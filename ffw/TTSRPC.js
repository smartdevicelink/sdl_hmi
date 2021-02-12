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
 * Reference implementation of TTS component.
 *
 * TTS is responsible for playing sound data sent from SDLCore to notify user
 * about some events happened.
 */
FFW.TTS = FFW.RPCObserver.create(
  {
    /**
     * If true then TTS is present and ready to communicate with SDL.
     *
     * @type {Boolean}
     */
    isReady: true,
    /**
     * Contains response codes for request that should be processed but there
     * were some kind of errors Error codes will be injected into response.
     */
    errorResponsePull: {},
    /**
     * Request id of current running Speak request
     *
     * @type {Boolean}
     */
    requestId: null,
    /**
     * Flag to determine if Speak request was aborted
     *
     * @type {Boolean}
     */
    aborted: false,
    /*
     * access to basic RPC functionality
     */
    client: FFW.RPCClient,
    componentName: "TTS",
    /*
     * connect to RPC bus
     */
    connect: function() {
      this.client.connect(this.componentName, this);
    },

    /**
     * @function sendMessage
     * @param {Em.Object} JSONMessage
     * @desc sending message to SDL
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
      Em.Logger.log('FFW.TTS.onRPCRegistered');
      this._super();
    },
    /*
     * Client is unregistered - no more requests
     */
    onRPCUnregistered: function() {
      Em.Logger.log('FFW.TTS.onRPCUnregistered');
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
      Em.Logger.log('FFW.TTS.onRPCResult');
      this._super();
    },
    /*
     * handle RPC erros here
     */
    onRPCError: function(error) {
      Em.Logger.log('FFW.TTS.onRPCError');
      this._super();
    },
    /*
     * handle RPC notifications here
     */
    onRPCNotification: function(notification) {
      Em.Logger.log('FFW.TTS.onRPCNotification');
      this._super();
    },
    /*
     * handle RPC requests here
     */
    onRPCRequest: function(request) {
      Em.Logger.log('FFW.TTS.onRPCRequest');
      this._super();
      switch (request.method) {
        case 'TTS.Speak':
        {
          if (SDL.TTSPopUp.active) {
            FFW.TTS.sendError(
              SDL.SDLModel.data.resultCode.REJECTED, request.id, 'TTS.Speak',
              'TTS in progress. Rejected.'
            );
          } else {
            this.requestId = request.id;
            SDL.SDLModel.onPrompt(
              request.params.ttsChunks, request.params.appID
            );
            if (request.params.playTone) {
              SDL.SDLModel.onPlayTone();
            }
          }
          break;
        }
        case 'TTS.SetGlobalProperties':
        {
          resultCode = FFW.RPCHelper.getCustomResultCode(request.params.appID, 'ttsSetGlobalProperties');
          if ('DO_NOT_RESPOND' == resultCode) {
            Em.Logger.log('Do not respond on this request');
            return;
          }

          let info = null;

          if(FFW.RPCHelper.isSuccessResultCode(resultCode)){
            resultCode = SDL.SDLModel.setProperties(request.params);
          } else {
            info = 'Erroneous response is assigned by settings';
          }
          this.sendTTSResult(
            resultCode,
            request.id,
            request.method,
            info
          );
          break;
        }
        case 'TTS.StopSpeaking':
        {
          SDL.SDLModel.TTSStopSpeaking();
          this.sendTTSResult(
            SDL.SDLModel.data.resultCode.SUCCESS,
            request.id,
            request.method
          );
          break;
        }
        case 'TTS.GetCapabilities':
        {
          Em.Logger.log('FFW.' + request.method + 'Response');
          // send repsonse
          var JSONMessage = {
            'jsonrpc': '2.0',
            'id': request.id,
            'result': {
              'speechCapabilities': [
                'TEXT',
                'PRE_RECORDED',
                'FILE'
              ],
              'prerecordedSpeechCapabilities': [
                'HELP_JINGLE',
                'INITIAL_JINGLE',
                'LISTEN_JINGLE',
                'POSITIVE_JINGLE',
                'NEGATIVE_JINGLE'
              ],
              'code': SDL.SDLModel.data.resultCode.SUCCESS, // type (enum)
              // from SDL
              // protocol
              'method': 'TTS.GetCapabilities'
            }
          };
          this.sendMessage(JSONMessage);
          break;
        }
        case 'TTS.GetSupportedLanguages':
        {
          Em.Logger.log('FFW.' + request.method + 'Response');
          var JSONMessage = {
            'jsonrpc': '2.0',
            'id': request.id,
            'result': {
              'code': SDL.SDLModel.data.resultCode.SUCCESS, // type (enum)
              // from SDL
              'method': 'TTS.GetSupportedLanguages',
              'languages': SDL.SDLModel.data.sdlLanguagesList
            }
          };
          this.sendMessage(JSONMessage);
          break;
        }
        case 'TTS.GetLanguage':
        {
          Em.Logger.log('FFW.' + request.method + 'Response');
          var JSONMessage = {
            'jsonrpc': '2.0',
            'id': request.id,
            'result': {
              'code': SDL.SDLModel.data.resultCode.SUCCESS, // type (enum)
              // from SDL
              'method': 'TTS.GetLanguage',
              'language': SDL.SDLModel.data.hmiTTSVRLanguage
            }
          };
          this.sendMessage(JSONMessage);
          break;
        }
        case 'TTS.ChangeRegistration':
        {
          SDL.SDLModel.changeRegistrationTTSVR(
            request.params.language, request.params.appID
          );
          this.sendTTSResult(
            SDL.SDLModel.data.resultCode.SUCCESS,
            request.id,
            request.method
          );
          break;
        }
        case 'TTS.IsReady':
        {
          Em.Logger.log('FFW.' + request.method + 'Response');
          // send repsonse
          var JSONMessage = {
            'jsonrpc': '2.0',
            'id': request.id,
            'result': {
              'available': this.get('isReady'),
              'code': SDL.SDLModel.data.resultCode.SUCCESS,
              'method': 'TTS.IsReady'
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
    sendTTSResult: function(resultCode, id, method, info, params) {
      const is_successful_code = FFW.RPCHelper.isSuccessResultCode(resultCode);
      if (is_successful_code && this.errorResponsePull[id] != null) {
        // If request was successful but some error was observed upon validation
        // Then result code assigned by RPCController should be considered instead
        const errorStruct = this.errorResponsePull[id];
        this.errorResponsePull[id] = null;

        this.sendTTSResult(
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

      Em.Logger.log('FFW.TTS.' + method + 'Response');
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
     * Notifies if sdl TTS components language was changed
     */
    OnLanguageChange: function(lang) {
      Em.Logger.log('FFW.TTS.OnLanguageChange');
      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'TTS.OnLanguageChange',
        'params': {
          'language': lang
        }
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Initiated by TTS module to let SDL know that TTS session has started.
     */
    Started: function() {
      Em.Logger.log('FFW.TTS.Started');
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'TTS.Started'
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Sent OnResetTimeout notification to SDLCore to inform when
     * HMI pronounces text longer than 10 seconds
     */
    OnResetTimeout: function(appID, methodName) {
      Em.Logger.log('FFW.TTS.OnResetTimeout');
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'TTS.OnResetTimeout',
        'params': {
          'appID': appID,
          'methodName': methodName
        }
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Initiated by TTS module to let SDL know that TTS session has stopped.
     */
    Stopped: function() {
      Em.Logger.log('FFW.TTS.Stopped');
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'TTS.Stopped'
      };
      this.sendMessage(JSONMessage);
    }
  }
);
