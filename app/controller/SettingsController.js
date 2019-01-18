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
     * for GetSystemTime RPC
     */
    getSystemTimeResultCode: 0,

    /**
     * @name getSystemTimeButtonText
     * @desc parameter for changing text of 
     * GetSystemTime result code button
     */
    getSystemTimeButtonText: 'GetSystemTime result code - SUCCESS',

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
    onState: function(event) {
      SDL.States.goToStates('settings.' + event.goToState);
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
      SDL.AppPermissionsView.update(SDL.SDLModelData.externalConsentStatus, 0);
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
     * Method to check Array of GetUrls data
     * And verify what OnSystemRequest should be sent
     *
     * @param {Object} urls
     */
    GetUrlsHandler: function(urls) {
      var url;
      for (i in urls) {
        if (urls.hasOwnProperty(i)) {
          url = urls[i];
          var appID = null;
          if ('appID' in url) {
            appID = url.appID;
          } else {  //If
            console.error(
              'WARNING! No appID in GetURLs response'
            );
          }
          if(FLAGS.ExternalPolicies === true) {
            FFW.ExternalPolicies.pack({
              type: 'PROPRIETARY',
              policyUpdateFile: SDL.SettingsController.policyUpdateFile,
              url: url.url,
              appID: appID
            })
          } else {
            FFW.BasicCommunication.OnSystemRequest(
              'PROPRIETARY',
              SDL.SettingsController.policyUpdateFile,
              url.url,
              appID
            );
          }
        }
      }
    },
    /**
     * Method responsible for PolicyUpdate retry sequence
     * abort parameter if set to true means that retry sequence if finished
     *
     * @param {Boolean} abort
     */
    policyUpdateRetry: function(abort) {
      clearTimeout(SDL.SDLModel.data.policyUpdateRetry.timer);
      SDL.SDLModel.data.policyUpdateRetry.timer = null;
      if (abort !== 'ABORT' && (
        SDL.SDLModel.data.policyUpdateRetry.try <
        SDL.SDLModel.data.policyUpdateRetry.retry.length)) {
        SDL.SDLModel.data.policyUpdateRetry.oldTimer =
          SDL.SDLModel.data.policyUpdateRetry.oldTimer +
          SDL.SDLModel.data.policyUpdateRetry.timeout * 1000 +
          SDL.SDLModel.data.policyUpdateRetry.retry[SDL.SDLModel.data.policyUpdateRetry.try] *
          1000;
        SDL.SDLModel.data.policyUpdateRetry.timer = setTimeout(
          function() {
            FFW.BasicCommunication.OnSystemRequest(
              'PROPRIETARY',
              SDL.SettingsController.policyUpdateFile,
              SDL.SDLModel.data.policyURLs[0].url,
              SDL.SDLModel.data.policyURLs[0].appID
            );
            SDL.SettingsController.policyUpdateRetry();
          }, SDL.SDLModel.data.policyUpdateRetry.oldTimer
        );
        SDL.SDLModel.data.policyUpdateRetry.try++;
      } else {
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
      var length = SDL.LightModel.lightState.length;
      for(var i = 0; i < length; ++i){
          if(event.text == SDL.LightModel.lightState[i].id){
            SDL.LightModel.set('lightSettings',SDL.deepCopy(SDL.LightModel.lightState[i]));
            break;
          }
      }
      SDL.SendMessage.toggleActivity();
    },
    turnOnSeat: function () {
      if(!SDL.States.settings.seat.active){
        SDL.SeatModel.goToStates();
        SDL.States.goToStates('settings.seat');
        }
    },
    
    /**
     * @function changeGetSystemTimeResultCode
     * @description Change result code of GetSystemTime response to SDL
     */
    changeGetSystemTimeResultCode: function() {
      this.set('getSystemTimeResultCode', this.getSystemTimeResultCode == 0
        ? SDL.SDLModel.data.resultCode.REJECTED
        : SDL.SDLModel.data.resultCode.SUCCESS);

      var buttonText = "GetSystemTime result code - ";
      this.set('getSystemTimeButtonText', this.getSystemTimeResultCode == 0 
        ? buttonText + 'SUCCESS'
        : buttonText + 'REJECTED');
    }
  }
);
