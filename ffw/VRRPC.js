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
 * Reference implementation of VR component.
 *
 * Interface to get or set some essential information sent from SDLCore. VR is
 * responsible for receiving voice commands choosed by user and sending
 * notification of chosen commands to SDLCore.
 *
 */
FFW.VR = FFW.RPCObserver.create(
  {
    /**
     * If true then VR is present and ready to communicate with SDL.
     *
     * @type {Boolean}
     */
    isReady: true,
    /**
     * Contains response codes for request that should be processed but there
     * were some kind of errors Error codes will be injected into response.
     */
    errorResponsePull: {},
    /*
     * access to basic RPC functionality
     */
    client: FFW.RPCClient,
    componentName: "VR",
    /*
     * connect to RPC bus
     */
    connect: function() {
      this.client.connect(this.componentName, this);
    },

    /**
     * sending message to SDL
     */
    sendMessage: function(JSONMessage){
      this.client.send(JSONMessage, this.componentName);
    },

    /**
     * @function subscribeToNotification
     * @param {Em.Object} notification
     * @desc subscribe to notifications from SDL
     */
    subscribeToNotification: function(notification){
      this.client.subscribeToNotification(notification, this.componentName);
    },

    /*
     * disconnect from RPC bus
     */
    disconnect: function() {
      this.onRPCUnregistered();
      this.client.disconnect();
    },

    /*
     * Client is registered - we can send request starting from this point of
     * time
     */
    onRPCRegistered: function() {
      Em.Logger.log('FFW.VR.onRPCRegistered');
      this._super();
    },
    /*
     * Client is unregistered - no more requests
     */
    onRPCUnregistered: function() {
      Em.Logger.log('FFW.VR.onRPCUnregistered');
      this._super();
    },
    /*
     * Client disconnected.
     */
    onRPCDisconnected: function() {
    },
    /*
     * when result is received from RPC component this function is called It is
     * the propriate place to check results of reuqest execution Please use
     * previously store reuqestID to determine to which request repsonse belongs
     * to
     */
    onRPCResult: function(response) {
      Em.Logger.log('FFW.VR.onRPCResult');
      this._super();
    },
    /*
     * handle RPC erros here
     */
    onRPCError: function(error) {
      Em.Logger.log('FFW.VR.onRPCError');
      this._super();
    },
    /*
     * handle RPC notifications here
     */
    onRPCNotification: function(notification) {
      Em.Logger.log('FFW.VR.onRPCNotification');
      this._super();
    },
    /*
     * handle RPC requests here
     */
    checkRequestType: function(type){
      switch(type){
        case 'Command':
          return 'vrAddCommand';
        case 'Choice':
          return 'createInteractionChoiceSet';
        default: return '';
      }
    },

    onRPCRequest: function(request) {
      Em.Logger.log('FFW.VR.onRPCRequest');
      SDL.ResetTimeoutPopUp.requestIDs[request.method] =  request.id;
      if (this.validationCheck(request)) {
        switch (request.method) {
          case 'VR.AddCommand':
          {
            var key = this.checkRequestType(request.params.type);
            result = FFW.RPCHelper.getCustomResultCode(request.params.appID, key);

            if ('DO_NOT_RESPOND' == result) {
              Em.Logger.log('Do not respond on this request');
              return;
            }

            let info = null;

            if(FFW.RPCHelper.isSuccessResultCode(result)){
              SDL.SDLModel.addCommandVR(request.params);
            } else {
              info = 'Erroneous response is assigned by settings';
            }

            this.sendVRResult(
              result,
              request.id,
              request.method,
              info
            );
            break;
          }
          case 'VR.DeleteCommand':
          {
            SDL.SDLModel.deleteCommandVR(request);
            break;
          }
          case 'VR.GetSupportedLanguages':
          {
            Em.Logger.log('FFW.' + request.method + 'Response');
            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS, // type
                // (enum)
                // from SDL
                'method': 'VR.GetSupportedLanguages',
                'languages': SDL.SDLModel.data.sdlLanguagesList
              }
            };
            this.sendMessage(JSONMessage);
            break;
          }
          case 'VR.GetLanguage':
          {
            Em.Logger.log('FFW.' + request.method + 'Response');
            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS, // type
                // (enum)
                // from SDL
                'method': 'VR.GetLanguage',
                'language': SDL.SDLModel.data.hmiTTSVRLanguage
              }
            };
            this.sendMessage(JSONMessage);
            break;
          }
          case 'VR.ChangeRegistration':
          {
            SDL.SDLModel.changeRegistrationTTSVR(
              request.params.language, request.params.appID
            );
            if (request.params.vrSynonyms) {
              SDL.VRPopUp.DeleteCommand(0, request.params.appID);
              SDL.VRPopUp.AddCommand(
                0, request.params.vrSynonyms, request.params.appID,
                'Application'
              );
            }
            this.sendVRResult(
              SDL.SDLModel.data.resultCode.SUCCESS,
              request.id,
              request.method
            );
            break;
          }
          case 'VR.IsReady':
          {
            Em.Logger.log('FFW.' + request.method + 'Response');
            // send repsonse
            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'available': this.get('isReady'),
                'code': 0,
                'method': 'VR.IsReady'
              }
            };
            this.sendMessage(JSONMessage);
            break;
          }
          case 'VR.PerformInteraction':
          {
            SDL.ResetTimeoutPopUp.extendResetTimeoutRPCs([request.method]);
            SDL.ResetTimeoutPopUp.expandCallbacks(function()
             {SDL.SDLModel.deactivateVr()}, request.method);
            SDL.ResetTimeoutPopUp.extendResetTimeoutCallBack(SDL.SDLModel.vrTimeout, request.method);
            SDL.ResetTimeoutPopUp.set('timeoutString', request.params.timeout/1000);
            SDL.SDLModel.vrPerformInteraction(request);
            break;
          }
          case 'VR.GetCapabilities':
          {
            Em.Logger.log('FFW.' + request.method + 'Response');
            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS,
                'method': 'VR.GetCapabilities',
                'vrCapabilities': ['TEXT']
              }
            };
            this.sendMessage(JSONMessage);
            break;
          }
          default:
          {
            // statements_def
            break;
          }
        }
      }
    },
    /**
     * Send error response from onRPCRequest
     *
     * @param {Number}
     *            resultCode
     * @param {Number}
     *            id
     * @param {String}
     *            method
     */
    sendError: function(resultCode, id, method, message) {
      Em.Logger.log('FFW.' + method + 'Response');
      // send response
      var JSONMessage = {
        'jsonrpc': '2.0',
        'id': id,
        'error': {
          'code': resultCode, // type (enum) from SDL protocol
          'message': message,
          'data': {
            'method': method
          }
        }
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * send notification when command was triggered
     *
     * @param {Number} requestID
     * @param {Number} resultCode
     * @param {Number} commandID
     */
    interactionResponse: function(requestID, resultCode, commandID) {
      if (FFW.RPCHelper.isSuccessResultCode(resultCode)) {
        this.sendVRResult(
          resultCode,
          requestID,
          'VR.PerformInteraction',
          null,
          {
            'choiceID': commandID
          }
        );
      } else {
        this.sendVRResult(
          resultCode,
          requestID,
          'VR.PerformInteraction',
          'VR Perform Interaction error response.'
        );
      }

      SDL.SDLModel.data.set('performInteractionSession', []);
    },
    /**
     * send response from onRPCRequest
     *
     * @param {Number}
     *            resultCode
     * @param {Number}
     *            id
     * @param {String}
     *            method
     * @param {String}
     *            info
     */
    sendVRResult: function(resultCode, id, method, info, params) {
      const is_successful_code = FFW.RPCHelper.isSuccessResultCode(resultCode);
      if (is_successful_code && this.errorResponsePull[id] != null) {
        // If request was successful but some error was observed upon validation
        // Then result code assigned by RPCController should be considered instead
        const errorStruct = this.errorResponsePull[id];
        this.errorResponsePull[id] = null;

        this.sendVRResult(
          errorStruct.code,
          id,
          method,
          `Unsupported ${errorStruct.type} type. Available data in request was processed.`
        );
        return;
      }

      let is_successful_response_format = function(is_success) {
        // Successful response without params, but with not-empty message
        // should be sent in errorneous format to properly forward info and result code
        if (is_success && info != null && params == null) {
          return false;
        }

        // Error response with not empty params should be sent in regular format
        // to properly forward result code and params (but sacrifice info)
        if (!is_success && params != null) {
          return true;
        }

        // Otherwise use result code calculated according to regular HMI logic
        return is_success;
      };

      Em.Logger.log('FFW.VR.' + method + 'Response');
      if (is_successful_response_format(is_successful_code)) {
        // send response
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': id,
          'result': {
            'code': resultCode, // type (enum) from SDL protocol
            'method': method
          }
        };

        if (params != null) {
          Object.assign(JSONMessage.result, params);
        }

        this.sendMessage(JSONMessage);
      } else {
        this.sendError(resultCode, id, method, info);
      }
    },
    /*
     * send notification when command was triggered from VR
     */
    onChoise: function(commandID) {
      Em.Logger.log('FFW.VR.PerformInteraction');
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'VR.OnChoise',
        'params': {
          'choiceID': commandID
        }
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Initiated by VR module to let SDL know that VR session has started.
     */
    Started: function() {
      Em.Logger.log('FFW.VR.Started');
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'VR.Started'
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Initiated by VR module to let SDL know that VR session has stopped.
     */
    Stopped: function() {
      Em.Logger.log('FFW.VR.Stopped');
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'VR.Stopped'
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * send notification when command was triggered
     */
    onCommand: function(commandID, appID, grammarID) {
      Em.Logger.log('FFW.VR.onCommand');
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'VR.OnCommand',
        'params': {
          'cmdID': commandID,
          'grammarID': grammarID
        }
      };
      if (appID) {
        JSONMessage.params.appID = appID;
      }
      this.sendMessage(JSONMessage);
    },
    /**
     * Notifies if sdl VR components language was changed
     */
    OnLanguageChange: function(lang) {
      Em.Logger.log('FFW.VR.OnLanguageChange');
      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'VR.OnLanguageChange',
        'params': {
          'language': lang
        }
      };
      this.sendMessage(JSONMessage);
    }
  }
);
