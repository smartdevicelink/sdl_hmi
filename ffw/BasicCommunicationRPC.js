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
/**
 * Reference implementation of BasicCommunication component. Interface to get or
 * set some essential information from OS. BasicCommunication responsible for
 * handling the basic commands of non-graphical part such as the registration of
 * mobile apps, geting the list of devices and applications and data transfer.
 */

FFW.BasicCommunication = FFW.RPCObserver
  .create(
    {
      /**
       * access to basic RPC functionality
       */
      client: FFW.RPCClient,
      /**
       * Contains response codes for request that should be processed but there
       * were some kind of errors Error codes will be injected into response.
       */
      errorResponsePull: {},
      /**
       * Contains keys and versions from vehicle data mapping which should be updated
       * once PTU sequence is finished (SystemRequest is received)
       */
      pendingVersionsToApply: {},
      onPutFileSubscribeRequestID: -1,
      onStatusUpdateSubscribeRequestID: -1,
      onAppPermissionChangedSubscribeRequestID: -1,
      onSDLPersistenceCompleteSubscribeRequestID: -1,
      onFileRemovedSubscribeRequestID: -1,
      onAppRegisteredSubscribeRequestID: -1,
      onAppUnregisteredSubscribeRequestID: -1,
      onSDLCloseSubscribeRequestID: -1,
      onSDLConsentNeededSubscribeRequestID: -1,
      onResumeAudioSourceSubscribeRequestID: -1,
      onServiceUpdateNotificationSubscribeRequestID: -1,
      onSystemCapabilityUpdatedNotificationSubscribeRequestID: -1,
      onAppPropertiesChangeNotificationSubscribeRequestID: -1,
      onAppServiceDataNotificationSubscribeRequestID: -1,
      onPutFileUnsubscribeRequestID: -1,
      onStatusUpdateUnsubscribeRequestID: -1,
      onAppPermissionChangedUnsubscribeRequestID: -1,
      onSDLPersistenceCompleteUnsubscribeRequestID: -1,
      onFileRemovedUnsubscribeRequestID: -1,
      onAppRegisteredUnsubscribeRequestID: -1,
      onAppUnregisteredUnsubscribeRequestID: -1,
      onSDLCloseUnsubscribeRequestID: -1,
      onSDLConsentNeededUnsubscribeRequestID: -1,
      onResumeAudioSourceUnsubscribeRequestID: -1,
      onServiceUpdateNotificationUnsubscribeRequestID: -1,
      onSystemCapabilityUpdatedNotificationUnsubscribeRequestID: -1,
      onAppServiceDataNotificationUnsubscribeRequestID: -1,
      // const
      onStatusUpdateNotification: 'SDL.OnStatusUpdate',
      onAppPermissionChangedNotification: 'SDL.OnAppPermissionChanged',
      onSDLConsentNeededNotification: 'SDL.OnSDLConsentNeeded',
      onSDLPersistenceCompleteNotification: 'BasicCommunication.OnSDLPersistenceComplete',
      onPutFileNotification: 'BasicCommunication.OnPutFile',
      onFileRemovedNotification: 'BasicCommunication.OnFileRemoved',
      onAppRegisteredNotification: 'BasicCommunication.OnAppRegistered',
      onAppUnregisteredNotification: 'BasicCommunication.OnAppUnregistered',
      onSDLCloseNotification: 'BasicCommunication.OnSDLClose',
      onResumeAudioSourceNotification: 'BasicCommunication.OnResumeAudioSource',
      componentName: "BasicCommunication",
      onServiceUpdateNotification: 'BasicCommunication.OnServiceUpdate',
      onSystemCapabilityUpdatedNotification: 'BasicCommunication.OnSystemCapabilityUpdated',
      onAppPropertiesChangeNotification: 'BasicCommunication.OnAppPropertiesChange',
      onAppServiceDataNotification: 'AppService.OnAppServiceData',

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
       * Client is registered - we can send request starting from this point
       * of time
       */
      onRPCRegistered: function() {
        Em.Logger.log('FFW.BasicCommunicationRPC.onRPCRegistered');
        this._super();
        // subscribe to notifications
        this.onPutFileSubscribeRequestID = this
          .subscribeToNotification(this.onPutFileNotification);
        this.onStatusUpdateSubscribeRequestID = this
          .subscribeToNotification(this.onStatusUpdateNotification);
        this.onAppPermissionChangedSubscribeRequestID = this
          .subscribeToNotification(this.onAppPermissionChangedNotification);
        this.onSDLPersistenceCompleteSubscribeRequestID = this
          .subscribeToNotification(this.onSDLPersistenceCompleteNotification);
        this.onFileRemovedSubscribeRequestID = this
          .subscribeToNotification(this.onFileRemovedNotification);
        this.onAppRegisteredSubscribeRequestID = this
          .subscribeToNotification(this.onAppRegisteredNotification);
        this.onAppUnregisteredSubscribeRequestID = this
          .subscribeToNotification(this.onAppUnregisteredNotification);
        this.onSDLCloseSubscribeRequestID = this
          .subscribeToNotification(this.onSDLCloseNotification);
        this.onSDLConsentNeededSubscribeRequestID = this
          .subscribeToNotification(this.onSDLConsentNeededNotification);
        this.onResumeAudioSourceSubscribeRequestID = this
          .subscribeToNotification(this.onResumeAudioSourceNotification);
        this.onServiceUpdateNotificationSubscribeRequestID = this
          .subscribeToNotification(this.onServiceUpdateNotification);
        this.onSystemCapabilityUpdatedNotificationSubscribeRequestID = this
          .subscribeToNotification(this.onSystemCapabilityUpdatedNotification);
        this.onAppPropertiesChangeNotificationSubscribeRequestID = this
          .subscribeToNotification(this.onAppPropertiesChangeNotification);
        this.onAppServiceDataNotificationSubscribeRequestID = this
          .subscribeToNotification(this.onAppServiceDataNotification);
        setTimeout(function() {
          FFW.BasicCommunication.OnSystemTimeReady();
        }, 500);
      },
      /**
       * Client is unregistered - no more requests
       */
      onRPCUnregistered: function() {
        Em.Logger.log('FFW.BasicCommunicationRPC.onRPCUnregistered');
        this._super();
        // unsubscribe from notifications
        this.onPutFileUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onPutFileNotification);
        this.onStatusUpdateUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onStatusUpdateNotification);
        this.onAppPermissionChangedUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onAppPermissionChangedNotification);
        this.onSDLPersistenceCompleteUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(
            this.onSDLPersistenceCompleteNotification
          );
        this.onFileRemovedUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onFileRemovedNotification);
        this.onAppRegisteredUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onAppRegisteredNotification);
        this.onAppUnregisteredUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onAppUnregisteredNotification);
        this.onSDLCloseUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onSDLCloseNotification);
        this.onSDLConsentNeededUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onSDLConsentNeededNotification);
        this.onResumeAudioSourceUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onResumeAudioSourceNotification);
        this.onServiceUpdateNotificationUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onServiceUpdateNotification);
        this.onSystemCapabilityUpdatedNotificationUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onSystemCapabilityUpdatedNotification);
        this.onAppServiceDataNotificationUnsubscribeRequestID = this.client
          .unsubscribeFromNotification(this.onAppServiceDataNotification);
      },
      /**
       * Client disconnected.
       */
      onRPCDisconnected: function() {
        if (SDL.SDLController) {
          SDL.SDLController.onSDLDisconected();
        }
      },
      /**
       * when result is received from RPC component this function is called It
       * is the propriate place to check results of reuqest execution Please
       * use previously store reuqestID to determine to which request repsonse
       * belongs to
       */
      onRPCResult: function(response) {
        Em.Logger.log('FFW.BasicCommunicationRPC.onRPCResult');
        this._super();
        if(response.result.method == 'SDL.GetPolicyConfigurationData') {
          var policyConfigRequestsData = SDL.SDLModel.data.getPolicyConfigurationDataRequestsList;
          var dataToRemove = null;
          policyConfigRequestsData.forEach(requestedData => {
            if(requestedData.id == response.id) {
              dataToRemove = requestedData;

              var resultCode = SDL.SDLModel.data.resultCode;
              if(response.result.code !== resultCode.SUCCESS) {
                var resultCodeString = '';
                for(key in resultCode) {
                  if(resultCode[key] === response.result.code) {
                    resultCodeString = key;
                    break;
                  }
                }
                SDL.PopUp.create().appendTo('body').popupActivate(
                  `${response.result.method} request from HMI wasn't successful.
                  Error code: ${response.result.code}( ${resultCodeString} )`
                )
                return;
              }
              if(response.result.value) {
                var policyConfigData = SDL.SDLModel.data.policyConfigData;
                response.result.value.forEach(element => {
                  var data = JSON.parse(element);
                  if(typeof data === 'object') {
                    for(key in data) {
                      if(requestedData.nestedProperty == key &&
                      requestedData.property == 'endpoint_properties') {
                        var self = this;
                        policyConfigData.forEach(function(configData, configIndex) {
                          if(undefined !== configData[key] &&
                              data[key]['version'] !== configData[key]['version']) {
                            if (!self.pendingVersionsToApply.hasOwnProperty(configIndex)) {
                              self.pendingVersionsToApply[configIndex] = {};
                            }
                            self.pendingVersionsToApply[configIndex][key] = data[key]['version'];

                            self.GetPolicyConfigurationData({
                              policyType: 'module_config',
                              property: 'endpoints',
                              nestedProperty: 'custom_vehicle_data_mapping_url'
                            });
                          }
                        })
                      }
                      else if (requestedData.nestedProperty == key &&
                      requestedData.property == 'endpoints') {
                        if(undefined !== data[key]) {
                          if(key == 'custom_vehicle_data_mapping_url') {
                            var fileName = "/tmp/fs/mp/images/ivsu_cache/oemMappingTable.json";
                            this.OnSystemRequest('OEM_SPECIFIC',
                                    fileName,
                                    data[key].default[0],
                                    undefined,
                                    'VEHICLE_DATA_MAPPING')
                          }
                          if(key == 7) {
                            SDL.SDLModel.data.set('policyURLs', data[key].default);
                            if(!FLAGS.PTUWithModemEnabled) {
                              if (data[key].default.length) {
                                SDL.SettingsController.OnSystemRequestHandler(data[key].default[0]);
                              } else {
                                SDL.SettingsController.OnSystemRequestHandler();
                              }
                              if (FLAGS.ExternalPolicies === true) {
                                SDL.SettingsController.policyUpdateRetry();
                              }
                            } else {
                              SDL.SettingsController.requestPTUFromEndpoint(SDL.SettingsController.policyUpdateFile, data[key].default);
                            }
                          }
                        }
                      }
                    }
                  }
                })
              }
            }
          })

          var index = policyConfigRequestsData.indexOf(dataToRemove);
          if(-1 <= index) {
            policyConfigRequestsData.splice(index,1);
          }
        }
        if (response.result.method == 'SDL.GetUserFriendlyMessage') {
          Em.Logger.log('SDL.GetUserFriendlyMessage: Response from SDL!');
          if (response.id in SDL.SDLModel.data.userFriendlyMessagePull) {
            var callbackObj = SDL.SDLModel.data.userFriendlyMessagePull[response.id];
            callbackObj.callbackFunc(response.result.messages);
            delete SDL.SDLModel.data.userFriendlyMessagePull[response.id];
          }
        }
        if (response.result.method == 'SDL.ActivateApp') {
          Em.Logger.log('SDL.ActivateApp: Response from SDL!');
          if (response.id in SDL.SDLModel.data.activateAppRequestsList) {
            var appID = SDL.SDLModel.data.activateAppRequestsList[response.id].appID,
              popUp = SDL.SDLModel.data.activateAppRequestsList[response.id].popUp;
            popUp.deactivate();
            if (!response.result.isSDLAllowed) {
              SDL.SettingsController.currentDeviceAllowance
                = response.result.device;
              FFW.BasicCommunication.GetUserFriendlyMessage(
                SDL.SettingsController.AllowSDLFunctionality,
                appID,
                ['DataConsent']
              );
            }
            if (response.result.isPermissionsConsentNeeded) {
              this.GetListOfPermissions(appID);
            }
            if (response.result.isAppPermissionsRevoked) {
              SDL.SDLModel.setAppPermissions(
                appID, response.result.appRevokedPermissions
              );
            }
            if (response.result.isAppRevoked) {
              FFW.BasicCommunication.GetUserFriendlyMessage(
                SDL.SettingsController.simpleParseUserFriendlyMessageData,
                appID,
                ['AppUnsupported']
              );
            } else {
              SDL.SDLController.getApplicationModel(appID)
                .deviceID = response.result.device ? response.result.device.id :
                null;
              if (SDL.SDLController.model &&
                SDL.SDLController.model.appID != appID) {
                SDL.States.goToStates('info.apps');
              }
              if (SDL.SDLModel.data.stateLimited == appID) {
                SDL.SDLModel.data.stateLimited = null;
                SDL.SDLModel.data.set('limitedExist', false);
              }
              if (response.result.isSDLAllowed) {
                SDL.SDLController.getApplicationModel(appID).turnOnSDL(appID);
              }
            }
            delete SDL.SDLModel.data.activateAppRequestsList[response.id];
          }
        }
        if (response.result.method == 'SDL.GetListOfPermissions') {
          Em.Logger.log('SDL.GetListOfPermissions: Response from SDL!');
          SDL.SettingsController.GetListOfPermissionsResponse(response);
        }
        if (response.result.method == 'SDL.GetStatusUpdate') {
          Em.Logger.log('SDL.GetStatusUpdate: Response from SDL!');
          SDL.PopUp.create().appendTo('body').popupActivate(
            "Update Status: " + response.result.status, null, false 
          );
        }
        if (response.result.method == 'BasicCommunication.GetAppProperties') {
          Em.Logger.log('BasicCommunication.GetAppProperties: Response from SDL!');
          SDL.InfoController.onGetAppProperties(response.result.code, response.result.properties);
        }
        if (response.result.method == 'BasicCommunication.SetAppProperties') {
          Em.Logger.log('BasicCommunication.SetAppProperties: Response from SDL!');
          SDL.InfoController.onSetAppProperties(response.result.code);
        }
      },
      /**
       * handle RPC erros here
       */
      onRPCError: function(response) {
        Em.Logger.log('FFW.BasicCommunicationRPC.onRPCError');
        this._super();
        if(!response.error.data) return ;

        if (response.error.data.method === 'SDL.ActivateApp') {
          var appID = SDL.SDLModel.data.activateAppRequestsList[response.id].appID,
            popUp = SDL.SDLModel.data.activateAppRequestsList[response.id].popUp;
          popUp.deactivate();
          if (response.error.code ===
            SDL.SDLModel.data.resultCode['APPLICATION_NOT_REGISTERED']) {
            SDL.PopUp.create().appendTo('body').popupActivate(
              'Activation FAILED! Application NOT registered.'
            );
            return;
          } else if (response.error.code ===
            SDL.SDLModel.data.resultCode.REJECTED) {
            SDL.PopUp.create().appendTo('body').popupActivate(
              'Activation FAILED! SDL rejected activation.'
            );
            return;
          }
        }
        else if (response.error.data.method === 'BasicCommunication.GetAppProperties') {
          Em.Logger.log('BasicCommunication.GetAppProperties: Response from SDL!');
          SDL.InfoController.onGetAppProperties(response.error.code, null);
        }
        else if (response.error.data.method === 'BasicCommunication.SetAppProperties') {
          Em.Logger.log('BasicCommunication.SetAppProperties: Response from SDL!');
          SDL.InfoController.onSetAppProperties(response.error.code);
        }
      },
      /**
       * handle RPC notifications here
       */
      onRPCNotification: function(notification) {
        Em.Logger.log('FFW.BasicCommunicationRPC.onRPCNotification');
        this._super();
        if (notification.method == this.onServiceUpdateNotification) {
          if('RPC' === notification.params.serviceType) {
            return;
          }
          SDL.ServiceUpdatePopUp.activate(notification.params.serviceType,
            notification.params.serviceEvent,
            notification.params.reason);
        }
        if (notification.method == this.onFileRemovedNotification) {
          SDL.SDLModel.onFileRemoved(notification.params);
        }
        if (notification.method == this.onStatusUpdateNotification) {
          var popUp = SDL.PopUp.create().appendTo('body');
          popUp.set('minimalSize',SDL.ServiceUpdatePopUp.active);
          popUp.popupActivate(
            'onStatusUpdate Notification: ' + notification.params.status
          );
          var messageCode = '';
          switch (notification.params.status) {
            case 'UP_TO_DATE':
            {
              messageCode = 'StatusUpToDate';
              //Update is complete, stop retry sequence
              if (FLAGS.ExternalPolicies === true) {
                SDL.SettingsController.policyUpdateRetry('ABORT');
              }
              SDL.SettingsController.policyUpdateFile = null;
              this.GetPolicyConfigurationData({
                policyType: 'module_config',
                property: 'endpoint_properties',
                nestedProperty: 'custom_vehicle_data_mapping_url'
              });
              break;
            }
            case 'UPDATING':
            {
              messageCode = 'StatusPending';
              break;
            }
            case 'UPDATE_NEEDED':
            {
              messageCode = 'StatusNeeded';
              if (FLAGS.ExternalPolicies === true && 
                  SDL.SDLModel.data.policyUpdateRetry.isRetry) {
                SDL.SettingsController.policyUpdateRetry();
              }
              break;
            }
          }
          FFW.BasicCommunication.GetUserFriendlyMessage(
            SDL.SettingsController.simpleParseUserFriendlyMessageData,
            SDL.SDLController.model ? SDL.SDLController.model.appID : null,
            [messageCode]
          );
        }
        if (notification.method == this.onAppPermissionChangedNotification) {
          if (notification.params.appPermissionsConsentNeeded) {
            this.GetListOfPermissions(notification.params.appID);
          }
          if (notification.params.isAppPermissionsRevoked) {
            SDL.SDLModel.setAppPermissions(
              notification.params.appID,
              notification.params.appRevokedPermissions
            );
          }
          if (notification.params.appRevoked) {
            FFW.BasicCommunication.GetUserFriendlyMessage(
              SDL.SettingsController.simpleParseUserFriendlyMessageData,
              notification.params.appID,
              ['AppUnsupported']
            );
          }
          if (notification.params.appUnauthorized) {
            FFW.BasicCommunication.GetUserFriendlyMessage(
              SDL.SettingsController.simpleParseUserFriendlyMessageData,
              notification.params.appID,
              ['AppUnauthorized']
            );
          }
        }
        if (notification.method == this.onAppRegisteredNotification) {
          let appModel = Object.assign(notification.params.application, {
            "priority": notification.params.priority ? notification.params.priority : 'NONE'
          });
          SDL.SDLModel.onAppRegistered(
            appModel, notification.params.vrSynonyms
          );
          FFW.RPCHelper.addApplication(notification.params.application.appID);
          this.OnFindApplications();
          const mainWindowID = 0;
          let capability = SDL.SDLController.getDefaultCapabilities(mainWindowID, notification.params.application.appID);
          FFW.BasicCommunication.OnSystemCapabilityUpdated(capability);
        }
        if (notification.method == this.onAppUnregisteredNotification) {
          if(notification.params.appID === FFW.RPCHelper.get('currentAppID')){
            SDL.States.goToStates('settings.rpccontrol');
            SDL.RPCControlView.showAppList();
          }
          // remove app from list
          SDL.SDLModel.onAppUnregistered(notification.params);
        }
        if (notification.method == this.onSDLCloseNotification) {
          //notification handler method
        }
        if (notification.method == this.onSDLConsentNeededNotification) {
          SDL.SettingsController.currentDeviceAllowance
            = notification.params.device;
          FFW.BasicCommunication.GetUserFriendlyMessage(
            SDL.SettingsController.AllowSDLFunctionality,
            null,
            ['DataConsent']
          );
        }
        if (notification.method == this.onResumeAudioSourceNotification) {
          SDL.SDLModel.data.stateLimited = notification.params.device;
          SDL.VRPopUp.updateVR();
        }
        if (notification.method == this.onPutFileNotification) {
          SDL.SDLModel.onPutFile(notification.params);
        }
        if (notification.method == this.onAppPropertiesChangeNotification) {
          SDL.InfoController.onAppPropertiesNotification(notification.params.properties);
        }
      },
      /**
       * handle RPC requests here
       */
      onRPCRequest: function(request) {
        Em.Logger.log('FFW.BasicCommunicationRPC.onRPCRequest');
        this._super();
        if (this.validationCheck(request)) {
          if (request.method == 'BasicCommunication.MixingAudioSupported') {
            this.MixingAudioSupported(request.id, true);
          }
          if (request.method == 'BasicCommunication.AllowAllApps') {
            this.AllowAllApps(request.id, true);
          }
          if (request.method == 'BasicCommunication.AllowApp') {
            this.AllowApp(request);
          }
          if (request.method == 'BasicCommunication.UpdateDeviceList') {
            SDL.SDLModel.onGetDeviceList(request.params);
            this.sendBCResult(
              SDL.SDLModel.data.resultCode.SUCCESS,
              request.id,
              request.method
            );
          }
          if (request.method == 'BasicCommunication.UpdateAppList') {
            SDL.SDLController.UpdateAppList(request.params);
            this.sendBCResult(
              SDL.SDLModel.data.resultCode.SUCCESS,
              request.id,
              request.method
            );
            SDL.InfoAppsView.showAppList();
          }
          if (request.method == 'BasicCommunication.SystemRequest') {
            if (FLAGS.ExternalPolicies === true) {
              FFW.ExternalPolicies.unpack({
                requestType: request.params.requestType,
                requestSubType: request.params.requestSubType,
                fileName: request.params.fileName
              });
            } else {
              this.OnReceivedPolicyUpdate(request.params.fileName);
            }

            if (request.params.requestType == 'OEM_SPECIFIC' &&
                request.params.requestSubType == 'VEHICLE_DATA_MAPPING') {
              var policyConfigData = SDL.SDLModel.data.policyConfigData;
              var self = this;
              policyConfigData.forEach(function(configData, configIndex) {
                if (self.pendingVersionsToApply.hasOwnProperty(configIndex)) {
                  var configVersionsToApply = self.pendingVersionsToApply[configIndex];
                  Object.keys(configVersionsToApply).forEach(keyToApply => {
                    configData[keyToApply]['version'] = configVersionsToApply[keyToApply];
                  });
                  delete self.pendingVersionsToApply[configIndex];
                }
              });
            }

            this.sendBCResult(
              SDL.SDLModel.data.resultCode.SUCCESS,
              request.id,
              request.method
            );
          }
          if (request.method == 'BasicCommunication.DialNumber') {
            SDL.PopUp.create().appendTo('body').popupActivate(
              'Would you like to dial ' + request.params.number + ' ?',
              function(result) {
                if (result) {
                  FFW.BasicCommunication.sendBCResult(
                    SDL.SDLModel.data.resultCode.SUCCESS,
                    request.id,
                    request.method
                  );
                  SDL.SDLModel.onDeactivateApp('call', request.params.appID);
                  SDL.States.goToStates('phone.dialpad');
                  SDL.PhoneController.incomingCall(request);
                } else {
                  FFW.BasicCommunication.sendError(
                    SDL.SDLModel.data.resultCode.REJECTED,
                    request.id,
                    request.method,
                    'No paired device!'
                  );
                }
              },
              false
            );
          }
          if (request.method == 'BasicCommunication.ActivateApp') {
            if (!request.params.level || request.params.level == 'FULL') {
              if (SDL.SDLController.model &&
                SDL.SDLController.model.appID != request.params.appID) {
                SDL.States.goToStates('info.apps');
              }
              if (SDL.SDLModel.data.stateLimited == request.params.appID) {
                SDL.SDLModel.data.stateLimited = null;
                SDL.SDLModel.data.set('limitedExist', false);
              }
              SDL.SDLController.getApplicationModel(request.params.appID).level
                = 'FULL';
              SDL.SDLController.getApplicationModel(request.params.appID)
                .turnOnSDL(request.params.appID);
              SDL.VRPopUp.updateVR();
            } else if (request.params.level === 'LIMITED') {
              SDL.SDLController.getApplicationModel(request.params.appID).level
                = 'LIMITED';
              SDL.VRPopUp.updateVR();
              if (SDL.SDLController.model &&
                SDL.SDLController.model.appID === request.params.appID) {
                SDL.States.goToStates('info.apps');
              }
              SDL.InfoAppsView.showAppList();
            } else if (request.params.level === 'NONE') {
              SDL.SDLController.getApplicationModel(request.params.appID).level
                = 'NONE';
              SDL.VRPopUp.updateVR();
              if (SDL.SDLController.model &&
                SDL.SDLController.model.appID === request.params.appID) {
                SDL.States.goToStates('info.apps');
              }
              SDL.InfoAppsView.showAppList();
            } else if (request.params.level === 'BACKGROUND') {
              SDL.SDLController.getApplicationModel(request.params.appID).level
                = 'BACKGROUND';
              SDL.VRPopUp.updateVR();
              if (SDL.SDLController.model &&
                SDL.SDLController.model.appID === request.params.appID) {
                SDL.States.goToStates('info.apps');
              }
              SDL.InfoAppsView.showAppList();
            }
            this.sendBCResult(
              SDL.SDLModel.data.resultCode.SUCCESS, request.id, request.method
            );
          }
          if (request.method == 'BasicCommunication.CloseApplication') {
            SDL.SDLController.getApplicationModel(request.params.appID).level
              = 'NONE';
            SDL.SDLController.closeApplication(request.params.appID);
            this.sendBCResult(
              SDL.SDLModel.data.resultCode.SUCCESS, request.id, request.method
            );
          }
          if (request.method == 'BasicCommunication.GetSystemInfo') {
            Em.Logger.log('BasicCommunication.GetSystemInfo Response');
            // send repsonse
            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS, // type (enum)
                                                              // from SDL
                                                              // protocol
                'method': request.method,
                'ccpu_version': SDL.SDLModel.data.ccpuVersion,
                'language': SDL.SDLModel.data.hmiUILanguage,
                'wersCountryCode': 'wersCountryCode'
              }
            };
            if (SDL.SDLModel.data.hardwareVersion != null) {
              JSONMessage.result.systemHardwareVersion = SDL.SDLModel.data.hardwareVersion;
            }
            this.sendMessage(JSONMessage);
          }
          if (request.method == 'BasicCommunication.PolicyUpdate') {
            SDL.SettingsController.policyUpdateFile = request.params.file;
            if (FLAGS.ExternalPolicies === true) {
              SDL.SDLModel.data.policyUpdateRetry.timeout
                = request.params.timeout;
              SDL.SDLModel.data.policyUpdateRetry.retry = request.params.retry;
              SDL.SDLModel.data.policyUpdateRetry.try = 0;
              this.GetPolicyConfigurationData({
                policyType: 'module_config',
                property: 'endpoints',
                nestedProperty: 7 //Service type for policies
              });
            }
            else if (FLAGS.PTUWithModemEnabled) {
              this.GetPolicyConfigurationData({
                policyType: 'module_config',
                property: 'endpoints',
                nestedProperty: 7 //Service type for policies
              });
            }
            else {
              SDL.SettingsController.OnSystemRequestHandler();
            }
            this.sendBCResult(
              SDL.SDLModel.data.resultCode.SUCCESS, request.id, request.method
            );
          }
          if (request.method == 'BasicCommunication.DecryptCertificate') {
            this.sendBCResult(
              SDL.SDLModel.data.resultCode.SUCCESS, request.id, request.method
            );
          }
          if (request.method == 'BasicCommunication.GetSystemTime') {
            var resultCode = SDL.SettingsController.get('getSystemTimeResultCode');
            resultCode == SDL.SDLModel.data.resultCode.SUCCESS
            ? this.GetSystemTimeResponse(request)
            : this.sendError(resultCode, request.id, request.method,
               "GetSystemTime request rejected on HMI Settings");
          }
        }
      },
      /********************* Requests BEGIN *********************/

       /**
       * @function GetPolicyConfigurationData
       * @param {Array} identifiers 
       * @description Send request SDL.GetPolicyConfigurationData
       */
      GetPolicyConfigurationData: function(data) {
        Em.Logger.log('SDL.GetPolicyConfigurationData: Request from HMI!');

        var itemIndex = this.client.generateId();
        var policyConfigRequestsData = SDL.SDLModel.data.getPolicyConfigurationDataRequestsList;
        policyConfigRequestsData.push({
          id: itemIndex,
          policyType: data.policyType,
          property: data.property,
          nestedProperty: data.nestedProperty        
        });
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': itemIndex,
          'method': 'SDL.GetPolicyConfigurationData',
          'params': {
            'policyType': data.policyType,
            'property': data.property
          }
        };
        this.sendMessage(JSONMessage);
      },

      /**
       * @description Sends request to get actual app properties
       * @param {Number} policyAppID
       */
      GetAppProperties: function(policyAppID) {
        var itemIndex = this.client.generateId();
        Em.Logger.log('BasicCommunication.GetAppProperties: Request from HMI!');

        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': itemIndex,
          'method': 'BasicCommunication.GetAppProperties',
          'params': {}
        };

        if (policyAppID) {
          JSONMessage.params.policyAppID = policyAppID;
        }

        this.sendMessage(JSONMessage);
      },

      /**
       * @description Sends request to set actual app properties
       * @param {Object} properties
       */
      SetAppProperties: function(properties) {
        var itemIndex = this.client.generateId();
        Em.Logger.log('BasicCommunication.SetAppProperties: Request from HMI!');

        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': itemIndex,
          'method': 'BasicCommunication.SetAppProperties',
          'params': {
            'properties': properties
          }
        };

        this.sendMessage(JSONMessage);
      },

      /**
       * Send request if application was activated
       *
       * @param {Number} appID
       */
      ActivateApp: function(appID) {
        var itemIndex = this.client.generateId();
        SDL.SDLModel.data.activateAppRequestsList[itemIndex] = {
          'appID': appID,
          'popUp': SDL.PopUp.create().appendTo('body').popupActivate(
            'Activation in progress...', null, true
          )
        };
        Em.Logger.log('SDL.ActivateApp: Request from HMI!');
        // send notification
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': itemIndex,
          'method': 'SDL.ActivateApp',
          'params': {
            'appID': appID
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Request to SDLCore to get user friendly message
       * callback function uses text message came in response from SDLCore
       *
       * @callback callbackFunc
       */
      GetUserFriendlyMessage: function(callbackFunc, appID, messageCodes) {
        var itemIndex = this.client.generateId();
        SDL.SDLModel.data.userFriendlyMessagePull[itemIndex]
          = {'callbackFunc': callbackFunc, 'appID': appID};
        Em.Logger.log('SDL.GetUserFriendlyMessage: Request from HMI!');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': itemIndex,
          'method': 'SDL.GetUserFriendlyMessage',
          'params': {
            'language': SDL.SDLModel.data.hmiUILanguage,
            'messageCodes': messageCodes
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Request to SDLCore to get user friendly message
       * callback function uses text message came in response from SDLCore
       *
       * @param {Number} appID
       */
      GetListOfPermissions: function(appID) {
        var itemIndex = this.client.generateId();
        SDL.SDLModel.data.getListOfPermissionsPull[itemIndex] = appID;
        Em.Logger.log('SDL.GetListOfPermissions: Request from HMI!');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': itemIndex,
          'method': 'SDL.GetListOfPermissions',
          'params': {}
        };
        if (appID) {
          JSONMessage.params.appID = appID;
        }
        this.sendMessage(JSONMessage);
      },
      /**
       * Request from HMI to find out Policy Table status
       */
      GetStatusUpdate: function() {
        Em.Logger.log('SDL.GetStatusUpdate: Request from HMI!');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': this.client.generateId(),
          'method': 'SDL.GetStatusUpdate',
          'params': {}
        };
        this.sendMessage(JSONMessage);
      },
      UpdateSDL: function() {
        Em.Logger.log('SDL.UpdateSDL: Request from HMI!');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': this.client.generateId(),
          'method': 'SDL.UpdateSDL',
          'params': {}
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Request for list of avaliable devices
       */
      getDeviceList: function() {
        Em.Logger.log('FFW.BasicCommunication.GetDeviceList');
        this.getDeviceListRequestID = this.client.generateID();
        var JSONMessage = {
          'id': this.getDeviceListRequestID,
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.GetDeviceList'
        };
        this.sendMessage(JSONMessage);
      },
      /********************* Requests END *********************/

      /********************* Responses BEGIN *********************/

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
      sendBCResult: function(resultCode, id, method, info, params) {
        const is_successful_code = FFW.RPCHelper.isSuccessResultCode(resultCode);
        if (is_successful_code && this.errorResponsePull[id] != null) {
          // If request was successful but some error was observed upon validation
          // Then result code assigned by RPCController should be considered instead
          const errorStruct = this.errorResponsePull[id];
          this.errorResponsePull[id] = null;

          this.sendBCResult(
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

        Em.Logger.log('FFW.BC.' + method + 'Response');
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
      /**
       * Response with params of the last one supports mixing audio (ie
       * recording TTS command and playing audio).
       *
       * @params {Number}
       */
      MixingAudioSupported: function(requestid, attenuatedSupported) {
        Em.Logger.log('FFW.BasicCommunication.MixingAudioSupported Response');
        // send request
        var JSONMessage = {
          'id': requestid,
          'jsonrpc': '2.0',
          'result': {
            'code': SDL.SDLModel.data.resultCode.SUCCESS,
            'attenuatedSupported': attenuatedSupported,
            'method': 'BasicCommunication.MixingAudioSupported'
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Response with Results by user/HMI allowing SDL functionality or
       * disallowing access to all mobile apps.
       *
       * @params {Number}
       */
      AllowAllApps: function(request, allowed) {
        Em.Logger.log('FFW.BasicCommunication.AllowAllApps Response');
        // send request
        var JSONMessage = {
          'id': request.id,
          'jsonrpc': '2.0',
          'result': {
            'code': SDL.SDLModel.data.resultCode.SUCCESS,
            'method': request.method,
            'allowed': allowed
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Response with result of allowed application
       *
       * @params {Number}
       */
      AllowApp: function(request) {
        Em.Logger.log('FFW.BasicCommunication.AllowAppResponse');
        var allowedFunctions = [];
        request.params.appPermissions.forEach(
          function(entry) {
            allowedFunctions.push(
              {
                name: entry,
                allowed: true
              }
            );
          }
        );
        // send request
        var JSONMessage = {
          'id': request.id,
          'jsonrpc': '2.0',
          'result': {
            'code': SDL.SDLModel.data.resultCode.SUCCESS,
            'method': 'BasicCommunication.AllowApp',
            'allowedFunctions': allowedFunctions
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * @name GetSystemTimeResponse
       * @type function
       * @desc Send GetSystemTime response
       * @param {Object} request
       */
      GetSystemTimeResponse: function(request) {
        var date = new Date();
            var systemTime = {
              millisecond: date.getMilliseconds(),
              second: date.getSeconds(),
              minute: date.getMinutes(),
              hour: date.getHours(),
              day: date.getDate(),
              month: date.getMonth()+1,
              year: date.getFullYear(),
              tz_hour: Math.floor(date.getTimezoneOffset()/-60),
              tz_minute: Math.abs(date.getTimezoneOffset()%60)
            };

            var JSONMessage = {
              'jsonrpc': '2.0',
              'id': request.id,
              'result': {
                'code': SDL.SDLModel.data.resultCode.SUCCESS, // type (enum) from SDL protocol
                'method': request.method,
                'systemTime':systemTime
              }
            };

            this.client.send(JSONMessage);
      },  
      /********************* Responses end *********************/

      /********************* Notifications BEGIN *********************/

      /**
       * @function OnAppActivated
       * @param {Number} appID 
       * @param {Number} windowID 
       * @description Sending OnAppActivated notification to the SDL
       */
      OnAppActivated: function(appID, windowID) {
        Em.Logger.log('FFW.BasicCommunication.OnAppActivated');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnAppActivated',
          'params': {
            'appID': appID,
            'windowID': windowID
          }
        };
        this.sendMessage(JSONMessage);
      },
      
      /**
       * Notifies if functionality was changed
       *
       * @param {Boolean} allowed
       * @param {String} source
       */
      OnAllowSDLFunctionality: function(allowed, source) {
        Em.Logger.log('FFW.SDL.OnAllowSDLFunctionality');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'SDL.OnAllowSDLFunctionality',
          'params': {
            'allowed': allowed,
            'source': source
          }
        };
        if (SDL.SettingsController.currentDeviceAllowance) {
          JSONMessage.params.device =
            SDL.SettingsController.currentDeviceAllowance;
        }
        this.sendMessage(JSONMessage);
      },
      /**
       * Notifies if language was changed
       *
       * @param {String} lang
       */
      OnSystemInfoChanged: function(lang) {
        Em.Logger.log('FFW.BasicCommunication.OnSystemInfoChanged');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnSystemInfoChanged',
          'params': {
            'language': lang
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Notification of decrypted policy table available
       *
       * @param {String} policyfile
       */
      OnReceivedPolicyUpdate: function(policyfile) {
        Em.Logger.log('FFW.SDL.OnReceivedPolicyUpdate');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'SDL.OnReceivedPolicyUpdate',
          'params': {
            'policyfile': policyfile
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Notifies if functionality was changed
       *
       * @param {Boolean} consentedFunctions
       * @param {String} source
       * @param {String} appID
       */
      OnAppPermissionConsent: function(consentedFunctions, eucsStatus, source, appID) {
        Em.Logger.log('FFW.SDL.OnAppPermissionConsent');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'SDL.OnAppPermissionConsent',
          'params': {
            'source': source
          }
        }

        if (consentedFunctions != null) {
          JSONMessage.params.consentedFunctions = consentedFunctions;
        }
        if (eucsStatus  != null) {
          JSONMessage.params.externalConsentStatus = eucsStatus;
        }
        if (appID != null) {
          JSONMessage.params.appID = appID;
        }
        this.sendMessage(JSONMessage);
      },
      /**
       * notification that UI is ready BasicCommunication should be sunscribed
       * to this notification
       */
      onReady: function() {
        Em.Logger.log('FFW.BasicCommunication.onReady');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnReady'
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * notification that HMI is ready to provide system time
       */
      OnSystemTimeReady: function() {
        Em.Logger.log('FFW.BasicCommunication.OnSystemTimeReady');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnSystemTimeReady'
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Sent notification to SDL when HMI closes
       */
      OnIgnitionCycleOver: function() {
        Em.Logger.log('FFW.BasicCommunication.OnIgnitionCycleOver');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnIgnitionCycleOver'
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Send request if device was unpaired from HMI
       *
       * @param {number} appID
       */
      OnDeviceStateChanged: function(elemet) {
        Em.Logger.log('FFW.SDL.OnDeviceStateChanged');
        // send notification
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'SDL.OnDeviceStateChanged',
          'params': {
            'deviceState': 'UNPAIRED',
            'deviceInternalId': '',
            'deviceId': {
              'name': elemet.deviceName,
              'id': elemet.deviceID
            }
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * This methos is request to get list of registered apps.
       */
      OnFindApplications: function() {
        Em.Logger.log('FFW.BasicCommunication.OnFindApplications');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnFindApplications'
        };
        if (SDL.SDLModel.data.CurrDeviceInfo.name ||
          SDL.SDLModel.data.CurrDeviceInfo.id) {
          JSONMessage.params = {
            'deviceInfo': SDL.SDLModel.data.CurrDeviceInfo
          };
        }
        this.sendMessage(JSONMessage);
      },
      /**
       * Send notification to SDL Core about system errors
       */
      OnSystemError: function(error) {
        Em.Logger.log('FFW.SDL.OnSystemError');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'SDL.OnSystemError',
          'params': {
            'error': error
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * This methos is request to get list of registered apps.
       */
      AddStatisticsInfo: function(statisticType) {
        Em.Logger.log('FFW.SDL.AddStatisticsInfo');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'SDL.AddStatisticsInfo',
          'params': {
            'statisticType': statisticType
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * @function OnAppDeactivated
       * @param {Number} AppID
       * @param {Number} windowID 
       * @description Invoked by UI component when user switches to any functionality which
       * is not other mobile application.
       */
      OnAppDeactivated: function(appID, windowID) {
        Em.Logger.log('FFW.BasicCommunication.OnAppDeactivated');
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnAppDeactivated',
          'params': {
            'appID': appID
          }
        };
        if(windowID) {
          JSONMessage.params['windowID'] = windowID;
        }
        this.sendMessage(JSONMessage);
      },
      /**
       * Sender: HMI->SDL. When: upon phone-call event started or ended
       *
       * @params {Boolean}
       */
      OnPhoneCall: function(isActive) {
        Em.Logger.log('FFW.BasicCommunication.OnPhoneCall');
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnPhoneCall',
          'params': {
            'isActive': isActive
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Initiated by HMI user. In response optional list of found devices -
       * if not provided, not were found.
       */
      OnStartDeviceDiscovery: function() {
        Em.Logger.log('FFW.BasicCommunication.OnStartDeviceDiscovery');
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnStartDeviceDiscovery'
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * OnAwakeSDL from HMI returns SDL to normal operation
       * after OnExitAllApplications(SUSPEND)
       */
      OnAwakeSDL: function() {
        Em.Logger.log('FFW.BasicCommunication.OnAwakeSDL');
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnAwakeSDL'
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Used by HMI when User chooses to exit application.
       *
       * @params {Number}
       */
      ExitApplication: function(appID, reason) {
        Em.Logger.log('FFW.BasicCommunication.OnExitApplication');
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnExitApplication',
          'params': {
            'reason': reason,
            'appID': appID
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Sent by HMI to SDL to close all registered applications.
       *
       * @params {String}
       */
      ExitAllApplications: function(reason) {
        Em.Logger.log('FFW.BasicCommunication.OnExitAllApplications');
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnExitAllApplications',
          'params': {
            'reason': reason
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Notifies if device was choosed
       *
       * @param {String}
       *            deviceName
       * @param {Number}
       *            appID
       */
      OnDeviceChosen: function(deviceName, id) {
        Em.Logger.log('FFW.BasicCommunication.OnDeviceChosen');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnDeviceChosen',
          'params': {
            'deviceInfo': {
              'name': deviceName,
              'id': id
            }
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Notifies if audio state was changed
       *
       * @param {Boolean} enabled
       */
      OnEmergencyEvent: function(enabled) {
        Em.Logger.log('FFW.BasicCommunication.OnEmergencyEvent');
        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnEmergencyEvent',
          'params': {
            'enabled': enabled
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * Initiated by HMI.
       */
      OnSystemRequest: function(type, fileName, url, appID, subType) {
        Em.Logger.log('FFW.BasicCommunication.OnSystemRequest');
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnSystemRequest',
          'params': {
            'requestType': type,
            'fileType': 'JSON',
            'timeout': 1000,
            'fileName': fileName
          }
        };
        if (url) {
          JSONMessage.params.url = url;
        }
        if (appID) {
          JSONMessage.params.appID = appID;
        }

        var requestSubTypeNotApplicable =
              (JSONMessage.params.fileType == 'BINARY' && type == "HTTP") ||
              (JSONMessage.params.fileType == 'JSON' && type == "PROPRIETARY");
        if (subType && subType.length > 0 && !requestSubTypeNotApplicable) {
          JSONMessage.params.requestSubType = subType;
        }

        this.sendMessage(JSONMessage);
      },
      /**
       * OnDeactivateHMI notification sender
       * @param value
       * @constructor
       */
      OnDeactivateHMI: function(value) {
        Em.Logger.log('FFW.BasicCommunication.OnDeactivateHMI');
        // send request
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnDeactivateHMI',
          'params': {
            'isDeactivated': value
          }
        };
        this.sendMessage(JSONMessage);
      },
      /**
       * OnEventChanged notification sender
       * @param reason
       * @param status
       * @constructor
       */
      OnEventChanged: function(eventName, status) {
        Em.Logger.log('FFW.BasicCommunication.OnEventChanged');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnEventChanged',
          'params': {
            'eventName': eventName,
            'isActive': status
          }
        };
        this.sendMessage(JSONMessage);
      },
      OnSystemCapabilityUpdated: function (data) {
        Em.Logger.log('FFW.BasicCommunication.OnSystemCapabilityUpdated');
        var JSONMessage = {
          'jsonrpc': '2.0',
          'method': 'BasicCommunication.OnSystemCapabilityUpdated',
          'params': {
            'appID': data.appID,
            'systemCapability':data.systemCapability
          }
        };
        this.sendMessage(JSONMessage);
      }

      /********************* Notifications END *********************/
    }
  );
