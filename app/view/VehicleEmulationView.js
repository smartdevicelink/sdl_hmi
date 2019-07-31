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
 * @name SDL.VehicleEmulationView
 * @desc Vehicle emulation settings representation
 * @category View
 * @filesource app/view/VehicleEmulationView.js
 * @version 1.0
 */

SDL.VehicleEmulationView = Em.ContainerView.create({
    classNameBindings: [
      'hide:inactive_state'
    ],
    elementId: 'vehicle_emulation_view',
    childViews: [
      'OptionNoEmulation',
      'OptionVehicle2x3',
      'OptionVehicle3x3',
      'applySettings',
      'coverageSettings',
      'radioNoEmulation',
      'radioVehicle2x3',
      'radioVehicle3x3'
    ],

    /**
     * @description Flag responsible for a overall view visibility
     * @type {Boolean}
     */
    hide: true,

    /**
     * @description No emulation image element
     */
    OptionNoEmulation: Em.View.extend(
      {
        classNames: [
          'option_no_emulation_view'
        ],
        classNameBindings: 'select',
        elementId: 'option_no_emulation_view',
        template: Ember.Handlebars.compile(
          '<span style="position: relative; top: 50%;">NO EMULATION</span>'
        ),
        
        select: function() {
          return 'no_emulation' == FLAGS.VehicleEmulationType;
        }.property('FLAGS.VehicleEmulationType'),

        actionDown: function() {
          document.getElementById('radioNoEmulation').checked = true;
          FLAGS.set('VehicleEmulationType', 'no_emulation');
        }
      }
    ),

    /**
     * @description Vehicle 2x3 image element
     */
    OptionVehicle2x3: Em.View.extend(
      {
        classNames: [
          'option_vehicle2x3'
        ],
        classNameBindings: 'select',
        elementId: 'option_vehicle2x3',

        select: function() {
          return 'vehicle_2x3' == FLAGS.VehicleEmulationType;
        }.property('FLAGS.VehicleEmulationType'),

        actionDown: function() {
          document.getElementById('radioVehicle2x3').checked = true;
          FLAGS.set('VehicleEmulationType', 'vehicle_2x3');
        }
      }
    ),

    /**
     * @description Vehicle 3x3 image element
     */
    OptionVehicle3x3: Em.View.extend(
      {
        classNames: [
          'option_vehicle3x3'
        ],
        classNameBindings: 'select',
        elementId: 'option_vehicle3x3',

        select: function() {
          return 'vehicle_3x3' == FLAGS.VehicleEmulationType;
        }.property('FLAGS.VehicleEmulationType'),

        actionDown: function() {
          document.getElementById('radioVehicle3x3').checked = true;
          FLAGS.set('VehicleEmulationType', 'vehicle_3x3');
        }
      }
    ),

    /**
     * @description Apply button element
     */
    applySettings: Em.View.create(
      {
        elementId: 'emulation_apply_settings',
        classNameBindings: [
          'visible_display', 'pressed:pressed'
        ],
        classNames: [
          'apply_settings',
          'ffw-button'
        ],
        template: Ember.Handlebars.compile('<span>Apply</span>'),
        actionDown: function(event) {
          this.set('pressed', true);
        },
        actionUp: function(event) {
          this.set('pressed', false);
          this._parentView.set('hide', true);
        }
      }
    ),

    /**
     * @description Coverage button element
     */
    coverageSettings: SDL.Button.create(
      {
        elementId: 'emulation_coverage_settings',
        classNameBindings: [
          'visible_display', 'pressed:pressed'
        ],
        classNames: [
          'coverage_settings',
          'ffw-button'
        ],
        template: Ember.Handlebars.compile('<span>Coverage</span>'),
        disabledBinding: 'isDisabled',
        
        isDisabled: function() {
          return 'no_emulation' === FLAGS.VehicleEmulationType;
        }.property('FLAGS.VehicleEmulationType'),

        actionDown: function(event) {
          if (this.get('disabled')) {
            return;
          }
          this.set('pressed', true);
        },        
        actionUp: function(event) {
          this.set('pressed', false);
          if (this.get('disabled')) {
            return;
          }
          SDL.VehicleModuleCoverageView.set('hide', false);
          SDL.VehicleModuleCoverageController.loadSavedCoverageSettings();
          SDL.VehicleModuleCoverageController.showModuleCoverage();

          var vehicle_name;
          switch (FLAGS.VehicleEmulationType) {
            case "vehicle_2x3": vehicle_name = this._parentView.radioVehicle2x3.text; break;
            case "vehicle_3x3": vehicle_name = this._parentView.radioVehicle3x3.text; break;
            default: vehicle_name = this._parentView.radioNoEmulation.text; break;
          }

          SDL.VehicleModuleCoverageView.set('currentVehicleText', 
            vehicle_name + " module coverage options"
          );
        }
      }
    ),

    /**
     * @description No emulation radio button element
     */
    radioNoEmulation: SDL.RadioButton.extend(
      {
        Id: 'radioNoEmulation',
        classNames: ['radioNoEmulation'],
        name: 'em_option',
        value: 'no_emulation',
        selectionBinding: 'FLAGS.VehicleEmulationType',
        text: 'No vehicle emulation'
      }
    ),

    /**
     * @description Vehicle 2x3 radio button element
     */
    radioVehicle2x3: SDL.RadioButton.extend(
      {
        Id: 'radioVehicle2x3',        
        classNames: ['radioVehicle2x3'],
        name: 'em_option',
        value: 'vehicle_2x3',
        selectionBinding: 'FLAGS.VehicleEmulationType',
        text: 'Vehicle 2x3'
      }
    ),

    /**
     * @description Vehicle 3x3 radio button element
     */
    radioVehicle3x3: SDL.RadioButton.extend(
      {
        Id: 'radioVehicle3x3',
        classNames: ['radioVehicle3x3'],
        name: 'em_option',
        value: 'vehicle_3x3',
        selectionBinding: 'FLAGS.VehicleEmulationType',
        text: 'Vehicle 3x3'
      }
    )
});
