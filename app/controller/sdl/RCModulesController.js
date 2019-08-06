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
     * @name moduleIDMapping
     * @type {Map}
     * @description Mapping module ID with driver and front passenger seat
     */
    moduleIDMapping: {},

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
      this.set('moduleIDMapping', {});
      this.set('moduleUUIDMapping', {});
      this.set('seatKeyLabelMapping', {});
      this.init();
    },
    /**
     * @description Function for generating a coverage according to specified
     * settings and saving into the moduleModelsMapping  
     * @param {String} module_type
     * @param {Array} module_coverage 
     */
    fillModuleModelsMapping: function(module_type, module_coverage) {
      var mapping = {};

      module_coverage.forEach(module => {
        // These fields are not mandatory according to API so should be checked
        var module_level = module.hasOwnProperty('level') ? module.level : 0;
        var module_row = module.row;
        var module_col = module.col;

        var covering_module_name = SDL.VehicleModuleCoverageController.getModuleKeyName({
          "col": module_col,
          "row": module_row,
          "level": module_level
        });

        var level_span = module.hasOwnProperty('levelspan') ? module.levelspan : 1;
        var row_span = module.hasOwnProperty('rowspan') ? module.rowspan : 1;
        var col_span = module.hasOwnProperty('colspan') ? module.colspan : 1;
        
        for (var level = module_level; level < module_level + level_span; ++level) {
          for (var row = module_row; row < module_row + row_span; ++row) {
            for (var col = module_col; col < module_col + col_span; ++col) {
              var covered_item = {
                "col" : col,
                "row" : row,
                "level" : level
              }
              var covered_module_name = 
                SDL.VehicleModuleCoverageController.getModuleKeyName(covered_item);
              mapping[covered_module_name] = covering_module_name;              
            }
          }
        }
      });

      this.moduleModelsMapping[module_type] = mapping;
    }, 
    
    /**
     * @description Function for getting covering module key by specified
     * module type + actual seat key
     * @param {String} module_type 
     * @param {String} module_key
     * @returns covering module key 
     */
    getCoveringModuleKey: function(module_type, module_key) {
      var mapping = this.moduleModelsMapping[module_type];
      return mapping[module_key];
    },

    /**
     * @description Function for getting module model by specified module
     * type + actual seat key
     * @param {String} module_type 
     * @param {String} module_key 
     */
    getCoveringModuleModel: function(module_type, module_key) {
      var covering_module_key = this.getCoveringModuleKey(module_type, module_key);
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
     * @returns {Number}
     * @description Function for generate UUID key
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
     * @description Function for creation of models and assigning them to
     * responsible modules according to coverage settings
     */
    populateModels: function() {
      this.resetToDefault();

        if('no_emulation' == FLAGS.VehicleEmulationType) {
          var moduleId = FLAGS.VehicleEmulationType;

          this.set('climateModels.' + moduleId, this.currentClimateModel);
          this.set('radioModels.' + moduleId, this.currentRadioModel);
          this.set('seatModels.' + moduleId, this.currentSeatModel);
          this.set('audioModels.' + moduleId, this.currentAudioModel);
          this.set('lightModels.' + moduleId, this.currentLightModel);
          this.set('hmiSettingsModels.' + moduleId, this.currentHMISettingsModel);

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
          return;
        }
        var vehicleRepresentation = 
            SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
        
        var contentBinding = [];
        vehicleRepresentation.forEach(function(element, index) {
          var moduleKeyName =  SDL.VehicleModuleCoverageController.getModuleKeyName(element);
          contentBinding.push(moduleKeyName);
        });

        var self = this;
        var coverageSettings = SDL.VehicleModuleCoverageController.getCoverageSettings();
        Object.keys(coverageSettings).forEach(module_type => {

          self.moduleUUIDMapping[module_type] = {};
          vehicleRepresentation.forEach(function(element, index) {
            var moduleKeyName =  SDL.VehicleModuleCoverageController.getModuleKeyName(element);
            self.moduleUUIDMapping[module_type][moduleKeyName] = 
              self.generateUUID(moduleKeyName, index + 1);
          });

          var module_coverage = coverageSettings[module_type];
          switch (module_type) {
            case 'CLIMATE': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('climateModels.' + key_name, SDL.ClimateControlModel.create({
                  ID: key_name,
                  UUID: this.moduleUUIDMapping[module_type][key_name]
                }));
                self.climateModels[key_name].generateClimateCapabilities(module);
                self.fillButtonCapabilitiesContent(self.climateModels[key_name], module_type, module);   
              });              
              break;
            }
            case 'RADIO': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('radioModels.' + key_name, SDL.RadioModel.create({
                  ID: key_name, 
                  UUID: this.moduleUUIDMapping[module_type][key_name]}
                )); 
                self.radioModels[key_name].generateRadioControlCapabilities(module);
                self.fillButtonCapabilitiesContent(self.radioModels[key_name], module_type, module);        
              });
              break;
            }
            case 'SEAT': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('seatModels.' + key_name, SDL.SeatModel.create({
                  ID: key_name, 
                  UUID: this.moduleUUIDMapping[module_type][key_name]}
                ));
                self.seatModels[key_name].generateSeatCapabilities(module);
              });
              break;    
            }
            case 'AUDIO': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('audioModels.' + key_name, SDL.AudioModel.create({
                  ID: key_name, 
                  UUID: this.moduleUUIDMapping[module_type][key_name]}
                ));   
                this.audioModels[key_name].generateAudioCapabilities(module);
              });              
              break;   
            }
            case 'LIGHT': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('lightModels.' + key_name, SDL.LightModel.create({
                  ID: key_name, 
                  UUID: this.moduleUUIDMapping[module_type][key_name]}
                ));
                self.lightModels[key_name].generateLightCapabilities(module);  
              });
              break;
            }
            case 'HMI_SETTINGS': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('hmiSettingsModels.' + key_name, SDL.HmiSettingsModel.create({
                  ID: key_name, 
                  UUID: this.moduleUUIDMapping[module_type][key_name]}
                ));
                self.hmiSettingsModels[key_name].generateHMISettingsCapabilities(module);   
              });
              break;
            }
          }
          self.fillModuleModelsMapping(module_type, module_coverage);
        });

        this.fillModuleSeatLocationContent(contentBinding);
        this.fillSeatLocationCapabilities(vehicleRepresentation);
        this.fillModuleIDMapping(vehicleRepresentation);

        this.updateCurrentModels(contentBinding[0]);
    },

    /**
     * @function fillModuleIDMapping
     * @param {Array} representation
     * @description function to generate driver and 
     * front passenger seat mapping model by moduleId
     */
    fillModuleIDMapping: function(representation) {
      var max_col_index = SDL.VehicleModuleCoverageController.getVehicleMaxIndex(representation, 'col');
      var max_col_value = SDL.VehicleModuleCoverageController.getVehicleItemValue(representation[max_col_index], 'col');
      representation.forEach(element => {
        if(0 == element.row && 0 == element.col) {
          var driver_key = SDL.VehicleModuleCoverageController.getModuleKeyName(element);
          this.moduleIDMapping[driver_key] = 'DRIVER';
        } else if(0 == element.row &&
           max_col_value == element.col &&
           0 != max_col_value) {
          var front_passenger_key = SDL.VehicleModuleCoverageController.getModuleKeyName(element);
          this.moduleIDMapping[front_passenger_key] = 'FRONT_PASSENGER';
        }        
      })
    },

    /**
     * @description Function to fill button capabilities
     * @param {Object} model
     * @param {Object} module 
     */
    fillButtonCapabilitiesContent: function(model, type, module) {
      var moduleKeyName = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
      var moduleUUID = this.moduleUUIDMapping[type][moduleKeyName];
      var moduleInfo = {
        'allowMultipleAccess': true,
        'moduleId': moduleUUID,
        'serviceArea': SDL.deepCopy(module),
        'location': SDL.deepCopy(module),
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
     * Converts module name into the human readable module name
     * @param {String} module_name
     * @returns human readable module name 
     */
    getUserFriendlyModuleName: function(module_name) {
      return module_name.replace('L', 'Level ')
                        .replace('R', ', Row ')
                        .replace('C', ', Col ');
    },

    /**
     * @description Function to generate user friendly names for a specified
     * strings in array and fill combobox with seat locations
     * @param {Array} content_binding 
     */
    fillModuleSeatLocationContent: function(content_binding) {
      if (1 >= content_binding.length) {
        SDL.ControlButtons.RCInfo.RCModules.set('content', content_binding);
        return;
      }

      var user_friendly_content = [];
      var mapping = {};
      content_binding.forEach(element => {
        var new_name = this.getUserFriendlyModuleName(element);
        user_friendly_content.push(new_name);
        mapping[element] = new_name;        
      });
      
      this.set('seatKeyLabelMapping', mapping);
      SDL.ControlButtons.RCInfo.RCModules.set('content', user_friendly_content);
    },

    /**
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
        key => {
          module_apps_mapping[key] = 0;
      });

      SDL.SDLModel.data.registeredApps.forEach(app => {
        var app_user_location = driver_location;
        if (app.userLocation) {
          app_user_location = app.userLocation;  
        }

        var module_name =
          SDL.VehicleModuleCoverageController.getModuleKeyName(app_user_location);
        module_apps_mapping[module_name]++;
      });

      var new_content = []
      Object.keys(this.seatKeyLabelMapping).forEach(
        key => {
          var new_name = this.getUserFriendlyModuleName(key);
          if (module_apps_mapping[key] > 0) {
            new_name = "[" + module_apps_mapping[key] + "] " + new_name;
          }
          this.seatKeyLabelMapping[key] = new_name;
          new_content.push(new_name);
      });

      SDL.ControlButtons.RCInfo.RCModules.set('content', new_content);
    },

    /**
     * @description Function to generate seat locations capabilities
     * @param {Array} representation 
     */
    fillSeatLocationCapabilities: function(representation) {       
      var seat_capability = {};
      
      var max_col_index = 
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(representation, 'col');
      seat_capability['columns'] = 
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          representation[max_col_index], 'col') + 1;

      var max_row_index = 
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(representation, 'row');
      seat_capability['rows'] = 
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          representation[max_row_index], 'row') + 1;

      var max_level_index = 
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(representation, 'level');
      seat_capability['levels'] = 
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          representation[max_level_index], 'level') + 1;

      seat_capability['seats'] = [];
      representation.forEach(seat => {
        seat_capability.seats.push(
          {
            'grid': seat
          }
        );
      });

      SDL.remoteControlCapabilities.seatLocationCapability = seat_capability;
    },

    /**
     * @function getModuleCurrentId
     * @description getter for a readable module name to display on UI
     * @param {String} module_id
     */
    getModuleCurrentId: function(module_type, module_id) {      
      var moduleGuid;
      if (this.moduleUUIDMapping.hasOwnProperty(module_type)) {
        moduleGuid = this.moduleUUIDMapping[module_type][module_id];
      }      
      return moduleGuid ? moduleGuid : 'DRIVER';      
    },

    /**
     * @function getSeatCurrentID
     * @description callback to get current module id name for Seat View
     */
    getSeatCurrentID: function() {
      var moduleGuid = SDL.RCModulesController.currentSeatModel.UUID ? 
      SDL.RCModulesController.currentSeatModel.UUID : 'DRIVER';
      return moduleGuid;
    }.property('SDL.RCModulesController.currentSeatModel.UUID'),

    /**
     * @function getLightCurrentID
     * @description callback to get current module id name for Light View
     */
    getLightCurrentID: function() {
      var moduleGuid = SDL.RCModulesController.currentLightModel.UUID ? 
      SDL.RCModulesController.currentLightModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentLightModel.UUID'),

    /**
     * @function getHmiSettingsCurrentID
     * @description callback to get current module id name for HMI Settings View
     */
    getHmiSettingsCurrentID: function() {
      var moduleGuid = SDL.RCModulesController.currentHMISettingsModel.UUID ? 
      SDL.RCModulesController.currentHMISettingsModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentHMISettingsModel.UUID'),

    /**
     * @function getClimateCurrentID
     * @description callback to get current module id name for Climate View
     */
    getClimateCurrentID: function() {
      var moduleGuid = SDL.RCModulesController.currentClimateModel.UUID ? 
      SDL.RCModulesController.currentClimateModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentClimateModel.UUID'),

    /**
     * @function getAudioCurrentID
     * @description callback to get current module id name for Audio Views
     */
    getAudioCurrentID: function() {
      var moduleGuid = SDL.RCModulesController.currentAudioModel.UUID ? 
      SDL.RCModulesController.currentAudioModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentAudioModel.UUID'),

    /**
     * @function getRadioCurrentID
     * @description callback to get current module id name for Radio View
     */
    getRadioCurrentID: function() {
      var moduleGuid = SDL.RCModulesController.currentRadioModel.UUID ? 
      SDL.RCModulesController.currentRadioModel.UUID : 'DRIVER';
      return "Module ID: " + moduleGuid;
    }.property('SDL.RCModulesController.currentRadioModel.UUID'),

    /**
     * @description Function invoked when user changes a seat zone
     * @param {String} user_friendly_key 
     */
    changeCurrentModule: function(user_friendly_key) {
      Object.keys(this.seatKeyLabelMapping).forEach(
        key => {
          var value = this.seatKeyLabelMapping[key];
          if (value == user_friendly_key) {
            this.updateCurrentModels(key);
          }
      });
    },

    /**
     * @description Function to update current models according to a newly
     * selected module
     * @param {String} module_key 
     */
    updateCurrentModels: function(module_key) {
        this.set('currentClimateModel', this.getCoveringModuleModel('CLIMATE', module_key));
        this.set('currentAudioModel', this.getCoveringModuleModel('AUDIO', module_key));
        this.set('currentSeatModel', this.getCoveringModuleModel('SEAT', module_key));
        this.set('currentRadioModel', this.getCoveringModuleModel('RADIO', module_key));
        this.set('currentHMISettingsModel', this.getCoveringModuleModel('HMI_SETTINGS', module_key));
        this.set('currentLightModel', this.getCoveringModuleModel('LIGHT', module_key));

        this.currentSeatModel.update();
        this.currentRadioModel.update();
        this.currentAudioModel.update();
        this.currentHMISettingsModel.update();
    },

    /**
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

        var moduleId = null;
        if (this.moduleUUIDMapping.hasOwnProperty(moduleType)) {
          for(key in this.moduleUUIDMapping[moduleType]) {
            if(moduleUUId === this.moduleUUIDMapping[moduleType][key]) {
              moduleId = key;
            }
          }
        }
        
        if('no_emulation' == FLAGS.VehicleEmulationType) {
          moduleId = FLAGS.VehicleEmulationType;
        }
        
        var dataToReturn = {};
        switch (moduleType) {
            case 'RADIO': 
            {
                if (data.params.moduleData.radioControlData) {
                    if (data.params.moduleData.radioControlData.radioEnable == undefined
                        && this.radioModels[moduleId].radioControlStruct.radioEnable == false) {
                        FFW.RC.sendError(
                        SDL.SDLModel.data.resultCode.IGNORED,
                        data.id, data.method,
                        'Radio module must be activated.'
                        );
                        return;
                    }
                    if(data.params.moduleData.radioControlData.hdChannel !== undefined
                      && data.params.moduleData.radioControlData.hdRadioEnable == undefined
                       && this.radioModels[moduleId].radioControlStruct.hdRadioEnable == false) {
                        FFW.RC.sendError(
                         SDL.SDLModel.data.resultCode.UNSUPPORTED_RESOURCE,
                         data.id, data.method,
                         'HD Radio module does not supported.'
                       );
                       return;
                    }
                    var result = this.radioModels[moduleId].checkRadioFrequencyBoundaries(
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
                            this.radioModels[moduleId].setRadioData(
                            data.params.moduleData.radioControlData);
                        if (this.radioModels[moduleId].radioControlStruct.radioEnable) {
                            this.radioModels[moduleId].saveCurrentOptions();
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
                      this.climateModels[moduleId].getClimateControlData().climateEnable;
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
                        this.climateModels[moduleId].setClimateData(
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
                        this.audioModels[moduleId].setAudioControlDataWithKeepContext(data.params.moduleData.audioControlData, moduleId) :
                        this.audioModels[moduleId].setAudioControlData(data.params.moduleData.audioControlData, moduleId);
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
                    var hmiSettingsControlData = this.hmiSettingsModels[moduleId].setHmiSettingsData(
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
                    var lightControlData = this.lightModels[moduleId].setLightControlData(
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
                    var seatControlData = this.seatModels[moduleId].setSeatControlData(
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

        var moduleId = null;
        if (this.moduleUUIDMapping.hasOwnProperty(moduleType)) {
          for(key in this.moduleUUIDMapping[moduleType]) {
            if(moduleUUId === this.moduleUUIDMapping[moduleType][key]) {
              moduleId = key;
            }
          }
        }

        if('no_emulation' == FLAGS.VehicleEmulationType) {
          moduleId = FLAGS.VehicleEmulationType;
        }

        var dataToReturn = {};
        switch(moduleType){
          case 'CLIMATE':{
            dataToReturn.climateControlData = this.climateModels[moduleId].getClimateControlData();
            break
          }
          case 'RADIO':{
            dataToReturn.radioControlData = this.radioModels[moduleId].getRadioControlData(false);
            break
          }
          case 'HMI_SETTINGS':{
            dataToReturn.hmiSettingsControlData = this.hmiSettingsModels[moduleId].getHmiSettingsControlData(false);
            break
          }
          case 'AUDIO':{
            dataToReturn.audioControlData = this.audioModels[moduleId].getAudioControlData(false);
            break;
          }
          case 'LIGHT':{
            dataToReturn.lightControlData = this.lightModels[moduleId].getLightControlData(false);
            break
          }
          case 'SEAT':{
            dataToReturn.seatControlData = this.seatModels[moduleId].getSeatControlData(false);
            break
          }
        }
        return dataToReturn;
    },

    /**
     * @function resetData
     * @param {Object} data
     * @param {String} module_name
     * @description Method to reset data of a module after change parameters in vehicle
     * editor
     */
    resetData: function(data,module_name) {
      var parsed_data = JSON.parse(data);
      var models = this.modelsNameMapping[module_name];
      var self = this;
      var setUUID = function(moduleID, UUID) {
        self[models][moduleID].set('UUID', UUID);
        self.moduleUUIDMapping[module_name][moduleID] = UUID;
      }
      if(Array.isArray(parsed_data)) {
        for(value of parsed_data) {
          var moduleId = SDL.VehicleModuleCoverageController.getModuleKeyName(value.location);
          setUUID(moduleId, value.moduleId);
        }
        return;
      }
      var moduleId = SDL.VehicleModuleCoverageController.getModuleKeyName(parsed_data.location);
      setUUID(moduleId, parsed_data.moduleId);

    }
})
