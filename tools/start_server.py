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

# Called for every client connecting (after handshake)
def new_client(client, server):
	print("New client connected and was given id %d\r" % client['id'])
	# server.server_close()

# Called for every client disconnecting
def client_left(client, server):
	print("Client(%d) disconnected\r" % client['id'])

# Called when a client sends a message
def message_received(client, server, message):
	mq_name = "/SDLMQ"
	print("Client(%d) said: %s\r" % (client['id'], message))
	os.system("./tools/mqclient"+" " + mq_name + " " + message)

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
	print("HMI MQ signals listener was started\r")
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
