/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *  · Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *  · Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *  · Neither the name of the Ford Motor Company nor the names of its
 * contributors may be used to endorse or promote products derived from this
 * software without specific prior written permission.
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
 * @name SDL.PlayerControllsView
 * @desc Video player visual representation
 * @category View
 * @filesource app/view/player/PlayerView.js
 * @version 1.0
 */
SDL.ClimateView = Em.ContainerView.create(
  {
    /** View Id */
    elementId: 'climateView',
    classNameBindings: [
      'SDL.States.climate.active:active_state:inactive_state'
    ],
    childViews: [
      'windowText',
      'climateView'
    ],
    windowText: SDL.Label.extend(
      {
        classNames: 'windowText',
        content: 'Climate'
      }
    ),
    climateView: Em.ContainerView.extend(
      {
        elementId: 'climate_control',
        classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',
        isDisabled: function() {
          return !SDL.ClimateController.model.climateControlData.climateEnable;
        }.property(
          'SDL.ClimateController.model.climateControlData.climateEnable'
        ),
        disabledBinding: 'isDisabled',
        childViews: [
          'desiredTemp',
          'desiredTempLabel',
          'fanSpeed',
          'fanSpeedLabel',
          'currentTemp',
          'curentTempLabel',
          'defrostZone',
          'defrostZoneLabel',
          'temperatureUnit',
          'temperatureUnitLabel',
          'ventilationMode',
          'ventilationModeLabel',
          'acEnable',
          'acMaxEnable',
          'autoModeEnable',
          'dualModeEnable',
          'recirculateAirEnable',
          'heatedWindshieldEnable',
          'heatedRearWindowEnable',
          'heatedSteeringWheelEnable',
          'heatedMirrorsEnable',
          'climateEnable',
          'climateModuleUUID'
        ],

        climateEnable: SDL.Button.extend(
          {
            elementId: 'enableClimate',
            classNames: 'enableClimate switcher',
            iconBinding: 'onIconChange',
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.ClimateController.model.climateControlData.climateEnable);
            }.property(
              'SDL.ClimateController.model.climateControlData.climateEnable'
            ),
            model: 'currentClimateModel',
            method: 'toggleClimateEnable',
            action: 'action',
            target: 'SDL.RCModulesController',
            onDown: false,
            textBinding: 'SDL.ClimateController.model.climateEnableButtonText'
          }
        ),

        climateModuleUUID: SDL.Label.create({
          elementId: 'climateModuleCurrent',
          classNames: 'climateModuleCurrent',
          contentBinding: 'SDL.RCModulesController.currentClimateModuleID'
        }),

        desiredTemp: Em.ContainerView.extend(
          {
            elementId: 'desiredTemp_container',
            classNames: 'calc_container',
            disabledBinding: 'parentView.disabled',
            childViews: [
              'desiredTemp_label',
              'desiredTemp_minus',
              'desiredTemp_plus'
            ],
            desiredTemp_minus: SDL.Button.extend(
              {
                elementId: 'desiredTemp_minus',
                classNames: 'minus',
                templateName: 'icon',
                icon: 'images/climate/minus_ico.png',
                onDown: false,
                model: 'currentClimateModel',
                method: 'desiredTempDown',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            ),
            desiredTemp_label: SDL.Label.extend(
              {
                elementId: 'desiredTemp_label',
                temp: function() {
                  var self = this._parentView.disabled;
                  temperature_struct = SDL.ClimateController.getTemperatureStruct(
                    SDL.ClimateController.model.climateControlData.temperatureUnit,
                    SDL.ClimateController.model.climateControlData.desiredTemp
                  );
                  return temperature_struct.value.toFixed(1);
                }.property(
                  'SDL.ClimateController.model.climateControlData.desiredTemp',
                  'SDL.ClimateController.model.climateControlData.temperatureUnit'
                ),
                contentBinding: 'temp',
                disabledBinding: 'parentView.disabled'
              }
            ),
            desiredTemp_plus: SDL.Button.extend(
              {
                elementId: 'desiredTemp_plus',
                classNames: 'plus',
                templateName: 'icon',
                model: '',
                icon: 'images/climate/plus_ico.png',
                onDown: false,
                model: 'currentClimateModel',
                method: 'desiredTempUp',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            )
          }
        ),
        desiredTempLabel: SDL.Label.extend(
          {
            elementId: 'desiredTempLabel',
            content: 'Desired temp'
          }
        ),
        fanSpeed: Em.ContainerView.extend(
          {
            elementId: 'fanSpeed_container',
            classNames: 'calc_container',
            disabledBinding: 'parentView.disabled',
            childViews: [
              'fanSpeed_label',
              'fanSpeed_minus',
              'fanSpeed_plus'
            ],
            fanSpeed_minus: SDL.Button.extend(
              {
                elementId: 'fanSpeed_minus',
                classNames: 'minus',
                templateName: 'icon',
                icon: 'images/climate/minus_ico.png',
                onDown: false,
                model: 'currentClimateModel',
                method: 'fanSpeedDown',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            ),
            fanSpeed_label: SDL.Label.extend(
              {
                elementId: 'fanSpeed_label',
                contentBinding: 'SDL.ClimateController.model.climateControlData.fanSpeed',
                disabledBinding: 'parentView.disabled'
              }
            ),
            fanSpeed_plus: SDL.Button.extend(
              {
                elementId: 'fanSpeed_plus',
                classNames: 'plus',
                templateName: 'icon',
                icon: 'images/climate/plus_ico.png',
                onDown: false,
                model: 'currentClimateModel',
                method: 'fanSpeedUp',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            )
          }
        ),
        fanSpeedLabel: SDL.Label.extend(
          {
            elementId: 'fanSpeedLabel',
            content: 'Fan speed'
          }
        ),
        currentTemp: Em.ContainerView.extend(
          {
            elementId: 'currentTemp_container',
            classNames: 'calc_container',
            disabledBinding: 'parentView.disabled',
            childViews: [
              'currentTemp_label',
              'currentTemp_minus',
              'currentTemp_plus'
            ],
            currentTemp_minus: SDL.Button.extend(
              {
                elementId: 'currentTemp_minus',
                classNames: 'minus',
                templateName: 'icon',
                icon: 'images/climate/minus_ico.png',
                onDown: false,
                model: 'currentClimateModel',
                method: 'currentTempDown',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            ),
            currentTemp_label: SDL.Label.extend(
              {
                elementId: 'currentTemp_label',
                temp: function() {
                  temperature_struct = SDL.ClimateController.getTemperatureStruct(
                    SDL.ClimateController.model.climateControlData.temperatureUnit,
                    SDL.ClimateController.model.climateControlData.currentTemp
                  );
                  return temperature_struct.value.toFixed(1);
                }.property(
                  'SDL.ClimateController.model.climateControlData.currentTemp',
                  'SDL.ClimateController.model.climateControlData.temperatureUnit'
                ),
                contentBinding: 'temp',
                disabledBinding: 'parentView.disabled'
              }
            ),
            currentTemp_plus: SDL.Button.extend(
              {
                elementId: 'currentTemp_plus',
                classNames: 'plus',
                templateName: 'icon',
                icon: 'images/climate/plus_ico.png',
                onDown: false,
                model: 'currentClimateModel',
                method: 'currentTempUp',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            )
          }
        ),
        curentTempLabel: SDL.Label.extend(
          {
            elementId: 'curentTempLabel',
            content: 'Current temp'
          }
        ),
        defrostZone: Em.ContainerView.extend(
          {
            elementId: 'defrostZone',
            classNames: 'quattro_container',
            childViews: [
              'defrostZone_Rear',
              'defrostZone_Front'
            ],
            selectedBinding: 'SDL.ClimateController.model.climateControlData.defrostZone',
            defrostZone_Rear: SDL.Button.extend(
              {
                elementId: 'defrostZoneRear',
                classNames: 'defrostZoneRear topRight',
                classNameBindings: 'highlighted',
                highlighted: function() {
                  return this._parentView.selected === 'REAR' ||
                         this._parentView.selected === 'ALL';
                }.property('parentView.selected'),
                templateName: 'icon',
                icon: 'images/climate/defrost_ico.png',
                onDown: false,
                disabledBinding: 'parentView.parentView.disabled',
                model: 'currentClimateModel',
                method: 'defrostRearEnable',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            ),
            defrostZone_Front: SDL.Button.extend(
              {
                elementId: 'defrostZoneFront',
                classNames: 'defrostZoneFront topLeft',
                classNameBindings: 'highlighted',
                highlighted: function() {
                  return this._parentView.selected === 'FRONT' ||
                         this._parentView.selected === 'ALL';
                }.property('parentView.selected'),
                templateName: 'icon',
                icon: 'images/climate/windsheald_ico.png',
                onDown: false,
                disabledBinding: 'parentView.parentView.disabled',
                model: 'currentClimateModel',
                method: 'defrostFrontEnable',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            )
          }
        ),
        defrostZoneLabel: SDL.Label.extend(
          {
            elementId: 'defrostZoneLabel',
            content: 'Defrost Zone'
          }
        ),
        temperatureUnit: Em.ContainerView.extend(
          {
            elementId: 'temperatureUnit',
            classNames: 'quattro_container',
            childViews: [
              'fahrenheit',
              'celsius'
            ],
            selectedBinding: 'SDL.ClimateController.model.climateControlData.temperatureUnit',
            fahrenheit: SDL.Button.extend(
              {
                elementId: 'fahrenheit',
                classNames: 'fahrenheit topLeft',
                classNameBindings: 'highlighted',
                highlighted: function() {
                  return this._parentView.selected === 'FAHRENHEIT';
                }.property('parentView.selected'),
                text: 'F',
                onDown: false,
                disabledBinding: 'parentView.parentView.disabled',
                model: 'currentClimateModel',
                method: 'temperatureUnitFahrenheitEnable',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            ),
            celsius: SDL.Button.extend(
              {
                elementId: 'celsius',
                classNames: 'celsius topRight',
                classNameBindings: 'highlighted',
                highlighted: function() {
                  return this._parentView.selected === 'CELSIUS';
                }.property('parentView.selected'),
                text: 'C',
                onDown: false,
                disabledBinding: 'parentView.parentView.disabled',
                model: 'currentClimateModel',
                method: 'temperatureUnitCelsiusEnable',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            )
          }
        ),
        temperatureUnitLabel: SDL.Label.extend(
          {
            elementId: 'temperatureUnitLabel',
            content: 'Temperature Unit'
          }
        ),
        ventilationMode: Em.ContainerView.extend(
          {
            elementId: 'ventilationMode',
            classNames: 'quattro_container',
            childViews: [
              'ventilationMode_Upper',
              'ventilationMode_Lower'
            ],
            selectedBinding: 'SDL.ClimateController.model.climateControlData.ventilationMode',
            ventilationMode_Upper: SDL.Button.extend(
              {
                elementId: 'ventilationModeUpper',
                classNames: 'ventilationModeUpper topRight',
                classNameBindings: 'highlighted',
                highlighted: function() {
                  return this._parentView.selected === 'UPPER' ||
                         this._parentView.selected === 'BOTH';
                }.property('parentView.selected'),
                text: 'UP',
                onDown: false,
                disabledBinding: 'parentView.parentView.disabled',
                model: 'currentClimateModel',
                method: 'ventilationModeUpperEnable',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            ),
            ventilationMode_Lower: SDL.Button.extend(
              {
                elementId: 'ventilationModeLower',
                classNames: 'ventilationModeLower topLeft',
                classNameBindings: 'highlighted',
                highlighted: function() {
                  return this._parentView.selected === 'LOWER' ||
                         this._parentView.selected === 'BOTH';
                }.property('parentView.selected'),
                text: 'LOW',
                onDown: false,
                disabledBinding: 'parentView.parentView.disabled',
                model: 'currentClimateModel',
                method: 'ventilationModeLowerEnable',
                action: 'action',
                target: 'SDL.RCModulesController'
              }
            )
          }
        ),
        ventilationModeLabel: SDL.Label.extend(
          {
            elementId: 'ventilationModeLabel',
            content: 'Ventilation Mode'
          }
        ),
        acEnable: SDL.Button.extend(
          {
            elementId: 'acEnable',
            classNames: 'acEnable switcher',
            disabledBinding: 'parentView.disabled',
            iconBinding: 'onIconChange',
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.ClimateController.model.climateControlData.acEnable);
            }.property(
              'SDL.ClimateController.model.climateControlData.acEnable'
            ),
            model: 'currentClimateModel',
            method: 'toggleAcEnable',
            action: 'action',
            target: 'SDL.RCModulesController',
            onDown: false,
            text: 'AC'
          }
        ),
        acMaxEnable: SDL.Button.extend(
          {
            elementId: 'acMaxEnable',
            classNames: 'acMaxEnable switcher',
            iconBinding: 'onIconChange',
            disabledBinding: 'parentView.disabled',
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.ClimateController.model.climateControlData.acMaxEnable);
            }.property(
              'SDL.ClimateController.model.climateControlData.acMaxEnable'
            ),
            model: 'currentClimateModel',
            method: 'toggleAcMaxEnable',
            action: 'action',
            target: 'SDL.RCModulesController',
            onDown: false,
            text: 'AC max'
          }
        ),
        autoModeEnable: SDL.Button.extend(
          {
            elementId: 'autoModeEnable',
            classNames: 'autoModeEnable switcher',
            iconBinding: 'onIconChange',
            disabledBinding: 'parentView.disabled',
            // Change Icon for Frequency Scan
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.ClimateController.model.climateControlData.autoModeEnable);
            }.property(
              'SDL.ClimateController.model.climateControlData.autoModeEnable'
            ),
            model: 'currentClimateModel',
            method: 'toggleAutoModeEnable',
            action: 'action',
            target: 'SDL.RCModulesController',
            onDown: false,
            text: 'Auto'
          }
        ),
        dualModeEnable: SDL.Button.extend(
          {
            elementId: 'dualModeEnable',
            classNames: 'dualModeEnable switcher',
            iconBinding: 'onIconChange',
            disabledBinding: 'parentView.disabled',
            // Change Icon for Frequency Scan
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.ClimateController.model.climateControlData.dualModeEnable);
            }.property(
              'SDL.ClimateController.model.climateControlData.dualModeEnable'
            ),
            model: 'currentClimateModel',
            method: 'toggleDualMode',
            action: 'action',
            target: 'SDL.RCModulesController',
            onDown: false,
            text: 'Dual'
          }
        ),
        recirculateAirEnable: SDL.Button.extend(
          {
            elementId: 'recirculateAirEnable',
            classNames: 'recirculateAirEnable switcher',
            iconBinding: 'onIconChange',
            disabledBinding: 'parentView.disabled',
            // Change Icon for Frequency Scan
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.ClimateController.model.climateControlData.circulateAirEnable);
            }.property(
              'SDL.ClimateController.model.climateControlData.circulateAirEnable'
            ),
            righticon: 'images/climate/recycle_ico.png',
            model: 'currentClimateModel',
            method: 'toggleRecirculateAir',
            action: 'action',
            target: 'SDL.RCModulesController',
            templateName: 'rightIcon',
            onDown: false
          }
        ),
        heatedWindshieldEnable: SDL.Button.extend({
          elementId: 'heatedWindshieldEnable',
          classNames: 'heatedWindshieldEnable switcher',
          iconBinding: 'onIconChange',
          disabledBinding: 'parentView.disabled',
          onIconChange: function() {
            return SDL.SDLController.getLedIndicatorImagePath(
              SDL.ClimateController.model.climateControlData.heatedWindshieldEnable);
          }.property(
            'SDL.ClimateController.model.climateControlData.heatedWindshieldEnable'
          ),
          model: 'currentClimateModel',
          method: 'toggleHeatedWindshieldEnable',
          action: 'action',
          target: 'SDL.RCModulesController',
          onDown: false,
          text: 'HW'
        }),
        heatedRearWindowEnable: SDL.Button.extend({
          elementId: 'heatedRearWindowEnable',
          classNames: 'heatedRearWindowEnable switcher',
          iconBinding: 'onIconChange',
          disabledBinding: 'parentView.disabled',
          onIconChange: function() {
            return SDL.SDLController.getLedIndicatorImagePath(
              SDL.ClimateController.model.climateControlData.heatedRearWindowEnable);
          }.property(
            'SDL.ClimateController.model.climateControlData.heatedRearWindowEnable'
          ),
          model: 'currentClimateModel',
          method: 'toggleHeatedRearWindowEnable',
          action: 'action',
          target: 'SDL.RCModulesController',
          onDown: false,
          text: 'HR'
        }),
        heatedSteeringWheelEnable: SDL.Button.extend({
          elementId: 'heatedSteeringWheelEnable',
          classNames: 'heatedSteeringWheelEnable switcher',
          iconBinding: 'onIconChange',
          disabledBinding: 'parentView.disabled',
          onIconChange: function() {
            return SDL.SDLController.getLedIndicatorImagePath(
              SDL.ClimateController.model.climateControlData.heatedSteeringWheelEnable);
          }.property(
            'SDL.ClimateController.model.climateControlData.heatedSteeringWheelEnable'
          ),
          model: 'currentClimateModel',
          method: 'toggleHeatedSteeringWheelEnable',
          action: 'action',
          target: 'SDL.RCModulesController',
          onDown: false,
          text: 'HS'
        }),
        heatedMirrorsEnable: SDL.Button.extend({
          elementId: 'heatedMirrorsEnable',
          classNames: 'heatedMirrorsEnable switcher',
          iconBinding: 'onIconChange',
          disabledBinding: 'parentView.disabled',
          onIconChange: function() {
            return SDL.SDLController.getLedIndicatorImagePath(
              SDL.ClimateController.model.climateControlData.heatedMirrorsEnable);
          }.property(
            'SDL.ClimateController.model.climateControlData.heatedMirrorsEnable'
          ),
          model: 'currentClimateModel',
          method: 'toggleHeatedMirrorsEnable',
          action: 'action',
          target: 'SDL.RCModulesController',
          onDown: false,
          text: 'HM'
        })
      }
    )
  }
);
