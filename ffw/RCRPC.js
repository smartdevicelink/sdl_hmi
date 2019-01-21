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
      this.client.subscribeToNotification(this.onRCStatusNotification);
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
            this.client.send(JSONMessage);
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
                'remoteControlCapability': SDL.remoteControlCapability
              }
            };
            this.client.send(JSONMessage);
            break;
          }
          case 'RC.SetInteriorVehicleData':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');
            this.set('isSetVdInProgress', true);

            if (request.params.moduleData.radioControlData) {
              if (request.params.moduleData.radioControlData.radioEnable == undefined
                  && SDL.RadioModel.radioControlStruct.radioEnable == false) {
                this.sendError(
                  SDL.SDLModel.data.resultCode.IGNORED,
                  request.id, request.method,
                  'Radio module must be activated.'
                );
                return;
              }
              if(request.params.moduleData.radioControlData.hdChannel !== undefined
                 && request.params.moduleData.radioControlData.hdRadioEnable == undefined
                  && SDL.RadioModel.radioControlStruct.hdRadioEnable == false) {
                  this.sendError(
                    SDL.SDLModel.data.resultCode.UNSUPPORTED_RESOURCE,
                    request.id, request.method,
                    'HD Radio module does not supported.'
                  );
                  return;
              }
              var result = SDL.RadioModel.checkRadioFrequencyBoundaries(
                request.params.moduleData.radioControlData
              );
              if (!result.success) {
                this.sendError(
                  SDL.SDLModel.data.resultCode.INVALID_DATA,
                  request.id, request.method,
                  result.info
                );
                return;
              }
            }
            
            var newClimateControlData = null;
            var newRadioControlData = null;
            var newAudioControlData= null;    
            var newHMISettingsControlData = null;
            var newLightControlData = null;
            var newSeatControlData = null;
            
            if (request.params.moduleData.climateControlData) {
              var currentClimateState = 
                SDL.ClimateController.getClimateControlData().climateEnable;
              var requestedClimateState = 
                request.params.moduleData.climateControlData.climateEnable;
              if(!currentClimateState) {
                if(requestedClimateState === undefined) {
                  this.sendError(
                    SDL.SDLModel.data.resultCode.REJECTED,
                    request.id, request.method,
                    'Climate Control is disable. Turn Climate on.'
                  );
                  return;
                } else if(requestedClimateState === false) {
                  this.sendError(
                    SDL.SDLModel.data.resultCode.REJECTED,
                    request.id, request.method,
                    'Climate Control is disabled already.'
                  );
                  return;
                }
              }
              newClimateControlData =
                SDL.ClimateController.model.setClimateData(
                  request.params.moduleData.climateControlData);
              if (Object.keys(request.params.moduleData.climateControlData).length > 0) {
                FFW.RC.onInteriorVehicleDataNotification({moduleType:'CLIMATE', 
                                                          climateControlData: newClimateControlData});
              }     
            }
            if (request.params.moduleData.radioControlData) {
             if(request.params.moduleData.radioControlData.band && 
              request.params.moduleData.radioControlData.band == 'DAB'){
                this.sendError(
                  SDL.SDLModel.data.resultCode.UNSUPPORTED_RESOURCE,
                  request.id, request.method,'DAB not supported'
                );
                return;
              } else {
                newRadioControlData =
                  SDL.RadioModel.setRadioData(
                    request.params.moduleData.radioControlData);
                if (SDL.RadioModel.radioControlStruct.radioEnable) {
                  SDL.RadioModel.saveCurrentOptions();
                }
                if (Object.keys(newRadioControlData).length > 0) {
                  FFW.RC.onInteriorVehicleDataNotification({moduleType:'RADIO', 
                                                            radioControlData: newRadioControlData});
                }
              }
            }
            if(request.params.moduleData.audioControlData){
              if(request.params.moduleData.audioControlData.source && 
                request.params.moduleData.audioControlData.source == 'DAB'){
                  this.sendError(
                    SDL.SDLModel.data.resultCode.UNSUPPORTED_RESOURCE,
                    request.id, request.method,'DAB not supported'
                  );
                  return;
                } else {
              newAudioControlData = (request.params.moduleData.audioControlData.keepContext!=null)?
              SDL.MediaController.setAudioControlDataWithKeepContext(request.params.moduleData.audioControlData)
              :SDL.MediaController.setAudioControlData(request.params.moduleData.audioControlData);
                if (Object.keys(request.params.moduleData.audioControlData).length > 0) {
                  FFW.RC.onInteriorVehicleDataNotification({moduleType:'AUDIO', 
                                                          audioControlData: newAudioControlData});
                }
              }
            }
            if(request.params.moduleData.hmiSettingsControlData){
              newHMISettingsControlData = SDL.HmiSettingsModel.setHmiSettingsData(
                request.params.moduleData.hmiSettingsControlData);
                if (Object.keys(request.params.moduleData.hmiSettingsControlData).length > 0) {
                  FFW.RC.onInteriorVehicleDataNotification({moduleType:'HMI_SETTINGS', 
                                                            hmiSettingsControlData: newHMISettingsControlData});
                }  
            }
            if(request.params.moduleData.lightControlData){
              newLightControlData = SDL.LightModel.setLightControlData(
                request.params.moduleData.lightControlData);

                if (Object.keys(newLightControlData).length > 0) {
                  FFW.RC.onInteriorVehicleDataNotification({moduleType:'LIGHT', 
                                                            lightControlData: request.params.moduleData.lightControlData});
                }
            }
            if(request.params.moduleData.seatControlData){
              newSeatControlData = SDL.SeatModel.setSeatControlData(
                request.params.moduleData.seatControlData);
                if (Object.keys(request.params.moduleData.seatControlData).length > 0) {
                  FFW.RC.onInteriorVehicleDataNotification({moduleType:'SEAT', 
                                                            seatControlData: newSeatControlData});
                }   
            };
            // send response
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
            if (newAudioControlData) {
              JSONMessage.result.moduleData.audioControlData =
              newAudioControlData;
            }
            if (newClimateControlData) {
              JSONMessage.result.moduleData.climateControlData =
                newClimateControlData;
            }
            if (newRadioControlData) {
              JSONMessage.result.moduleData.radioControlData =
                newRadioControlData;
            }
            if(newHMISettingsControlData){
              JSONMessage.result.moduleData.hmiSettingsControlData =
                newHMISettingsControlData;
            }
            if(newLightControlData){
              JSONMessage.result.moduleData.lightControlData =
                newLightControlData;
            }
            if(newSeatControlData){
              JSONMessage.result.moduleData.seatControlData =
                newSeatControlData;
            }

            this.client.send(JSONMessage);
            this.set('isSetVdInProgress', false);
            break;
          }
          case 'RC.GetInteriorVehicleData':
          {
            Em.Logger.log('FFW.' + request.method + ' Request');

            var moduleType = request.params.moduleType;
            var climateControlData = null;
            var radioControlData = null;
            var audioControlData=null;
            var hmiSettingsControlData = null;
            var lightControlData = null;
            var seatControlData = null;

            var app = SDL.SDLController.getApplicationModel(
              request.params.appID
            );
            switch(moduleType){
              case 'CLIMATE':{
                climateControlData = SDL.ClimateController.getClimateControlData();
                break
              }
              case 'RADIO':{
                radioControlData = SDL.RadioModel.getRadioControlData(false);
                break
              }
              case 'HMI_SETTINGS':{
                hmiSettingsControlData = SDL.HmiSettingsModel.getHmiSettingsControlData(false);
                break
              }
              case 'AUDIO':{
                audioControlData = SDL.MediaController.getAudioControlData(false);
                break;
              }
              case 'LIGHT':{
                lightControlData = SDL.LightModel.getLightControlData(false);
                break
              }
              case 'SEAT':{
                seatControlData = SDL.SeatModel.getSeatControlData(false);
                break
              }
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
            if (audioControlData) {
              JSONMessage.result.moduleData.audioControlData
                = audioControlData;
            }
            if(hmiSettingsControlData){
              JSONMessage.result.moduleData.hmiSettingsControlData = 
              hmiSettingsControlData;
            }
            if(lightControlData){
              JSONMessage.result.moduleData.lightControlData = 
                lightControlData;
            }
            if(seatControlData){
              JSONMessage.result.moduleData.seatControlData = 
              seatControlData;
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
          'allowed': allowed
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
      this.client.send(JSONMessage);
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
        FFW.RC.client.send(JSONMessage);
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

      var deviceName = SDL.SDLController.getApplicationModel(appID)
        .deviceName;

      if ((SDL.SDLModel.driverDeviceInfo &&
        deviceName != SDL.SDLModel.driverDeviceInfo.name) ||
        !SDL.SDLModel.reverseFunctionalityEnabled) {
        return false;
      }

      return true;
    },
  }
);
