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
    listenersMap: {},
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
    },
    disconnect:function(){
      if (this.socket) {
        this.socket.close();
        this.set('socket', null);
      }
    },
    triggerMessageSend: function() {
      var self = this;
      setTimeout(
        function() {
          self.onSend();
        }, 100
      );
    },
    send:function(data){
      this.sendData.push(data);
      this.triggerMessageSend();
    },
    subscribeOnEvent(event_name, callback) {
      this.listenersMap[event_name] = callback;
    },
    unsubscribeFromEvent(event_name) {
      if (event_name in this.listenersMap) {
        delete this.listenersMap[event_name];
      }
    },
    onSend: function(){
      var msg = JSON.stringify(this.sendData.pop());
      Em.Logger.log('Message to be sent: ' + msg);

      if (this.socket && this.socket.readyState == this.socket.OPEN){
        this.socket.send(msg);
      }

      if (this.sendData.length > 0) {
        this.triggerMessageSend();
      }
    },
    onWSMessage: function(evt) {
      Em.Logger.log('Message received: ' + evt.data);
      let event = JSON.parse(evt.data);
      let event_name = event.method;
      if (event_name in this.listenersMap) {
        let params = event.params;
        this.listenersMap[event_name](params);
      }
    },
    onWSOpen: function(evt) {
      Em.Logger.log('RPCSimpleCLient.onWSOpen');
    },
    onWSClose: function(evt) {
      Em.Logger.log('RPCSimpleClient: Connection is closed');
    }
  }
);
