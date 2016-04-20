SDL.ClimateControlModel = Em.Object.create({

  init: function() {
      this.set('currentSet', this.climateSet.driver);
    },

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

  driverZone: {
      'col': 0,
      'row': 0,
      'level': 0,
      'colspan': 1,
      'rowspan': 1,
      'levelspan': 1
    },

  zoneSet: [
    'Driver',
    'Front Passenger',
    'Back Left',
    'Back Right'
  ],

  zoneSelect: 'Driver',

  passengerZone: {
      'col': 1,
      'row': 0,
      'level': 0,
      'colspan': 1,
      'rowspan': 1,
      'levelspan': 1
    },

  climateSet: {
      driver: {
        moduleZone: {
          'col': 0,
          'row': 0,
          'level': 0,
          'colspan': 2,
          'rowspan': 2,
          'levelspan': 1
        },
        climateControlData: {
          fanSpeed: 0,
          currentTemp: 72,
          desiredTemp: 72,
          temperatureUnit: 'CELSIUS',
          acEnable: true,
          circulateAirEnable: true,
          autoModeEnable: true,
          defrostZone: 'ALL',
          dualModeEnable: true
        }
      },
      front_passenger: {
        moduleZone: {
          'col': 1,
          'row': 0,
          'level': 0,
          'colspan': 2,
          'rowspan': 2,
          'levelspan': 1
        },
        climateControlData: {
          fanSpeed: 0,
          currentTemp: 72,
          desiredTemp: 72,
          temperatureUnit: 'CELSIUS',
          acEnable: true,
          circulateAirEnable: true,
          autoModeEnable: true,
          defrostZone: 'ALL',
          dualModeEnable: true
        }
      },
      back_left: {
        moduleZone: {
          'col': 0,
          'row': 1,
          'level': 0,
          'colspan': 2,
          'rowspan': 2,
          'levelspan': 1
        },
        climateControlData: {
          fanSpeed: 0,
          currentTemp: 72,
          desiredTemp: 72,
          temperatureUnit: 'CELSIUS',
          acEnable: true,
          circulateAirEnable: true,
          autoModeEnable: true,
          defrostZone: 'ALL',
          dualModeEnable: true
        }
      },
      back_right: {
        moduleZone: {
          'col': 1,
          'row': 1,
          'level': 0,
          'colspan': 2,
          'rowspan': 2,
          'levelspan': 1
        },
        climateControlData: {
          fanSpeed: 0,
          currentTemp: 72,
          desiredTemp: 72,
          temperatureUnit: 'CELSIUS',
          acEnable: true,
          circulateAirEnable: true,
          autoModeEnable: true,
          defrostZone: 'ALL',
          dualModeEnable: true
        }
      }
    },

  currentSet: null,

  zoneSelectObserver: function() {
      switch (this.zoneSelect) {
        case 'Driver' : {

          this.set('currentSet', this.climateSet.driver);

          break;
        }
        case 'Front Passenger' : {

          this.set('currentSet', this.climateSet.front_passenger);

          break;
        }
        case 'Back Left' : {

          this.set('currentSet', this.climateSet.back_left);

          break;
        }
        case 'Back Right' : {

          this.set('currentSet', this.climateSet.back_right);

          break;
        }
        default : {
          break;
        }
      }
    }.observes('this.zoneSelect'),

  setClimateData: function(data, zone) {

    if (data.fanSpeed) {
      this.setFanSpeed(data.fanSpeed, zone);
    }

    if (data.currentTemp) {
      this.setCurrentTemp(data.currentTemp, zone);
    }

    if (data.desiredTemp) {
      this.setDesiredTemp(data.desiredTemp, zone);
    }

    if (data.temperatureUnit) {
      this.setTemperatureUnitCelsiusEnable(data.temperatureUnit, zone);
    }

    if (data.acEnable) {
      this.setAcEnable(data.acEnable, zone);
    }

    if (data.circulateAirEnable) {
      this.setReciRCulateAirEnable(data.circulateAirEnable, zone);
    }

    if (data.autoModeEnable) {
      this.setAutoModeEnable(data.autoModeEnable, zone);
    }

    if (data.defrostZone) {
      this.setDefrostZone(data.defrostZone, zone);
    }

    if (data.dualModeEnable) {
      this.setDualModeEnable(data.dualModeEnable, zone);
    }

    FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
      this.climateSet[zone].moduleZone, null,
      this.climateSet[zone].climateControlData
    );
  },

  fanSpeedUp: function() {
      if (this.currentSet.climateControlData.fanSpeed < 100) {
        this.set('currentSet.climateControlData.fanSpeed',
          this.currentSet.climateControlData.fanSpeed + 1
        );
        FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
          this.currentSet.moduleZone, null, this.currentSet.climateControlData
        );
      }
    },

  fanSpeedDown: function() {
      if (this.currentSet.climateControlData.fanSpeed > 0) {
        this.set('currentSet.climateControlData.fanSpeed',
          this.currentSet.climateControlData.fanSpeed - 1
        );
        FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
          this.currentSet.moduleZone, null, this.currentSet.climateControlData
        );
      }
    },

  currentTempUp: function() {
      if (this.currentSet.climateControlData.currentTemp < 100) {
        this.set('currentSet.climateControlData.currentTemp',
          this.currentSet.climateControlData.currentTemp + 1
        );
        FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
          this.currentSet.moduleZone, null, this.currentSet.climateControlData
        );
      }
    },

  currentTempDown: function() {
      if (this.currentSet.climateControlData.currentTemp > 0) {
        this.set('currentSet.climateControlData.currentTemp',
          this.currentSet.climateControlData.currentTemp - 1
        );
        FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
          this.currentSet.moduleZone, null, this.currentSet.climateControlData
        );
      }
    },

  desiredTempUp: function() {
      if (this.currentSet.climateControlData.desiredTemp < 100) {
        this.set('currentSet.climateControlData.desiredTemp',
          this.currentSet.climateControlData.desiredTemp + 1
        );
        FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
          this.currentSet.moduleZone, null, this.currentSet.climateControlData
        );
      }
    },

  desiredTempDown: function() {
      if (this.currentSet.climateControlData.desiredTemp > 0) {
        this.set('currentSet.climateControlData.desiredTemp',
          this.currentSet.climateControlData.desiredTemp - 1
        );
        FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
          this.currentSet.moduleZone, null, this.currentSet.climateControlData
        );
      }
    },

  temperatureUnitKelvinEnable: function() {
      this.set('currentSet.climateControlData.temperatureUnit', 'KELVIN');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  temperatureUnitFahrenheitEnable: function() {
      this.set('currentSet.climateControlData.temperatureUnit', 'FAHRENHEIT');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  temperatureUnitCelsiusEnable: function() {
      this.set('currentSet.climateControlData.temperatureUnit', 'CELSIUS');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  defrostFrontEnable: function() {
      this.set('currentSet.climateControlData.defrostZone', 'FRONT');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  defrostRearEnable: function() {
      this.set('currentSet.climateControlData.defrostZone', 'REAR');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  defrostAllEnable: function() {
      this.set('currentSet.climateControlData.defrostZone', 'ALL');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  toggleDualMode: function() {
      this.toggleProperty('currentSet.climateControlData.dualModeEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  toggleRecirculateAir: function() {
      this.toggleProperty('currentSet.climateControlData.circulateAirEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  toggleAcEnable: function() {
      this.toggleProperty('currentSet.climateControlData.acEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  toggleAutoModeEnable: function() {
      this.toggleProperty('currentSet.climateControlData.autoModeEnable');
      FFW.RC.onInteriorVehicleDataNotification('CLIMATE',
        this.currentSet.moduleZone, null, this.currentSet.climateControlData
      );
    },

  setFanSpeed: function(speed, zone) {
      this.set('climateSet.' + zone + '.climateControlData.fanSpeed', speed);
    },

  setCurrentTemp: function(temp, zone) {
      this.set('climateSet.' + zone + '.climateControlData.currentTemp', temp);
    },

  setDesiredTemp: function(temp, zone) {
      this.set('climateSet.' + zone + '.climateControlData.desiredTemp', temp);
    },

  setTemperatureUnitCelsiusEnable: function(tempUnit, zone) {
      this.set('climateSet.' + zone + '.climateControlData.temperatureUnit',
        tempUnit
      );
    },

  setAcEnable: function(state, zone) {
      this.set('climateSet.' + zone + '.climateControlData.acEnable', state);
    },

  setReciRCulateAirEnable: function(state, zone) {
      this.set('climateSet.' + zone + '.climateControlData.circulateAirEnable',
        state
      );
    },

  setAutoModeEnable: function(state, zone) {
      this.set('climateSet.' + zone + '.climateControlData.autoModeEnable', state
      );
    },

  setDefrostZone: function(defZone, zone) {
      this.set('climateSet.' + zone + '.climateControlData.defrostZone', defZone);
    },

  setDualModeEnable: function(state, zone) {
      this.set('climateSet.' + zone + '.climateControlData.dualModeEnable', state
      );
    }
}
);
