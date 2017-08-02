SDL.ClimateControlModel = Em.Object.create({

  init: function() {},

  currentFanSpeed: 0,
  autoModeEnableString: 'OFF',
  dualModeEnableString: 'OFF',
  passengerDesiredTemp: 70,
  reciRCulateAirEnableString: 'OFF',
  acEnableString: 'OFF',

  climateControlData: {
    temperatureUnit: 'CELSIUS',
    currentTemp: 20,
    desiredTemp: 25,
    acEnable: true,
    acMaxEnable: true,
    circulateAirEnable: true,
    autoModeEnable: true,
    defrostZone: 'ALL',
    dualModeEnable: true,
    fanSpeed: 0,
    currentVentilationMode: 'BOTH'
  },

  getClimateControlCapabilities: function() {
    var result = {
      moduleName: 'Climate Control Module',
      fanSpeedAvailable: true,
      desiredTemperatureAvailable: true,
      acEnableAvailable: true,
      acMaxEnableAvailable: true,
      circulateAirEnableAvailable: true,
      autoModeEnableAvailable: true,
      dualModeEnableAvailable: true,
      defrostZoneAvailable: true,
      defrostZone: ['ALL', 'FRONT', 'REAR', 'NONE'],
      ventilationModeAvailable: true,
      ventilationMode: ['UPPER', 'LOWER', 'BOTH', 'NONE']
    };

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
      ventilationMode: this.climateControlData.currentVentilationMode
    };

    return result;
  },

  setClimateData: function(data) {

    if (data.fanSpeed != null) {
      this.setFanSpeed(data.fanSpeed);
    }

    if (data.currentTemperature != null) {
      this.setCurrentTemp(data.currentTemperature);
    }

    if (data.desiredTemperature != null) {
      this.setDesiredTemp(data.desiredTemperature);
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

    if (data.acMaxEnable != null) {
      this.setAcMaxEnable(data.acMaxEnable);
    }

    if (data.ventilationMode != null) {
      this.setCurrentVentilationMode(data.ventilationMode);
    }

    var properties = [];
    for (var key in data) {
      properties.push(key);
    }

    var result = this.getClimateControlData();
    return SDL.SDLController.filterObjectProperty(result, properties);
  },

  sendClimateChangeNotification: function(properties) {
    var data = this.getClimateControlData();
    data = SDL.SDLController.filterObjectProperty(data, properties);
    if (Object.keys(data).length > 0) {
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE', data, null);
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

  temperatureUnitFahrenheitEnable: function() {
      this.set('climateControlData.temperatureUnit', 'FAHRENHEIT');
      this.sendClimateChangeNotification(
        ['currentTemperature.unit', 'currentTemperature.value',
         'desiredTemperature.unit', 'desiredTemperature.value']
      );
    },

  temperatureUnitCelsiusEnable: function() {
      this.set('climateControlData.temperatureUnit', 'CELSIUS');
      this.sendClimateChangeNotification(
        ['currentTemperature.unit', 'currentTemperature.value',
         'desiredTemperature.unit', 'desiredTemperature.value']
      );
    },

  refreshDefrostZoneValue: function() {
    if (this.climateControlData.defrostZoneFrontEnable &&
        this.climateControlData.defrostZoneRearEnable) {
      this.set('climateControlData.defrostZone', 'ALL');
    } else if (!this.climateControlData.defrostZoneFrontEnable &&
               !this.climateControlData.defrostZoneRearEnable) {
      this.set('climateControlData.defrostZone', 'NONE');
    } else if (this.climateControlData.defrostZoneFrontEnable) {
      this.set('climateControlData.defrostZone', 'FRONT');
    } else if (this.climateControlData.defrostZoneRearEnable) {
      this.set('climateControlData.defrostZone', 'REAR');
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

  refreshVentilationModeValue: function() {
    if (this.climateControlData.ventilationModeUpEnable &&
        this.climateControlData.ventilationModeLowEnable) {
      this.set('climateControlData.ventilationMode', 'BOTH');
    } else if (!this.climateControlData.ventilationModeUpEnable &&
               !this.climateControlData.ventilationModeLowEnable) {
      this.set('climateControlData.ventilationMode', 'NONE');
    } else if (this.climateControlData.ventilationModeUpEnable) {
      this.set('climateControlData.ventilationMode', 'UPPER');
    } else if (this.climateControlData.ventilationModeLowEnable) {
      this.set('climateControlData.ventilationMode', 'LOWER');
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
    var properties = ['acEnable'];
    this.toggleProperty('climateControlData.acEnable');
    if (!this.climateControlData.acEnable &&
        this.climateControlData.acMaxEnable) {
      properties.push('acMaxEnable');
      this.toggleProperty('climateControlData.acMaxEnable');
    }
    this.sendClimateChangeNotification(properties);
  },

  toggleAcMaxEnable: function() {
    var properties = ['acMaxEnable'];
    this.toggleProperty('climateControlData.acMaxEnable');
    if (!this.climateControlData.acEnable &&
         this.climateControlData.acMaxEnable) {
      properties.push('acEnable');
      this.toggleProperty('climateControlData.acEnable');
    }
    this.sendClimateChangeNotification(properties);
  },

  toggleAutoModeEnable: function() {
    this.toggleProperty('climateControlData.autoModeEnable');
    this.sendClimateChangeNotification(['autoModeEnable']);
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
  },

  setAcMaxEnable: function(state) {
    this.set('climateControlData.acMaxEnable', state);
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
  }
}
);
