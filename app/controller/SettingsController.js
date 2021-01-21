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
 * @name SDL.SettingsController
 * @desc Info Controller logic
 * @category Controller
 * @filesource app/controller/SettingsController.js
 * @version 1.0
 */

SDL.SettingsController = Em.Object.create(
  {
    activeState: 'settings.policies',
    hiddenLeftMenu: false,

    /**
     * @name getSystemTimeResultCode
     * @desc parameter of response result code
     * for GetSystemTime RPC. Initial value sets as a zero which equals with
     * SUCCESS result code.
     */
    getSystemTimeResultCode: 0,

    /**
     * @name getSystemTimeButtonText
     * @desc parameter for changing text of 
     * GetSystemTime result code button
     */
    getSystemTimeButtonText: 'GetSystemTime result code - SUCCESS',

    /*
     * @name modelBinding
     * @description Model of binding
     */
    modelBinding: 'SDL.RCModulesController',

    /**
     * File name for SDL.OnSystemRequest
     * Came in SDL.PolicyUpdate request
     */
    policyUpdateFile: null,

    /**
     * Data of current requested devices which access will be allowed or
     * disallowed.
     */
    currentDeviceAllowance: null,

    /**
     * @description Value of CCPU version displayed in user input
     */
    editedCcpuVersionValue: "",

    /**
     * @description Map of vehicle type data displayed in user inputs
     */
    editedVehicleType: {},

    onState: function(event) {
      if(SDL.States.currentState.name === 'rpcconfig'){
        FFW.RPCHelper.setCurrentAppID(null);
      }
      SDL.States.goToStates('settings.' + event.goToState);
      if('rpccontrol.rpcconfig' === event.goToState){
        SDL.RPCControlConfigView.set('appNameLabel.content',event.appName);
        FFW.RPCHelper.updateRpc(event.appID);
      }
    },
    onChildState: function(event) {
      SDL.States.goToStates(
        SDL.States.currentState.get('path') + '.' +
        event.goToState
      );
    },
    getStatusUpdate: function() {
      FFW.BasicCommunication.GetStatusUpdate();
    },
    phoneCall: function() {
      SDL.SDLController.onEventChanged('phoneCall', true);
      SDL.SDLModel.data.phoneCallActive = true;
      var appID = null;
      if (SDL.SDLController.model) {
        appID = SDL.SDLController.model.appID;
      }
      if (appID) {
        SDL.SDLModel.onDeactivateApp('call', appID);
        SDL.States.goToStates('phone.dialpad');
        setTimeout(
          function() {
            SDL.SDLController.onEventChanged('phoneCall', false);
            SDL.SDLController.getApplicationModel(appID).turnOnSDL(appID);
            SDL.SDLModel.data.phoneCallActive = false;
          }, 20000
        ); //Magic number - 5 seconds timeout for emulating conversation call
      } else {
        setTimeout(
          function() {
            SDL.SDLController.onEventChanged('phoneCall', false);
            SDL.SDLModel.data.phoneCallActive = false;
          }, 20000
        ); //Magic number - 5 seconds timeout for emulating conversation call
      }
    },
    allDeviceAccess: function() {
      var allowedValue, allowedText;
      if (SDL.DeviceConfigView.globalConfigurationValue) {
        SDL.DeviceConfigView.set('globalConfigurationValue', false);
        allowedValue = false;
        allowedText = ' - Not allowed';
      } else {
        SDL.DeviceConfigView.set('globalConfigurationValue', true);
        allowedValue = true;
        allowedText = ' - Allowed';
      }
      var dev = SDL.SDLModel.data.connectedDevices;
      for (var key in dev) {
        if (dev.hasOwnProperty(key)) {
          dev[key].allowed = allowedValue;
        }
      }
      SDL.DeviceConfigView.showDeviceList();
      FFW.BasicCommunication.OnAllowSDLFunctionality(allowedValue, 'GUI');
    },
    changeDeviceAccess: function(event) {
      var dev = SDL.SDLModel.data.connectedDevices;
      for (var key in dev) {
        if (dev.hasOwnProperty(key)) {
          if (dev[key].id == event.id) {
            if (dev[key].allowed) {
              dev[key].allowed = false;
              event.set('text', event.name + ' - Not allowed');
            } else {
              dev[key].allowed = true;
              event.set('text', event.name + ' - Allowed');
            }
            var device = {
              'name': dev[key].name,
              'id': dev[key].id
            };
            SDL.DeviceConfigView.set('globalConfigurationValue', null);
            FFW.BasicCommunication.OnAllowSDLFunctionality(
              dev[key].allowed,
              'GUI', device
            );
            break;
          }
        }
      }
    },
    changeAppPermission: function(element) {
      var text = "";
      if (element.allowed) {
        text = element.text.replace(' - Allowed', ' - Not allowed');
      } else {
        text = element.text.replace(' - Not allowed', ' - Allowed');
      }
      element.set('text', text);
      element.allowed = !element.allowed;
    },
    /**
     * Method to send request to update array with app permissions
     *
     * @param {Object} element
     *
     */
    GetListOfPermissions: function(element) {
      FFW.BasicCommunication.GetListOfPermissions(element.appID);
      SDL.AppPermissionsView.update(SDL.SDLModelData.externalConsentStatus, element.appID);
      SDL.States.goToStates('settings.policies.appPermissions');
    },
    /**
     * Method to update array with app permissions which came from SDL
     *
     * @param {Object} message
     *
     */
    GetListOfPermissionsResponse: function(message) {
      if (message.id in SDL.SDLModel.data.getListOfPermissionsPull) {
        var appID = SDL.SDLModel.data.getListOfPermissionsPull[message.id],
          messageCodes = [];
        for (var i = 0; i < message.result.allowedFunctions.length; i++) {
          messageCodes.push(message.result.allowedFunctions[i].name);
        }
        FFW.BasicCommunication.GetUserFriendlyMessage(
          SDL.SettingsController.permissionsFriendlyMessageUpdate, appID,
          messageCodes
        );
        SDL.AppPermissionsView.update(message.result.allowedFunctions, appID);
        delete SDL.SDLModel.data.getListOfPermissionsPull[message.id];
      }
    },
     /**
     * Method to update externalConsentStatus for Location
     *
     * @param {Object} message
     *
     */
    changeUcsLocation: function(event) {
      var ucs = SDL.SDLModel.data.externalConsentStatus;
      if (ucs[0].status == "OFF") {
        ucs[0].status = "ON";
      }
      else {
        ucs[0].status = "OFF";
      }
      FFW.BasicCommunication.OnAppPermissionConsent(null, [{entityType: 1, entityID: 1, status: ucs[0].status}], "GUI", null);
      event.set('text', event.name + ' - ' + ucs[0].status);
    },
     /**
     * Method to update externalConsentStatus for Vehicle
     *
     * @param {Object} message
     *
     */
    changeUcsVehicle: function(event) {
      var ucs = SDL.SDLModel.data.externalConsentStatus;
      if (ucs[1].status == "OFF") {
        ucs[1].status = "ON";
      }
      else {
        ucs[1].status = "OFF";
      }
      FFW.BasicCommunication.OnAppPermissionConsent(null, [{entityType: 1, entityID: 2, status: ucs[1].status}], "GUI", null);
      event.set('text', event.name + ' - ' + ucs[1].status);
    },
    /**
     * Method to update array with app permissions with UserFriendlyMessage
     * from SDL
     *
     * @param {Object} message
     *
     */
    permissionsFriendlyMessageUpdate: function(message) {
      SDL.SettingsController.simpleParseUserFriendlyMessageData(message);
      SDL.States.goToStates('settings.policies.appPermissions');
    },
    updateSDL: function() {
      FFW.BasicCommunication.UpdateSDL();
    },
    AllowSDLFunctionality: function(messages) {
      if (messages.length > 0) {
        SDL.SettingsController.simpleParseUserFriendlyMessageData(
          messages,
          SDL.SettingsController.OnAllowSDLFunctionality
        );
      } else {
        SDL.PopUp.create().appendTo('body').popupActivate(
          'WARNING!!!!!!!!!!!!!! ' +
          'There is no text from SDL in GetUserFriendlyMessage for DataConsent parameter!!! Please allow the device...',
          SDL.SettingsController.OnAllowSDLFunctionality
        );
      }
    },
    userFriendlyMessagePopUp: function(appId, messageCode) {
      FFW.BasicCommunication.GetUserFriendlyMessage(
        SDL.SettingsController.simpleParseUserFriendlyMessageData, appId,
        messageCode
      );
    },
    simpleParseUserFriendlyMessageData: function(messages, func) {
      if (!messages) {
        return;
      }

      var tts = '',
        text = '';
      messages.forEach(
        function(x) {
          if (x.ttsString) {
            tts += x.ttsString;
          }
          if (x.textBody) {
            text += x.textBody;
          }
          if (x.line1) {
            text += x.line1;
          }
          if (x.line2) {
            text += x.line2;
          }
        }
      );
      if (tts) {
        SDL.TTSPopUp.ActivateTTS(tts);
      }
      if (text) {
        SDL.PopUp.create().appendTo('body').popupActivate(text, func);
      }
    },
    OnAllowSDLFunctionality: function(result) {
      var dev = SDL.SDLModel.data.connectedDevices;
      for (var key in dev) {
        if (dev.hasOwnProperty(key)) {
          if (dev[key].id == SDL.SettingsController.currentDeviceAllowance.id) {
            dev[key].allowed = result;
          }
        }
      }
      SDL.DeviceConfigView.set('globalConfigurationValue', null);
      SDL.DeviceConfigView.showDeviceList();
      FFW.BasicCommunication.OnAllowSDLFunctionality(
        result, 'GUI',
        SDL.SettingsController.currentDeviceAllowance
      );
      SDL.SDLModel.data.connectedDevices[
        SDL.SettingsController.currentDeviceAllowance.id
        ].isSDLAllowed = result;
      SDL.SettingsController.currentDeviceAllowance = null;
    },
    /**
     * Method verify what OnSystemRequest should be sent
     *
     * @param {String} url
     */
    OnSystemRequestHandler: function(url) {
      if(FLAGS.ExternalPolicies === true) {
        FFW.ExternalPolicies.pack({
          requestType: 'PROPRIETARY',
          fileName: SDL.SettingsController.policyUpdateFile,
          url: url
        })
      } else {
        FFW.BasicCommunication.OnSystemRequest(
          'PROPRIETARY',
          SDL.SettingsController.policyUpdateFile,
          url
        );
      }
    },
    /**
     * Method responsible for PolicyUpdate retry sequence
     * abort parameter if set to true means that retry sequence if finished
     *
     * @param {Boolean} abort
     */
    policyUpdateRetry: function(abort) {
      if(SDL.SDLModel.data.policyUpdateRetry.isIterationInProgress) {
        return;
      }
      clearTimeout(SDL.SDLModel.data.policyUpdateRetry.timer);
      SDL.SDLModel.data.policyUpdateRetry.timer = null;

      var sendOnSystemRequest = function() {
        SDL.SDLModel.data.policyUpdateRetry.isIterationInProgress = false;
        FFW.BasicCommunication.OnSystemRequest(
          'PROPRIETARY',
          SDL.SettingsController.policyUpdateFile,
          SDL.SDLModel.data.policyURLs[0]
        );
      }
      if(abort !== 'ABORT' && !SDL.SDLModel.data.policyUpdateRetry.isRetry) {
        SDL.SDLModel.data.policyUpdateRetry.isRetry = true;
        return;
      }
      var length = SDL.SDLModel.data.policyUpdateRetry.retry.length;
      if(length == SDL.SDLModel.data.policyUpdateRetry.try) {
        SDL.SDLModel.data.policyUpdateRetry.isRetry = false;
      }
      if (abort !== 'ABORT' && SDL.SDLModel.data.policyUpdateRetry.isRetry) {           
        
        SDL.SDLModel.data.policyUpdateRetry.oldTimer = 
          SDL.SDLModel.data.policyUpdateRetry.retry[SDL.SDLModel.data.policyUpdateRetry.try] * 1000;
     
        SDL.SDLModel.data.policyUpdateRetry.timer = setTimeout(
          function() {
            sendOnSystemRequest();
          }, SDL.SDLModel.data.policyUpdateRetry.oldTimer
        );
        SDL.SDLModel.data.policyUpdateRetry.isIterationInProgress = true;
        SDL.SDLModel.data.policyUpdateRetry.try++;
      } else {
        SDL.SDLModel.data.policyUpdateRetry.isRetry = false;
        clearTimeout(SDL.SDLModel.data.policyUpdateRetry.timer);
        SDL.SDLModel.data.policyUpdateRetry = {
          timeout: null,
          retry: [],
          try: null,
          timer: null,
          oldTimer: 0
        };
      }
    },

    /**
     * @description Downloads PTS content through the backend
     * @param {String} file_name
     * @returns promise for downloading the PTS content
     */
    downloadPTSFromFile: function(file_name) {
      return new Promise( (resolve, reject) => {
        let client = FFW.RPCSimpleClient;

        let pts_receive_timer = setTimeout(function() {
          Em.Logger.log('PTU: Timeout for getting PTS expired');
          client.unsubscribeFromEvent('GetPTFileContentResponse');
          reject();
        }, 10000);

        let pts_received_callback = function(params) {
          Em.Logger.log('PTU: Downloading PTS has finished');
          clearTimeout(pts_receive_timer);
          client.unsubscribeFromEvent('GetPTFileContentResponse');

          if (params.success == false) {
            Em.Logger.log('PTU: Downloading PTS was not successful');
            return reject();
          }

          Em.Logger.log('PTU: PTS downloaded successfully');
          resolve(params['content']);
        }

        let message = {
          method: 'GetPTFileContentRequest',
          params: {
            fileName: file_name
          }
        };

        client.connect();
        client.subscribeOnEvent('GetPTFileContentResponse', pts_received_callback);
        client.send(message);
      });
    },

    /**
     * @description Sends PTS to specified endpoint URL
     * @param {String} url_str
     * @param {String} pts_data
     * @returns promise for sending PTS to endpoint
     */
    sendPTSToEndpoint: function(url_str, pts_data) {
      return new Promise( (resolve, reject) => {
        Em.Logger.log(`PTU: Sending POST request to endpoint: ${url_str}`);

        $.ajax({
          url: url_str,
          type: "POST",
          contentType: 'application/json; charset=utf-8',
          data: pts_data,
          dataType: 'json',
          success: (response) => {
            Em.Logger.log('PTU: Received PTU response from endpoint');

            const ptu_content = JSON.stringify(response.data[0]);
            resolve(ptu_content);
          },
          error: (err) => {
            Em.Logger.log('PTU: Request to endpoint has failed');
            reject();
          }
        });
      });
    },

    /**
     * @description Saves PTU content to specified file
     * @param {String}
     * @param {String}
     * @returns promise for saving PTU content
     */
    savePTUToFile: function(file_name, ptu_data) {
      return new Promise( (resolve, reject) => {
        Em.Logger.log(`PTU: Saving PTU to file: ${file_name}`);

        let client = FFW.RPCSimpleClient;

        let ptu_save_timer = setTimeout(function() {
          Em.Logger.log('PTU: Timeout for saving PTU expired');
          client.unsubscribeFromEvent('SavePTUToFileResponse');
          reject();
        }, 10000);

        let ptu_saved_callback = function(params) {
          Em.Logger.log('PTU: PTU has been saved!');
          clearTimeout(ptu_save_timer);
          client.unsubscribeFromEvent('SavePTUToFileResponse');

          if (params.success == false) {
            Em.Logger.log('PTU: PTU save was not successful');
            return reject();
          }

          Em.Logger.log('PTU: PTU saved successfully');
          resolve();
        }

        let message = {
          method: 'SavePTUToFileRequest',
          params: {
            fileName: file_name,
            data: ptu_data
          }
        };

        client.subscribeOnEvent('SavePTUToFileResponse', ptu_saved_callback);
        client.send(message);
      });
    },

    /**
     * @description Generates new file path for updated PT
     * @returns generated file path
     */
    generatePTUFilePath: function() {
      let path = document.location.pathname;
      let index = path.lastIndexOf('/');
      if (index >= 0) {
        path = path.slice(0, index);
      }

      let current_date = new Date();
      return `${path}/IVSU/PTU_${current_date.getFullYear()}${current_date.getMonth()+1}${current_date.getDate()}_` +
             `${current_date.getHours()}${current_date.getMinutes()}${current_date.getSeconds()}.json`;
    },

    /**
     * @description Peforms PTU sequence using provided PTS and url
     * @param {String}
     * @param {Array}
     */
    requestPTUFromEndpoint: function(pts_file_name, urls){
      var that = this;

      let ptu_failed_callback = function() {
        Em.Logger.log('PTU: PTUWithModem failed. Switching to PTUWithMobile');
        FFW.RPCSimpleClient.disconnect();

        FLAGS.set('PTUWithModemEnabled', false); // switch back to PTU via mobile

        if (urls.length > 0 && FLAGS.ExternalPolicies === true) {
          SDL.SettingsController.OnSystemRequestHandler(urls[0]);
          SDL.SettingsController.policyUpdateRetry();
        } else {
          SDL.SettingsController.OnSystemRequestHandler();
        }
      };

      that.downloadPTSFromFile(pts_file_name)
        .then( function(pts_content) {
          if (urls.length > 0) {
            that.sendPTSToEndpoint(urls[0], pts_content)
                .then( function(ptu_content) {
                  const output_file = that.generatePTUFilePath();
                  that.savePTUToFile(output_file, ptu_content)
                    .then( function() {
                      FFW.RPCSimpleClient.disconnect();
                      FFW.BasicCommunication.OnReceivedPolicyUpdate(output_file);
                    },
                    ptu_failed_callback)
                },
                ptu_failed_callback)
          }
        },
        ptu_failed_callback);
    },

    turnOnPoliciesSettings: function(){
      if(!SDL.States.settings.policies.active){
        SDL.States.goToStates('settings.policies');
      }
    },
    turnOnHMISettings: function(){
      if(!SDL.States.settings.HMISettings.active){
        SDL.States.goToStates('settings.HMISettings');
      }
    },
    turnOnLight: function(){
      if(!SDL.States.settings.light.active){
        SDL.States.goToStates('settings.light');
      }
    },
    turnOnLightSubMenu: function(event){
      var length = this.model.currentLightModel.lightState.length;
      for(var i = 0; i < length; ++i){
          if(event.text == this.model.currentLightModel.lightState[i].id){
            this.model.currentLightModel.set('lightSettings',SDL.deepCopy(this.model.currentLightModel.lightState[i]));
            break;
          }
      }
      SDL.SendMessage.toggleActivity();
    },
    turnOnSeat: function () {
      if(!SDL.States.settings.seat.active){
        this.model.currentSeatModel.goToStates();
        SDL.States.goToStates('settings.seat');
        }
    },

    /**
     * @description Saves new CCPU version value from user input
     */
    applyNewVersionValues: function() {
      SDL.SDLModel.data.ccpuVersion = this.editedCcpuVersionValue;

      Em.Logger.log("New system version settings have been applied");
    },

    /**
     * @description Getter for all available vehicle type data and corresponding controls
     */
    getVehicleTypeCheckboxes: function() {
      return [
        { checkbox: SDL.VehicleTypeEditorView.vehicleMakeCheckBox, property: 'make' },
        { checkbox: SDL.VehicleTypeEditorView.vehicleModelCheckBox, property: 'model' },
        { checkbox: SDL.VehicleTypeEditorView.vehicleYearCheckBox, property: 'modelYear' },
        { checkbox: SDL.VehicleTypeEditorView.vehicleTrimCheckBox, property: 'trim' }
      ];
    },

    /**
     * @description Applies edited by user vehicle data settings to internal data
     */
    applyNewVehicleTypeValues: function() {
      let setNewVehicleTypeValue = (checkbox, property) => {
        if (checkbox.checked) {
          SDL.SDLVehicleInfoModel.set('vehicleType.' + property, this.editedVehicleType[property]);
        } else {
          SDL.SDLVehicleInfoModel.set('vehicleType.' + property, null);
        }
      };

      this.getVehicleTypeCheckboxes().forEach( (item) => {
        setNewVehicleTypeValue(item.checkbox, item.property);
      });

      Em.Logger.log("New vehicle type have been applied");
    },

    /**
     * @description Updated UI controls and values according to internal data values
     * @param {Object} new_values internal data values structure
     */
    updateVehicleTypeValues: function(new_values) {
      let setNewVehicleTypeValue = (checkbox, property) => {
        if (new_values[property] !== null) {
          this.set('editedVehicleType.' + property, new_values[property]);
          checkbox.set('checked', true);
        } else {
          checkbox.set('checked', false);
        }
      };

      this.getVehicleTypeCheckboxes().forEach( (item) => {
        setNewVehicleTypeValue(item.checkbox, item.property);
      });
    },

    /**
     * @function sendGetPolicyConfigurationDataRequest
     * @description send GetPolicyConfigurationData request from HMI by user action
     */
    sendGetPolicyConfigurationDataRequest: function() {
      var policyConfigurationData = {
        policyType: SDL.SDLModel.data.policyType,
        property: SDL.SDLModel.data.property
      };
      if('endpoint_properties' === policyConfigurationData.property) {
        policyConfigurationData.nestedProperty = 'custom_vehicle_data_mapping_url';
      }
      FFW.BasicCommunication.GetPolicyConfigurationData(policyConfigurationData);
    },

    /**
     * @function checkPolicyVersionButtonPress
     * @description send GetPolicyConfigurationData request from HMI by user action
     */
    checkPolicyVersionButtonPress: function() {
      var policyConfigurationData = {
        policyType: 'module_config',
        property: 'endpoint_properties',
        nestedProperty: 'custom_vehicle_data_mapping_url'
      };
      FFW.BasicCommunication.GetPolicyConfigurationData(policyConfigurationData);
    },
    
    /**
     * @function changeGetSystemTimeResultCode
     * @description Change result code of GetSystemTime response to SDL
     */
    changeGetSystemTimeResultCode: function() {
      var successResultCode = SDL.SDLModel.data.resultCode.SUCCESS;

      this.set('getSystemTimeResultCode', 
      this.getSystemTimeResultCode == successResultCode
        ? SDL.SDLModel.data.resultCode.REJECTED
        : SDL.SDLModel.data.resultCode.SUCCESS);

      var buttonText = "GetSystemTime result code - ";
      this.set('getSystemTimeButtonText', 
      this.getSystemTimeResultCode == successResultCode 
        ? buttonText + 'SUCCESS'
        : buttonText + 'REJECTED');
    }
  }
);
