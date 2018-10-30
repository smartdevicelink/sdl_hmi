# Copyright (c) 2018 Ford Motor Company,
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# * Redistributions of source code must retain the above copyright notice, this
#   list of conditions and the following disclaimer.
#
# * Redistributions in binary form must reproduce the above copyright notice,
#   this list of conditions and the following disclaimer in the documentation
#   and/or other materials provided with the distribution.
#
# * Neither the name of Ford Motor Company nor the names of its
#   contributors may be used to endorse or promote products derived from
#   this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

from websocket_server import WebsocketServer
from threading import Thread
from time import sleep
import os
import signal
import json

# Called for every client connecting (after handshake)
def new_client(client, server):
	print("New client connected and was given id %d\r" % client['id'])
	# server.server_close()

# Called for every client disconnecting
def client_left(client, server):
	print("Client(%d) disconnected\r" % client['id'])

# Called when a client sends a message
def message_received(client, server, message):
	data = json.loads(message)
	print("Client(%d) said: %s\r" % (client['id'], data))
	if 'method' in data["params"]:
		if data['params']['method'] == 'BasicCommunication.PolicyUpdate':
			policyUpdate(data['params']['file'])
			server.send_message(client,message)
			return
		
		if data['params']['method'] == 'BasicCommunication.SystemRequest':
			systemRequestEraseData(data['params']['filename'])
			server.send_message(client,message)
			return

	sendLowVoltage(data["params"])

# Called when a server received BasicCommunication.SystemRequest method
def systemRequestEraseData(path):
	file = open(path,'r')
	content = file.read()
	file.close()

	data = json.loads(content)

	if 'data' in data:
		data = data['data']
		data_to_write = json.dumps(data)

		file = open(path,'w')
		file.write(data_to_write)
		file.close
		
# Called when a server received BasicCommunication.PolicyUpdate method
def policyUpdate(path):
	file = open(path,'r')
	content = file.read()
	file.close()

	data = json.loads(content)

	policy_table = data['policy_table']
	HTTPHeader = createHTTPHeader(policy_table)

	data_to_write = json.dumps(HTTPHeader)

	file = open(path,'w')

	file.write(data_to_write)

	file.close()

# Create HTTPHeader for BasicCommunication.PolicyUpdate request
def createHTTPHeader(policy_table):
	
	HTTPHeader =  {'HTTPRequest': {}}
	
	HTTPRequest = HTTPHeader['HTTPRequest']
	HTTPRequest['headers'] = {}

	encoded = json.dumps(policy_table)

	HTTPRequest['body'] = encoded
	
	HTTPRequest['headers']['ConnectTimeout'] = policy_table['module_config']['timeout_after_x_seconds']
	HTTPRequest['headers']['Content-Length'] = len(encoded)
	HTTPRequest['headers']['ContentType'] = "application/json"
	HTTPRequest['headers']['DoInput'] = True
	HTTPRequest['headers']['DoOutput'] = True
	HTTPRequest['headers']['InstanceFollowRedirects'] = False
	HTTPRequest['headers']['ReadTimeout'] = policy_table['module_config']['timeout_after_x_seconds']
	HTTPRequest['headers']['RequestMethod'] = 'POST'
	HTTPRequest['headers']['UseCaches'] = False
	HTTPRequest['headers']['charset'] = 'utf-8'
	return HTTPHeader

# Called for creat unix signal
def sendLowVoltage(message):
	# The value is taken from the file src/appMain/smartDeviceLink.ini
	# Offset from SIGRTMIN
	offset = {'LOW_VOLTAGE': 1, 'WAKE_UP': 2, 'IGNITION_OFF': 3}

	signal_value = signal.Signals['SIGRTMIN'].value
	signal_value += offset[message]

	cmd_command = 'ps -ef | grep smartDeviceLinkCore | grep -v grep | awk \'{print $2}\' | xargs kill -' + str(signal_value)
	os.system(cmd_command)

def getch():
        import sys, tty, termios
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)

        return ch

def startServer(server):
	print("HMI signals listener was started\r")
	server.set_fn_new_client(new_client)
	server.set_fn_client_left(client_left)
	server.set_fn_message_received(message_received)
	server.run_forever()

def keyBoardEvent():
	global server
	char = ' '
	while char != 'q':
		char = getch()

server = WebsocketServer(8081)
serverThread = Thread(target = startServer, args = (server, ))
keyBoardThread = Thread(target = keyBoardEvent)
keyBoardThread.start()
serverThread.start()

keyBoardThread.join()
print("Closing server...")
server.shutdown()
server.server_close()
