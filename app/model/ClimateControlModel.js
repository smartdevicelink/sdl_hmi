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
 * @name SDL.ClimateControlModel
 * @desc Navigation model
 * @category Model
 * @filesource app/model/ClimateControlModel.js
 * @version 1.0
 */

SDL.ClimateControlModel = Em.Object.extend({

  init: function() {
    this._super();
    this.set('climateControlData', {});
    this.set('climateControlData.temperatureUnit', 'CELSIUS');
    this.set('climateControlData.currentTemp', 20);
    this.set('climateControlData.desiredTemp', 25);
    this.set('climateControlData.acEnable', true);
    this.set('climateControlData.acMaxEnable', true);
    this.set('climateControlData.circulateAirEnable', true);
    this.set('climateControlData.autoModeEnable', true);
    this.set('climateControlData.defrostZone', 'FRONT');
    this.set('climateControlData.defrostZoneFrontEnable', true);
    this.set('climateControlData.defrostZoneRearEnable', false);
    this.set('climateControlData.dualModeEnable', true);
    this.set('climateControlData.fanSpeed', 0);
    this.set('climateControlData.ventilationMode', 'UPPER');
    this.set('climateControlData.ventilationModeLowEnable', false);
    this.set('climateControlData.ventilationModeUpEnable', false);
    this.set('climateControlData.heatedWindshieldEnable', false);
    this.set('climateControlData.heatedRearWindowEnable', false);
    this.set('climateControlData.heatedSteeringWheelEnable', false);
    this.set('climateControlData.heatedMirrorsEnable', false);
    this.set('climateControlData.climateEnable', true);
    this.set("climateEnableButtonText", "Climate ON");

    this.set('currentFanSpeed', 0);
    this.set('autoModeEnableString', 'OFF');
    this.set('dualModeEnableString', 'OFF');
    this.set('passengerDesiredTemp', 70);
    this.set('reciRCulateAirEnableString', 'OFF');
    this.set('acEnableString', 'OFF');
    this.set('defrostZoneStruct', ['FRONT', 'REAR', 'ALL', 'NONE']);
    this.set('ventilationModeStruct', ['UPPER', 'LOWER', 'BOTH', 'NONE']);
    
  },

  climateControlData: {},

  getClimateControlCapabilities: function() {
    var result = [];

    var capabilities = {
      moduleName: 'Climate Control Module',
      climateEnableAvailable: true,
      currentTemperatureAvailable: true,
      fanSpeedAvailable: true,
      desiredTemperatureAvailable: true,
      acEnableAvailable: true,
      acMaxEnableAvailable: true,
      circulateAirEnableAvailable: true,
      autoModeEnableAvailable: true,
      dualModeEnableAvailable: true,
      defrostZoneAvailable: true,
      defrostZone: this.defrostZoneStruct,
      ventilationModeAvailable: true,
      ventilationMode: this.ventilationModeStruct,
      heatedWindshieldAvailable: true,
      heatedRearWindowAvailable: true,
      heatedSteeringWheelAvailable: true,
      heatedMirrorsAvailable: true
    };

    result.push(capabilities);

    return result;
  },

  getButtonCapabilities: function() {
    var result = [
      {
        'name': 'AC_MAX',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'AC',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'RECIRCULATE',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'FAN_UP',
        'shortPressAvailable': true,
        'longPressAvailable': true,
        'upDownAvailable': false
      },
      {
        'name': 'FAN_DOWN',
        'shortPressAvailable': true,
        'longPressAvailable': true,
        'upDownAvailable': false
      },
      {
        'name': 'TEMP_UP',
        'shortPressAvailable': true,
        'longPressAvailable': true,
        'upDownAvailable': false
      },
      {
        'name': 'TEMP_DOWN',
        'shortPressAvailable': true,
        'longPressAvailable': true,
        'upDownAvailable': false
      },
      {
        'name': 'DEFROST_MAX',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'DEFROST',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'DEFROST_REAR',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'UPPER_VENT',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'LOWER_VENT',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      }
    ];
    return result;
  },

  getClimateControlData: function() {
    var result = {
      fanSpeed: this.climateControlData.fanSpeed,
      currentTemperature: SDL.ClimateController.getTemperatureStruct(
        this.climateControlData.temperatureUnit,
        this.climateControlData.currentTemp
      ),
      desiredTemperature: SDL.ClimateController.getTemperatureStruct(
        this.climateControlData.temperatureUnit,
        this.climateControlData.desiredTemp
      ),
      acEnable: this.climateControlData.acEnable,
      circulateAirEnable: this.climateControlData.circulateAirEnable,
      autoModeEnable: this.climateControlData.autoModeEnable,
      defrostZone: this.climateControlData.defrostZone,
      dualModeEnable: this.climateControlData.dualModeEnable,
      acMaxEnable: this.climateControlData.acMaxEnable,
      ventilationMode: this.climateControlData.ventilationMode,
      heatedWindshieldEnable: this.climateControlData.heatedWindshieldEnable,
      heatedRearWindowEnable: this.climateControlData.heatedRearWindowEnable,
      heatedSteeringWheelEnable: this.climateControlData.heatedSteeringWheelEnable,
      heatedMirrorsEnable: this.climateControlData.heatedMirrorsEnable,
      climateEnable: this.climateControlData.climateEnable
    };

    return result;
  },

  setClimateData: function(data) {
    var before_set = SDL.deepCopy(this.getClimateControlData());

    if(data.climateEnable != null) {
      this.setClimateEnable(data.climateEnable);
    }

    if (data.fanSpeed != null) {
      this.setFanSpeed(data.fanSpeed);
    }

    if (data.currentTemperature != null) {
      this.setCurrentTemp(data.currentTemperature);
    }

    if (data.desiredTemperature != null) {
      this.setDesiredTemp(data.desiredTemperature);
      if(data.desiredTemperature.unit == 'FAHRENHEIT') {
        this.temperatureUnitFahrenheitEnable(false);
      } else {
        this.temperatureUnitCelsiusEnable(false);
      }
    }

    if (data.acMaxEnable != null) {
      this.setAcMaxEnable(data.acMaxEnable);
    }

    if (data.acEnable != null) {
      this.setAcEnable(data.acEnable);
    }

    if (data.circulateAirEnable != null) {
      this.setRecirculateAirEnable(data.circulateAirEnable);
    }

    if (data.autoModeEnable != null) {
      this.setAutoModeEnable(data.autoModeEnable);
    }

    if (data.defrostZone != null) {
      this.setDefrostZone(data.defrostZone);
    }

    if (data.dualModeEnable != null) {
      this.setDualModeEnable(data.dualModeEnable);
    }

    if (data.ventilationMode != null) {
      this.setVentilationMode(data.ventilationMode);
    }

    if (data.heatedWindshieldEnable != null) {
      this.setHeatedWindshieldEnable(data.heatedWindshieldEnable);
    }

    if (data.heatedRearWindowEnable != null) {
      this.setHeatedRearWindowEnable(data.heatedRearWindowEnable);
    }

    if (data.heatedSteeringWheelEnable != null) {
      this.setHeatedSteeringWheelEnable(data.heatedSteeringWheelEnable);
    }

    if (data.heatedMirrorsEnable != null) {
      this.setHeatedMirrorsEnable(data.heatedMirrorsEnable);
    }

    var after_set = SDL.deepCopy(this.getClimateControlData());

    var properties =
      SDL.SDLController.getChangedProperties(before_set, after_set);
    for (var key in data) {
      if (properties.indexOf(key) < 0) {
        properties.push(key);
      }
      if (key == 'currentTemperature') {
        properties.push('currentTemperature.unit');
        properties.push('currentTemperature.value');
      }
      if (key == 'desiredTemperature') {
        properties.push('desiredTemperature.unit');
        properties.push('desiredTemperature.value');
      }
    }

    return SDL.SDLController.filterObjectProperty(after_set, properties);
  },

  sendClimateChangeNotification: function(properties) {
    var data = this.getClimateControlData();
    data = SDL.SDLController.filterObjectProperty(data, properties);
    if (Object.keys(data).length > 0) {
      FFW.RC.onInteriorVehicleDataNotification({moduleType:'CLIMATE',moduleId: this.UUID, climateControlData: data});
    }
  },

  fanSpeedUp: function() {
      if (this.climateControlData.fanSpeed < 100) {
        this.set('climateControlData.fanSpeed',
          this.climateControlData.fanSpeed + 1);
        this.sendClimateChangeNotification(['fanSpeed']);
      }
    },

  fanSpeedDown: function() {
      if (this.climateControlData.fanSpeed > 0) {
        this.set('climateControlData.fanSpeed',
          this.climateControlData.fanSpeed - 1
        );
        this.sendClimateChangeNotification(['fanSpeed']);
      }
    },

  currentTempUp: function() {
      this.set('climateControlData.currentTemp',
        this.climateControlData.currentTemp + 1);
      this.sendClimateChangeNotification(
        ['currentTemperature.unit', 'currentTemperature.value']
      );
    },

  currentTempDown: function() {
      this.set('climateControlData.currentTemp',
        this.climateControlData.currentTemp - 1);
      this.sendClimateChangeNotification(
        ['currentTemperature.unit', 'currentTemperature.value']
      );
    },

  desiredTempUp: function() {
      this.set('climateControlData.desiredTemp',
        this.climateControlData.desiredTemp + 1);
      this.sendClimateChangeNotification(
        ['desiredTemperature.unit', 'desiredTemperature.value']
      );
    },

  desiredTempDown: function() {
      this.set('climateControlData.desiredTemp',
        this.climateControlData.desiredTemp - 1);
      this.sendClimateChangeNotification(
        ['desiredTemperature.unit', 'desiredTemperature.value']
      );
    },

  temperatureUnitFahrenheitEnable: function(sendNotification = true) {
      this.set('climateControlData.temperatureUnit', 'FAHRENHEIT');
      if(sendNotification){
        this.sendClimateChangeNotification(
          ['currentTemperature.unit', 'currentTemperature.value',
          'desiredTemperature.unit', 'desiredTemperature.value']
        );
      }
      SDL.RCModulesController.currentHMISettingsModel.set('temperatureUnit','FAHRENHEIT');
  },

  temperatureUnitCelsiusEnable: function(sendNotification = true) {
      this.set('climateControlData.temperatureUnit', 'CELSIUS');
      if(sendNotification){
        this.sendClimateChangeNotification(
          ['currentTemperature.unit', 'currentTemperature.value',
          'desiredTemperature.unit', 'desiredTemperature.value']
        );
      }
      SDL.RCModulesController.currentHMISettingsModel.set('temperatureUnit','CELSIUS');
  },

  refreshDefrostZoneValue: function() {
    if (this.climateControlData.defrostZoneFrontEnable &&
        this.climateControlData.defrostZoneRearEnable) {
      this.set('climateControlData.defrostZone', this.defrostZoneStruct[2]);
    } else if (!this.climateControlData.defrostZoneFrontEnable &&
               !this.climateControlData.defrostZoneRearEnable) {
      this.set('climateControlData.defrostZone', this.defrostZoneStruct[3]);
    } else if (this.climateControlData.defrostZoneFrontEnable) {
      this.set('climateControlData.defrostZone', this.defrostZoneStruct[0]);
    } else if (this.climateControlData.defrostZoneRearEnable) {
      this.set('climateControlData.defrostZone', this.defrostZoneStruct[1]);
    }

    this.sendClimateChangeNotification(['defrostZone']);
  },

  defrostFrontEnable: function() {
    this.toggleProperty('climateControlData.defrostZoneFrontEnable');
    this.refreshDefrostZoneValue();
  },

  defrostRearEnable: function() {
    this.toggleProperty('climateControlData.defrostZoneRearEnable');
    this.refreshDefrostZoneValue();
  },

  defrostAllEnable: function() {
    if (this.climateControlData.defrostZoneFrontEnable ==
        this.climateControlData.defrostZoneRearEnable) {
      this.toggleProperty('climateControlData.defrostZoneFrontEnable');
      this.toggleProperty('climateControlData.defrostZoneRearEnable');
    } else if (this.climateControlData.defrostZoneFrontEnable ||
               this.climateControlData.defrostZoneRearEnable) {
      this.set('climateControlData.defrostZoneRearEnable', true);
      this.set('climateControlData.defrostZoneFrontEnable', true);
    } else {
      this.set('climateControlData.defrostZoneRearEnable', false);
      this.set('climateControlData.defrostZoneFrontEnable', false);
    }

    this.refreshDefrostZoneValue();
  },

  refreshVentilationModeValue: function() {
    if (this.climateControlData.ventilationModeUpEnable &&
        this.climateControlData.ventilationModeLowEnable) {
      this.set('climateControlData.ventilationMode', this.ventilationModeStruct[2]);
    } else if (!this.climateControlData.ventilationModeUpEnable &&
               !this.climateControlData.ventilationModeLowEnable) {
      this.set('climateControlData.ventilationMode', this.ventilationModeStruct[3]);
    } else if (this.climateControlData.ventilationModeUpEnable) {
      this.set('climateControlData.ventilationMode', this.ventilationModeStruct[0]);
    } else if (this.climateControlData.ventilationModeLowEnable) {
      this.set('climateControlData.ventilationMode', this.ventilationModeStruct[1]);
    }

    this.sendClimateChangeNotification(['ventilationMode']);
  },

  ventilationModeUpperEnable: function() {
    this.toggleProperty('climateControlData.ventilationModeUpEnable');
    this.refreshVentilationModeValue();
  },

  ventilationModeLowerEnable: function() {
    this.toggleProperty('climateControlData.ventilationModeLowEnable');
    this.refreshVentilationModeValue();
  },

  toggleDualMode: function() {
    this.toggleProperty('climateControlData.dualModeEnable');
    this.sendClimateChangeNotification(['dualModeEnable']);
  },

  toggleRecirculateAir: function() {
    this.toggleProperty('climateControlData.circulateAirEnable');
    this.sendClimateChangeNotification(['circulateAirEnable']);
  },

  toggleAcEnable: function() {
    this.toggleProperty('climateControlData.acEnable');
    this.onAcEnableChanged(true);
  },

  toggleClimateEnable: function() {
    this.toggleProperty('climateControlData.climateEnable');
    var dataForSending = this.getDataForSending();
    this.sendClimateChangeNotification(dataForSending);
  },

  getDataForSending: function() {
    var dataForSending = [];
    var climateData = this.getClimateControlData();
    var climateEnable = climateData.climateEnable;
    if(climateEnable) {
      for(var key in climateData) {
        if(typeof climateData[key] == 'object') {
          dataForSending.push(key + ".*");
          continue;
        }
        dataForSending.push(key);
      }
    } else {
      dataForSending.push('climateEnable');
    }
    return dataForSending;
  },

  changeClimateEnableButtonText: function() {
    var enable = this.climateControlData.climateEnable;
    var buttonText = enable ? 'Climate ON' : 'Climate OFF';
    this.set('climateEnableButtonText', buttonText);
  }.observes('this.climateControlData.climateEnable'),

  toggleAcMaxEnable: function() {
    this.toggleProperty('climateControlData.acMaxEnable');
    this.onAcMaxEnableChanged(true);
  },

  toggleAutoModeEnable: function() {
    this.toggleProperty('climateControlData.autoModeEnable');
    this.sendClimateChangeNotification(['autoModeEnable']);
  },

  toggleHeatedWindshieldEnable: function(){
    this.toggleProperty('climateControlData.heatedWindshieldEnable');
    this.sendClimateChangeNotification(['heatedWindshieldEnable']);
  },

  toggleHeatedRearWindowEnable: function(){
    this.toggleProperty('climateControlData.heatedRearWindowEnable');
    this.sendClimateChangeNotification(['heatedRearWindowEnable']);
  },

  toggleHeatedSteeringWheelEnable: function(){
    this.toggleProperty('climateControlData.heatedSteeringWheelEnable');
    this.sendClimateChangeNotification(['heatedSteeringWheelEnable']);
  },

  toggleHeatedMirrorsEnable: function(){
    this.toggleProperty('climateControlData.heatedMirrorsEnable');
    this.sendClimateChangeNotification(['heatedMirrorsEnable']);
  },

  onAcEnableChanged: function(sendNotification) {
    var properties = ['acEnable'];
    if (!this.climateControlData.acEnable &&
        this.climateControlData.acMaxEnable) {
      properties.push('acMaxEnable');
      this.toggleProperty('climateControlData.acMaxEnable');
    }
    if (sendNotification) {
      this.sendClimateChangeNotification(properties);
    }
  },

  onAcMaxEnableChanged: function(sendNotification) {
    var properties = ['acMaxEnable'];
    if (!this.climateControlData.acEnable &&
         this.climateControlData.acMaxEnable) {
      properties.push('acEnable');
      this.toggleProperty('climateControlData.acEnable');
    }
    if (sendNotification) {
      this.sendClimateChangeNotification(properties);
    }
  },

  setClimateEnable: function(climateEnable) {
    this.set('climateControlData.climateEnable', climateEnable);
  },

  setFanSpeed: function(speed) {
    this.set('climateControlData.fanSpeed', speed);
  },

  setCurrentTemp: function(temp) {
    this.set('climateControlData.currentTemp',
    SDL.ClimateController.extractTemperatureFromStruct(temp));
  },

  setDesiredTemp: function(temp) {
    this.set('climateControlData.desiredTemp',
    SDL.ClimateController.extractTemperatureFromStruct(temp));
  },

  setTemperatureUnitCelsiusEnable: function(tempUnit) {
    this.set('climateControlData.temperatureUnit', tempUnit);
  },

  setAcEnable: function(state) {
    this.set('climateControlData.acEnable', state);
    this.onAcEnableChanged(false);
  },

  setAcMaxEnable: function(state) {
    this.set('climateControlData.acMaxEnable', state);
    this.onAcMaxEnableChanged(false);
  },

  setRecirculateAirEnable: function(state) {
    this.set('climateControlData.circulateAirEnable', state);
  },

  setAutoModeEnable: function(state) {
    this.set('climateControlData.autoModeEnable', state);
  },

  setDefrostZone: function(defZone) {
    this.set('climateControlData.defrostZone', defZone);
  },

  setDualModeEnable: function(state) {
    this.set('climateControlData.dualModeEnable', state);
  },

  setVentilationMode: function(ventMode) {
    this.set('climateControlData.ventilationMode', ventMode);
  },

  setHeatedWindshieldEnable: function(state) {
    this.set('climateControlData.heatedWindshieldEnable', state);
  },

  setHeatedRearWindowEnable: function(state) {
    this.set('climateControlData.heatedRearWindowEnable', state);
  },

  setHeatedSteeringWheelEnable: function(state) {
    this.set('climateControlData.heatedSteeringWheelEnable', state);
  },

  setHeatedMirrorsEnable: function(state) {
    this.set('climateControlData.heatedMirrorsEnable', state);
  },
  
  /**
   * @description Function to generate climate capabilities
   * @param {Object} element 
   */
  generateClimateCapabilities: function(element) {
    var capabilities = this.getClimateControlCapabilities()[0];
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
    SDL.remoteControlCapabilities.remoteControlCapability['climateControlCapabilities'].push(capabilities);
  }
}
);
