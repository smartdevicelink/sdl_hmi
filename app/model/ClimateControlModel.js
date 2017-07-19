SDL.ClimateControlModel = Em.Object.create({

  init: function() {},

  currentFanSpeed: 0,
  autoModeEnableString: 'OFF',
  dualModeEnableString: 'OFF',
  passengerDesiredTemp: 70,
  reciRCulateAirEnableString: 'OFF',
  acEnableString: 'OFF',

  /**
   * GetInteriorVehicleDataConsent
   * Consented app for CLIMATE noduleType
   */
  consentedApp: null,

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
      currentTemperature: SDL.SDLController.getTemperatureStruct(
        this.climateControlData.temperatureUnit,
        this.climateControlData.currentTemp
      ),
      desiredTemperature: SDL.SDLController.getTemperatureStruct(
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

    var result = this.getClimateControlData();
    for (var key in result) {
      if (!data.hasOwnProperty(key)) {
        delete result[key];
      }
    }

    // FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
    //   result, null);

    return result;
  },

  fanSpeedUp: function() {
      if (this.climateControlData.fanSpeed < 100) {
        this.set('climateControlData.fanSpeed', 
          this.climateControlData.fanSpeed + 1);
        FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
          this.getClimateControlData(), null);
      }
    },

  fanSpeedDown: function() {
      if (this.climateControlData.fanSpeed > 0) {
        this.set('climateControlData.fanSpeed',
          this.climateControlData.fanSpeed - 1
        );
        FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
          this.getClimateControlData(), null);
      }
    },

  currentTempUp: function() {
      this.set('climateControlData.currentTemp',
        this.climateControlData.currentTemp + 1);
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  currentTempDown: function() {
      this.set('climateControlData.currentTemp',
        this.climateControlData.currentTemp - 1);
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  desiredTempUp: function() {
      this.set('climateControlData.desiredTemp',
        this.climateControlData.desiredTemp + 1);
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  desiredTempDown: function() {
      this.set('climateControlData.desiredTemp',
        this.climateControlData.desiredTemp - 1);
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  temperatureUnitFahrenheitEnable: function() {
      this.set('climateControlData.temperatureUnit', 'FAHRENHEIT');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  temperatureUnitCelsiusEnable: function() {
      this.set('climateControlData.temperatureUnit', 'CELSIUS');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  defrostNoneEnable: function() {
      this.set('climateControlData.defrostZone', 'NONE');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  defrostFrontEnable: function() {
      this.set('climateControlData.defrostZone', 'FRONT');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  defrostRearEnable: function() {
      this.set('climateControlData.defrostZone', 'REAR');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  defrostAllEnable: function() {
      this.set('climateControlData.defrostZone', 'ALL');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  ventilationModeNoneEnable: function() {
      this.set('climateControlData.currentVentilationMode', 'NONE');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
  },

  ventilationModeUpperEnable: function() {
      this.set('climateControlData.currentVentilationMode', 'UPPER');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
  },

  ventilationModeLowerEnable: function() {
      this.set('climateControlData.currentVentilationMode', 'LOWER');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
  },

  ventilationModeBothEnable: function() {
      this.set('climateControlData.currentVentilationMode', 'BOTH');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
  },

  toggleDualMode: function() {
      this.toggleProperty('climateControlData.dualModeEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  toggleRecirculateAir: function() {
      this.toggleProperty('climateControlData.circulateAirEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  toggleAcEnable: function() {
      this.toggleProperty('climateControlData.acEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  toggleAcMaxEnable: function() {
      this.toggleProperty('climateControlData.acMaxEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  toggleAutoModeEnable: function() {
      this.toggleProperty('climateControlData.autoModeEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.getClimateControlData(), null);
    },

  setFanSpeed: function(speed) {
      this.set('climateControlData.fanSpeed', speed);
    },

  setCurrentTemp: function(temp) {
      this.set('climateControlData.currentTemperature',
        SDL.SDLController.extractTemperatureFromStruct(temp));
    },

  setDesiredTemp: function(temp) {
      this.set('climateControlData.desiredTemperature',
        SDL.SDLController.extractTemperatureFromStruct(temp));
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

  setCurrentVentilationMode: function(ventMode) {
      this.set('climateControlData.currentVentilationMode', ventMode);
  }
}
);
