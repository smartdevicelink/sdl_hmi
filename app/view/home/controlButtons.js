/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
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
 * @name SDL.controlButtons
 * @desc Climate module visual representation
 * @category View
 * @filesource app/view/home/controlButtons.js
 * @version 1.0
 */

SDL.ControlButtons = Em.ContainerView.create({

  elementId: 'app_controlButtons',

  childViews: [
    'VRButton',
    'buttonControls',
    'driverDistractionControl',
    'infoTable',
    'vehicleInfo',
    'tbtClientState',
    'ExitApp',
    'SystemRequest',
    'UILanguages',
    'TTSVRLanguages',
    'UILanguagesLabel',
    'TTSVRLanguagesLabel',
    'appUILanguagesLabel',
    'appTTSVRLanguagesLabel',
    'appUILang',
    'appTTSVRLang',
    'keyboard',
    'imageMode',
    'imageModeLabel',
    'RCInfo',
    'vehicleEmulation'
  ],
  vehicleEmulation: Em.View.create(
    {
      elementId: 'warning_vehicle_emulation_btn',
      classNameBindings: [
        'isReady: visible_display', 'pressed:pressed'
      ],
      classNames: [
        'vehicle_emulation_btn',
        'ffw-button'
      ],
      template: Ember.Handlebars.compile('<span>Vehicle</span>'),
      appLoaded: function() {
        var self = this;
        setTimeout(
          function() {
            self.set('isReady', true);
          }, 2000
        );
      }.observes('SDL.appReady'),
      actionDown: function(event) {
        this.set('pressed', true);
      },
      actionUp: function(event) {
        this.set('pressed', false);
        SDL.VehicleEmulationView.set('hide', !SDL.VehicleEmulationView.hide);
        if (SDL.VehicleEmulationView.hide) {
          SDL.VehicleModuleCoverageView.set('hide', true);
          FLAGS.set('VehicleEmulationType', FLAGS.lastVehicleEmulationtype);
          SDL.RCModulesController.populateModels();
        }
      }
    }
  ),

  RCInfo: Em.ContainerView.extend({
    elementId: 'RCInfo',
    classNames: 'RCInfo',
    classNameBindings: ['this.show:show'],
    show: false,
    childViews: [
      'RCModules',
      'RCModulesLabel'
    ],
    
    RCModulesLabel: SDL.Label.extend({
        elementId: 'RCModulesLabel',
        classNames: 'RCModulesLabel',
        content: 'Selected seat:'
      }
    ),

    RCModules: Em.Select.extend({

        elementId: 'RCModule',

        classNames: 'RCModulesSelect',

        show: function(event) {
          this._parentView.set('show', this.content.length);
        }.observes('this.content'),

        change: function(event) {
          SDL.RCModulesController.changeCurrentModule(this.selection);
        }

      }
    ),
  }),

  imageModeLabel: SDL.Label.extend({
    elementId: 'imageModeLabel',
    classNames: 'imageModeLabel',
    content: 'Display mode:'
  }
),

getCurrentDisplayModeClass: function() {
  switch(SDL.ControlButtons.imageMode.selection){
    case SDL.SDLModel.data.imageModeList[0]: return 'day-mode';
    case SDL.SDLModel.data.imageModeList[1]: return 'night-mode';
    case SDL.SDLModel.data.imageModeList[2]: return 'high-lighted-mode';
    default: return '';
  }
},
/**
 * HMI element Select with list of supported image mode
 */
  imageMode:Em.Select.extend({
    elementId: 'imageMode',
    classNames: 'imageModeSelect',
    contentBinding: 'SDL.SDLModel.data.imageModeList',
    selection: 'Highlighted mode',
    change:function(){
      SDL.InfoAppsView.findNewApps.setMode(this.selection);
      SDL.InfoAppsView.Asist911.setMode(this.selection);
      SDL.InfoAppsView.vehicleHealthReport.setMode(this.selection);
      SDL.InfoAppsView.getDeviceList.setMode(this.selection);
      SDL.InfoView.leftMenu.items.servicesButton.setMode(this.selection);
      SDL.InfoView.leftMenu.items.appsButton.setMode(this.selection);
      SDL.InfoView.leftMenu.items.calendarButton.setMode(this.selection);
      SDL.InfoView.leftMenu.items.goToCD.setMode(this.selection);
      SDL.InfoView.leftMenu.items.travelLinkButton.setMode(this.selection);
      SDL.InfoView.leftMenu.items.sdlButton.setMode(this.selection);
      SDL.TurnByTurnView.nextTurnIconImage.setMode(this.selection);
      SDL.TurnByTurnView.turnIconImage.setMode(this.selection);
      SDL.InteractionChoicesView.set('imageMode',this.selection);
      SDL.InteractionChoicesView.updateIcons();
      if (SDL.SDLController.model) {
        SDL.SDLController.model.setMode(this.selection);
        length=SDL.OptionsView.commands.items.length;
        var commands = SDL.SDLController.model.get('currentCommandsList');
        for(var i=0;i<length;i++){
          SDL.OptionsView.commands.items[i].type.prototype.setMode(this.selection);
          if(commands[i].isTemplate){
          SDL.OptionsView.commands.items[i].type.prototype.setMode(this.selection);
          }
        }
        SDL.OptionsView.commands.refreshItems();
      }
    }
  }
),

  keyboard: SDL.Button.extend({
        classNames: ['keyboard', 'button'],
        elementId: 'activate_keyboard',
        action: 'uiShowKeyboard',
        text: 'KEYBOARD',
        target: 'SDL.SDLController',
        search: function() {
          FFW.UI.OnKeyboardInput(SDL.SDLModel.data.keyboardInputValue,
            'ENTRY_SUBMITTED'
          );
        }
      }
    ),
    
  /*
   * Label with name of UILanguages select
   */
  appUILang: SDL.Label.extend({

    elementId: 'appUILang',

    classNames: 'appUILang',

    contentBinding: 'SDL.SDLController.model.UILanguage'
  }
),

  /*
   * Label with name of TTSVRLanguages select
   */
  appTTSVRLang: SDL.Label.extend({

    elementId: 'appTTSVRLang',

    classNames: 'appTTSVRLang',

    contentBinding: 'SDL.SDLController.model.TTSVRLanguage'
  }
),

  /*
   * Label with name of UILanguages select
   */
  appUILanguagesLabel: SDL.Label.extend({

    elementId: 'appUILanguagesLabel',

    classNames: 'appUILanguagesLabel',

    content: 'application UI Languages'
  }
),

  /*
   * Label with name of TTSVRLanguages select
   */
  appTTSVRLanguagesLabel: SDL.Label.extend({

    elementId: 'appTTSVRLanguagesLabel',

    classNames: 'appTTSVRLanguagesLabel',

    content: 'application (TTS + VR) Languages'
  }
),

  /*
   * Label with name of UILanguages select
   */
  UILanguagesLabel: SDL.Label.extend({

    elementId: 'UILanguagesLabel',

    classNames: 'UILanguagesLabel',

    content: 'UI Languages'
  }
),

  /*
   * Label with name of TTSVRLanguages select
   */
  TTSVRLanguagesLabel: SDL.Label.extend({

    elementId: 'TTSVRLanguagesLabel',

    classNames: 'TTSVRLanguagesLabel',

    content: 'TTS + VR Languages'
  }
),

  /*
   * HMI element Select with list of supported UI component languages
   */
  UILanguages: Em.Select.extend({

    elementId: 'UILanguages',

    classNames: 'languageSelect',

    contentBinding: 'SDL.SDLModel.data.sdlLanguagesList',

    valueBinding: 'SDL.SDLModel.data.hmiUILanguage'
  }
),

  /*
   * HMI element Select with list of supported TTS and VR component
   * languages
   */
  TTSVRLanguages: Em.Select.extend({

    elementId: 'TTSVRLanguages',

    classNames: 'languageSelect',

    contentBinding: 'SDL.SDLModel.data.sdlLanguagesList',

    valueBinding: 'SDL.SDLModel.data.hmiTTSVRLanguage'
  }
),

  /**
   * VehicleInfo button
   */
  vehicleInfo: SDL.Button.create({
        elementId: 'vehicleInfoButton',
        classNames: 'vehicleInfoButton btn',
        text: 'Vehicle Info',
        action: function() {

          // this._super();
          SDL.VehicleInfo.toggleActivity();
        },
        templateName: 'text'
      }
    ),

  /**
   * TBT Client State button
   */
  tbtClientState: SDL.Button.create({
        elementId: 'tbtClientStateButton',
        classNames: 'tbtClientStateButton btn',
        text: 'TBT Client State',
        action: function() {

          // this._super();
          SDL.TBTClientStateView.toggleActivity();
        },
        templateName: 'text'
      }
    ),

  /**
   * Exit Application button opens Exit Application reasons popup
   */
  ExitApp: SDL.Button.create({
        elementId: 'exitApp',
        classNames: 'exitApp btn',
        text: 'Exit Application',
        action: function() {

          // this._super();
          SDL.ExitApp.toggleActivity();
        },
        templateName: 'text'
      }
    ),

  /**
   * Exit Application button opens Exit Application reasons popup
   */
  SystemRequest: SDL.Button.create({
        elementId: 'systemRequest',
        classNames: 'systemRequest btn',
        text: 'System Request',
        action: function() {

          // this._super();
          SDL.SystemRequest.toggleActivity();
        },
        templateName: 'text'
      }
    ),

  /**
   * Voice Recognition button
   */
  VRButton: SDL.Button.create({
        elementId: 'VRButton',
        classNames: 'VRButton',
        action: 'activateVRPopUp',
        target: 'SDL.SDLController'
      }
    ),

  infoTable: Em.ContainerView.extend({
        elementId: 'infoTable',

        classNames: 'infoTable',

        childViews: [
          'globalPropertiesLabel',
          'gpHelpData',
          'gpTimeoutData',
          'gpAUTOCOMPLETE',
          'policyURLs'
        ],

        globalPropertiesLabel: SDL.Label.extend({

          elementId: 'sdlGPLabel',

          classNames: 'sdlGPLabel',

          content: 'HELP_PROMPT: TIMEOUT_PROMPT: AUTOCOMPLETE_TEXT: POLICY_URLS:'
        }
      ),

        policyURLs: SDL.Label.extend({

          elementId: 'policyURLs',

          classNames: 'sdlGPData',

          contentBinding: 'this.propertiesData',

          propertiesData: function() {

            var str = '';
            for (var i = 0; i < SDL.SDLModel.data.policyURLs.length; i++) {
              str += SDL.SDLModel.data.policyURLs[i] + '; ';
            }

            return str;
          }.property('SDL.SDLModel.data.policyURLs')
        }
      ),

        gpHelpData: SDL.Label.extend({

          elementId: 'sdlGPHData',

          classNames: 'sdlGPData',

          contentBinding: 'this.propertiesData',

          propertiesData: function() {

            var str = '';
            if (SDL.SDLController.model &&
              SDL.SDLController.model.globalProperties.helpPrompt) {

              var items = SDL.SDLController.model.globalProperties.helpPrompt;
              for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                if ('FILE' == item.type) {
                  str += '[Audio File] ';
                } else {
                  str += item.text + ' ';
                }
              }
            }
            return str;
          }.property(
            'SDL.SDLController.model.globalProperties.helpPrompt.@each.text'
          )
        }
      ),

        gpTimeoutData: SDL.Label.extend({

          elementId: 'sdlGPTData',

          classNames: 'sdlGPData',

          contentBinding: 'this.propertiesData',

          propertiesData: function() {

            var str = '';
            if (SDL.SDLController.model &&
              SDL.SDLController.model.globalProperties.timeoutPrompt) {

              var items = SDL.SDLController.model.globalProperties.timeoutPrompt;
              for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                if ('FILE' == item.type) {
                  str += '[Audio File] ';
                } else {
                  str += item.text + ' ';
                }
              }
            }

            return str;
          }.property(
            'SDL.SDLController.model.globalProperties.timeoutPrompt.@each.text'
          )
        }
      ),

        gpAUTOCOMPLETE: SDL.Label.extend({

          elementId: 'sdlGPAUTOCOMPLETE',

          classNames: 'sdlGPData',

          contentBinding: 'SDL.SDLController.model.globalProperties.keyboardProperties.autoCompleteList',

          propertiesData: function() {
              var str = '';
              if (SDL.SDLController.model && SDL.SDLController.model.globalProperties.keyboardProperties 
                && SDL.SDLController.model.globalProperties.keyboardProperties.autoCompleteList) {
                  for (var i = 0; i < SDL.SDLController.model.globalProperties.keyboardProperties.autoCompleteList.length; i++) {
                      str += SDL.SDLController.model.globalProperties.keyboardProperties.autoCompleteList[i]
                          + ' ';
                  }
              }

              return str;
          }.property(
            'SDL.SDLController.model.globalProperties.keyboardProperties.autoCompleteList.@each'
          )
        }
      )
      }
    ),

  driverDistractionControl: Em.ContainerView.extend({
        elementId: 'driverDistractionControl',

        classNames: 'driverDistractionControl',

        childViews: [
          'driverDistractionLabel', 'driverDistractionCheckBox'
        ],

        driverDistractionLabel: SDL.Label.extend({

          elementId: 'driverDistractionControlLabel',

          classNames: 'driverDistractionControlLabel',

          content: 'DD'
        }
      ),

        driverDistractionCheckBox: Em.Checkbox.extend({

          elementId: 'driverDistractionControlCheckBox',

          classNames: 'driverDistractionControlCheckBox',

          checkedBinding: 'SDL.SDLModel.data.driverDistractionState',

          click: function(event) {
            SDL.SDLController.selectDriverDistraction(event.currentTarget.checked);
          }

        }
      )
      }
    ),

  buttonControls: Em.ContainerView.extend({
        elementId: 'buttonControls',

        classNames: 'buttonControls',

        childViews: [
          'ContainerControlls',
          'OneBtn',
          'TwoBtn',
          'ThreeBtn',
          'FourBtn',
          'FiveBtn',
          'SixBtn',
          'SevenBtn',
          'EightBtn',
          'NineBtn',
          'ZiroBtn'
        ],

        ContainerControlls: Em.ContainerView.extend({
            elementId: 'ContainerControlls',

            classNames: 'ContainerControlls',

            childViews: [
              'UpBtn', 'DownBtn', 'LeftBtn', 'RightBtn', 'OkBtn'
            ],

            /** Up button */
            UpBtn: SDL.Button.create(SDL.PresetEvents, {
                elementId: 'TUNEUP',
                classNames: 'UpBtn',
                time: 0,
                presetName: 'TUNEUP'
              }
            ),

            /** Down button */
            DownBtn: SDL.Button.create(SDL.PresetEvents, {
                elementId: 'TUNEDOWN',
                classNames: 'DownBtn',
                time: 0,
                presetName: 'TUNEDOWN'
              }
            ),

            /** Left button */
            LeftBtn: SDL.Button.create(SDL.PresetEvents, {
                elementId: 'SEEKLEFT',
                classNames: 'LeftBtn',
                time: 0,
                presetName: 'SEEKLEFT'
              }
            ),

            /** Right button */
            RightBtn: SDL.Button.create(SDL.PresetEvents, {
                elementId: 'SEEKRIGHT',
                classNames: 'RightBtn',
                time: 0,
                presetName: 'SEEKRIGHT'
              }
            ),

            /** Ok button */
            OkBtn: SDL.Button.create({
                elementId: 'OK',
                classNames: 'OkBtn',
                time: 0,
                presetName: 'OK',
                actionDown: function() {

                  this._super();
                  SDL.SDLController.onSoftButtonOkActionDown(this.presetName);
                },
                actionUp: function() {

                  this._super();
                  SDL.SDLController.onSoftButtonOkActionUp(this.presetName);
                }
              }
            )
          }
        ),

        /** One button */
        OneBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_1',
            classNames: 'OneBtn btnNotPressed',
            text: '1',
            time: 0,
            presetName: 'PRESET_1',
            templateName: 'text'
          }
        ),

        /** Two button */
        TwoBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_2',
            classNames: 'TwoBtn btnNotPressed',
            text: '2',
            time: 0,
            presetName: 'PRESET_2',
            templateName: 'text'
          }
        ),

        /** Three button */
        ThreeBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_3',
            classNames: 'ThreeBtn btnNotPressed',
            text: '3',
            time: 0,
            presetName: 'PRESET_3',
            templateName: 'text'
          }
        ),

        /** Four button */
        FourBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_4',
            classNames: 'FourBtn btnNotPressed',
            text: '4',
            time: 0,
            presetName: 'PRESET_4',
            templateName: 'text'
          }
        ),

        /** Five button */
        FiveBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_5',
            classNames: 'FiveBtn btnNotPressed',
            text: '5',
            time: 0,
            presetName: 'PRESET_5',
            templateName: 'text'
          }
        ),

        /** One button */
        SixBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_6',
            classNames: 'SixBtn btnNotPressed',
            text: '6',
            time: 0,
            presetName: 'PRESET_6',
            templateName: 'text'
          }
        ),

        /** One button */
        SevenBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_7',
            classNames: 'SevenBtn btnNotPressed',
            text: '7',
            time: 0,
            presetName: 'PRESET_7',
            templateName: 'text'
          }
        ),

        /** One button */
        EightBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_8',
            classNames: 'EightBtn btnNotPressed',
            text: '8',
            time: 0,
            presetName: 'PRESET_8',
            templateName: 'text'
          }
        ),

        /** One button */
        NineBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_9',
            classNames: 'NineBtn btnNotPressed',
            text: '9',
            time: 0,
            presetName: 'PRESET_9',
            templateName: 'text'
          }
        ),

        /** One button */
        ZiroBtn: SDL.Button.create(SDL.PresetEvents, {
            elementId: 'PRESET_0',
            classNames: 'ZiroBtn btnNotPressed',
            text: '0',
            time: 0,
            presetName: 'PRESET_0',
            templateName: 'text'
          }
        )
      }
    )
}
);
