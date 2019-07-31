/*
 * Copyright (c) 2018, Ford Motor Company All rights reserved.
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
 * @name SDL.HmiSettingsModel
 * @desc Navigation model
 * @category Model
 * @filesource app/model/HmiSettingsModel.js
 * @version 1.0
 */

SDL.HmiSettingsModel = Em.Object.extend({

/**
 * Display mode of the HMI display
**/     
  displayModeStruct: [
    'DAY',
    'NIGHT',
    'AUTO'
  ],

/**
* Current display mode of the HMI display
**/   
  displayMode: 'DAY',

/**
  * Distance Unit used in the HMI (for maps/tracking distances)
**/ 
  distanceUnitStruct:[
    'MILES',
    'KILOMETERS'
  ],

/**
* Current distance Unit used in the HMI (for maps/tracking distances)
**/ 
  distanceUnit: 'MILES',

/*
*Temperature Unit used in the HMI (for temperature measuring systems)
*/ 
  temperatureUnitStruct: [
    'FAHRENHEIT',
    'CELSIUS'
  ],
/*
 * Current temperature Unit used in the HMI (for temperature measuring systems)
 */ 
  temperatureUnit: 'CELSIUS',

  getHmiSettingsCapabilities: function() {
    var capabilities = {
      moduleName: 'HMI Settings Control Module',
      distanceUnitAvailable: true,
      temperatureUnitAvailable: true,
      displayModeUnitAvailable: true
    };

    return capabilities;
  },

  setHmiSettingsData: function(data){
      var result = {};
      if(data.displayMode && this.displayMode != data.displayMode) {
        this.set('displayMode',data.displayMode);
        result.displayMode = data.displayMode;
      }
      if(data.temperatureUnit && this.temperatureUnit != data.temperatureUnit) {
        this.set('temperatureUnit',data.temperatureUnit);
        if('CELSIUS' == data.temperatureUnit){
          SDL.RCModulesController.climateModels[this.ID].temperatureUnitCelsiusEnable();
        }else{
          SDL.RCModulesController.climateModels[this.ID].temperatureUnitFahrenheitEnable();
        }
        result.temperatureUnit = data.temperatureUnit;
      }
      if(data.distanceUnit && this.distanceUnit != data.distanceUnit) {
        this.set('distanceUnit',data.distanceUnit);
        result.distanceUnit = data.distanceUnit;
      }

    return result;
  },

  getHmiSettingsControlData: function(){
    var result = {
      temperatureUnit: this.temperatureUnit,
      displayMode: this.displayMode,
      distanceUnit: this.distanceUnit
    };
    if(result.displayMode == 'AUTO'){
      var time = new Date().toLocaleTimeString();
      time = parseInt(time.substring(0, time.indexOf(':')));
      result.displayMode = (time > 7 && time < 20? 'DAY': 'NIGHT');
    }
    return result;
  },

  /**
   * @description Function to generate default HMI settings capabilities
   * supported by HMI
   * @type {Object}
   */
  generateHMISettingsCapabilities: function(element) {
    var capabilities = this.getHmiSettingsCapabilities();
    if(element) {
      var moduleInfo = {
        'allowMultipleAccess': true,
        'moduleId': this.UUID,
        'serviceArea': SDL.deepCopy(element),
        'location': SDL.deepCopy(element),
      };

      moduleInfo.location['colspan'] = 1;
      moduleInfo.location['rowspan'] = 1;
      moduleInfo.location['levelspan'] = 1;
      capabilities['moduleInfo'] = moduleInfo;
    }
    SDL.remoteControlCapabilities.remoteControlCapability['hmiSettingsControlCapabilities'] = capabilities;
  },

  /**
   * @function toggleDisplayMode
   * @description Callback for sending HMI settings notification with changed displayMode
   */
  toggleDisplayMode: function() {
    var next = SDL.SDLController.nextElement(SDL.RCModulesController.currentHMISettingsModel.displayModeStruct, SDL.RCModulesController.currentHMISettingsModel.displayMode);
    SDL.RCModulesController.currentHMISettingsModel.set('displayMode',next);
    var data = {
      displayMode: SDL.RCModulesController.currentHMISettingsModel.getHmiSettingsControlData().displayMode
    }
    this.sendHMISettingsNotification(data);
  },

  /**
   * @function toggleDistanceUnit
   * @description Callback for sending HMI settings notification with changed distanceUnit
   */
 toggleDistanceUnit: function() {
    var next = SDL.SDLController.nextElement(SDL.RCModulesController.currentHMISettingsModel.distanceUnitStruct, SDL.RCModulesController.currentHMISettingsModel.distanceUnit);
    SDL.RCModulesController.currentHMISettingsModel.set('distanceUnit',next);
    var data = {
      distanceUnit: next
    }
    this.sendHMISettingsNotification(data);
  },

/**
 * @function toggleDistanceUnit
 * @description Callback for sending HMI settings notification with changed distanceUnit
 */ 
 toggleTemperatureUnit: function() {
    var next = SDL.SDLController.nextElement(SDL.RCModulesController.currentHMISettingsModel.temperatureUnitStruct, SDL.RCModulesController.currentHMISettingsModel.temperatureUnit);
    SDL.RCModulesController.currentHMISettingsModel.set('temperatureUnit',next);
    SDL.RCModulesController.climateModels[this.ID].set('climateControlData.temperatureUnit', next);
    if(next == 'FAHRENHEIT') {
      SDL.RCModulesController.climateModels[this.ID].temperatureUnitFahrenheitEnable();
    } else {
      SDL.RCModulesController.climateModels[this.ID].temperatureUnitCelsiusEnable();
    }
    var data = {
      temperatureUnit: next
    }
    this.sendHMISettingsNotification(data);
  },

  /**
   * @function sendHMISettingsNotification
   * @param {Object} data
   * @description Sending OnInteriorVehicleData notification
   */
  sendHMISettingsNotification: function(data){
    if (Object.keys(data).length > 0) {
      FFW.RC.onInteriorVehicleDataNotification({moduleType:'HMI_SETTINGS', moduleId: this.UUID, hmiSettingsControlData: data});
    }
  },

  /**
   * @function update
   * @description updating of all bind values
   */
  update: function() {
    this.set('displayMode', this.displayMode);
    this.set('distanceUnit', this.distanceUnit);
    this.set('temperatureUnit', this.temperatureUnit);
  }
})
