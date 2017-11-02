/*
 * Copyright (c) 2017, Ford Motor Company All rights reserved.
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
 * @name SDL.EditVehicleDataController
 * @desc Edit vehicle data module logic
 * @category Controller
 * @filesource app/controller/sdl/EditVehicleDataController.js
 * @version 1.0
 */

SDL.EditVehicleDataController = Em.Object.create({

  /**
   * Model binding
   */
  modelBinding: 'SDL.SDLVehicleInfoModel',

  /**
   * Path to currently active parameter in vehicleData map
   */
  currentParameterPath: '.',

  /**
   * Name of currently active parameter in vehicleData map
   */
  currentParameterName: '',

  /**
   * Value of param to edit
   */
  paramValue: null,

  /**
   * Type of param value to edit
   */
  paramValueType: '',

  /**
   * Flag to display edit param view or not
   */
  isParamEditing: false,

  /**
   * Inner storage for disabled params for every map key
   */
  disabledMapParams: {},

  /**
   * Event when user clicks edit parameter button
   */
  onParamButtonClick: function(element) {
    var key = element._parentView.itemID;
    this.set('currentParameterName', key);

    var value = this.getParameterValueFromMap(key);
    var valueType = typeof value;

    switch (typeof value) {
      case 'boolean': {
         this.set('paramValue', value.toString());
         break;
      }
      case 'number':
      case 'string': {
         this.set('paramValue', value);
         break;
      }
      default: {
        this.set('paramValue', '');
      }
    }

    this.set('paramValueType', valueType);
    this.toggleProperty('isParamEditing');
  },

  /**
   * Event when user clicks arrow button
   */
  onArrowButtonClick: function(element) {
    var key = element._parentView.itemID;

    this.saveMapParametersState();
    this.set('currentParameterPath',
      this.get('currentParameterPath') + '/' + key
    );
  },

  /**
   * Event when user clicks back button
   */
  onBackButtonClick: function() {
    if (this.isParamEditing) {
      this.cancelParamChanges();
      return;
    }
    if (this.currentParameterPath != '.') {
      this.saveMapParametersState();
      this.gotoUpperLevelMap();
      return;
    }
    SDL.EditVehicleDataView.toggleActivity();
  },

  /**
   * Gets pointer to currently displayed map object
   */
  getActiveObject: function() {
    var keys = this.currentParameterPath.split('/');
    var target;
    for (var i = 0; i < keys.length; ++i) {
      if (keys[i] == '.') {
        target = SDL.SDLVehicleInfoModel.vehicleData;
      } else {
        target = target[keys[i]];
      }
    }
    return target;
  },

  /**
   * Gets list of passed object own properties sorted alphabetically
   */
  getSortedProperties: function(object) {
    var properties = [];
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        properties.push(key);
      }
    }
    properties.sort();
    return properties;
  },

  /**
   * Gets parameter value from map using path and key
   */
  getParameterValueFromMap: function(key) {
    var path = this.currentParameterPath.split('/');
    var target;
    for (var i = 0; i < path.length; ++i) {
      if (path[i] == '.') {
        target = this.model.vehicleData;
      } else {
        target = target[path[i]];
      }
    }
    return target[key];
  },

  /**
   * Converts current parameter path to valid map key name
   */
  getMapPathKeyValue: function(path) {
    var result = '';
    var path = (typeof(path)==='undefined' ?
                  this.currentParameterPath.split('/') :
                  path.split('/'));

    for (var i = 0; i < path.length; ++i) {
      if (path[i] == '.') {
        result += 'root';
      } else {
        result += '_' + path[i];
      }
    }
    return result;
  },

  /**
   * Sets parameter value in map using path and key
   */
  setParameterValueForMap: function(key, value) {
    var path = this.currentParameterPath.split('/');
    path.push(key);
    var target = '';
    for (var i = 0; i < path.length; ++i) {
      if (path[i] != '.') {
        target += '.' + path[i];
      }
    }
    var oldValue = this.getParameterValueFromMap(key);
    var newValue;
    switch (this.paramValueType) {
      case 'boolean': {
        newValue = value == 'true';
        break;
      }
      case 'number': {
        newValue = parseFloat(value);
        break;
      }
      default: {
        newValue = value;
      }
    }

    this.model.set('vehicleData' + target, newValue);
    this.saveMapParametersState();
    if (newValue != oldValue) {
      this.notifyAboutParamChanges();
    }
  },

  /**
   * Checks if map parameter state is disabled according to inner storage data
   */
  isMapParameterDisabled: function(paramName) {
    var disabledCurrentPath =
      SDL.EditVehicleDataController.getMapPathKeyValue();
    var disabledCurrentParams =
      SDL.EditVehicleDataController.get('disabledMapParams.' + disabledCurrentPath);

    if (disabledCurrentParams && disabledCurrentParams.length > 0) {
      return disabledCurrentParams.indexOf(paramName) >= 0;
    }
    return false;
  },

  /**
   * Saves map parameters disabled state from UI to inner storage
   */
  saveMapParametersState: function() {
    var disabledCurrentPath = this.getMapPathKeyValue();
    var disabledCurrentParams = [];
    var itemKeyName = SDL.EditVehicleDataView.vehicleDataList.elementId + '_item';
    var items = SDL.EditVehicleDataView.vehicleDataList.items;
    for (var i = 0; i < items.length; ++i) {
      var item = document.getElementById(itemKeyName + i);
      if (item && item.classList.contains('checkboxVisible') &&
          !item.classList.contains('checkboxChecked')) {
        disabledCurrentParams.push(items[i].params.itemID);
      }
    }
    this.set('disabledMapParams.' + disabledCurrentPath, disabledCurrentParams);
  },

  /**
   * Removes map parameters from object which was disabled by user
   */
  removeDisabledParams: function(obj) {
    var resultObject = {};

    for (var objKey in obj) {
      if (!obj.hasOwnProperty(objKey)) {
        continue;
      }

      var disabledCurrentPath = this.getMapPathKeyValue('./' + objKey);
      var disabledParams = this.get('disabledMapParams.' + disabledCurrentPath);

      var targetObject = obj[objKey];
      var isArray = targetObject instanceof Array;
      var outObjectItem = isArray ? [] : {};
      for (var targetKey in targetObject) {
        if (targetObject.hasOwnProperty(targetKey) &&
            disabledParams.indexOf(targetKey) < 0) {
          if (isArray) {
            outObjectItem.push(targetObject[targetKey]);
          } else {
            outObjectItem[targetKey] = targetObject[targetKey];
          }
        }
      }
      resultObject[objKey] = outObjectItem;
    }
    return resultObject;
  },

  /**
   * Sends notification about changing of currently edited parameter
   */
  notifyAboutParamChanges: function() {
    var path = this.currentParameterPath.split('/');
    var rootKeyName;
    if (path.length == 1) {
      rootKeyName = this.currentParameterName;
    } else {
      rootKeyName = path[1];
    }
    var rootParamValue = SDL.SDLController.filterObjectByPredicate(
      this.model.vehicleData, rootKeyName
    );
    var rootParamValue =
      this.removeDisabledParams(rootParamValue);
    FFW.VehicleInfo.OnVehicleData(rootParamValue);
  },

  /**
   * Applies new parameter value for currently selected key
   */
  applyParamChanges: function() {
    this.setParameterValueForMap(
      this.currentParameterName, this.paramValue
    );
    this.set('currentParameterName', '');
    this.toggleProperty('isParamEditing');
  },

  /**
   * Exit from current parameter editor
   */
  cancelParamChanges: function() {
    this.set('currentParameterName', '');
    this.toggleProperty('isParamEditing');
  },

  /**
   * Goes back to parent map object
   */
  gotoUpperLevelMap: function() {
    var path = this.currentParameterPath.split('/');
    if (path.length > 1) path.pop();

    this.set('currentParameterPath', path.join('/'));
  }

}
);
