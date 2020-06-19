/*
 * Copyright (c) 2019, Ford Motor Company All rights reserved.
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
 * @name SDL.RCModulesController
 * @desc RC modules controller logic
 * @category Controller
 * @filesource app/controller/sdl/RCModulesController.js
 * @version 1.0
 */
SDL.RCModulesController = Em.Object.create({
    /**
     * @description Mapping of module names and corresponding data models
     * @type {Map}
     */
    modelsNameMapping:{
      AUDIO: 'audioModels',
      RADIO: 'radioModels',
      CLIMATE: 'climateModels',
      SEAT: 'seatModels',
      LIGHT: 'lightModels',
      HMI_SETTINGS: 'hmiSettingsModels'
    },

    /**
     * @description Mapping of module seats and audio data models
     * @type {Map}
     */
    audioModels: {},

    /**
     * @description Mapping of module seats and climate data models
     * @type {Map}
     */
    climateModels: {},

    /**
     * @description Mapping of module seats and radio data models
     * @type {Map}
     */
    radioModels: {},

    /**
     * @description Mapping of module seats and seat data models
     * @type {Map}
     */
    seatModels: {},

    /**
     * @description Mapping of module seats and hmi settings data models
     * @type {Map}
     */
    hmiSettingsModels: {},

    /**
     * @description Mapping of module seats and light data models
     * @type {Map}
     */
    lightModels: {},

    /**
     * @description Mapping of module types and internal mapping of module
     * seats and responsible module
     * @type {Map}
     */
    moduleModelsMapping: {},

    /**
     * @name moduleUUIDMapping
     * @type {Map}
     * @description Mapping module ID to UUID
     */
    moduleUUIDMapping: {},

    /**
     * @description Mapping of user friendly seat names and their key names
     * @type {Map}
     */
    seatKeyLabelMapping: {},

    /**
     * @description Reference to currently active seat model
     * @type {Object}
     */
    currentSeatModel: null,

    /**
     * @description Reference to currently active audio model
     * @type {Object}
     */
    currentAudioModel: null,

    /**
     * @description Reference to currently active climate model
     * @type {Object}
     */
    currentClimateModel: null,

    /**
     * @description Reference to currently active radio model
     * @type {Object}
     */
    currentRadioModel: null,

    /**
     * @description Reference to currently active hmi settings model
     * @type {Object}
     */
    currentHMISettingsModel: null,

    /**
     * @description Reference to currently active light model
     * @type {Object}
     */
    currentLightModel: null,

    /**
     * @function init
     * @description Function for controller initialization
     */
    init: function() {
        // Mock models required for early binding initialization
        this.set('currentAudioModel', SDL.AudioModel.create());
        this.set('currentClimateModel', SDL.ClimateControlModel.create());
        this.set('currentSeatModel', SDL.SeatModel.create({ID: 'No emulation mode. ID is undefined'}));
        this.set('currentRadioModel', SDL.RadioModel.create());
        this.set('currentHMISettingsModel', SDL.HmiSettingsModel.create());
        this.set('currentLightModel', SDL.LightModel.create());
    },

    /**
     * @function resetToDefault
     * @description Reset all parameters of current object to default
     */
    resetToDefault: function() {
      SDL.remoteControlCapabilities = SDL.deepCopy(SDL.initialRemoteControlCapabilities);
      this.set('audioModels', {});
      this.set('climateModels', {});
      this.set('radioModels', {});
      this.set('seatModels', {});
      this.set('hmiSettingsModels', {});
      this.set('lightModels', {});
      this.set('moduleModelsMapping', {});
      this.set('moduleUUIDMapping', {});
      this.set('seatKeyLabelMapping', {});
      this.init();
    },

    /**
     * @function fillModuleModelsMapping
     * @description Function for generating a coverage according to specified
     * settings and saving into the moduleModelsMapping
     * @param {String} module_type
     * @param {Array} module_coverage
     */
    fillModuleModelsMapping: function(module_type, module_coverage) {
      var mapping = {};

      module_coverage.forEach(module_service_area => {
        // These fields are not mandatory according to API so should be checked
        var module_level = module_service_area.hasOwnProperty('level') ? module_service_area.level : 0;
        var module_row = module_service_area.row;
        var module_col = module_service_area.col;

        var covering_module_name = SDL.VehicleModuleCoverageController.getLocationName({
          "col": module_col,
          "row": module_row,
          "level": module_level
        });

        var level_span = module_service_area.hasOwnProperty('levelspan') ? module_service_area.levelspan : 1;
        var row_span = module_service_area.hasOwnProperty('rowspan') ? module_service_area.rowspan : 1;
        var col_span = module_service_area.hasOwnProperty('colspan') ? module_service_area.colspan : 1;

        for (var level = module_level; level < module_level + level_span; ++level) {
          for (var row = module_row; row < module_row + row_span; ++row) {
            for (var col = module_col; col < module_col + col_span; ++col) {
              var covered_item = {
                "col" : col,
                "row" : row,
                "level" : level
              }
              var covered_location_name =
                SDL.VehicleModuleCoverageController.getLocationName(covered_item);
              mapping[covered_location_name] = covering_module_name;
            }
          }
        }
      });

      this.moduleModelsMapping[module_type] = mapping;
    },

    /**
     * @function getCoveringModuleKey
     * @description Function for getting covering module key by specified
     * module type + actual seat key
     * @param {String} module_type
     * @param {String} location_name specifies the location of a space in
     * the format "L<level>R<row>C<col>"
     * @returns covering module key
     */
    getCoveringModuleKey: function(module_type, location_name) {
      var mapping = this.moduleModelsMapping[module_type];
      return mapping[location_name];
    },

    /**
     * @function getCoveringModuleModel
     * @description Function for getting module model by specified module
     * type + actual seat key
     * @param {String} module_type
     * @param {String} location_name specifies the location of a space in
     * the format "L<level>R<row>C<col>"
     */
    getCoveringModuleModel: function(module_type, location_name) {
      var covering_module_key = this.getCoveringModuleKey(module_type, location_name);
      switch (module_type) {
        case 'CLIMATE': return this.climateModels[covering_module_key];
        case 'RADIO': return this.radioModels[covering_module_key];
        case 'SEAT': return this.seatModels[covering_module_key];
        case 'AUDIO': return this.audioModels[covering_module_key];
        case 'LIGHT': return this.lightModels[covering_module_key];
        case 'HMI_SETTINGS': return this.hmiSettingsModels[covering_module_key];
      }
      return null;
    },

    /**
     * @function generateUUID
     * @description Function for generate UUID key
     * @returns module ID string
     */
    generateUUID: function(input, offset) {
      var shift = 0;
      var generateSymbol = function(character) {
        var charCode = 0;
        for(i =0; i < input.length; ++i){
          charCode   += input.charCodeAt(i) + shift;
          shift += offset;
        }
        shift = shift >=100 ? 0 : shift;
        if(charCode >= 100) {
            var temp = charCode.toString();
            temp = temp.slice(1,temp.length);
            charCode = parseInt(temp);
        }

        charCode = charCode/100;
        var r = charCode * 16 | 0, v = character == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }
      return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, generateSymbol);
    },

    /**
     * @function populateModels
     * @description Function for creation of models and assigning them to
     * responsible modules according to coverage settings
     */
    populateModels: function() {
        this.resetToDefault();
        var vehicleRepresentation =
        SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
        if('no_emulation' == FLAGS.VehicleEmulationType) {
          var emulationType = FLAGS.VehicleEmulationType;

          this.set('climateModels.' + emulationType, this.currentClimateModel);
          this.set('radioModels.' + emulationType, this.currentRadioModel);
          this.set('seatModels.' + emulationType, this.currentSeatModel);
          this.set('audioModels.' + emulationType, this.currentAudioModel);
          this.set('lightModels.' + emulationType, this.currentLightModel);
          this.set('hmiSettingsModels.' + emulationType, this.currentHMISettingsModel);

          this.currentClimateModel.generateClimateCapabilities();
          this.currentAudioModel.generateAudioCapabilities();
          this.currentHMISettingsModel.generateHMISettingsCapabilities();
          this.currentLightModel.generateLightCapabilities();
          this.currentSeatModel.generateSeatCapabilities();
          this.currentHMISettingsModel.generateHMISettingsCapabilities();
          this.currentRadioModel.generateRadioControlCapabilities();
          delete SDL.remoteControlCapabilities.seatLocationCapability;
          SDL.remoteControlCapabilities.remoteControlCapability['buttonCapabilities'] = SDL.defaultButtonCapabilities;
          this.fillModuleSeatLocationContent([]);
          this.fillSeatLocationCapabilities(vehicleRepresentation);
          return;
        }

        var seatLocationNames = [];
        vehicleRepresentation.forEach(seat_location => {
          var location_name =
            SDL.VehicleModuleCoverageController.getLocationName(seat_location);
          seatLocationNames.push(location_name);
        });

        var self = this;
        var coverageSettings = SDL.VehicleModuleCoverageController.getCoverageSettings();
        Object.keys(coverageSettings).forEach(module_type => {

          self.moduleUUIDMapping[module_type] = {};
          vehicleRepresentation.forEach(function(seat_location, index) {
            var location_name =  SDL.VehicleModuleCoverageController.getLocationName(seat_location);
            self.moduleUUIDMapping[module_type][location_name] =
              self.generateUUID(location_name, index + 1);
          });

          var module_coverage = coverageSettings[module_type];
          switch (module_type) {
            case 'CLIMATE': {
              module_coverage.forEach(module_service_area => {
                var location_name = SDL.VehicleModuleCoverageController.getLocationName(module_service_area);
                self.set('climateModels.' + location_name, SDL.ClimateControlModel.create({
                  ID: location_name,
                  UUID: this.moduleUUIDMapping[module_type][location_name]
                }));
                self.climateModels[location_name].generateClimateCapabilities(module_service_area);
                self.fillButtonCapabilitiesContent(self.climateModels[location_name], module_type, module_service_area);
              });
              break;
            }
            case 'RADIO': {
              module_coverage.forEach(module_service_area => {
                var location_name = SDL.VehicleModuleCoverageController.getLocationName(module_service_area);
                self.set('radioModels.' + location_name, SDL.RadioModel.create({
                  ID: location_name,
                  UUID: this.moduleUUIDMapping[module_type][location_name]}
                ));
                self.radioModels[location_name].generateRadioControlCapabilities(module_service_area);
                self.fillButtonCapabilitiesContent(self.radioModels[location_name], module_type, module_service_area);
              });
              break;
            }
            case 'SEAT': {
              let seatUUIDs = [];
              module_coverage.forEach(module_service_area => {
                var location_name = SDL.VehicleModuleCoverageController.getLocationName(module_service_area);
                self.set('seatModels.' + location_name, SDL.SeatModel.create({
                  ID: location_name,
                  UUID: this.moduleUUIDMapping[module_type][location_name]}
                ));
                self.seatModels[location_name].generateSeatCapabilities(module_service_area);
                seatUUIDs.push(this.moduleUUIDMapping[module_type][location_name]);
              });
              SDL.SeatView.id.seatModuleUUID.set('content', seatUUIDs);
              break;
            }
            case 'AUDIO': {
              module_coverage.forEach(module_service_area => {
                var location_name = SDL.VehicleModuleCoverageController.getLocationName(module_service_area);
                self.set('audioModels.' + location_name, SDL.AudioModel.create({
                  ID: location_name,
                  UUID: this.moduleUUIDMapping[module_type][location_name]}
                ));
                this.audioModels[location_name].generateAudioCapabilities(module_service_area);
              });
              break;
            }
            case 'LIGHT': {
              module_coverage.forEach(module_service_area => {
                var location_name = SDL.VehicleModuleCoverageController.getLocationName(module_service_area);
                self.set('lightModels.' + location_name, SDL.LightModel.create({
                  ID: location_name,
                  UUID: this.moduleUUIDMapping[module_type][location_name]}
                ));
                self.lightModels[location_name].generateLightCapabilities(module_service_area);
              });
              break;
            }
            case 'HMI_SETTINGS': {
              module_coverage.forEach(module_service_area => {
                var location_name = SDL.VehicleModuleCoverageController.getLocationName(module_service_area);
                self.set('hmiSettingsModels.' + location_name, SDL.HmiSettingsModel.create({
                  ID: location_name,
                  UUID: this.moduleUUIDMapping[module_type][location_name]}
                ));
                self.hmiSettingsModels[location_name].generateHMISettingsCapabilities(module_service_area);
              });
              break;
            }
          }
          self.fillModuleModelsMapping(module_type, module_coverage);
        });

        this.fillModuleSeatLocationContent(seatLocationNames);
        this.fillSeatLocationCapabilities(vehicleRepresentation);
        this.updateCurrentModels(seatLocationNames[0]);
    },

    /**
     * @function fillButtonCapabilitiesContent
     * @description Function to fill button capabilities
     * @param {Object} model
     * @param {String} module_type
     * @param {Object} module_service_area
     */
    fillButtonCapabilitiesContent: function(model, module_type, module_service_area) {
      var location_name = SDL.VehicleModuleCoverageController.getLocationName(module_service_area);
      var moduleUUID = this.moduleUUIDMapping[module_type][location_name];
      var moduleInfo = {
        'allowMultipleAccess': true,
        'moduleId': moduleUUID,
        'serviceArea': SDL.deepCopy(module_service_area),
        'location': SDL.deepCopy(module_service_area),
      };

      moduleInfo.location['colspan'] = 1;
      moduleInfo.location['rowspan'] = 1;
      moduleInfo.location['levelspan'] = 1;

      var button_capabilities = model.getButtonCapabilities();
      button_capabilities.forEach(element => {
        element['moduleInfo'] = moduleInfo;
      });

      SDL.remoteControlCapabilities.remoteControlCapability['buttonCapabilities'] =
        SDL.remoteControlCapabilities.remoteControlCapability['buttonCapabilities']
          .concat(button_capabilities);
      var buttonCapabilitiesLength = SDL.remoteControlCapabilities.remoteControlCapability.buttonCapabilities.length;
      if(100 <= buttonCapabilitiesLength) {
        SDL.remoteControlCapabilities.remoteControlCapability.buttonCapabilities.length = 100;
      }
    },

    /**
     * @function getUserFriendlyLocationName
     * @description Converts module name into the human readable module name
     * @param {String} location_name
     * @returns human readable module name
     */
    getUserFriendlyLocationName: function(location_name) {
      return location_name.replace('L', 'Level ')
                        .replace('R', ', Row ')
                        .replace('C', ', Col ');
    },

    /**
     * @function fillModuleSeatLocationContent
     * @description Function to generate user friendly names for a specified
     * strings in array and fill combobox with seat locations
     * @param {Array} seat_location_names
     */
    fillModuleSeatLocationContent: function(seat_location_names) {
      if (1 >= seat_location_names.length) {
        SDL.ControlButtons.RCInfo.RCModules.set('content', seat_location_names);
        return;
      }

      var user_friendly_content = [];
      var mapping = {};
      seat_location_names.forEach(seat_location_name => {
        var new_name = this.getUserFriendlyLocationName(seat_location_name);
        user_friendly_content.push(new_name);
        mapping[seat_location_name] = new_name;
      });

      this.set('seatKeyLabelMapping', mapping);
      SDL.ControlButtons.RCInfo.RCModules.set('content', user_friendly_content);
    },

    /**
     * @function updateModuleSeatLocationContent
     * @description Function to update existing seat location names according to
     * amount of registered applications and their userLocation
     */
    updateModuleSeatLocationContent: function() {
      if (1 >= Object.keys(this.seatKeyLabelMapping).length) {
        return;
      }

      var vehicle_representation =
        SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
      var driver_location = vehicle_representation[0];
      var module_apps_mapping = {};

      Object.keys(this.seatKeyLabelMapping).forEach(
        location_name => {
          module_apps_mapping[location_name] = 0;
      });

      SDL.SDLModel.data.registeredApps.forEach(app => {
        var app_user_location = driver_location;
        if (app.userLocation) {
          app_user_location = app.userLocation;
        }

        var location_name =
          SDL.VehicleModuleCoverageController.getLocationName(app_user_location);
        module_apps_mapping[location_name]++;
      });

      var new_content = []
      Object.keys(this.seatKeyLabelMapping).forEach(
        location_name => {
          var new_name = this.getUserFriendlyLocationName(location_name);
          if (module_apps_mapping[location_name] > 0) {
            new_name = "[" + module_apps_mapping[location_name] + "] " + new_name;
          }
          this.seatKeyLabelMapping[location_name] = new_name;
          new_content.push(new_name);
      });

      SDL.ControlButtons.RCInfo.RCModules.set('content', new_content);
    },

    /**
     * @function fillSeatLocationCapabilities
     * @description Function to generate seat locations capabilities
     * @param {Array} seat_locations
     */
    fillSeatLocationCapabilities: function(seat_locations) {
      var seat_location_capability = {};

      var max_col_index =
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(seat_locations, 'col');
      seat_location_capability['columns'] =
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          seat_locations[max_col_index], 'col') + 1;

      var max_row_index =
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(seat_locations, 'row');
      seat_location_capability['rows'] =
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          seat_locations[max_row_index], 'row') + 1;

      var max_level_index =
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(seat_locations, 'level');
      seat_location_capability['levels'] =
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          seat_locations[max_level_index], 'level') + 1;

      seat_location_capability['seats'] = [];
      seat_locations.forEach(seat => {
        seat_location_capability.seats.push(
          {
            'grid': seat
          }
        );
      });

      SDL.remoteControlCapabilities.seatLocationCapability = seat_location_capability;
    },

    /**
     * @function currentSeatModuleID
     * @description callback to get current module id name for Seat View
     */
    currentSeatModuleID: function() {
      var moduleGuid = SDL.RCModulesController.currentSeatModel.UUID ?
      SDL.RCModulesController.currentSeatModel.UUID : 'DRIVER';
      return moduleGuid;
    }.property('SDL.RCModulesController.currentSeatModel.UUID'),

    /**
     * @function currentLightModuleID
     * @description callback to get current module id name for Light View
     */
    currentLightModuleID: function() {
      var moduleGuid = SDL.RCModulesController.currentLightModel.UUID ?
      SDL.RCModulesController.currentLightModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentLightModel.UUID'),

    /**
     * @function currentHmiSettingsModuleID
     * @description callback to get current module id name for HMI Settings View
     */
    currentHmiSettingsModuleID: function() {
      var moduleGuid = SDL.RCModulesController.currentHMISettingsModel.UUID ?
      SDL.RCModulesController.currentHMISettingsModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentHMISettingsModel.UUID'),

    /**
     * @function currentClimateModuleID
     * @description callback to get current module id name for Climate View
     */
    currentClimateModuleID: function() {
      var moduleGuid = SDL.RCModulesController.currentClimateModel.UUID ?
      SDL.RCModulesController.currentClimateModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentClimateModel.UUID'),

    /**
     * @function currentAudioModuleID
     * @description callback to get current module id name for Audio Views
     */
    currentAudioModuleID: function() {
      var moduleGuid = SDL.RCModulesController.currentAudioModel.UUID ?
      SDL.RCModulesController.currentAudioModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentAudioModel.UUID'),

    /**
     * @function currentRadioModuleID
     * @description callback to get current module id name for Radio View
     */
    currentRadioModuleID: function() {
      var moduleGuid = SDL.RCModulesController.currentRadioModel.UUID ?
      SDL.RCModulesController.currentRadioModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentRadioModel.UUID'),

    /**
     * @function changeCurrentModule
     * @description Function invoked when user changes a seat zone
     * @param {String} user_friendly_key
     */
    changeCurrentModule: function(user_friendly_key) {
      Object.keys(this.seatKeyLabelMapping).forEach(
        location_name => {
          var value = this.seatKeyLabelMapping[location_name];
          if (value == user_friendly_key) {
            this.updateCurrentModels(location_name);
          }
      });
    },

    /**
     * @function updateCurrentModels
     * @description Function to update current models according to a newly
     * selected module
     * @param {String} module_key
     */
    updateCurrentModels: function(location_name) {
        this.set('currentClimateModel', this.getCoveringModuleModel('CLIMATE', location_name));
        this.set('currentAudioModel', this.getCoveringModuleModel('AUDIO', location_name));
        this.set('currentRadioModel', this.getCoveringModuleModel('RADIO', location_name));
        this.set('currentHMISettingsModel', this.getCoveringModuleModel('HMI_SETTINGS', location_name));
        this.set('currentLightModel', this.getCoveringModuleModel('LIGHT', location_name));

        SDL.SeatView.id.seatModuleUUID.set('value', this.moduleUUIDMapping['SEAT'][location_name]);
        SDL.SeatView.id.seatModuleUUID.trigger('change');

        this.currentRadioModel.update();
        this.currentAudioModel.update();
        this.currentHMISettingsModel.update();
    },

    /**
     * @function action
     * @description Function used to do specified action in specified model
     * @param {Event} event
     */
    action: function(event) {
        this[event.model][event.method](event);
    },

    /**
     * @function setInteriorVehicleData
     * @param {Object} data
     * @description Set data from mobile request by moduleId
     */
    setInteriorVehicleData: function(data) {
        var moduleUUId = data.params.moduleData.moduleId;
        var moduleType = data.params.moduleData.moduleType;

        var location_name = null;
        if (this.moduleUUIDMapping.hasOwnProperty(moduleType)) {
          for(key in this.moduleUUIDMapping[moduleType]) {
            if(moduleUUId === this.moduleUUIDMapping[moduleType][key]) {
              location_name = key;
            }
          }
        }

        if('no_emulation' == FLAGS.VehicleEmulationType) {
          location_name = FLAGS.VehicleEmulationType;
        }

        var dataToReturn = {};
        switch (moduleType) {
            case 'RADIO':
            {
                if (data.params.moduleData.radioControlData) {
                    if (data.params.moduleData.radioControlData.radioEnable == undefined
                        && this.radioModels[location_name].radioControlStruct.radioEnable == false) {
                        FFW.RC.sendError(
                        SDL.SDLModel.data.resultCode.IGNORED,
                        data.id, data.method,
                        'Radio module must be activated.'
                        );
                        return;
                    }
                    if(data.params.moduleData.radioControlData.hdChannel !== undefined
                      && data.params.moduleData.radioControlData.hdRadioEnable == undefined
                       && this.radioModels[location_name].radioControlStruct.hdRadioEnable == false) {
                        FFW.RC.sendError(
                         SDL.SDLModel.data.resultCode.UNSUPPORTED_RESOURCE,
                         data.id, data.method,
                         'HD Radio module does not supported.'
                       );
                       return;
                    }
                    var result = this.radioModels[location_name].checkRadioFrequencyBoundaries(
                        data.params.moduleData.radioControlData
                    );
                    if (!result.success) {
                        FFW.RC.sendError(
                        SDL.SDLModel.data.resultCode.INVALID_DATA,
                        data.id, data.method,
                        result.info
                        );
                        return;
                    }
                }

                if (data.params.moduleData.radioControlData) {
                    if(data.params.moduleData.radioControlData.band &&
                        data.params.moduleData.radioControlData.band == 'DAB'){
                        FFW.RC.sendError(
                            SDL.SDLModel.data.resultCode.UNSUPPORTED_RESOURCE,
                            data.id, data.method,'DAB not supported'
                        );
                        return;
                    } else {
                        var radioControlData =
                            this.radioModels[location_name].setRadioData(
                            data.params.moduleData.radioControlData);
                        if (this.radioModels[location_name].radioControlStruct.radioEnable) {
                            this.radioModels[location_name].saveCurrentOptions();
                        }
                        if (Object.keys(radioControlData).length > 0) {
                            FFW.RC.onInteriorVehicleDataNotification({moduleType:'RADIO', moduleId: moduleUUId,
                                                                    radioControlData: radioControlData});
                        }
                        dataToReturn.radioControlData = radioControlData;
                    }
                }
                break;
            }
            case 'CLIMATE':
            {
                if (data.params.moduleData.climateControlData) {
                    var currentClimateState =
                      this.climateModels[location_name].getClimateControlData().climateEnable;
                    var requestedClimateState =
                      data.params.moduleData.climateControlData.climateEnable;
                    if(!currentClimateState) {
                      if(requestedClimateState === undefined) {
                        FFW.RC.sendError(
                          SDL.SDLModel.data.resultCode.REJECTED,
                          data.id, data.method,
                          'Climate Control is disable. Turn Climate on.'
                        );
                        return;
                      } else if(requestedClimateState === false) {
                        FFW.RC.sendError(
                          SDL.SDLModel.data.resultCode.REJECTED,
                          data.id, data.method,
                          'Climate Control is disabled already.'
                        );
                        return;
                      }
                    }
                    var climateControlData =
                        this.climateModels[location_name].setClimateData(
                        data.params.moduleData.climateControlData);
                    if (Object.keys(data.params.moduleData.climateControlData).length > 0) {
                        FFW.RC.onInteriorVehicleDataNotification({moduleType:'CLIMATE', moduleId: moduleUUId,
                                                                climateControlData: climateControlData});
                    }
                    dataToReturn.climateControlData = climateControlData;
                }
                break;
            }
            case 'AUDIO':
            {
                if(data.params.moduleData.audioControlData){
                    if(data.params.moduleData.audioControlData.source &&
                      data.params.moduleData.audioControlData.source == 'DAB'){
                        FFW.RC.sendError(
                          SDL.SDLModel.data.resultCode.UNSUPPORTED_RESOURCE,
                          data.id, data.method,'DAB not supported'
                        );
                        return;
                    } else {
                        var audioControlData = (data.params.moduleData.audioControlData.keepContext!=null) ?
                        this.audioModels[location_name].setAudioControlDataWithKeepContext(data.params.moduleData.audioControlData, location_name) :
                        this.audioModels[location_name].setAudioControlData(data.params.moduleData.audioControlData, location_name);
                        if (Object.keys(data.params.moduleData.audioControlData).length > 0) {
                            FFW.RC.onInteriorVehicleDataNotification({moduleType:'AUDIO', moduleId: moduleUUId,
                                                                    audioControlData: audioControlData});
                        }
                        if(data.params.moduleData.audioControlData.source === 'MOBILE_APP') {
                          FFW.RC.OnIVDNotificationWasSent = true;
                        }
                        dataToReturn.audioControlData = audioControlData;
                    }
                }
                break;
            }
            case 'HMI_SETTINGS':
            {
                if(data.params.moduleData.hmiSettingsControlData){
                    var hmiSettingsControlData = this.hmiSettingsModels[location_name].setHmiSettingsData(
                      data.params.moduleData.hmiSettingsControlData);
                    if (Object.keys(data.params.moduleData.hmiSettingsControlData).length > 0) {
                    FFW.RC.onInteriorVehicleDataNotification({moduleType:'HMI_SETTINGS', moduleId: moduleUUId,
                                                                hmiSettingsControlData: hmiSettingsControlData});
                    }
                    dataToReturn.hmiSettingsControlData = hmiSettingsControlData;
                }
                break;
            }
            case 'LIGHT':
            {
                if(data.params.moduleData.lightControlData){
                    var lightControlData = this.lightModels[location_name].setLightControlData(
                      data.params.moduleData.lightControlData);

                    if (Object.keys(lightControlData).length > 0) {
                    FFW.RC.onInteriorVehicleDataNotification({moduleType:'LIGHT', moduleId: moduleUUId,
                                                                lightControlData: data.params.moduleData.lightControlData});
                    }
                    dataToReturn.lightControlData = lightControlData;
                }
                break;
            }
            case 'SEAT':
            {
                if(data.params.moduleData.seatControlData){
                    var seatControlData = this.seatModels[location_name].setSeatControlData(
                    data.params.moduleData.seatControlData);
                    if (Object.keys(data.params.moduleData.seatControlData).length > 0) {
                    FFW.RC.onInteriorVehicleDataNotification({moduleType:'SEAT', moduleId: moduleUUId,
                                                                seatControlData: seatControlData});
                    }
                    dataToReturn.seatControlData = seatControlData;
                }
            }
        }
        return dataToReturn;
    },

    /**
     * @function getInteriorVehicleData
     * @param {Object} data
     * @description get data by moduleId and moduleType
     */
    getInteriorVehicleData: function(data) {
        var moduleUUId = data.params.moduleId;
        var moduleType = data.params.moduleType;

        var location_name = null;
        if (this.moduleUUIDMapping.hasOwnProperty(moduleType)) {
          for(key in this.moduleUUIDMapping[moduleType]) {
            if(moduleUUId === this.moduleUUIDMapping[moduleType][key]) {
              location_name = key;
            }
          }
        }

        if('no_emulation' == FLAGS.VehicleEmulationType) {
          location_name = FLAGS.VehicleEmulationType;
        }

        var dataToReturn = {};
        switch(moduleType){
          case 'CLIMATE':{
            dataToReturn.climateControlData = this.climateModels[location_name].getClimateControlData();
            break
          }
          case 'RADIO':{
            dataToReturn.radioControlData = this.radioModels[location_name].getRadioControlData(false);
            break
          }
          case 'HMI_SETTINGS':{
            dataToReturn.hmiSettingsControlData = this.hmiSettingsModels[location_name].getHmiSettingsControlData(false);
            break
          }
          case 'AUDIO':{
            dataToReturn.audioControlData = this.audioModels[location_name].getAudioControlData(false);
            break;
          }
          case 'LIGHT':{
            dataToReturn.lightControlData = this.lightModels[location_name].getLightControlData(false);
            break
          }
          case 'SEAT':{
            dataToReturn.seatControlData = this.seatModels[location_name].getSeatControlData(false);
            break
          }
        }
        return dataToReturn;
    }
})
