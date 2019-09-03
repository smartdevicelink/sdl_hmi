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
 * Reference implementation of RemoteControl component.
 *
 * Interface to get or set some essential information sent from SDLCore.
 * RemoteControl is responsible for sending a data about the condition of the
 * vehicle between SDLCore and CAN network. Instead CAN network used
 * RemoteControlModel.
 *
 */
FFW.RC = FFW.RPCObserver.create(
  {
    /**
     * If true then RemoteControl is present and ready to communicate with SDL.
     *
     * @type {Boolean}
     */
    isReady: true,
    /**
     * If true then RC controller currently handles SetIVD request
     */
    isSetVdInProgress: false,

    /**
     * @param OnIVDNotificationWasSent
     * @type {Boolean}
     * @description If true MOBILE_APP has been activated by SetIVd reqeuest and has sent OnInterioirVehicleData
     * notification
     */
    OnIVDNotificationWasSent: false,
    /**
     * Contains response codes for request that should be processed but there
     * were some kind of errors Error codes will be injected into response.
     */
    errorResponsePull: {},
    /**
     * contains method name for RCStatus_Notification
     */
    onRCStatusNotification: 'RC.OnRCStatus',
    /**
     * access to basic RPC functionality
     */
    client: FFW.RPCClient,
    componentName: "RC",
    /**
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

    /**
     * disconnect from RPC bus
     */
    disconnect: function() {
      this.onRPCUnregistered();
      this.client.disconnect();
    },

    /**
     * Client is registered - we can send request starting from this point of
     * time
     */
    onRPCRegistered: function() {
      Em.Logger.log('FFW.RC.onRPCRegistered');
      // send notification after some time after registration
      setTimeout(
        function() {
          FFW.RC.OnRemoteControlSettings(
            SDL.SDLModel.reverseFunctionalityEnabled,
            SDL.SDLModel.reverseAccessMode
          );
        },
        500
      );
      this._super();
      this.subscribeToNotification(this.onRCStatusNotification);
    },
    /**
     * Client is unregistered - no more requests
     */
    onRPCUnregistered: function() {
      Em.Logger.log('FFW.RC.onRPCUnregistered');
      this._super();
      this.client.unsubscribeFromNotification(this.onRCStatusNotification);
    },
    /**
     * Client disconnected.
     */
    onRPCDisconnected: function() {
    },
    /**
     * when result is received from RPC component this function is called It is
     * the propriate place to check results of reuqest execution Please use
     * previously store reuqestID to determine to which request repsonse belongs
     * to
     */
    onRPCResult: function(response) {
      Em.Logger.log('FFW.RC.onRPCResult');
      this._super();
    },
    /**
     * handle RPC erros here
     */
    onRPCError: function(error) {
      Em.Logger.log('FFW.RC.onRPCError');
      this._super();
    },
    /**
     * handle RPC notifications here
     */
    onRPCNotification: function(notification) {
      Em.Logger.log('FFW.RC.onRPCNotification');
      this._super();
      switch (notification.method) {
        case 'RC.OnRCStatus':
          {
            Em.Logger.log(notification.method);
            var appID = notification.params.appID;
            var allocatedModules = notification.params.allocatedModules;
            var freeModules = notification.params.freeModules;
            var item = {
                        allocated : allocatedModules,
                        free : freeModules
                       };
            var map = SDL.deepCopy(SDL.SDLModel.appRCStatus);
            map[appID] = item;
            SDL.SDLModel.set('appRCStatus', map);
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
     * handle RPC requests here
     *
     * @type {Object} request
     */
    onRPCRequest: function(request) {
      Em.Logger.log('FFW.RC.onRPCRequest');
      if (this.validationCheck(request)) {
        switch (request.method) {
          case 'RC.IsReady':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');
            // send repsonse
            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'available': this.get('isReady'),
                'code': SDL.SDLModel.data.resultCode.SUCCESS,
                'method': request.method
              }
            };
            this.sendMessage(JSONMessage);
            break;
          }
          case 'RC.GetCapabilities':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');

            // send repsonse
            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS,
                'method': request.method,
                'seatLocationCapability': SDL.remoteControlCapabilities.seatLocationCapability,
                'remoteControlCapability': SDL.remoteControlCapabilities.remoteControlCapability
              }
            };
            this.sendMessage(JSONMessage);
            break;
          }
          case 'RC.SetInteriorVehicleData':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');
            this.set('isSetVdInProgress', true);
             var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS,
                'method': request.method,
                'moduleData': {
                  'moduleType': request.params.moduleData.moduleType,
                  'moduleId': request.params.moduleData.moduleId
                }
              }
            };

            var newControlData = SDL.RCModulesController.setInteriorVehicleData(request);
            if(newControlData) {
              var key = Object.keys(newControlData)[0];
              JSONMessage.result.moduleData[key] = newControlData[key];
              this.client.send(JSONMessage);
            }
            this.set('isSetVdInProgress', false);
            break;
          }
          case 'RC.GetInteriorVehicleData':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');

            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS,
                'method': request.method,
                'isSubscribed': request.params.subscribe,
                'moduleData': {
                  'moduleType': request.params.moduleType,
                  'moduleId': request.params.moduleId
                }
              }
            };

            var data = SDL.RCModulesController.getInteriorVehicleData(request);
            if(data) {
              var key = Object.keys(data)[0];
              JSONMessage.result.moduleData[key] = data[key];
              this.client.send(JSONMessage);
            }
            break;
          }
          case 'RC.GetInteriorVehicleDataConsent':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');
            SDL.SDLController.interiorDataConsent(request);
            break;
          }
          case 'RC.SetGlobalProperties':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');

            if (request.params.userLocation !== null) {
              var user_location = request.params.userLocation.grid;
              var app = SDL.SDLController.getApplicationModel(request.params.appID);

              if (!app) {
                this.sendError(
                  SDL.SDLModel.data.resultCode.REJECTED,
                  request.id,
                  request.method,
                  "Application is not registered"
                );
                return;
              }

              app.userLocation = user_location;
              SDL.RCModulesController.updateModuleSeatLocationContent();
            }

            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS,
                'method': request.method
              }
            };
            this.client.send(JSONMessage);
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
      if (resultCode != SDL.SDLModel.data.resultCode.SUCCESS) {

        // send repsonse
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
      }
    },
    /**
     * Send response from onRPCRequest
     *
     * @param {Number}
     *            resultCode
     * @param {Number}
     *            id
     * @param {String}
     *            method
     */
    sendRCResult: function(resultCode, id, method) {
      Em.Logger.log('FFW.' + method + 'Response');
      if (resultCode === SDL.SDLModel.data.resultCode.SUCCESS) {

        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': id,
          'result': {
            'code': resultCode,
            'method': method
          }
        };
        this.sendMessage(JSONMessage);
      }
    },
    GetInteriorVehicleDataConsentResponse: function(request, allowed) {
      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'id': request.id,
        'result': {
          'code': SDL.SDLModel.data.resultCode.SUCCESS,
          'method': request.method,
          'allowed': allowed
        }
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * From HMI to RSDL
     * notifies if User selected to disallow RSDL functionality or if he
     * changed his mind and allowed it.
     * @constructor
     */
    OnDeviceRankChanged: function(device, rank) {
      if (device) {
        Em.Logger.log('FFW.RC.OnDeviceRankChanged Notification');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'RC.OnDeviceRankChanged',
          'params': {
            'device': device,
            'deviceRank': rank
          }
        };
        this.sendMessage(JSONMessage);
      }
    },
    /**
     * From HMI to RSDL
     * notifies if User selected to disallow RSDL functionality or if he
     * changed his mind and allowed it.
     */
    OnRemoteControlSettings: function(allowed, accessMode) {
      Em.Logger.log('FFW.RC.OnRemoteControlSettings Notification');
      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'RC.OnRemoteControlSettings',
        'params': {
          'allowed': allowed
        }
      };
      if (allowed === true) {
        JSONMessage.params.accessMode = accessMode;
      }
      this.sendMessage(JSONMessage);
    },
    /**
     * @param moduleType
     */
    onInteriorVehicleDataNotification: function(data) {
      var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'RC.OnInteriorVehicleData',
          'params': {
              'moduleData': data
          }
        };
        Em.Logger.log('FFW.RC.OnInteriorVehicleData Notification');
        FFW.RC.sendMessage(JSONMessage);
    },
    /**
     * Verification for consented apps
     * HMI should reject secon unconsented app
     * @param request
     */
    consentedAppCheck: function(request) {
      var appID = request.params.appID;
      var moduleType = null;
      if (request.params.moduleDescription) {
        moduleType = request.params.moduleDescription.moduleType;
      } else if (request.params.moduleData) {
        moduleType = request.params.moduleData.moduleType;
      } else {
        moduleType = request.params.moduleType;
      }

      if (!SDL.SDLModel.reverseFunctionalityEnabled) {
        return false;
      }

      return true;
    },
  }
);
