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
 * @name SDL.VehicleModuleCoverageController
 * @desc Vehicle module coverage settings representation
 * @category View
 * @filesource app/controller/VehicleModuleCoverageController.js
 * @version 1.0
 */
SDL.VehicleModuleCoverageController = Em.Object.create({

  /**
   * @description Reference to view to work with
   * @type {Object}
   */
  targetView: null,

  /**
   * @description List of supported RC modules
   * @type {Array}
   */
  availableModules: [
    "CLIMATE",
    "RADIO",
    "SEAT",
    "AUDIO",
    "LIGHT",
    "HMI_SETTINGS"
  ],

  /**
   * @description Map of modules and their coverage settings
   * @type {Map}
   */
  coverageSettings: {},

  /**
   * @description Map of saved coverage settings from coverageSettings per
   * each vehicle
   * @type {Map}
   */
  savedCoverageSettings: {},

  /**
   * @description Map of initial settings for each emulation type
   * @type {Map}
   */
  defaultCoverageSettings: {},
  
  /**
   * @description Function for controller initialization
   */
  init: function() {
    this.set('targetView', SDL.VehicleModuleCoverageView);    
  },

  /**
   * @description Function for loading saved coverage settings for a chosen
   * vehicle. If there is no saved settings, default settings will be generated
   */
  loadSavedCoverageSettings: function() {
    var emulation_type = FLAGS.VehicleEmulationType;
    if (this.savedCoverageSettings.hasOwnProperty(emulation_type)) {
      this.set('coverageSettings', 
        SDL.deepCopy(this.savedCoverageSettings[emulation_type])
      ); 
      return;
    }

    var currentSeatsData = SDL.SDLModelData.vehicleSeatRepresentation[emulation_type];
    var default_settings = {};

    this.availableModules.forEach(module => {
      if ('SEAT' == module) {
        default_settings[module] = SDL.deepCopy(currentSeatsData);
        return;
      }

      if ('CLIMATE' == module) {
        default_settings[module] = this.createDriverPassangerCoverage(currentSeatsData);
        return;
      }

      default_settings[module] = this.createFullCoverage(currentSeatsData);      
    });

    this.set('coverageSettings', SDL.deepCopy(default_settings));
  },

  /**
   * @description Function to generate a single module which covers all vehicle
   * seats
   * @param {Array} data 
   */
  createFullCoverage: function(data) {
    var coverage_element = SDL.deepCopy(data[0]);

    var max_col_index = this.getVehicleMaxIndex(data, 'col');
    var max_col_value = this.getVehicleItemValue(data[max_col_index], 'col');
    coverage_element['colspan'] = max_col_value + 1;

    var max_row_index = this.getVehicleMaxIndex(data, 'row');
    var max_row_value = this.getVehicleItemValue(data[max_row_index], 'row');
    coverage_element['rowspan'] = max_row_value + 1;

    var max_level_index = this.getVehicleMaxIndex(data, 'level');
    var max_level_value = this.getVehicleItemValue(data[max_level_index], 'level');
    coverage_element['levelspan'] = max_level_value + 1;

    return [coverage_element];
  },

  /**
   * @description Function to generate two modules which cover all vehicle seats
   * @param {Array} data 
   */
  createDriverPassangerCoverage: function(data) {
    var full_seat_module = SDL.deepCopy(data[0]);
    
    var max_row_index = this.getVehicleMaxIndex(data, 'row');
    var max_row_value = this.getVehicleItemValue(data[max_row_index], 'row');    
    full_seat_module['rowspan'] = max_row_value + 1;

    var max_col_index = this.getVehicleMaxIndex(data, 'col');
    var max_col_value = this.getVehicleItemValue(data[max_col_index], 'col');
    full_seat_module['colspan'] = max_col_value + 1;
    
    var max_level_index = this.getVehicleMaxIndex(data, 'level');
    var max_level_value = this.getVehicleItemValue(data[max_level_index], 'level');
    full_seat_module['levelspan'] = max_level_value + 1;

    var driver_seat_module = SDL.deepCopy(full_seat_module);
    driver_seat_module['colspan'] --;

    var passanger_seat_module = SDL.deepCopy(full_seat_module);
    passanger_seat_module['col'] = max_col_value;
    passanger_seat_module['colspan'] = 1;

    return [
      driver_seat_module,
      passanger_seat_module
    ];
  },

  /**
   * @description Function for saving current coverage settings into the map
   */
  saveCoverageSettings: function() {
    var emulation_type = FLAGS.VehicleEmulationType;
    this.savedCoverageSettings[emulation_type] = SDL.deepCopy(this.coverageSettings);
  },

  /**
   * @description Function to reset current coverage settings and set them to
   * default ones
   */
  resetCoverageSettings: function() {
    var emulation_type = FLAGS.VehicleEmulationType;
    if (this.savedCoverageSettings.hasOwnProperty(emulation_type)) {
      delete this.savedCoverageSettings[emulation_type];
    }
    this.set('coverageSettings', 
      SDL.deepCopy(this.defaultCoverageSettings[emulation_type])
    );
    this.showModuleCoverage();
  },

  /**
   * @description Function to get current coverage settings. If no settings
   * were set, default will be generated
   * @returns current coverage settings for the chosen vehicle
   */
  getCoverageSettings: function() {
    var emulation_type = FLAGS.VehicleEmulationType;
    if (this.savedCoverageSettings.hasOwnProperty(emulation_type)) {
      var saved_settings = this.savedCoverageSettings[emulation_type];
      var service_areas = {};
      Object.keys(saved_settings).forEach(module => {
        service_areas[module] = this.extractModulesCoverage(saved_settings[module]);
      });
      return service_areas;
    }

    this.loadSavedCoverageSettings();
    return this.coverageSettings;
  },

  /**
   * @description Function to display current module coverage settings in the
   * target view's editor
   */
  showModuleCoverage: function() {
    this.targetView.coverageEditor.activate();
    this.switchModule(this.targetView.currentModule);
  },

  /**
   * @function getModuleInfo
   * @param {String} module_type
   * @description get module info
   */
  getModuleInfo: function(module_type) {
    var data = [];
    switch(module_type) {
      case 'RADIO': {
        SDL.remoteControlCapabilities.remoteControlCapability.radioControlCapabilities.forEach(element => {
          data.push(element.moduleInfo)
        });
        break;
      }
      case 'AUDIO': {
        SDL.remoteControlCapabilities.remoteControlCapability.audioControlCapabilities.forEach(element => {
          data.push(element.moduleInfo)
        });
        break;
      }
      case 'CLIMATE': {
        SDL.remoteControlCapabilities.remoteControlCapability.climateControlCapabilities.forEach(element => {
          data.push(element.moduleInfo)
        });
        break;
      }
      case 'SEAT': {
        SDL.remoteControlCapabilities.remoteControlCapability.seatControlCapabilities.forEach(element => {
          data.push(element.moduleInfo)
        });
        break;
      }
      case 'LIGHT': {
        data = SDL.remoteControlCapabilities.remoteControlCapability.lightControlCapabilities.moduleInfo
        break;
      }
      case 'HMI_SETTINGS': {
        data = SDL.remoteControlCapabilities.remoteControlCapability.hmiSettingsControlCapabilities.moduleInfo
        break;
      }
    }
    return data;
  },

  /**
   * @function setModuleInfo
   * @param {String} module_type
   * @param {String} data
   * @description Set module info
   */
  setModuleInfo: function(module_type, data) {
    var parsed_settings = JSON.parse(data);
    switch(module_type) {
      case 'RADIO': {
        SDL.remoteControlCapabilities.remoteControlCapability.radioControlCapabilities.forEach(function(element,index) {
          element.moduleInfo = parsed_settings[index];
        });
        break;
      }
      case 'AUDIO': {
        SDL.remoteControlCapabilities.remoteControlCapability.audioControlCapabilities.forEach(function(element,index) {
          element.moduleInfo = parsed_settings[index];
        });
        break;
      }
      case 'CLIMATE': {
        SDL.remoteControlCapabilities.remoteControlCapability.climateControlCapabilities.forEach(function(element,index) {
          element.moduleInfo = parsed_settings[index];
        });
        break;
      }
      case 'SEAT': {
        SDL.remoteControlCapabilities.remoteControlCapability.seatControlCapabilities.forEach(function(element,index) {
          element.moduleInfo = parsed_settings[index];
        });
        break;
      }
      case 'LIGHT': {
        SDL.remoteControlCapabilities.remoteControlCapability.lightControlCapabilities.moduleInfo = parsed_settings;
        break;
      }
      case 'HMI_SETTINGS': {
        SDL.remoteControlCapabilities.remoteControlCapability.hmiSettingsControlCapabilities.moduleInfo = parsed_settings;
        break;
      }
    }
  },
  /**
   * @description Function to change the content of editor to display settings
   * of another module
   * @param {String} module_type 
   */
  switchModule: function(module_type) {
    var emulation_type = FLAGS.VehicleEmulationType;
    if (!this.defaultCoverageSettings.hasOwnProperty(emulation_type)) {
      this.availableModules.forEach(module => {
        this.coverageSettings[module] = this.getModuleInfo(module);
      });
      this.defaultCoverageSettings[emulation_type] = SDL.deepCopy(this.coverageSettings);
    }

    var moduleInfo = this.coverageSettings[module_type];    
    this.targetView.coverageEditor.set('content', JSON.stringify(moduleInfo, null, 2));
    this.targetView.coverageEditor.reset();

    var self = this;
    this.targetView.coverageEditor.activate(function(data) {
        self.saveModuleSettings(self.targetView.currentModule, data);
        SDL.RCModulesController.resetData(data,module_type);
        self.setModuleInfo(self.targetView.currentModule, data);
    });
  },

  /**
   * @description Function to save current module settings before switching
   * @param {String} module_type 
   * @param {Object} data 
   */
  saveModuleSettings: function(module_type, data) {
    var parsed_settings = JSON.parse(data);
    this.set('coverageSettings.' + module_type, parsed_settings);
  },

  /**
   * @description Function to validate current settings
   * @returns true if settings are valid, otherwise returns false
   */
  validateSettings: function() {
    this.targetView.coverageEditor.save();

    var validation_message = this.checkModulesConsistency();
    if (validation_message !== "") {
      SDL.PopUp.create().appendTo('#' + this.targetView.elementId).popupActivate(
        'Invalid JSON settings:\n' + validation_message
      );
      return false;
    }
    
    validation_message = this.checkModulesBoundaries();
    if (validation_message !== "") {
      SDL.PopUp.create().appendTo('#' + this.targetView.elementId).popupActivate(
        'Invalid JSON settings:\n' + validation_message
      );
      return false;
    }

    validation_message = this.checkModuleLocationMatching();
    if (validation_message !== "") {
      SDL.PopUp.create().appendTo('#' + this.targetView.elementId).popupActivate(
        'Invalid JSON settings:\n' + validation_message
      );
      return false;
    }

    validation_message = this.checkModuleCoverage();
    if (validation_message !== "") {
      SDL.PopUp.create().appendTo('#' + this.targetView.elementId).popupActivate(
        'Invalid JSON settings:\n' + validation_message
      );
      return false;
    }

    return true;
  },

  /**
   * @description Function to extract module coverage settings from provided object
   * @param {Object} module_settings
   * @returns array of module coverage settings
   */
  extractModulesCoverage(module_settings) {
    var array_of_settings = Array.isArray(module_settings) ? module_settings : [module_settings];
    var service_areas = [];

    array_of_settings.forEach(element => {
      service_areas.push(element['serviceArea']);
    });

    return service_areas;    
  },

  /**
   * @description Function to get current module key by its location
   * @param {Object} item
   * @returns stringified key of the module 
   */
  getModuleKeyName: function(item) {
    return "L" + item.level + "R" + item.row + "C" + item.col;
  },

  /**
   * @description Function to get index of element in array which has max value
   * in the specified field
   * @param {Array} data 
   * @param {String} field 
   * @returns index of element
   */
  getVehicleMaxIndex: function(data, field) {
    var max_index = 0;
    var max_value = 0;

    data.forEach(
      function(item, index) {
        var value = 
          SDL.VehicleModuleCoverageController.getVehicleItemValue(item, field);

        if (value > max_value) {
          max_index = index;
          max_value = value;
        }
    });

    return max_index;
  },

  /**
   * @description Function to get value of the element considering its "span"
   * addition
   * @param {Object} item 
   * @param {String} field 
   * @returns value of element
   */
  getVehicleItemValue: function(item, field) {
    var value = 0;
    if (item.hasOwnProperty(field)) {
      value = item[field];
    }

    var span_field = field + 'span';
    if (item.hasOwnProperty(span_field)) {
      value += item[span_field] - 1;
    }

    return value;
  },

  /**
   * @description Function to check settings consistency according to API
   * @returns true if settings are valid, otherwise returns false
   */
  checkModulesConsistency: function() {
    var validation_message = "";

    Object.keys(this.coverageSettings).forEach(module_type => {
      var module_coverage = this.coverageSettings[module_type];
      if (!Array.isArray(module_coverage)) {
        module_coverage = [module_coverage];
      }
      
      module_coverage.forEach(
        function(element, index) {
          if (!element.hasOwnProperty('moduleId')) {
            validation_message += module_type + ": Element #" + index + " does not contain moduleId field!\n";
            return;
          }
          if (!element.hasOwnProperty('serviceArea')) {
            validation_message += module_type + ": Element #" + index + " does not contain serviceArea field!\n";
            return;
          }
          if (!element.hasOwnProperty('location')) {
            validation_message += module_type + ": Element #" + index + " does not contain location field!\n";
            return;
          }
          var service_area = element['serviceArea'];
          if (!service_area.hasOwnProperty('col') || !service_area.hasOwnProperty('row')) {
            validation_message += module_type + ": Element #" + index + " does not contain col/row field!\n";
          }
      });
    });

    return validation_message;
  },

  /**
   * @description Function to check settings boundaries according to physical
   * seats location of the chosen vehicle
   * @returns true if settings are valied, otherwise returns false
   */
  checkModulesBoundaries: function() {
    var representation = SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
    var max_col_index = this.getVehicleMaxIndex(representation, 'col');
    var max_col_value = this.getVehicleItemValue(representation[max_col_index], 'col');

    var max_row_index = this.getVehicleMaxIndex(representation, 'row');
    var max_row_value = this.getVehicleItemValue(representation[max_row_index], 'row');
    
    var max_level_index = this.getVehicleMaxIndex(representation, 'level');
    var max_level_value = this.getVehicleItemValue(representation[max_level_index], 'level');

    var validation_message = "";

    Object.keys(this.coverageSettings).forEach(module_type => {
      var module_coverage = this.coverageSettings[module_type];
      var service_areas = this.extractModulesCoverage(module_coverage);

      var module_max_col_index = this.getVehicleMaxIndex(service_areas, 'col');
      var module_max_col_value = this.getVehicleItemValue(service_areas[module_max_col_index], 'col');

      var module_max_row_index = this.getVehicleMaxIndex(service_areas, 'row');
      var module_max_row_value = this.getVehicleItemValue(service_areas[module_max_row_index], 'row');

      var module_max_level_index = this.getVehicleMaxIndex(service_areas, 'level');
      var module_max_level_value = this.getVehicleItemValue(service_areas[module_max_level_index], 'level');  

      if (module_max_col_value > max_col_value) {
        validation_message += module_type + ": out-of-bound column in " + 
          this.getModuleKeyName(service_areas[module_max_col_index]) + "\n";
      }
      if (module_max_row_value > max_row_value) {
        validation_message += module_type + ": out-of-bound row in " +
          this.getModuleKeyName(service_areas[module_max_row_index]) + "\n";
      }
      if (module_max_level_value > max_level_value) {
        validation_message += module_type + ": out-of-bound level in " +
          this.getModuleKeyName(service_areas[module_max_level_index]) + "\n";
      }
    });

    return validation_message;
  },

  /**
   * @description Function to check that module physical locations matches the
   * service areas of these modules
   * @returns true if settings are valid, otherwise returns false
   */
  checkModuleLocationMatching: function() {
    var validation_message = "";

    Object.keys(this.coverageSettings).forEach(module_type => {
      var module_coverage = this.coverageSettings[module_type];
      if (!Array.isArray(module_coverage)) {
        module_coverage = [module_coverage];
      }

      module_coverage.forEach(module_element => {
        var module_location = module_element['location'];
        var module_area = module_element['serviceArea'];
        var module_key_name = this.getModuleKeyName(module_location);

        if (module_location['col'] != module_area['col']) {
          validation_message += module_type + ": " + module_key_name + " has a 'col' mismatch!\n";
          return;
        }

        if (module_location['row'] != module_area['row']) {
          validation_message += module_type + ": " + module_key_name + " has a 'row' mismatch!\n";
          return;
        }

        var location_level = module_location.hasOwnProperty('level') ? module_location['level'] : 0;
        var area_level = module_area.hasOwnProperty('level') ? module_area['level'] : 0;
        if (location_level != area_level) {
          validation_message += module_type + ": " + module_key_name + " has a 'level' mismatch!\n";
          return;
        }
      });      
    });

    return validation_message;
  },

  /**
   * @description Function to check coverage by specified settings of the
   * physical seats of the chosen vehicle
   * @returns true if settings are valied, otherwise returns false
   */
  checkModuleCoverage: function() {
    var representation = SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
    var validation_message = "";

    Object.keys(this.coverageSettings).forEach(module_type => {
      // Coverage map will contain how many modules covers each location
      // 0 - seat is not covered by any module - NOK
      // 1 - seat is covered by one module - OK
      // >1 - seat is covered by multiple modules - NOK
      var coverage = {};
    
      representation.forEach(item => {
        coverage[this.getModuleKeyName(item)] = 0;
      });
      
      var module_coverage = this.coverageSettings[module_type];
      var service_areas = this.extractModulesCoverage(module_coverage);

      service_areas.forEach(module => {
        // These fields are not mandatory according to API so should be checked
        var module_level = module.hasOwnProperty('level') ? module.level : 0;

        var level_span = module.hasOwnProperty('levelspan') ? module.levelspan : 1;
        var row_span = module.hasOwnProperty('rowspan') ? module.rowspan : 1;
        var col_span = module.hasOwnProperty('colspan') ? module.colspan : 1;
        
        for (var level = module_level; level < module_level + level_span; ++level) {
          for (var row = module.row; row < module.row + row_span; ++row) {
            for (var col = module.col; col < module.col + col_span; ++col) {
              var covered_item = {
                "col" : col,
                "row" : row,
                "level" : level
              }
              var covered_module_name = this.getModuleKeyName(covered_item);
              if (coverage.hasOwnProperty(covered_module_name)) {
                coverage[covered_module_name]++;
              }
            }
          }
        }
      });

      Object.keys(coverage).forEach(module => {
        if (0 == coverage[module]) {
          validation_message += module_type + ": Location " + module + " is not covered\n";
          return;
        }
        if (1 < coverage[module]) {
          validation_message += module_type + ": Location " + module + " is covered by " + 
            coverage[module] + " modules\n"
        }
      });
    });    

    return validation_message;
  }

});
