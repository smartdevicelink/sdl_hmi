/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
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

SDL.VehicleTypeEditorView = Em.ContainerView.create(
    {
      elementId: 'policies_settings_vehicle_type_editor_view',
      classNames: 'in_settings_separate_view',
      classNameBindings: [
        'SDL.States.settings.policies.vehicleTypeEditor.active:active_state:inactive_state'
      ],
      childViews: [
        'versionsTitle',
        'backButton',
        'vehicleMakeLabel',
        'vehicleMakeCheckBox',
        'vehicleMakeInput',

        'vehicleModelLabel',
        'vehicleModelCheckBox',
        'vehicleModelInput',

        'vehicleYearLabel',
        'vehicleYearCheckBox',
        'vehicleYearInput',

        'vehicleTrimLabel',
        'vehicleTrimCheckBox',
        'vehicleTrimInput',

        'applyButton'
      ],
      versionsTitle: SDL.Label.extend(
        {
          classNames: 'label',
          content: 'Configure vehicle type parameters'
        }
      ),
      backButton: SDL.Button.extend(
        {
          classNames: [
            'backButton'
          ],
          action: 'onState',
          target: 'SDL.SettingsController',
          goToState: 'policies',
          icon: 'images/media/ico_back.png',
          onDown: false
        }
      ),
      vehicleMakeLabel: SDL.Label.extend(
        {
          classNames: 'vehicleMakeLabel vehicleBaseLabel',
          content: 'Make: '
        }
      ),
      vehicleMakeCheckBox: Em.Checkbox.extend(
        {
          elementId: 'vehicleMakeCheckBox',
          classNames: 'vehicleMakeCheckBox vehicleBaseCheckBox item',

          click: function(event) {
            SDL.VehicleTypeEditorView.vehicleMakeInput.set('disabled', !event.currentTarget.checked)
          }
        }
      ),
      vehicleMakeInput: Ember.TextField.extend(
        {
          elementId: 'vehicleMakeInput',
          classNames: 'vehicleMakeInput vehicleBaseInput dataInput',
          placeholder: '<Type vehicle make here>',
          valueBinding: 'SDL.SettingsController.editedVehicleType.make'
        }
      ),

      vehicleModelLabel: SDL.Label.extend(
        {
          classNames: 'vehicleModelLabel vehicleBaseLabel',
          content: 'Model: '
        }
      ),
      vehicleModelCheckBox: Em.Checkbox.extend(
        {
          elementId: 'vehicleModelCheckBox',
          classNames: 'vehicleModelCheckBox vehicleBaseCheckBox item',

          click: function(event) {
            SDL.VehicleTypeEditorView.vehicleModelInput.set('disabled', !event.currentTarget.checked)
          }
        }
      ),
      vehicleModelInput: Ember.TextField.extend(
        {
          elementId: 'vehicleModelInput',
          classNames: 'vehicleModelInput vehicleBaseInput dataInput',
          placeholder: '<Type vehicle model here>',
          valueBinding: 'SDL.SettingsController.editedVehicleType.model'
        }
      ),

      vehicleYearLabel: SDL.Label.extend(
        {
          classNames: 'vehicleYearLabel vehicleBaseLabel',
          content: 'Year: '
        }
      ),
      vehicleYearCheckBox: Em.Checkbox.extend(
        {
          elementId: 'vehicleYearCheckBox',
          classNames: 'vehicleYearCheckBox vehicleBaseCheckBox item',

          click: function(event) {
            SDL.VehicleTypeEditorView.vehicleYearInput.set('disabled', !event.currentTarget.checked)
          }
        }
      ),
      vehicleYearInput: Ember.TextField.extend(
        {
          elementId: 'vehicleYearInput',
          classNames: 'vehicleYearInput vehicleBaseInput dataInput',
          placeholder: '<Type vehicle year here>',
          valueBinding: 'SDL.SettingsController.editedVehicleType.modelYear'
        }
      ),

      vehicleTrimLabel: SDL.Label.extend(
        {
          classNames: 'vehicleTrimLabel vehicleBaseLabel',
          content: 'Trim: '
        }
      ),
      vehicleTrimCheckBox: Em.Checkbox.extend(
        {
          elementId: 'vehicleTrimCheckBox',
          classNames: 'vehicleTrimCheckBox vehicleBaseCheckBox item',

          click: function(event) {
            SDL.VehicleTypeEditorView.vehicleTrimInput.set('disabled', !event.currentTarget.checked)
          }
        }
      ),
      vehicleTrimInput: Ember.TextField.extend(
        {
          elementId: 'vehicleTrimInput',
          classNames: 'vehicleTrimInput vehicleBaseInput dataInput',
          placeholder: '<Type vehicle trim here>',
          valueBinding: 'SDL.SettingsController.editedVehicleType.trim'
        }
      ),


      applyButton: SDL.Button.extend(
        {
          elementId: 'vehicleTypeApplyButton',
          classNames: 'vehicleTypeApplyButton button',
          text: 'Apply',
          action: 'applyNewVehicleTypeValues',
          target: 'SDL.SettingsController',
          onDown: false
        }
      )
    }
  );
