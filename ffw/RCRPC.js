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
     * Contains response codes for request that should be processed but there
     * were some kind of errors Error codes will be injected into response.
     */
    errorResponsePull: {},
    /**
     * access to basic RPC functionality
     */
    client: FFW.RPCClient.create(
      {
        componentName: 'RC'
      }
    ),
    /**
     * connect to RPC bus
     */
    connect: function() {
      this.client.connect(this, 900); // Magic number is unique identifier for
      // component
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
      this._super();
    },
    /**
     * Client is unregistered - no more requests
     */
    onRPCUnregistered: function() {
      Em.Logger.log('FFW.RC.onRPCUnregistered');
      this._super();
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
          // case 'RC.GetInteriorVehicleDataCapabilities':
          // {
          //   Em.Logger.log('FFW.' + request.method + ' Request');
          //   if (!SDL.SDLModel.errorResponse) {
          //     var interiorVehicleDataCapabilities = {};
          //     if (request.params.moduleTypes) {
          //       for (var i = 0; i < request.params.moduleTypes.length; i++) {
          //         if (request.params.moduleTypes[i] === 'CLIMATE') {
          //           interiorVehicleDataCapabilities.climateControlCapabilities =
          //             [
          //               SDL.ClimateController.model.getClimateControlCapabilities()
          //             ]
          //         }
          //         if (request.params.moduleTypes[i] === 'RADIO') {
          //           interiorVehicleDataCapabilities.radioControlCapabilities =
          //             [
          //               SDL.RadioModel.getRadioControlCapabilities()
          //             ]
          //         }
          //       }
          //     }
          //     // send repsonse
          //     var JSONMessage = {
          //       'jsonrpc': '2.0',
          //       'id': request.id,
          //       'result': {
          //         'code': SDL.SDLModel.data.resultCode.SUCCESS,
          //         'method': request.method,
          //         'interiorVehicleDataCapabilities': interiorVehicleDataCapabilities
          //       }
          //     };
          //     this.client.send(JSONMessage);
          //   } else {
          //     this.sendError(
          //       SDL.SDLModel.data.resultCode['DATA_NOT_AVAILABLE'],
          //       request.id,
          //       request.method,
          //       'Requested module data is not available'
          //     );
          //   }
          //   break;
          // }

          //case "RC.GrantAccess": {
          //
          //    SDL.SDLModel.giveControl(request);
          //
          //    break;
          //}
          //
          //case "RC.CancelAccess": {
          //
          //    SDL.SDLModel.cancelControl(request);
          //
          //    break;
          //}
          case 'RC.SetInteriorVehicleData':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');

            var newClimateControlData = null;
            var newRadioControlData = null;

            if (request.params.moduleData.climateControlData) {
              newClimateControlData =
                SDL.ClimateController.model.setClimateData(
                  request.params.moduleData.climateControlData);
            }
            if (request.params.moduleData.radioControlData) {
              newRadioControlData =
                SDL.RadioModel.setRadioData(
                  request.params.moduleData.radioControlData);
            }
            // send repsonse
            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS,
                'method': request.method,
                'moduleData': {
                  'moduleType': request.params.moduleData.moduleType
                }
              }
            };

            if (newClimateControlData) {
              JSONMessage.result.moduleData.climateControlData =
                newClimateControlData;
            }

            if (newRadioControlData) {
              JSONMessage.result.moduleData.radioControlData =
                newRadioControlData;
            }

            this.client.send(JSONMessage);
            break;
          }
          case 'RC.GetInteriorVehicleData':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');
            if (request.params.appID == undefined) {
             this.sendError(
               SDL.SDLModel.data.resultCode.INVALID_DATA, request.id,
               request.method, 'appID parameter missing!'
             );
             return;
            }
            if (!this.conssetAppCheck(request)) {
              return;
            }

            var moduleType = request.params.moduleDescription.moduleType;
            var climateControlData = null;
            var radioControlData = null;

            var app = SDL.SDLController.getApplicationModel(
              request.params.appID
            );
            if (moduleType === 'CLIMATE') {
              climateControlData = SDL.ClimateController.model.getClimateControlData();
            } else if (moduleType === 'RADIO') {
              radioControlData = SDL.RadioModel.getRadioControlData();
            }

            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS,
                'method': request.method,
                'moduleData': {
                  'moduleType': moduleType
                }
              }
            };

            if (radioControlData) {
              JSONMessage.result.moduleData.radioControlData =
                radioControlData;
            }
            if (climateControlData) {
              JSONMessage.result.moduleData.climateControlData
                = climateControlData;
            }
            if (request.params.subscribe !== undefined) {
              JSONMessage.result.isSubscribed =
                request.params.subscribe;
            }

            this.client.send(JSONMessage);
            break;
          }
          case 'RC.GetInteriorVehicleDataConsent':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');
            SDL.SDLController.interiorDataConsent(request);
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
        this.client.send(JSONMessage);
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
        this.client.send(JSONMessage);
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
          allowed: allowed
        }
      };
      this.client.send(JSONMessage);
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
        this.client.send(JSONMessage);
      }
    },
    /**
     * From HMI to RSDL
     * notifies if User selected to disallow RSDL functionality or if he
     * changed his mind and allowed it.
     * @constructor
     */
    OnReverseAppsAllowing: function(allowed) {
      Em.Logger.log('FFW.VehicleInfo.OnReverseAppsAllowing Notification');
      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'VehicleInfo.OnReverseAppsAllowing',
        'params': {
          'allowed': allowed
        }
      };
      this.client.send(JSONMessage);
    },
    /**
     * Notification about trigered action by user touchstart
     *
     */
    OnControlChanged: function() {
      SDL.SDLModel.set('givenControlFlag', false);
      Em.Logger.log('FFW.RC.OnControlChanged Notification');
      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'RC.OnControlChanged'
      };
      this.client.send(JSONMessage);
    },
    /**
     * @param moduleType
     */
    onInteriorVehicleDataNotification: function(moduleType, climateControlData, radioControlData) {
      var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'RC.OnInteriorVehicleData',
          'params': {
            'moduleData': {
              'moduleType': moduleType
            }
          }
        };
        if (climateControlData) {
          JSONMessage.params.moduleData.climateControlData =
            climateControlData;
        }
        if (radioControlData) {
          JSONMessage.params.moduleData.radioControlData =
            radioControlData;
        }
        Em.Logger.log('FFW.RC.OnInteriorVehicleData Notification');
        FFW.RC.client.send(JSONMessage);
    },
    /**
     * Verification for consented apps
     * HMI should reject secon unconsented app
     * @param request
     */
    conssetAppCheck: function(request) {
      var deviceName = SDL.SDLController.getApplicationModel(
        request.params.appID
      ).deviceName;
      if ((SDL.SDLModel.driverDeviceInfo &&
        deviceName == SDL.SDLModel.driverDeviceInfo.name) ||
        !SDL.SDLController.reverseAppsAllowed) {
        return true;
      }
      if (request.params.moduleDescription) {
        if (request.params.moduleDescription.moduleType === 'CLIMATE') {
          if (SDL.SDLModel.data.climateFirstConsentedApp == null) {
            SDL.SDLModel.data.climateFirstConsentedApp = request.params.appID;
            return true;
          } else if (SDL.SDLModel.data.climateFirstConsentedApp !=
            request.params.appID) {
            this.sendError(
              SDL.SDLModel.data.resultCode.REJECTED,
              request.id,
              request.method,
              'To many unconsented requests!'
            );
            return false;
          }
        } else {
          if (SDL.SDLModel.data.radioFirstConsentedApp == null) {
            SDL.SDLModel.data.radioFirstConsentedApp = request.params.appID;
            return true;
          } else if (SDL.SDLModel.data.radioFirstConsentedApp !=
            request.params.appID) {
            this.sendError(
              SDL.SDLModel.data.resultCode.REJECTED,
              request.id,
              request.method,
              'To many unconsented requests!'
            );
            return false;
          }
        }
      } else {
        if (request.params.moduleData.moduleType === 'CLIMATE') {
          if (SDL.SDLModel.data.climateFirstConsentedApp == null) {
            SDL.SDLModel.data.climateFirstConsentedApp = request.params.appID;
            return true;
          } else if (SDL.SDLModel.data.climateFirstConsentedApp !=
            request.params.appID) {
            this.sendError(
              SDL.SDLModel.data.resultCode.REJECTED,
              request.id,
              request.method,
              'To many unconsented requests!'
            );
            return false;
          }
        } else {
          if (SDL.SDLModel.data.radioFirstConsentedApp == null) {
            SDL.SDLModel.data.radioFirstConsentedApp = request.params.appID;
            return true;
          } else if (SDL.SDLModel.data.radioFirstConsentedApp !=
            request.params.appID) {
            this.sendError(
              SDL.SDLModel.data.resultCode.REJECTED,
              request.id,
              request.method,
              'To many unconsented requests!'
            );
            return false;
          }
        }
      }
      return true;
    }
  }
);
