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
            'bandCheckbox',
            'bandLabel',
            'bandSelect',
            'rdsDataLabel',
            'PSCheckbox',
            'PSLabel',
            'PSInput',
            'RTCheckbox',
            'RTLabel',
            'RTInput',
            'CTCheckbox',
            'CTLabel',
            'CTInput',
            'PICheckbox',
            'PILabel',
            'PIInput',
            'PTYCheckbox',
            'PTYLabel',
            'PTYInput',
            'TPCheckbox',
            'TPLabel',
            'TPSelect',
            'TACheckbox',
            'TALabel',
            'TASelect',
            'REGCheckbox',
            'REGLabel',
            'REGInput',
            'availableHDsCheckbox',
            'availableHDsLabel',
            'availableHDsInput',
            'hdChannelCheckbox',
            'hdChannelLabel',
            'hdChannelInput',
            'signalStrengthCheckbox',
            'signalStrengthLabel',
            'signalStrengthInput',
            'signalChangeThresholdCheckbox',
            'signalChangeThresholdLabel',
            'signalChangeThresholdInput',
            'stateCheckbox',
            'stateLabel',
            'stateSelect',
            'send'
          ],
          bandCheckbox: Em.Checkbox.extend(
            {
              elementId: 'bandCheckbox',
              classNames: 'bandCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.band'
            }
          ),
          bandLabel: SDL.Label.extend(
            {
              elementId: 'bandLabel',
              classNames: 'bandLabel',
              content: 'Band'
            }
          ),
          bandSelect: Em.Select.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'bandSelect',
              classNames: 'bandSelect',
              contentBinding: 'SDL.RadioModel.bandStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.band',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.band) {
                  var data = {
                    'band': SDL.RadioModel.lastOptionParams.band
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.band;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.band'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          rdsDataLabel: SDL.Label.extend(
            {
              elementId: 'rdsDataLabel',
              classNames: 'rdsDataLabel',
              content: 'RDS Data list'
            }
          ),
          PSCheckbox: Em.Checkbox.extend(
            {
              elementId: 'PSCheckbox',
              classNames: 'PSCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.rdsData.PS'
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
              attributeBindings: ['disabled'],
              elementId: 'PSInput',
              classNames: 'PSInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.PS',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.rdsData.PS) {
                  var data = {
                    'rdsData': {
                      'PS': SDL.RadioModel.lastOptionParams.rdsData.PS
                    }
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.PS;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.PS'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          RTCheckbox: Em.Checkbox.extend(
            {
              elementId: 'RTCheckbox',
              classNames: 'RTCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.rdsData.RT'
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
              attributeBindings: ['disabled'],
              elementId: 'RTInput',
              classNames: 'RTInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.RT',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.rdsData.RT) {
                  var data = {
                    'rdsData': {
                      'RT': SDL.RadioModel.lastOptionParams.rdsData.RT
                    }
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.RT;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.RT'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          CTCheckbox: Em.Checkbox.extend(
            {
              elementId: 'CTCheckbox',
              classNames: 'CTCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.rdsData.CT'
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
              attributeBindings: ['disabled'],
              elementId: 'CTInput',
              classNames: 'CTInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.CT',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.rdsData.CT) {
                  var data = {
                    'rdsData': {
                      'CT': SDL.RadioModel.lastOptionParams.rdsData.CT
                    }
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.CT;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.CT'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          PICheckbox: Em.Checkbox.extend(
            {
              elementId: 'PICheckbox',
              classNames: 'PICheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.rdsData.PI'
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
              attributeBindings: ['disabled'],
              elementId: 'PIInput',
              classNames: 'PIInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.PI',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.rdsData.PI) {
                  var data = {
                    'rdsData': {
                      'PI': SDL.RadioModel.lastOptionParams.rdsData.PI
                    }
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.PI;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.PI'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          PTYCheckbox: Em.Checkbox.extend(
            {
              elementId: 'PTYCheckbox',
              classNames: 'PTYCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.rdsData.PTY'
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
              attributeBindings: ['disabled'],
              elementId: 'PTYInput',
              classNames: 'PTYInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.PTY',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.rdsData.PTY) {
                  var data = {
                    'rdsData': {
                      'PTY': SDL.RadioModel.lastOptionParams.rdsData.PTY
                    }
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.PTY;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.PTY'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          TPCheckbox: Em.Checkbox.extend(
            {
              elementId: 'TPCheckbox',
              classNames: 'TPCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.rdsData.TP'
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
              attributeBindings: ['disabled'],
              elementId: 'TPSelect',
              classNames: 'TPSelect',
              contentBinding: 'SDL.RadioModel.boolStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.TP',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.rdsData.TP) {
                  var data = {
                    'rdsData': {
                      'TP': SDL.RadioModel.lastOptionParams.rdsData.TP
                    }
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.TP;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.TP'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          TACheckbox: Em.Checkbox.extend(
            {
              elementId: 'TACheckbox',
              classNames: 'TACheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.rdsData.TA'
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
              attributeBindings: ['disabled'],
              elementId: 'TASelect',
              classNames: 'TASelect',
              contentBinding: 'SDL.RadioModel.boolStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.TA',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.rdsData.TA) {
                  var data = {
                    'rdsData': {
                      'TA': SDL.RadioModel.lastOptionParams.rdsData.TA
                    }
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.TA;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.TA'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          REGCheckbox: Em.Checkbox.extend(
            {
              elementId: 'REGCheckbox',
              classNames: 'REGCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.rdsData.REG'
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
              attributeBindings: ['disabled'],
              elementId: 'REGInput',
              classNames: 'REGInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.rdsData.REG',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.rdsData.REG) {
                  var data = {
                    'rdsData': {
                      'REG': SDL.RadioModel.lastOptionParams.rdsData.REG
                    }
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.REG;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.REG'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          availableHDsCheckbox: Em.Checkbox.extend(
            {
              elementId: 'availableHDsCheckbox',
              classNames: 'availableHDsCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.availableHDs'
            }
          ),
          availableHDsLabel: SDL.Label.extend(
            {
              elementId: 'availableHDsLabel',
              classNames: 'availableHDsLabel',
              content: 'availableHDs'
            }
          ),
          availableHDsInput: Em.Select.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'availableHDsInput',
              classNames: 'availableHDsInput',
              contentBinding: 'SDL.RadioModel.hdChannelsStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.availableHDs',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.availableHDs) {
                  var data = {
                    'availableHDs': SDL.RadioModel.lastOptionParams.availableHDs
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.availableHDs;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.availableHDs'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          hdChannelCheckbox: Em.Checkbox.extend(
            {
              elementId: 'hdChannelCheckbox',
              classNames: 'hdChannelCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.hdChannel'
            }
          ),
          hdChannelLabel: SDL.Label.extend(
            {
              elementId: 'hdChannelLabel',
              classNames: 'hdChannelLabel',
              content: 'hdChannel'
            }
          ),
          hdChannelInput: Em.Select.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'hdChannelInput',
              classNames: 'hdChannelInput',
              availableHDValueChanged: function() {
                var result = SDL.RadioModel.hdChannelsStruct.slice();
                var index = result.indexOf(
                  SDL.RadioModel.radioControlStruct.availableHDs);
                result.splice(index + 1, index + result.length - 1);
                var maxHdValue = result[result.length - 1];
                if (SDL.RadioModel.radioControlStruct.hdChannel > maxHdValue) {
                  SDL.RadioModel.setCurrentHdChannel(maxHdValue);
                }
                this.set('content', result);
              }.observes(
                'SDL.RadioModel.radioControlStruct.availableHDs'
              ),
              valueBinding: 'SDL.RadioModel.radioControlStruct.hdChannel',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.hdChannel) {
                  var data = {
                    'hdChannel': SDL.RadioModel.lastOptionParams.hdChannel
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.hdChannel;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.hdChannel'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          signalStrengthCheckbox: Em.Checkbox.extend(
            {
              elementId: 'signalStrengthCheckbox',
              classNames: 'signalStrengthCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.signalStrength'
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
              attributeBindings: ['disabled'],
              elementId: 'signalStrengthInput',
              classNames: 'signalStrengthInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.signalStrength',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.signalStrength) {
                  var data = {
                    'signalStrength': SDL.RadioModel.lastOptionParams.signalStrength
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.signalStrength;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.signalStrength'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          signalChangeThresholdCheckbox: Em.Checkbox.extend(
            {
              elementId: 'signalChangeThresholdCheckbox',
              classNames: 'signalChangeThresholdCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.signalChangeThreshold'
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
              attributeBindings: ['disabled'],
              elementId: 'signalChangeThresholdInput',
              classNames: 'signalChangeThresholdInput',
              valueBinding: 'SDL.RadioModel.radioControlStruct.signalChangeThreshold',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.signalChangeThreshold) {
                  var data = {
                    'signalChangeThreshold': SDL.RadioModel.lastOptionParams.signalChangeThreshold
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.signalChangeThreshold;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.signalChangeThreshold'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          stateCheckbox: Em.Checkbox.extend(
            {
              elementId: 'stateCheckbox',
              classNames: 'stateCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.state'
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
              attributeBindings: ['disabled'],
              elementId: 'stateSelect',
              classNames: 'stateSelect',
              contentBinding: 'SDL.RadioModel.stateStruct',
              valueBinding: 'SDL.RadioModel.radioControlStruct.state',
              isDisabled: function() {
                if (!SDL.RadioModel.radioControlCheckboxes.state) {
                  var data = {
                    'state': SDL.RadioModel.lastOptionParams.state
                  };
                  SDL.RadioModel.setRadioData(data);
                }
                return !SDL.RadioModel.radioControlCheckboxes.state;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.state'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          send: SDL.Button.extend(
            {
              elementId: 'sendButton',
              classNames: 'sendButton button',
              text: 'Send',
              onDown: false,
              target: 'SDL.RadioModel',
              action: 'sendButtonPress'
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
          classNameBindings: [
            'SDL.RadioModel.radioControlStruct.radioEnable:active_state:inactive_state'
          ],
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
                          if (!SDL.RadioModel.radioControlStruct.radioEnable) {
                            return true;
                          }
                          if (this.preset == 'X') {
                            return !SDL.RadioModel.directTuneKeypressed;
                          } else if (this.preset == 'Enter') {
                            return !SDL.RadioModel.directTuneFinished;
                          } else if (this.preset != 'X') {
                            return !SDL.RadioModel.get('directTuneKeys')
                              .contains(this.preset);
                          }
                        }.property(
                          'SDL.RadioModel.radioControlStruct.radioEnable',
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
                  onEnableRadioClick: function() {
                    this.set('disabled',
                      !SDL.RadioModel.radioControlStruct.radioEnable);
                  }.observes(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabled: true,
                  elementId: 'radio_media_preset_button1',
                  classNames: 'a0',
                  getPresetText: function() {
                    var band = SDL.RadioModel.radioControlStruct.band;
                    return SDL.RadioModel.preset[band][0];
                  }.property(
                    'SDL.RadioModel.radioControlStruct.band'
                  ),
                  textBinding: 'getPresetText',
                  templateName: 'text',
                  preset: 0,
                  presetName: 'PRESET_1'
                }
              ),
              2: SDL.RadioPresetButton.extend(
                {
                  onEnableRadioClick: function() {
                    this.set('disabled',
                      !SDL.RadioModel.radioControlStruct.radioEnable);
                  }.observes(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabled: true,
                  elementId: 'radio_media_preset_button2',
                  classNames: 'a1',
                  getPresetText: function() {
                    var band = SDL.RadioModel.radioControlStruct.band;
                    return SDL.RadioModel.preset[band][1];
                  }.property(
                    'SDL.RadioModel.radioControlStruct.band'
                  ),
                  textBinding: 'getPresetText',
                  templateName: 'text',
                  preset: 1,
                  presetName: 'PRESET_2'
                }
              ),
              3: SDL.RadioPresetButton.extend(
                {
                  onEnableRadioClick: function() {
                    this.set('disabled',
                      !SDL.RadioModel.radioControlStruct.radioEnable);
                  }.observes(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabled: true,
                  elementId: 'radio_media_preset_button3',
                  classNames: 'a2',
                  getPresetText: function() {
                    var band = SDL.RadioModel.radioControlStruct.band;
                    return SDL.RadioModel.preset[band][2];
                  }.property(
                    'SDL.RadioModel.radioControlStruct.band'
                  ),
                  textBinding: 'getPresetText',
                  templateName: 'text',
                  preset: 2,
                  presetName: 'PRESET_3'
                }
              ),
              4: SDL.RadioPresetButton.extend(
                {
                  onEnableRadioClick: function() {
                    this.set('disabled',
                      !SDL.RadioModel.radioControlStruct.radioEnable);
                  }.observes(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabled: true,
                  elementId: 'radio_media_preset_button4',
                  classNames: 'a3',
                  getPresetText: function() {
                    var band = SDL.RadioModel.radioControlStruct.band;
                    return SDL.RadioModel.preset[band][3];
                  }.property(
                    'SDL.RadioModel.radioControlStruct.band'
                  ),
                  textBinding: 'getPresetText',
                  templateName: 'text',
                  preset: 3,
                  presetName: 'PRESET_4'
                }
              ),
              5: SDL.RadioPresetButton.extend(
                {
                  onEnableRadioClick: function() {
                    this.set('disabled',
                      !SDL.RadioModel.radioControlStruct.radioEnable);
                  }.observes(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabled: true,
                  elementId: 'radio_media_preset_button5',
                  classNames: 'a4',
                  getPresetText: function() {
                    var band = SDL.RadioModel.radioControlStruct.band;
                    return SDL.RadioModel.preset[band][4];
                  }.property(
                    'SDL.RadioModel.radioControlStruct.band'
                  ),
                  textBinding: 'getPresetText',
                  templateName: 'text',
                  preset: 4,
                  presetName: 'PRESET_5'
                }
              ),
              6: SDL.RadioPresetButton.extend(
                {
                  onEnableRadioClick: function() {
                    this.set('disabled',
                      !SDL.RadioModel.radioControlStruct.radioEnable);
                  }.observes(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabled: true,
                  elementId: 'radio_media_preset_button6',
                  classNames: 'a5',
                  getPresetText: function() {
                    var band = SDL.RadioModel.radioControlStruct.band;
                    return SDL.RadioModel.preset[band][5];
                  }.property(
                    'SDL.RadioModel.radioControlStruct.band'
                  ),
                  textBinding: 'getPresetText',
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
              iconBinding: 'onIconChange',
              // Change Icon for Frequency Scan
              onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.RadioModel.radioControlStruct.radioEnable);
              }.property('SDL.RadioModel.radioControlStruct.radioEnable')
            }
          ),
          scanButton: SDL.Button.extend(
            {
              onEnableRadioClick: function() {
                this.set('disabled',
                  !SDL.RadioModel.radioControlStruct.radioEnable);
              }.observes(
                'SDL.RadioModel.radioControlStruct.radioEnable'
              ),
              disabled: true,
              elementId: 'media_fm_scanButton',
              classNames: ['rs-item'],
              iconBinding: 'onIconChange',
              // Change Icon for Frequency Scan
              onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.RadioModel.scanState);
              }.property('SDL.RadioModel.scanState'),
              action: 'scanKeyPress',
              target: 'SDL.RadioModel',
              onDown: false,
              text: 'Scan'
            }
          ),
          optionsButton: SDL.Button.extend(
            {
              onEnableRadioClick: function() {
                this.set('disabled',
                  !SDL.RadioModel.radioControlStruct.radioEnable);
              }.observes(
                'SDL.RadioModel.radioControlStruct.radioEnable'
              ),
              disabled: true,
              elementId: 'media_fm_optionButton',
              classNames: ['rs-item'],
              icon: 'images/media/active_arrow.png',
              text: 'Options',
              target: 'SDL.RadioModel',
              action: 'toggleOptions'
            }
          ),
          directTuneButton: SDL.Button.extend(
            {
              onEnableRadioClick: function() {
                this.set('disabled',
                  !SDL.RadioModel.radioControlStruct.radioEnable);
              }.observes(
                'SDL.RadioModel.radioControlStruct.radioEnable'
              ),
              disabled: true,
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
              onEnableRadioClick: function() {
                this.set('disabled',
                  !SDL.RadioModel.radioControlStruct.radioEnable);
              }.observes(
                'SDL.RadioModel.radioControlStruct.radioEnable'
              ),
              disabled: true,
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
                  onEnableRadioClick: function() {
                    this.set('disabled',
                      !SDL.RadioModel.radioControlStruct.radioEnable);
                  }.observes(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabled: true,
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
                  onEnableRadioClick: function() {
                    this.set('disabled',
                      !SDL.RadioModel.radioControlStruct.radioEnable);
                  }.observes(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabled: true,
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
