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
from http.server import HTTPServer as BaseHTTPServer, SimpleHTTPRequestHandler

import os
import signal
import json
import requests
import zipfile


import ffmpeg
import threading
import pexpect.fdpexpect


WEBSOCKET_PORT = 8081
FILESERVER_PORT = 8082

class HTTPHandler(SimpleHTTPRequestHandler):
    """This handler uses server.base_path instead of always using os.getcwd()"""
    def translate_path(self, path):
        path = SimpleHTTPRequestHandler.translate_path(self, path)
        relpath = os.path.relpath(path, os.getcwd())
        fullpath = os.path.join(self.server.base_path, relpath)
        return fullpath

class HTTPServer(BaseHTTPServer):
    """The main server, you pass in base_path which is the path you want to serve requests from"""
    def __init__(self, base_path, server_address, RequestHandlerClass=HTTPHandler):
        self.base_path = base_path
        BaseHTTPServer.__init__(self, server_address, RequestHandlerClass)

# Called for every client connecting (after handshake)
def new_client(client, server):
	print("New client connected and was given id %d\r" % client['id'])
	# server.server_close()

# Called for every client disconnecting
def client_left(client, server):
	print("Client(%d) disconnected\r" % client['id'])

# Called when a client sends a message
def message_received(client, server, message):
	print("Received message from client(%d): %s\r" % (client['id'], message))

	parsed_message = None

	try:
		parsed_message = json.loads(message)
	except ValueError as err:
		print("-->Invalid JSON received: %s\r" % (err))
		return

	if "method" not in parsed_message:
		print("-->Received message does not contain mandatory field \"method\"\r")
		return

	response_message = handle_message(parsed_message["method"], parsed_message["params"])

	if response_message is not None:
		print("-->Sending response message to client %d: %s\r" % (client['id'], response_message))
		server.send_message(client, response_message)

def handle_message(method, params):
	print("-->Processing method %s\r" % (method))

	method_mapping = get_method_mapping()

	if method in method_mapping:
		return method_mapping[method](params)
	else:
		print("-->Method handler for %s was not found! Message ignored\r" % (method))
		return None

def handle_low_voltage_message(params):
	print("-->Handle low voltage message\r")

	# The value is taken from the file src/appMain/smartDeviceLink.ini
	# Offset from SIGRTMIN
	offset = {'LOW_VOLTAGE': 1, 'WAKE_UP': 2, 'IGNITION_OFF': 3}

	signal_param = params["signal"]
	signal_value = signal.Signals['SIGRTMIN'].value
	signal_value += offset[signal_param]

	cmd_command = 'ps -ef | grep smartDeviceLinkCore | grep -v grep | awk \'{print $2}\' | xargs kill -' + str(signal_value)
	os.system(cmd_command)

	response_msg = {
		"method": "LowVoltageSignalResponse",
		"params": {
			"success": True
		}
	}

	return json.dumps(response_msg)

def handle_get_pt_file_content_message(params):
	print("-->Handle get PTS content message\r")

	file_name = params["fileName"]
	file_content = None

	with open(file_name) as json_file:
		file_content = json.load(json_file)

	response_msg = {
		"method": "GetPTFileContentResponse",
		"params": {
			"content": json.dumps(file_content),
			"success": True
		}
	}

	return json.dumps(response_msg)

def handle_save_PTU_to_file_message(params):
	print("-->Handle save PTU content message\r")

	file_name = params["fileName"]
	content = json.loads(params["data"])

	with open(file_name, 'w') as json_file:
		json.dump(content, json_file)

	response_msg = {
		"method": "SavePTUToFileResponse",
		"params": {
			"success": True
		}
	}

	return json.dumps(response_msg)

def handle_get_app_bundle_message(params):
	print("-->Handle get app bundle message\r")

	policy_app_id = params["appID"]
	file_path = params["fileName"] + policy_app_id + ".zip"
	extract_path = params["fileName"] + policy_app_id + "/"
	url = params["url"]

	print("-->Creating subdirectories\r")
	os.makedirs(extract_path, exist_ok = True)

	print("-->Downloading file: " + url + "\r")
	response = requests.get(url)

	print("-->Saving to file system: " + file_path + "\r")
	with open(file_path, 'wb') as f:
		f.write(response.content)

	print("-->Extracting bundle to: " + extract_path + "\r")
	with zipfile.ZipFile(file_path, 'r') as zip:
		zip.extractall(extract_path)

	print("-->Deleting zip file\r")
	os.remove(file_path)

	print("-->Sending the response\r")
	response_msg = {
		"method": "GetAppBundleResponse",
		"params": {
			"success": True
		}
	}

	return json.dumps(response_msg)

def handle_get_app_manifest_message(params):
	print("-->Handle get app manifest message\r")

	file_path = params['fileName']
	print("-->Getting manifest file content: " + file_path + "\r")

	json_content = None
	with open(file_path, 'r') as js_file:
		file_content = js_file.read()
		first_bracket = file_content.find("{")
		last_bracket = file_content.rfind("}")
		json_content = file_content[first_bracket:last_bracket + 1]

	print("-->Sending the response\r")
	response_msg = {
		"method": "GetAppManifestResponse",
		"params": {
			"success": True,
			"content": json_content
		}
	}

	return json.dumps(response_msg)


def handle_start_streaming_adapter(params):
	print("-->Handle start gstreamer adapter\r")
	stream_endpoint = "http://localhost:8085"
	ffmpeg_process = ffmpeg.input(params['url']).output(stream_endpoint, vcodec="vp8", format="webm", listen=1, multiple_requests=1).run_async(pipe_stderr=True) 
	print("Wait for data from SDL")
	o = pexpect.fdpexpect.fdspawn(ffmpeg_process.stderr.fileno())
	o.expect("Input")
	print("data from SDL available")
	response_msg = {
		"method": "StartStreamingAdapter",
		"params": {
			"success": True,
			"stream_endpoint": stream_endpoint
		}
	}

	return json.dumps(response_msg)


def get_method_mapping():
	return {
		"LowVoltageSignalRequest": handle_low_voltage_message,
		"GetPTFileContentRequest": handle_get_pt_file_content_message,
		"SavePTUToFileRequest": handle_save_PTU_to_file_message,
		"GetAppBundleRequest": handle_get_app_bundle_message,
		"GetAppManifestRequest": handle_get_app_manifest_message,
		"StartStreamingAdapter": handle_start_streaming_adapter
	}

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

def start_signals_listener(server):
	server.set_fn_new_client(new_client)
	server.set_fn_client_left(client_left)
	server.set_fn_message_received(message_received)
	server.run_forever()

def start_file_server(file_server):
	file_server.serve_forever()

def signal_handler(sig, frame):
    print("\rStopping server...")

web_dir = os.path.dirname(os.path.dirname(__file__))
file_server = HTTPServer(web_dir, ("", FILESERVER_PORT))
fileServerThread = Thread(target = start_file_server, args = (file_server, ))
fileServerThread.start()
print("HTTP file server was started\r")

server = WebsocketServer(WEBSOCKET_PORT)
serverThread = Thread(target = start_signals_listener, args = (server, ))
serverThread.start()
print("HMI signals listener was started\r")

signal.signal(signal.SIGINT, signal_handler)
print("Press Ctrl+C to stop server")
signal.pause()

print("Closing signals listener...")
server.shutdown()
server.server_close()

print("Closing HTTP file server...")
file_server.shutdown()
file_server.server_close()
