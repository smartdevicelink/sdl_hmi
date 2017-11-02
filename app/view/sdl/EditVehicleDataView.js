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
 * @name SDL.EditVehicleDataView
 * @desc Visual vehicle data editor representation
 * @category View
 * @filesource app/view/sdl/EditVehicleDataView.js
 * @version 1.0
 */

SDL.EditVehicleDataView = Em.ContainerView.create(
  {
    elementId: 'EditVehicleData',
    classNames: 'EditVehicleData',
    classNameBindings: [
      'active'
    ],
    childViews: [
      'backButton',
      'vehicleEditInfoLabel',
      'vehicleDataList',
      'editParameterView'
    ],
    /**
     * Property indicates the activity state of VehicleInfo PopUp
     */
    active: false,
    /**
     * Back button view
     */
    backButton: SDL.Button.extend(
      {
        classNames: [
          'backButton'
        ],
        target: 'SDL.EditVehicleDataController',
        action: 'onBackButtonClick',
        icon: 'images/media/ico_back.png',
        onDown: false
      }
    ),
    /**
     * Title of EditVehicleDataView PopUp view
     */
    vehicleEditInfoLabel: SDL.Label.extend(
      {
        elementId: 'vehicleEditInfoLabel',
        classNames: 'vehicleEditInfoLabel',
        content: 'Main vehicle data parameters',
        getParameterPath: function() {
          var param = SDL.EditVehicleDataController.currentParameterName;
          if (param == '') {
            this.set('content', 'Edit vehicle data parameters');
            return;
          }
          this.set('content', 'Parameter: ' + param);
        }.observes('SDL.EditVehicleDataController.currentParameterName')
      }
    ),
    /**
     * List of vehicle data items
     */
    vehicleDataList: SDL.List.extend(
      {
        classNames: [
          'vdList'
        ],
        classNameBindings: [
          'SDL.EditVehicleDataController.isParamEditing:inactive_state:active_state'
        ],
        elementId: 'vdList',
        itemsOnPage: 5,
        itemsBinding: 'this.itemGenerator',
        itemGenerator: function() {
          var activeObject =
            SDL.EditVehicleDataController.getActiveObject();
          var properties =
            SDL.EditVehicleDataController.getSortedProperties(activeObject);
          var items = [];
          for (var i = 0; i < properties.length; ++i) {
            var key = properties[i];
            var value = activeObject[key];
            var isComplex =
              typeof value == 'object' || typeof value == 'array';
            var isDisabled =
              SDL.EditVehicleDataController.isMapParameterDisabled(key);

            items.push(
            {
              type: SDL.CheckableButton,
              params: {
                className: 'checkableButton',
                disabled: false,
                itemID: key,
                checkboxVisible: activeObject instanceof Array,
                checkboxChecked: !isDisabled,
                buttonText: 'Parameter "' + key + '"' +
                  (!isComplex ? ' = ' + value : ''),
                buttonTemplateName: (isComplex ? 'arrow' : 'text'),
                buttonAction: (isComplex ? 'onArrowButtonClick' :
                  'onParamButtonClick'),
                buttonTarget: 'SDL.EditVehicleDataController'
              }
            });
          }
          return items;
        }.property('SDL.SDLVehicleInfoModel.vehicleData',
          'SDL.EditVehicleDataController.isParamEditing',
          'SDL.EditVehicleDataController.currentParameterPath')
      }
    ),
    /**
     * Edit parameter view
     */
    editParameterView: Em.ContainerView.create({
      elementId: 'editParameterView',
      classNames: 'editParameterView',
      classNameBindings: [
        'SDL.EditVehicleDataController.isParamEditing:active_state:inactive_state'
      ],
      childViews: [
        'editParamInput',
        'applyChangesButton'
      ],
      /**
       * Input for speed value changes
       */
      editParamInput: Ember.TextField.extend(
        {
          elementId: 'editParamInput',
          classNames: 'editParamInput',
          valueBinding: 'SDL.EditVehicleDataController.paramValue',
          keyUp: function(event, view) {
            if (event.key == 'Enter') {
              SDL.EditVehicleDataController.applyParamChanges();
            }
          }
        }
      ),
      /**
       * Button to apply param changes
       */
      applyChangesButton: SDL.Button.extend(
        {
          elementId: 'applyChangesButton',
          classNames: 'button applyChangesButton',
          action: 'applyParamChanges',
          target: 'SDL.EditVehicleDataController',
          text: 'Apply',
          enabled: false,
          onDown: false
        }
      )
    }),
    /**
     * Trigger function that activates and deactivates VehicleInfo PopUp
     */
    toggleActivity: function() {
      this.set('active', !this.active);
    }
  }
);
