/*
 * Copyright (c) 2018, Ford Motor Company All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: ·
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. · Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. · Neither the name of the Ford Motor Company nor the
 * names of its contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
FFW.RPCSimpleClient = Em.Object.create({

    socket:null,
    sendData: [],
    init:function(){
    },
    connect:function(){
      this.socket = new WebSocket(FLAGS.PYTHON_SERVER_URL);
      var self = this;
      this.socket.onopen = function(evt) {
        self.onWSOpen(evt);
      };
      this.socket.onclose = function(evt) {
        self.onWSClose(evt);
      };
      this.socket.onmessage = function(evt) {
        self.onWSMessage(evt);
      };
      this.socket.onerror = function(evt) {
        self.onWSerror(evt);
      };
    },
    triggerMessageSend: function() {
      var self = this;
      setTimeout(
        function() {
          self.onSend();
        }, 100
      );
    },
    onWSerror: function(data) {
      var msg = this.sendData.pop();
      if(msg.params.method !== undefined){
        FFW.BasicCommunication.sendError(
          SDL.SDLModel.data.resultCode.REJECTED,
          msg.params.id,
          msg.params.method,
          'Server doesn\'t exist!'
        );
      }
    },

    send:function(data){
      this.sendData.push(data);

      if(!this.socket) {
        this.connect();
        return;
      }
      this.triggerMessageSend();
    },
    onSend: function(){
      var msg = this.sendData.pop();
      Em.Logger.log('Message to be sent: ' + JSON.stringify(msg));

      if (this.socket && this.socket.readyState == this.socket.OPEN){
        this.socket.send(JSON.stringify(msg));
      } 
      if (msg.params.method == undefined) {
        if (this.sendData.length > 0) {
          this.triggerMessageSend();
        } else {
          this.socket.close();
        }
      }
    },
    onWSMessage: function(evt) {
      Em.Logger.log('Message received: ' + evt.data);
      var jsonObj = JSON.parse(evt.data);
      FFW.BasicCommunication.sendBCResult(
        SDL.SDLModel.data.resultCode.SUCCESS, jsonObj.params.id, jsonObj.params.method
      );
      this.socket.close();
    },
    onWSOpen: function(evt) {
      Em.Logger.log('RPCSimpleCLient.onWSOpen');
      if (this.sendData.length > 0) {
        this.triggerMessageSend();
      }
    },
    onWSClose: function(evt) {
      Em.Logger.log('RPCSimpleClient: Connection is closed');
      this.set('socket', null);
    }
  }
);
