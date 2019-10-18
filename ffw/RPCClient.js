/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
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
/*
 * Base class for RPC client
 *
 * Class provides access to basic functionality of RPC components Message Broker
 * as: registerComponent unregisterComponent subscription to notifications logic
 * to calculate request id
 */
FFW.RPCClient = Em.Object.create(
  {
    /*
     * transport layer for messages exchange
     */
    socket: null, // instance of websocket
    /*
     * url for message broker
     */
    url: FLAGS.WEBSOCKET_URL,
    /*
     * these variables are used to have unique request ids for different
     * components in RPC bus idStart is received as a response for
     * registerRPCComponent messages. space for ids for specific RPC
     * component is allocated by message broker
     */
    idStart: 200,
    idRange: 1000,
    requestId: 200,

    /**
     * @param observerMap
     * @desc store pairs {observer name, observer}
     */
    observerMap: {},
    /**
     * @param idToComponentName
     * @desc store pairs {message id, observer name}.
     * For processing response needs to know who sent a request.
     */
    idToComponentName: {},
    /**
     * @param responseHandlers
     * @desc store pairs {message id, responseHandlers}.
     * Need for processing specific requests.
     */
    responseHandlers: {},

    createWebSocket: function(){
      this.socket = new WebSocket(this.url);
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
        self.onWSError(evt);
      };
    },

    /*
     * Open WebSocket and initialize handlers
     */
    connect: function(componentName, observer) {
      var map_size = Object.keys(this.observerMap).length
      this.observerMap[componentName] = observer;
      if(0 == map_size){
        this.createWebSocket();
        return;
      }
      if (this.socket.readyState == this.socket.OPEN){
        this.registerRPCComponent(componentName);
      }
    },

    /*
     * Close WebSocket connection Please make sure that component was
     * unregistered in advance
     */
    disconnect: function(componentName) {
      if(!this.observerMap.hasOwnProperty(componentName)){
        Em.Logger.log("An attempt to disconnect the " + componentName +
                                                                    " failed.");
        return;
      }

      SDL.SDLController.unregisterComponentStatus(componentName);
      this.unregisterRPCComponent(componentName);
      Em.Logger.log(componentName + " disconnected.");
      delete this.observerMap[componentName];
    },
    /*
     * WebSocket connection is ready Now RPC component can be registered in
     * message broker
     */
    onWSOpen: function(evt) {
      Em.Logger.log('RPCCLient.onWSOpen');
      for(var i in this.observerMap){
        this.registerRPCComponent(i);
      }
    },

    /*
     * when result is received from RPC component this function is called It
     * is the propriate place to check results of reuqest execution Please
     * use previously store reuqestID to determine to which request repsonse
     * belongs to
     */
    onWSMessage: function(evt) {
      Em.Logger.log("SDL -> HMI " + this.getTime() +  ": " + evt.data);
      var jsonObj = JSON.parse(evt.data, SDL.RPCController.capabilitiesCheck);

      var observerName = "";
      if(jsonObj.method){
       observerName = jsonObj.method.substring(0,jsonObj.method.indexOf('.'));
       if(observerName === "SDL"){
        observerName = "BasicCommunication";
       }

       // Verification of unsupported params and remove them from original
       // request Changing filenames with backslash - escape the \ with %5C
       // due to Issue 45051 in chromium
       this.observerMap[observerName].checkImage(jsonObj.params);
      }

      // Verification of unsupported params and remove them from original
      // request
      if (SDL.RPCController.capabilityCheckResult != null ) {
        this.observerMap[observerName].errorResponsePull[jsonObj.id]
          = SDL.RPCController.capabilityCheckResult;
        SDL.RPCController.capabilityCheckResult = null;

        this.observerMap[observerName].checkSoftButtons(jsonObj.params);
        this.observerMap[observerName].checkChoice(jsonObj.params);
        this.observerMap[observerName].checkChunk(jsonObj.params);
        this.observerMap[observerName].checkHelpItems(jsonObj.params);
        this.observerMap[observerName].checkTurnList(jsonObj.params);
      }

      if (jsonObj.id == null){
          this.observerMap[observerName].onRPCNotification(jsonObj);
        return;
      }

      if(this.responseHandlers.hasOwnProperty(jsonObj.id)){
        this.responseHandlers[jsonObj.id](jsonObj);
        delete this.responseHandlers[jsonObj.id];
        return;
      }

      if (jsonObj.result != null) {
        observerName = this.idToComponentName[jsonObj.id]
        this.observerMap[observerName].onRPCResult(jsonObj);
      } else if (jsonObj.error != null) {
        observerName = this.idToComponentName[jsonObj.id]
        this.observerMap[observerName].onRPCError(jsonObj);
      } else {
        this.observerMap[observerName].onRPCRequest(jsonObj);
      }
    },
    /*
     * WebSocket connection is closed Please make sure that RPCComponent was
     * dunregistered in advance
     */
    onWSClose: function(evt) {
      Em.Logger.log('RPCClient: Connection is closed');
      for(var i in this.observerMap){
              SDL.SDLController.unregisterComponentStatus(i);
              this.observerMap[i].onRPCDisconnected();
      }

      var self = this;
      setTimeout(
        function() {
          self.createWebSocket();
        }, 5000
      );
    },
    /*
     * WebSocket connection errors handling
     */
    onWSError: function(evt) {

      // Em.Logger.log("ERROR: " + evt.data);
      Em.Logger.log('ERROR: ');
    },
    /*
     * register component is RPC bus
     */
    registerRPCComponent: function(componentName) {
      var msgId = this.generateId();
      var self = this;

      this.responseHandlers[msgId] = function(jsonObj){
          self.observerMap[componentName].onRPCRegistered();
      }

      var JSONMessage = {
        'jsonrpc': '2.0',
        'id': msgId,
        'method': 'MB.registerComponent',
        'params': {
          'componentName': componentName
        }
      };
      this.send(JSONMessage);
    },
    /*
     * unregister component is RPC bus
     */
    unregisterRPCComponent: function(componentName) {
      var msgId = this.generateId();
      var self = this;

      this.responseHandlers[msgId] = function(jsonObj){
          self.observerMap[componentName].onRPCUnregistered();
      }

      var JSONMessage = {
        'jsonrpc': '2.0',
        'id': msgId,
        'method': 'MB.unregisterComponent',
        'params': {
          'componentName': componentName
        }
      };
      this.send(JSONMessage);
    },
    /*
     * Subscribes to notification. Returns the request's id.
     */
    subscribeToNotification: function(notification, componentName) {
      var msgId = this.generateId();
      var self = this;
      this.responseHandlers[msgId] = function(jsonObj){
        if (jsonObj.result != null) {
          self.observerMap[componentName].onRPCResult(jsonObj);
        } else if (jsonObj.error ) {
          self.observerMap[componentName].onRPCError(jsonObj);
        }
      }
      var JSONMessage = {
        'jsonrpc': '2.0',
        'id': msgId,
        'method': 'MB.subscribeTo',
        'params': {
          'propertyName': notification
        }
      };
      this.send(JSONMessage);
      return msgId;
    },
    /*
     * Unsubscribes from notification. Returns the request's id.
     */
    unsubscribeFromNotification: function(notification, componentName) {
      var msgId = this.generateId();
      var self = this;
      if(self.observerMap[componentName] == undefined){
        return;
      }
      this.responseHandlers[msgId] = function(jsonObj){
        if (jsonObj.result != null) {
          self.observerMap[componentName].onRPCResult(jsonObj);
        } else if (jsonObj.error) {
          self.observerMap[componentName].onRPCError(jsonObj);
        }
      }

      var JSONMessage = {
        'jsonrpc': '2.0',
        'id': msgId,
        'method': 'MB.unsubscribeFrom',
        'params': {
          'propertyName': notification
        }
      };
      this.send(JSONMessage);
      return msgId;
    },

    /*
     * stringify object and send via socket connection
     */
    send: function(obj, componentName) {
      if (this.socket && this.socket.readyState == this.socket.OPEN) {
        if(componentName){
          this.idToComponentName[obj.id] = componentName;
        }
        var strJson = JSON.stringify(obj);
        Em.Logger.log("HMI -> SDL " + this.getTime() + ": " + strJson);

        this.socket.send(strJson);
      } else {
        Em.Logger
          .error('RPCClient: Can\'t send message since socket is not ready');
      }
    },

    /*
     * Generate id for new request to RPC component Function has to be used
     * as private
     */
    generateId: function() {
      this.requestId++;
      if (this.requestId >= this.idStart + this.idRange) {
        this.requestId = this.idStart;
      }
      return this.requestId;
    },

    /*
     * return string with the current time
     */
    getTime(){
      var logTime = new Date();
      var timeStr = logTime.getHours() + ':' + logTime.getMinutes() + ':' +
      logTime.getSeconds() + ':' + logTime.getMilliseconds();
      return "[" + timeStr + "]";
    }
  }
);
