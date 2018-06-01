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

SDL.HmiSettingsModel = Em.Object.create({

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
  temperatureUnit: SDL.ClimateControlModel.climateControlData.temperatureUnit,

  getHmiSettingsCapabilities: function() {
    var capabilities = {
      moduleName: 'HMISettingsControlCapabilities',
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
          SDL.ClimateControlModel.temperatureUnitCelsiusEnable();
        }else{
          SDL.ClimateControlModel.temperatureUnitFahrenheitEnable();
        }
        result.temperatureUnit = data.temperatureUnit;
      }
      if(data.distanceUnit && this.distanceUnit != data.distanceUnit) {
        this.set('distanceUnit',data.distanceUnit);
        result.distanceUnit = data.distanceUnit;
      }

      if (Object.keys(result).length > 0) {
        FFW.RC.onInteriorVehicleDataNotification({
          moduleType:'HMI_SETTINGS',
          hmiSettingsControlData: result
       });
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
  }
})
