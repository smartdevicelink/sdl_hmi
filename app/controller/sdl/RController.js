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
 * @name SDL.RController
 * @desc SDL abstract application controller
 * @category Controller
 * @filesource app/controller/sdl/RController.js
 * @version 1.0
 */

SDL.RController = SDL.SDLController.extend(
  {
    onEventChanged: function(reason, status) {
      switch (reason) {
        case 'phoneCall':
        {
          FFW.BasicCommunication.OnPhoneCall(status);
          break;
        }
        case 'emergencyEvent':
        {
          FFW.BasicCommunication.OnEmergencyEvent(status);
          break;
        }
        case 'onDeactivateHMI':
        {
          FFW.BasicCommunication.OnDeactivateHMI(status);
          break;
        }
        default:
        {
          this._super(reason, status);
          return;
        }
      }
    },

   onButtonPressEvent: function(params) {
      var result_struct = {
        resultCode: SDL.SDLModel.data.resultCode.SUCCESS,
        resultInfo: ""
      };

      if (params.moduleType == 'CLIMATE') {
        var model = SDL.ClimateController.model;
        switch (params.buttonName) {
          case 'AC_MAX': {
            model.toggleAcMaxEnable();
            break;
          }
          case 'AC': {
            model.toggleAcEnable();
            break;
          }
          case 'RECIRCULATE': {
            model.toggleRecirculateAir();
            break;
          }
          case 'FAN_UP': {
            model.fanSpeedUp();
            break;
          }
          case 'FAN_DOWN': {
            model.fanSpeedDown();
            break;
          }
          case 'TEMP_UP': {
            model.desiredTempUp();
            break;
          }
          case 'TEMP_DOWN': {
            model.desiredTempDown();
            break;
          }
          case 'DEFROST_MAX': {
            model.defrostAllEnable();
            break;
          }
          case 'DEFROST': {
            model.defrostFrontEnable();
            break;
          }
          case 'DEFROST_REAR': {
            model.defrostRearEnable();
            break;
          }
          case 'UPPER_VENT': {
            model.ventilationModeUpperEnable();
            break;
          }
          case 'LOWER_VENT': {
            model.ventilationModeLowerEnable();
            break;
          }
          default: {
            result_struct.resultCode = SDL.SDLModel.data.resultCode.GENERIC_ERROR;
            result_struct.resultInfo = 'Unknown climate module button';
            return result_struct;
          }
        }
        return result_struct;
      }

      if (params.moduleType == 'RADIO') {
        switch (params.buttonName) {
          case 'VOLUME_UP': {
            SDL.MediaController.volumeUpPress();
            break;
          }
          case 'VOLUME_DOWN': {
            SDL.MediaController.volumeDownPress();
            break;
          }
          case 'EJECT': {
            if (SDL.MediaController.activeState == 'media.player.cd') {
              SDL.MediaController.ejectCD();
            } else {
              result_struct.resultCode = SDL.SDLModel.data.resultCode.IGNORED;
              result_struct.resultInfo = 'CD audio source must be selected';
              return result_struct;
            }
            break;
          }
          case 'SOURCE': {
            SDL.MediaController.changeSource();
            break;
          }
          case 'SHUFFLE': {
            if (SDL.MediaController.activeState == 'media.player.cd' ||
                SDL.MediaController.activeState == 'media.player.usb') {
              SDL.MediaController.turnOnShuffle();
            } else {
              result_struct.resultCode = SDL.SDLModel.data.resultCode.IGNORED;
              result_struct.resultInfo = 'CD or USB audio source must be selected';
              return result_struct;
            }
            break;
          }
          case 'REPEAT': {
            if (SDL.MediaController.activeState == 'media.player.cd' ||
                SDL.MediaController.activeState == 'media.player.usb') {
              SDL.MediaController.repeatPress();
            } else {
              result_struct.resultCode = SDL.SDLModel.data.resultCode.IGNORED;
              result_struct.resultInfo = 'CD or USB audio source must be selected';
              return result_struct;
            }
            break;
          }
          default: {
            result_struct.resultCode = SDL.SDLModel.data.resultCode.GENERIC_ERROR;
            result_struct.resultInfo = 'Unknown radio module button';
            return result_struct;
          }
        }
        return result_struct;
      }

      return result_struct;
    },

   /**
     * Go to RSDL options menu on click menu header
     */
    onRSDLOptionsClick: function() {
      SDL.States.goToStates('settings.policies.rsdlOptionsList');
    },

   /**
     * Toggle RSDL functionality flag option
     */
    toggleRSDLFunctionality: function() {
      SDL.SDLModel.toggleProperty('reverseFunctionalityEnabled');
      SDL.SDLMediaController.deactivateActiveRcApp();
      SDL.NonMediaController.deactivateActiveRcApp();
      SDL.InfoAppsView.showAppList();
      FFW.RC.OnRemoteControlSettings(
        SDL.SDLModel.reverseFunctionalityEnabled,
        SDL.SDLModel.reverseAccessMode
      );
    },

   /**
     * Toggle RSDL access mode option
     */
    toggleRCAccessMode: function() {
      var next = this.nextElement(SDL.SDLModel.reverseAccessModesStruct, SDL.SDLModel.reverseAccessMode);
      SDL.SDLModel.set('reverseAccessMode',next);
      FFW.RC.OnRemoteControlSettings(
        SDL.SDLModel.reverseFunctionalityEnabled,
        SDL.SDLModel.reverseAccessMode
      );
    },

   toggleDisplayMode: function() {
      var next = this.nextElement(SDL.HmiSettingsModel.displayModeStruct, SDL.HmiSettingsModel.displayMode);
      SDL.HmiSettingsModel.set('displayMode',next);
      var data = {
        displayMode: SDL.HmiSettingsModel.getHmiSettingsControlData().displayMode
      }
      this.sendHMISettingsNotification(data);
    },

   toggleDistanceUnit: function() {
      var next = this.nextElement(SDL.HmiSettingsModel.distanceUnitStruct, SDL.HmiSettingsModel.distanceUnit);
      SDL.HmiSettingsModel.set('distanceUnit',next);
      var data = {
        distanceUnit: next
      }
      this.sendHMISettingsNotification(data);
    },

   toggleTemperatureUnit: function() {
      var next = this.nextElement(SDL.HmiSettingsModel.temperatureUnitStruct, SDL.HmiSettingsModel.temperatureUnit);
      SDL.HmiSettingsModel.set('temperatureUnit',next);
      SDL.ClimateControlModel.set('climateControlData.temperatureUnit', next);
      if(next == 'FAHRENHEIT') {
        SDL.ClimateControlModel.temperatureUnitFahrenheitEnable();
      } else {
        SDL.ClimateControlModel.temperatureUnitCelsiusEnable();
      }
      var data = {
        temperatureUnit: next
      }
      this.sendHMISettingsNotification(data);
    },

   sendHMISettingsNotification: function(data){
      if (Object.keys(data).length > 0) {
        FFW.RC.onInteriorVehicleDataNotification({moduleType:'HMI_SETTINGS', hmiSettingsControlData: data});
      }
    },

   nextElement: function(data, currentItem){
      var arr_length = data.length;
      for (var i = 0; i < arr_length; i++) {
        if (data[i] == currentItem) {
          if (i + 1 >= arr_length) {
            return data[0];
          } else {
            return data[i + 1];
          }
        }
      }
    },

   /**
     * Change responses to error for GetInteriorVehicleDataCapabilities
     * @param element
     * @constructor
     */
    setRCCapabilitiesErrorResponse: function(element) {
      SDL.SDLModel.toggleProperty('errorResponse');
    },

   /**
     * Register application method
     * @param {Object} params
     * @param {Object} applicationType
     */
    registerApplication: function(params, applicationType) {
      if (applicationType === undefined || applicationType === null) {
        SDL.SDLModel.data.get('registeredApps').pushObject(
          this.applicationModels[0].create(
            {
              //Magic number 0 - Default media model
              // for not initialized applications
              appID: params.appID,
              appName: params.appName,
              deviceName: params.deviceInfo.name,
              appType: params.appType,
              isMedia: 0,
              disabledToActivate: params.greyOut ? true : false
            }
          )
        );
      } else if (applicationType === 2) {
        //Magic number 2 - Default RC application with non-media model
        SDL.SDLModel.data.get('registeredApps').pushObject(
          this.applicationModels[1].create(
            {
              //Magic number 1 - Default non-media model
              appID: params.appID,
              appName: params.appName,
              deviceName: params.deviceInfo.name,
              appType: params.appType,
              isMedia: false,
              initialized: true,
              disabledToActivate: params.greyOut ? true : false
            }
          )
        );
      } else {
        SDL.SDLModel.data.get('registeredApps').pushObject(
          this.applicationModels[applicationType].create(
            {
              appID: params.appID,
              appName: params.appName,
              deviceName: params.deviceInfo.name,
              appType: params.appType,
              isMedia: applicationType == 0,
              initialized: true,
              disabledToActivate: params.greyOut ? true : false
            }
          )
        );
      }
      var exitCommand = {
        'id': -10,
        'params': {
          'menuParams': {
            'parentID': 0,
            'menuName': 'Exit \'DRIVER_DISTRACTION_VIOLATION\'',
            'position': 0
          },

         cmdID: -1
        }
      };
      SDL.SDLController.getApplicationModel(params.appID).addCommand(
        exitCommand
      );
      exitCommand = {
        'id': -10,
        'params': {
          'menuParams': {
            'parentID': 0,
            'menuName': 'Exit \'USER_EXIT\'',
            'position': 0
          },

         cmdID: -2
        }
      };
      SDL.SDLController.getApplicationModel(params.appID).addCommand(
        exitCommand
      );
      exitCommand = {
        'id': -10,
        'params': {
          'menuParams': {
            'parentID': 0,
            'menuName': 'Exit \'UNAUTHORIZED_TRANSPORT_REGISTRATION\'',
            'position': 0
          },

         cmdID: -3
        }
      };
      SDL.SDLController.getApplicationModel(params.appID).addCommand(
        exitCommand
      );
    },

   toggleDriverDeviceWindow: function(element) {
      SDL.PrimaryDevice.toggleProperty('active');
    },

   driverDeviceWindowClose: function(device, rank) {
      this.toggleDriverDeviceWindow();
      if (!device) {
        return;
      }
      if (rank === 1 &&
        SDL.SDLModel.driverDeviceInfo &&//Magic number 1 means passenger's
                                        // device
        device.name === SDL.SDLModel.driverDeviceInfo.name) {
        var apps = SDL.SDLModel.data.registeredApps;
        for (var i = 0; i < apps.length; i++) {
          if (apps[i].deviceName === device.name) {
            apps[i].level = 'NONE';
          }
        }
        SDL.SDLModel.set('driverDeviceInfo', null);
        SDL.InfoAppsView.showAppList();
        FFW.RC.OnDeviceRankChanged(device, SDL.SDLModel.deviceRank[rank]);
      } else if (rank === 0) {  //Magic number 1 means driver's device
        SDL.SDLModel.set('driverDeviceInfo', device);
        SDL.InfoAppsView.showAppList();
        FFW.RC.OnDeviceRankChanged(device, SDL.SDLModel.deviceRank[rank]);
      }
    },

   /**
     * Handeler for OnKeyboardInputcommand button press
     *
     * @param element
     *            SDL.Button
     */
    onCommand: function(element) {
      if (element.commandID < 0) {
        switch (element.commandID) {
          case -1:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'DRIVER_DISTRACTION_VIOLATION'
            );
            break;
          }
          case -2:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'USER_EXIT'
            );
            break;
          }
          case -3:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'UNAUTHORIZED_TRANSPORT_REGISTRATION'
            );
            break;
          }
          default:
          {
            console.log('Unknown command with ID: ' + element.commandID);
          }
        }
        SDL.OptionsView.deactivate();
        SDL.States.goToStates('info.apps');
      } else if (element.menuID >= 0) {

        // if subMenu
        // activate driver destruction if necessary
        if (SDL.SDLModel.data.driverDistractionState) {
          SDL.DriverDistraction.activate();
        } else {
          this.onSubMenu(element.menuID);
        }
      } else {
        FFW.UI.onCommand(element.commandID, this.model.appID);
        SDL.OptionsView.deactivate();
      }
    },

   /**
     * PopUp appears on screen when SDL need response from user
     * to allow or disallow app get access to manage radio or climate module
     * @param request
     */
    interiorDataConsent: function(request) {
      var appName = SDL.SDLController.getApplicationModel(
        request.params.appID
      ).appName;

      var module = 'Unknown';
      if (request.params.moduleType == 'CLIMATE') {
        module = 'Climate';
      } else if (request.params.moduleType == 'RADIO') {
        module = 'Radio';
      }

      var popUp = SDL.PopUp.create().appendTo('body').popupActivate(
        'Would you like to grant access for ' + appName +
        ' application for module ' + module + '?',
        function(result) {
          FFW.RC.GetInteriorVehicleDataConsentResponse(request, result);
        }
      );

      setTimeout(
        function() {
          if (popUp && popUp.active) {
            popUp.deactivate();
            FFW.RC.sendError(
              SDL.SDLModel.data.resultCode['TIMED_OUT'], request.id,
              request.method, 'The resource is in use and the driver did not respond in time'
            );
          }
        }, 9500
      ); //Magic number is timeout for RC consent popUp
    },

   /**
     *
     */
    onDeactivatePassengerApp: function(button) {
      SDL.PopUp.create().appendTo('body').popupActivate(
        'Exit application?',
        function(result) {
          if (result) {
            SDL.SDLController.userExitAction(button.appID);
          }
        }
      );
    },

   /**
     * Returns indicator image path depending on state
     * @param state
     */
    getLedIndicatorImagePath: function(state) {
      if (state) {
        return 'images/media/active_horiz_led.png';
      } else {
        return 'images/media/passiv_horiz_led.png';
      }
    },

   /**
     * Filter objects properties according to filter param
     * @param data contains input object to filter
     * @param properties contains properties to keep
     */
    filterObjectProperty: function(data, properties, stack) {
      if (stack == null) {
        stack = '';
      }

      var result = data;
      for (var key in result) {
        if (typeof result[key] == 'object') {
          result[key] = this.filterObjectProperty(
            result[key], properties, key + '.'
          );
          if (Object.keys(result[key]).length === 0) {
            delete result[key];
          }
        } else if (properties.indexOf(stack + key) < 0 &&
                   properties.indexOf(stack + '*') < 0) {
          delete result[key];
        }
      }
      return result;
    },

   /**
     * Get diff between lhs and rhs object properties recursively
     * @param lhs contains reference to first object of comparison
     * @param rhs contains reference to second object of comparison
     * @param stack contains prefix name for current object propery
     */
    getChangedProperties: function(lhs, rhs, stack) {
      if (stack == null) {
          stack = '';
      }

      var properties = [];
      for (var key in rhs) {
        if (typeof rhs[key] == 'object') {
          var obj_properties = this.getChangedProperties(
            lhs[key], rhs[key], key + '.'
          );
          properties = properties.concat(obj_properties);
        } else if (lhs[key] != rhs[key]) {
          properties.push(stack + key);
        }
      }

      return properties;
    }
  }
);
