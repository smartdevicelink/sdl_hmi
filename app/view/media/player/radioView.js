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
 * @name SDL.RadioView
 * @desc SDL Media application module visual representation
 * @category View
 * @filesource app/view/media/radioView.js
 * @version 1.0
 */
SDL.RadioView = Em.ContainerView
  .create(
    {
      /**
       * View Id
       */
      elementId: 'radio_view_container',
      classNameBindings: [
        'SDL.States.media.player.radio.active:active_state:inactive_state'
      ],
      /**
       * View Components
       */
      childViews: [
        'rightmenu',
        'info',
        'tuneButtons',
        'optionsMenu'
      ],
      optionsMenu: Em.ContainerView.create(
        {
          elementId: 'radio_options_view_container',
          classNames: 'options',
          classNameBindings: [
            'SDL.RadioModel.optionsEnabled:active_state:inactive_state'
          ],
          /**
           * View Components
           */
          childViews: [
            'bandLabel',
            'bandSelect',
            'rdsDataLabel',
            'PSLabel',
            'PSInput',
            'RTLabel',
            'RTInput',
            'CTLabel',
            'CTInput',
            'PILabel',
            'PIInput',
            'PTYLabel',
            'PTYInput',
            'TPLabel',
            'TPSelect',
            'TALabel',
            'TASelect',
            'REGLabel',
            'REGInput',
            'availableHDsLabel',
            'availableHDsInput',
            'hdChannelLabel',
            'hdChannelInput',
            'signalStrengthLabel',
            'signalStrengthInput',
            'signalChangeThresholdLabel',
            'signalChangeThresholdInput',
            'stateLabel',
            'stateSelect',
            'send'
          ],
          bandLabel: SDL.Label.extend(
            {
              elementId: 'bandLabel',
              classNames: 'bandLabel',
              content: 'Band'
            }
          ),
          bandSelect: Em.Select.extend(
            {
              elementId: 'bandSelect',
              classNames: 'bandSelect',
              contentBinding: 'SDL.RadioModel.bandStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.band'
            }
          ),
          rdsDataLabel: SDL.Label.extend(
            {
              elementId: 'rdsDataLabel',
              classNames: 'rdsDataLabel',
              content: 'RDS Data list'
            }
          ),
          PSLabel: SDL.Label.extend(
            {
              elementId: 'PSLabel',
              classNames: 'PSLabel',
              content: 'PS'
            }
          ),
          /**
           * Input
           */
          PSInput: Ember.TextField.extend(
            {
              elementId: 'PSInput',
              classNames: 'PSInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.PS'
            }
          ),
          RTLabel: SDL.Label.extend(
            {
              elementId: 'RTLabel',
              classNames: 'RTLabel',
              content: 'RT'
            }
          ),
          /**
           * Input
           */
          RTInput: Ember.TextField.extend(
            {
              elementId: 'RTInput',
              classNames: 'RTInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.RT'
            }
          ),
          CTLabel: SDL.Label.extend(
            {
              elementId: 'CTLabel',
              classNames: 'CTLabel',
              content: 'CT'
            }
          ),
          /**
           * Input
           */
          CTInput: Ember.TextField.extend(
            {
              elementId: 'CTInput',
              classNames: 'CTInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.CT'
            }
          ),
          PILabel: SDL.Label.extend(
            {
              elementId: 'PILabel',
              classNames: 'PILabel',
              content: 'PI'
            }
          ),
          /**
           * Input
           */
          PIInput: Ember.TextField.extend(
            {
              elementId: 'PIInput',
              classNames: 'PIInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.PI'
            }
          ),
          PTYLabel: SDL.Label.extend(
            {
              elementId: 'PTYLabel',
              classNames: 'PTYLabel',
              content: 'PTY'
            }
          ),
          /**
           * Input
           */
          PTYInput: Ember.TextField.extend(
            {
              elementId: 'PTYInput',
              classNames: 'PTYInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.PTY'
            }
          ),
          TPLabel: SDL.Label.extend(
            {
              elementId: 'TPLabel',
              classNames: 'TPLabel',
              content: 'TP'
            }
          ),
          /**
           * Select
           */
          TPSelect: Em.Select.extend(
            {
              elementId: 'TPSelect',
              classNames: 'TPSelect',
              contentBinding: 'SDL.RadioModel.boolStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.TP'
            }
          ),
          TALabel: SDL.Label.extend(
            {
              elementId: 'TALabel',
              classNames: 'TALabel',
              content: 'TA'
            }
          ),
          /**
           * Select
           */
          TASelect: Em.Select.extend(
            {
              elementId: 'TASelect',
              classNames: 'TASelect',
              contentBinding: 'SDL.RadioModel.boolStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.TA'
            }
          ),
          REGLabel: SDL.Label.extend(
            {
              elementId: 'REGLabel',
              classNames: 'REGLabel',
              content: 'REG'
            }
          ),
          /**
           * Input
           */
          REGInput: Ember.TextField.extend(
            {
              elementId: 'REGInput',
              classNames: 'REGInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.REG'
            }
          ),
          availableHDsLabel: SDL.Label.extend(
            {
              elementId: 'availableHDsLabel',
              classNames: 'availableHDsLabel',
              content: 'availableHDs'
            }
          ),
          /**
           * Input
           */
          availableHDsInput: Ember.TextField.extend(
            {
              elementId: 'availableHDsInput',
              classNames: 'availableHDsInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.availableHDs'
            }
          ),
          hdChannelLabel: SDL.Label.extend(
            {
              elementId: 'hdChannelLabel',
              classNames: 'hdChannelLabel',
              content: 'hdChannel'
            }
          ),
          /**
           * Input
           */
          hdChannelInput: Ember.TextField.extend(
            {
              elementId: 'hdChannelInput',
              classNames: 'hdChannelInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.hdChannel'
            }
          ),
          signalStrengthLabel: SDL.Label.extend(
            {
              elementId: 'signalStrengthLabel',
              classNames: 'signalStrengthLabel',
              content: 'signalStrength'
            }
          ),
          /**
           * Input
           */
          signalStrengthInput: Ember.TextField.extend(
            {
              elementId: 'signalStrengthInput',
              classNames: 'signalStrengthInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.signalStrength'
            }
          ),
          signalChangeThresholdLabel: SDL.Label.extend(
            {
              elementId: 'signalChangeThresholdLabel',
              classNames: 'signalChangeThresholdLabel',
              content: 'signalChangeThreshold'
            }
          ),
          /**
           * Input
           */
          signalChangeThresholdInput: Ember.TextField.extend(
            {
              elementId: 'signalChangeThresholdInput',
              classNames: 'signalChangeThresholdInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.signalChangeThreshold'
            }
          ),
          stateLabel: SDL.Label.extend(
            {
              elementId: 'stateLabel',
              classNames: 'stateLabel',
              content: 'state'
            }
          ),
          stateSelect: Em.Select.extend(
            {
              elementId: 'stateSelect',
              classNames: 'stateSelect',
              contentBinding: 'SDL.RadioModel.stateStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.state'
            }
          ),
          send: SDL.Button.extend(
            {
              elementId: 'sendButton',
              classNames: 'sendButton button',
              text: 'Send',
              onDown: false,
              action: function() {
                FFW.RC.onInteriorVehicleDataNotification(
                  'RADIO', null, SDL.RadioModel.get('radioControlData')
                );
              }
            }
          )
        }
      ),
      songInfo: '',
      genre: '',
      info: Em.View.extend(
        {
          STAName: function() {
            return 'STA-' + SDL.RadioModel.station.toString().replace('.', '');
          }.property('SDL.RadioModel.station'),
          songInfo: function() {
            var data = SDL.RadioModel.radioDetails;
            if (data) {
              if (!(data.songInfo.name && data.songInfo.artist)) {
                if (data.songInfo.name) {
                  return data.songInfo.name;
                } else if (data.songInfo.artist) {
                  return data.songInfo.artist;
                }
              } else {
                return data.songInfo.name + ' - ' + data.songInfo.artist;
              }
            }
          }.property(
            'SDL.RadioModel.radioDetails.songInfo.artist',
            'SDL.RadioModel.radioDetails.songInfo.name'
          ),
          template: Em.Handlebars
            .compile(
              '{{#with view}}' +
              '<div class="track-info">' +
              '<div class="STAName">{{STAName}}</div>' +
              '<div class="station">{{SDL.RadioModel.station}}</div>' +
              '<div class="divider_o"></div>' +
              '<div class="genre">{{SDL.RadioModel.radioDetails.songInfo.genre}}</div>' +
              '<div class="songInfo">{{songInfo}}</div>' +
              '</div>' + '{{/with}}'
            )
        }
      ),
      tuneButtons: Em.ContainerView.create(
        {
          elementId: 'radio_media_presetButtons',
          classNames: [
            'main-preset-buttons-wraper'
          ],
          childViews: [
            'presets',
            'tune'
          ],
          tune: Em.ContainerView.extend(
            {
              classNameBindings: [
                'SDL.RadioModel.tuneRadio::hidden'
              ],
              elementId: 'tuneButtons',
              classNames: 'preset-items tuneButtons',
              afterRender: function() {
                var index = [1, 2, 3, 4, 5, 'X', 6, 7, 8, 9, 0, 'Enter'];
                for (var i = 0; i < 12; i++) {
                  this._childViews.pushObject(
                    SDL.Button.create(
                      {
                        classNames: i != 5 ? 'preset-item a0' :
                          'preset-item a0 clear',
                        text: index[i],
                        templateName: i == 5 ? 'icon' : 'text',
                        preset: index[i],
                        icon: i == 5 ? 'images/phone/del.png' : null,
                        action: 'tuneRadioStation',
                        target: 'SDL.RadioModel',
                        disabledBinding: 'isDisabled',
                        isDisabled: function() {
                          if (this.preset == 'X') {
                            return !SDL.RadioModel.directTuneKeypressed;
                          } else if (this.preset == 'Enter') {
                            return !SDL.RadioModel.directTuneFinished;
                          } else if (this.preset != 'X') {
                            return !SDL.RadioModel.get('directTuneKeys')
                              .contains(this.preset);
                          }
                        }.property(
                          'SDL.RadioModel.directTuneKeys',
                          'SDL.RadioModel.directTuneFinished',
                          'SDL.RadioModel.directTuneKeypressed'
                        )
                      }
                    )
                  );
                }
              }
            }
          ),
          presets: Em.ContainerView.extend(
            {
              classNameBindings: [
                'SDL.RadioModel.tuneRadio:hidden'
              ],
              elementId: 'radio_media_presetButtons_wrapper',
              classNames: ['preset-items'],
              childViews: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6'
              ],
              1: SDL.RadioPresetButton.extend(
                {
                  elementId: 'radio_media_preset_button1',
                  classNames: 'a0',
                  textBinding: 'SDL.RadioModel.preset.0',
                  templateName: 'text',
                  preset: 0,
                  presetName: 'PRESET_1'
                }
              ),
              2: SDL.RadioPresetButton.extend(
                {
                  elementId: 'radio_media_preset_button2',
                  classNames: 'a1',
                  textBinding: 'SDL.RadioModel.preset.1',
                  templateName: 'text',
                  preset: 1,
                  presetName: 'PRESET_2'
                }
              ),
              3: SDL.RadioPresetButton.extend(
                {
                  elementId: 'radio_media_preset_button3',
                  classNames: 'a2',
                  textBinding: 'SDL.RadioModel.preset.2',
                  templateName: 'text',
                  preset: 2,
                  presetName: 'PRESET_3'
                }
              ),
              4: SDL.RadioPresetButton.extend(
                {
                  elementId: 'radio_media_preset_button4',
                  classNames: 'a3',
                  textBinding: 'SDL.RadioModel.preset.3',
                  templateName: 'text',
                  preset: 3,
                  presetName: 'PRESET_4'
                }
              ),
              5: SDL.RadioPresetButton.extend(
                {
                  elementId: 'radio_media_preset_button5',
                  classNames: 'a4',
                  textBinding: 'SDL.RadioModel.preset.4',
                  templateName: 'text',
                  preset: 4,
                  presetName: 'PRESET_5'
                }
              ),
              6: SDL.RadioPresetButton.extend(
                {
                  elementId: 'radio_media_preset_button6',
                  classNames: 'a5',
                  textBinding: 'SDL.RadioModel.preset.5',
                  templateName: 'text',
                  preset: 5,
                  presetName: 'PRESET_6'
                }
              )
            }
          )
        }
      ),
      rightmenu: Em.ContainerView.create(
        {
          /** View Id */
          elementId: 'fm_rightmenu_view',
          /** Class Names */
          classNames: ['right-stock'],
          /** View Components*/
          childViews: [
            'RadioEnable',
            'scanButton',
            'optionsButton',
            'directTuneButton',
            'presetsButton',
            'tuneButtons'
          ],
          RadioEnable: SDL.Button.extend(
            {
              elementId: 'media_fm_hdButton',
              classNames: ['rs-item'],
              text: 'Enable Radio',
              disabled: false,
              onDown: false,
              action: 'radioEnableKeyPress',
              target: 'SDL.RadioModel',
              icon: 'images/media/passiv_horiz_led.png',
              // Change Icon for Frequency Scan
              onIconChange: function() {
                if (SDL.RadioModel.radioControlStruct.radioEnable) {
                  this.set('icon', 'images/media/active_horiz_led.png');
                } else {
                  this.set('icon', 'images/media/passiv_horiz_led.png');
                }
              }.observes('SDL.RadioModel.radioControlStruct.radioEnable')
            }
          ),
          scanButton: SDL.Button.extend(
            {
              elementId: 'media_fm_scanButton',
              classNames: ['rs-item'],
              icon: 'images/media/passiv_horiz_led.png',
              // Change Icon for Frequency Scan
              onIconChange: function() {
                if (SDL.RadioModel.scanState) {
                  this.set('icon', 'images/media/active_horiz_led.png');
                } else {
                  this.set('icon', 'images/media/passiv_horiz_led.png');
                }
              }.observes('SDL.RadioModel.scanState'),
              action: 'scanKeyPress',
              target: 'SDL.RadioModel',
              onDown: false,
              text: 'Scan'
            }
          ),
          optionsButton: SDL.Button.extend(
            {
              elementId: 'media_fm_optionButton',
              classNames: ['rs-item'],
              icon: 'images/media/active_arrow.png',
              text: 'Options',
              disabled: false,
              action: function() {
                SDL.SDLModel.resetControl();
                SDL.RadioModel.toggleProperty('optionsEnabled');
              }
            }
          ),
          directTuneButton: SDL.Button.extend(
            {
              elementId: 'media_fm_directButton',
              classNameBindings: [
                'SDL.RadioModel.tuneRadio:hidden'
              ],
              templateName: 'text',
              classNames: ['rs-item'],
              action: 'directTune',
              target: 'SDL.RadioModel',
              onDown: false,
              text: 'Direct Tune'
            }
          ),
          presetsButton: SDL.Button.extend(
            {
              elementId: 'media_fm_presetsButton',
              classNameBindings: [
                'SDL.RadioModel.tuneRadio::hidden'
              ],
              templateName: 'text',
              classNames: ['rs-item'],
              action: 'directTune',
              target: 'SDL.RadioModel',
              onDown: false,
              text: 'Presets'
            }
          ),
          tuneButtons: Em.ContainerView.extend(
            {
              elementId: 'media_fm_tuneButtons',
              childViews: [
                'tuneDown',
                'tuneUp'
              ],
              tuneUp: SDL.Button.extend(
                {
                  elementId: 'media_fm_tuneUpButton',
                  target: 'SDL.RadioModel',
                  action: 'tuneUpPress',
                  onDown: false,
                  templateName: 'text',
                  text: '>>'
                }
              ),
              tuneDown: SDL.Button.extend(
                {
                  elementId: 'media_fm_tuneDownButton',
                  target: 'SDL.RadioModel',
                  action: 'tuneDownPress',
                  onDown: false,
                  templateName: 'text',
                  text: '<<'
                }
              )
            }
          )
        }
      )
    }
  );
