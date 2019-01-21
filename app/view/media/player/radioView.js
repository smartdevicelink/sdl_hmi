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

      setHD:function(){
        if (SDL.RadioModel.radioControlStruct.band != 'XM') {
          SDL.RadioModel.setHDRadioEnable(SDL.RadioModel.radioControlStruct.hdRadioEnable ?
          false : true);
          SDL.RadioModel.set('radioControlCheckboxes.availableHdChannels',
            SDL.RadioModel.radioControlStruct.hdRadioEnable);
          SDL.RadioModel.set('radioControlCheckboxes.hdChannel',
            SDL.RadioModel.radioControlStruct.hdRadioEnable);
          if(SDL.RadioModel.radioControlStruct.hdRadioEnable){
            SDL.RadioModel.sendRadioChangeNotification(['hdRadioEnable',
              'availableHdChannels','hdChannel', 'sisData.*',
              'stationIDNumber.*', 'stationLocation.*']);
          }
          else{
            SDL.RadioModel.sendRadioChangeNotification(['hdRadioEnable']);
          }
          
        }
      },

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
            'availableHDsChannelInput',
            'availableHDsCheckbox',
            'availableHDsLabel',
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
            'sisDataLabel',
            'stationShortNameCheckbox',
            'stationShortNameLabel',
            'stationShortNameInput',
            'stationMessageCheckBox',
            'stationMessageLabel',
            'stationMessageInput',
            'stationLongNameCheckBox',
            'stationLongNameLabel',
            'stationLongNameInput',
            'gpsDataLabel',
            'gpsDataCheckBox',
            'longitudeLabel',
            'longitudeInput',
            'latitudeLabel',
            'latitudeInput',
            'altitudeCheckBox',
            'altitudeLabel',
            'altitudeInput',
            'stationIdLabel',
            'countryCodeCheckBox',
            'countryCodeLabel',
            'countryCodeInput',
            'fccLabel',
            'fccCheckBox',
            'fccInput',
            'send'
          ],


          fccCheckBox: Em.Checkbox.extend(
            {
              elementId: 'fccCheckBox',
              classNames: 'fccCheckBox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.sisData.stationIDNumber.fccFacilityId'
            }
          ),
         fccLabel: SDL.Label.extend(
            {
              elementId: 'fccLabel',
              classNames: 'fccLabel',
              content: 'FCC facility ID'
            }
          ),
        fccInput: Ember.TextField.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'fccInput',
              classNames: 'fccInput',
              valueBinding: 'SDL.RadioModel.lastOptionParams.sisData.stationIDNumber.fccFacilityId',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationIDNumber.fccFacilityId;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationIDNumber.fccFacilityId'
              ),
              
              disabledBinding: 'isDisabled'
            }
          ),


          countryCodeCheckBox: Em.Checkbox.extend(
            {
              elementId: 'countryCodeCheckBox',
              classNames: 'countryCodeCheckBox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.sisData.stationIDNumber.countryCode'
            }
          ),
         countryCodeLabel: SDL.Label.extend(
            {
              elementId: 'countryCodeLabel',
              classNames: 'countryCodeLabel',
              content: 'Country code'
            }
          ),
        countryCodeInput: Ember.TextField.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'countryCodeInput',
              classNames: 'countryCodeInput',
              valueBinding: 'SDL.RadioModel.lastOptionParams.sisData.stationIDNumber.countryCode',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationIDNumber.countryCode;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationIDNumber.countryCode'
              ),
              disabledBinding: 'isDisabled'
            }
          ),


          stationIdLabel: SDL.Label.extend(
            {
              elementId: 'stationIdLabel',
              classNames: 'stationIdLabel',
              content: 'Station ID:'
            }
          ),

          altitudeCheckBox: Em.Checkbox.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'altitudeCheckBox',
              classNames: 'altitudeCheckBox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.altitude',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          altitudeLabel: SDL.Label.extend(
            {
              elementId: 'altitudeLabel',
              classNames: 'altitudeLabel',
              content: 'Altitude'
            }
          ),
          altitudeInput: Ember.TextField.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'altitudeInput',
              classNames: 'altitudeInput',
              valueBinding: 'SDL.RadioModel.lastOptionParams.sisData.stationLocation.altitude',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData ? 
                !SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData
                :!SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.altitude;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData',
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.altitude'
              ),
              disabledBinding: 'isDisabled'
            }
          ),

          
          latitudeLabel: SDL.Label.extend(
            {
              elementId: 'latitudeLabel',
              classNames: 'latitudeLabel',
              content: 'Latitude'
            }
          ),
          latitudeInput: Ember.TextField.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'latitudeInput',
              classNames: 'latitudeInput',
              valueBinding: 'SDL.RadioModel.lastOptionParams.sisData.stationLocation.latitudeDegrees',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData'
              ),
              disabledBinding: 'isDisabled'
            }
          ),


          longitudeLabel: SDL.Label.extend(
            {
              elementId: 'longitudeLabel',
              classNames: 'longitudeLabel',
              content: 'Longitude'
            }
          ),
          longitudeInput: Ember.TextField.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'longitudeInput',
              classNames: 'longitudeInput',
              valueBinding: 'SDL.RadioModel.lastOptionParams.sisData.stationLocation.longitudeDegrees',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          gpsDataCheckBox: Em.Checkbox.extend(
            {
              elementId: 'gpsDataCheckBox',
              classNames: 'gpsDataCheckBox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.sisData.stationLocation.gpsData'
            }
          ),
          stationLongNameCheckBox: Em.Checkbox.extend(
            {
              elementId: 'stationLongNameCheckBox',
              classNames: 'stationLongNameCheckBox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.sisData.stationLongName'
            }
          ),
         stationLongNameLabel: SDL.Label.extend(
            {
              elementId: 'stationLongNameLabel',
              classNames: 'stationLongNameLabel',
              content: 'Station long name'
            }
          ),
         stationLongNameInput: Ember.TextField.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'stationLongNameInput',
              classNames: 'stationLongNameInput',
              valueBinding: 'SDL.RadioModel.lastOptionParams.sisData.stationLongName',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationLongName;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationLongName'
              ),
              disabledBinding: 'isDisabled',
              
            }
          ),
          stationMessageCheckBox: Em.Checkbox.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'stationMessageCheckBox',
              classNames: 'stationMessageCheckBox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.sisData.stationMessage'
            }
          ),
         stationMessageLabel: SDL.Label.extend(
            {
              elementId: 'stationMessageLabel',
              classNames: 'stationMessageLabel',
              content: 'Station message'
            }
          ),
         stationMessageInput: Ember.TextField.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'stationMessageInput',
              classNames: 'stationMessageInput',
              valueBinding: 'SDL.RadioModel.lastOptionParams.sisData.stationMessage', 
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationMessage;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationMessage'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
          sisDataLabel: SDL.Label.extend(
            {
              elementId: 'sisDataLabel',
              classNames: 'sisDataLabel',
              content: 'Sis Data list'
            }
          ),
          gpsDataLabel: SDL.Label.extend(
            {
              elementId: 'gpsDataLabel',
              classNames: 'gpsDataLabel',
              content: 'Station Location:'
            }
          ),
          stationShortNameCheckbox: Em.Checkbox.extend(
            {
              elementId: 'stationShortNameCheckbox',
              classNames: 'stationShortNameCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.sisData.stationShortName'
            }
          ),
          stationShortNameLabel: SDL.Label.extend(
            {
              elementId: 'stationShortNameLabel',
              classNames: 'stationShortNameLabel',
              content: 'Station short name'
            }
          ),
          stationShortNameInput: Ember.TextField.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'stationShortNameInput',
              classNames: 'stationShortNameInput',
              valueBinding: 'SDL.RadioModel.lastOptionParams.sisData.stationShortName',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.sisData.stationShortName;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.sisData.stationShortName'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.band',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.rdsData.PS',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.rdsData.RT',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.rdsData.CT',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.rdsData.PI',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.rdsData.PTY',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.rdsData.TP',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.rdsData.TA',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.rdsData.REG',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.rdsData.REG;
              }.property(
                'SDL.RadioModel.radioControlCheckboxes.rdsData.REG'
              ),
              disabledBinding: 'isDisabled'
            }
          ),

          availableHDsChannelInput: Em.ContainerView.create(
            {
              elementId: 'hd_channel_container',
              classNames: 'channel',
              disabledBinding: 'isDisabled',
              isDisabled: function() {
                return !SDL.RadioModel.radioControlCheckboxes.availableHdChannels;
              }.property('SDL.RadioModel.radioControlCheckboxes.availableHdChannels'),

              childViews: [
                'availableHdChannelsCheckBox_0',
                'availableHdChannelsLabel_0',
                'availableHdChannelsCheckBox_1',
                'availableHdChannelsLabel_1',
                'availableHdChannelsCheckBox_2',
                'availableHdChannelsLabel_2',
                'availableHdChannelsCheckBox_3',
                'availableHdChannelsLabel_3',
                'availableHdChannelsCheckBox_4',
                'availableHdChannelsLabel_4',
                'availableHdChannelsCheckBox_5',
                'availableHdChannelsLabel_5',
                'availableHdChannelsCheckBox_6',
                'availableHdChannelsLabel_6',
                'availableHdChannelsCheckBox_7',
                'availableHdChannelsLabel_7'
              ],

              availableHdChannelsCheckBox_0: Em.Checkbox.extend(
                {
                  elementId: 'availableHdChannelsCheckBox_0',
                  classNames: 'availableHdChannelsCheckBox_0',
                  disabledBinding: 'parentView.disabled',
                  checkedBinding: 'SDL.RadioModel.hdChannelAvailable.0',
                  change: function(event) {
                    SDL.RadioModel.changeAvailableHDsTempData(event,0);
                  }
                }
              ),
              availableHdChannelsLabel_0: SDL.Label.extend(
                {
                  elementId: 'availableHdChannelsLabel_0',
                  classNames: 'availableHdChannelsLabel_0',
                  disabledBinding: 'parentView.disabled',
                  content: '0:'
                }
              ),
              availableHdChannelsCheckBox_1: Em.Checkbox.extend(
                {
                  elementId: 'availableHdChannelsCheckBox_1',
                  classNames: 'availableHdChannelsCheckBox_1',
                  disabledBinding: 'parentView.disabled',
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlCheckboxes.availableHDsChannel;
                  }.property('SDL.RadioModel.radioControlCheckboxes.availableHDsChannel'),
                  checkedBinding: 'SDL.RadioModel.hdChannelAvailable.1',
                  change: function(event) {
                    SDL.RadioModel.changeAvailableHDsTempData(event, 1);
                  }
                }
              ),
              availableHdChannelsLabel_1: SDL.Label.extend(
                {
                  elementId: 'availableHdChannelsLabel_1',
                  classNames: 'availableHdChannelsLabel_1',
                  disabledBinding: 'parentView.disabled',
                  content: '1:'
                }
              ),
              availableHdChannelsCheckBox_2: Em.Checkbox.extend(
                {
                  elementId: 'availableHdChannelsCheckBox_2',
                  classNames: 'availableHdChannelsCheckBox_2',
                  disabledBinding: 'parentView.disabled',
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlCheckboxes.availableHDsChannel;
                  }.property('SDL.RadioModel.radioControlCheckboxes.availableHDsChannel'),
                  checkedBinding: 'SDL.RadioModel.hdChannelAvailable.2',
                  change: function(event) {
                    SDL.RadioModel.changeAvailableHDsTempData(event, 2);
                  }
                }
              ),
              availableHdChannelsLabel_2: SDL.Label.extend(
                {
                  elementId: 'availableHdChannelsLabel_2',
                  classNames: 'availableHdChannelsLabel_2',
                  disabledBinding: 'parentView.disabled',
                  content: '2:'
                }
              ),
              availableHdChannelsCheckBox_3: Em.Checkbox.extend(
                {
                  elementId: 'availableHdChannelsCheckBox_3',
                  classNames: 'availableHdChannelsCheckBox_3',
                  disabledBinding: 'parentView.disabled',
                  change: function(event) {
                    SDL.RadioModel.changeAvailableHDsTempData(event,3);
                  },
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlCheckboxes.availableHDsChannel;
                  }.property('SDL.RadioModel.radioControlCheckboxes.availableHDsChannel'),
                  checkedBinding: 'SDL.RadioModel.hdChannelAvailable.3'
                }
              ),
              availableHdChannelsLabel_3: SDL.Label.extend(
                {
                  elementId: 'availableHdChannelsLabel_3',
                  classNames: 'availableHdChannelsLabel_3',
                  disabledBinding: 'parentView.disabled',
                  content: '3:'
                }
              ),
              availableHdChannelsCheckBox_4: Em.Checkbox.extend(
                {
                  elementId: 'availableHdChannelsCheckBox_4',
                  classNames: 'availableHdChannelsCheckBox_4',
                  disabledBinding: 'parentView.disabled',
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlCheckboxes.availableHDsChannel;
                  }.property('SDL.RadioModel.radioControlCheckboxes.availableHDsChannel'),
                  checkedBinding: 'SDL.RadioModel.hdChannelAvailable.4',
                  change: function(event) {
                    SDL.RadioModel.changeAvailableHDsTempData(event,4);
                  }
                }
              ),
              availableHdChannelsLabel_4: SDL.Label.extend(
                {
                  elementId: 'availableHdChannelsLabel_4',
                  classNames: 'availableHdChannelsLabel_4',
                  disabledBinding: 'parentView.disabled',
                  content: '4:'
                }
              ),
              availableHdChannelsCheckBox_5: Em.Checkbox.extend(
                {
                  elementId: 'availableHdChannelsCheckBox_5',
                  classNames: 'availableHdChannelsCheckBox_5',
                  disabledBinding: 'parentView.disabled',
                  change: function(event) {
                    SDL.RadioModel.changeAvailableHDsTempData(event,5);
                  },
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlCheckboxes.availableHDsChannel;
                  }.property('SDL.RadioModel.radioControlCheckboxes.availableHDsChannel'),
                  checkedBinding: 'SDL.RadioModel.hdChannelAvailable.5'
                }
              ),
              availableHdChannelsLabel_5: SDL.Label.extend(
                {
                  elementId: 'availableHdChannelsLabel_5',
                  classNames: 'availableHdChannelsLabel_5',
                  disabledBinding: 'parentView.disabled',
                  content: '5:'
                }
              ),
              availableHdChannelsCheckBox_6: Em.Checkbox.extend(
                {
                  elementId: 'availableHdChannelsCheckBox_6',
                  classNames: 'availableHdChannelsCheckBox_6',
                  disabledBinding: 'parentView.disabled',
                  change: function(event) {
                    SDL.RadioModel.changeAvailableHDsTempData(event,6);
                  },
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlCheckboxes.availableHDsChannel;
                  }.property('SDL.RadioModel.radioControlCheckboxes.availableHDsChannel'),
                  checkedBinding: 'SDL.RadioModel.hdChannelAvailable.6'
                }
              ),
              availableHdChannelsLabel_6: SDL.Label.extend(
                {
                  elementId: 'availableHdChannelsLabel_6',
                  classNames: 'availableHdChannelsLabel_6',
                  disabledBinding: 'parentView.disabled',
                  content: '6:'
                }
              ),
              availableHdChannelsCheckBox_7: Em.Checkbox.extend(
                {
                  elementId: 'availableHdChannelsCheckBox_7',
                  classNames: 'availableHdChannelsCheckBox_7',
                  disabledBinding: 'parentView.disabled',
                  change: function(event) {
                    SDL.RadioModel.changeAvailableHDsTempData(event,7);
                  },
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlCheckboxes.availableHDsChannel;
                  }.property('SDL.RadioModel.radioControlCheckboxes.availableHDsChannel'),
                  checkedBinding: 'SDL.RadioModel.hdChannelAvailable.7'
                }
              ),
              availableHdChannelsLabel_7: SDL.Label.extend(
                {
                  elementId: 'availableHdChannelsLabel_7',
                  classNames: 'availableHdChannelsLabel_7',
                  disabledBinding: 'parentView.disabled',
                  content: '7:'
                }
              ),
            }
          ),
          
          availableHDsCheckbox: Em.Checkbox.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'availableHDsCheckbox',
              classNames: 'availableHDsCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.availableHdChannels',
              isDisabled: function() {
                return !SDL.RadioModel.lastOptionParams.hdRadioEnable;
              }.property(
                'SDL.RadioModel.lastOptionParams.hdRadioEnable'
              ),
              disabledBinding: 'isDisabled',
              
            }
          ),
          availableHDsLabel: SDL.Label.extend(
            {
              elementId: 'availableHDsLabel',
              classNames: 'availableHDsLabel',
              content: 'availableHdChannels'
            }
          ),
          hdChannelCheckbox: Em.Checkbox.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'hdChannelCheckbox',
              classNames: 'hdChannelCheckbox',
              checkedBinding: 'SDL.RadioModel.radioControlCheckboxes.hdChannel',
              isDisabled: function() {
                return !SDL.RadioModel.lastOptionParams.hdRadioEnable;
              }.property(
                'SDL.RadioModel.lastOptionParams.hdRadioEnable'
              ),
              disabledBinding: 'isDisabled',
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
                var count = 0;
                var result = [];
                SDL.RadioModel.availableHdChannels = [];
                for(var key in SDL.RadioModel.hdChannelAvailable) {
                  if(SDL.RadioModel.hdChannelAvailable[key]) {
                    result.push(count);
                    SDL.RadioModel.availableHdChannels.push(count);
                  }
                  ++count;
                }
                SDL.RadioModel.set('lastOptionParams.hdChannel', result[0]);
                this.set('content', result);
              }.observes(
                'SDL.RadioModel.lastOptionParams.availableHdChannels.@each',
                'SDL.RadioModel.hdChannelAvailable.0',
                'SDL.RadioModel.hdChannelAvailable.1',
                'SDL.RadioModel.hdChannelAvailable.2',
                'SDL.RadioModel.hdChannelAvailable.3',
                'SDL.RadioModel.hdChannelAvailable.4',
                'SDL.RadioModel.hdChannelAvailable.5',
                'SDL.RadioModel.hdChannelAvailable.6',
                'SDL.RadioModel.hdChannelAvailable.7'),
              valueBinding: 'SDL.RadioModel.lastOptionParams.hdChannel',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.signalStrength',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.signalChangeThreshold',
              isDisabled: function() {
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
              valueBinding: 'SDL.RadioModel.lastOptionParams.state',
              isDisabled: function() {
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
          HDRadio: function() {
            if (SDL.RadioModel.radioControlStruct.band == 'XM') {
              SDL.RadioModel.setHDRadioEnable(false);
              SDL.RadioModel.set('radioControlCheckboxes.availableHdChannels',
              SDL.RadioModel.radioControlStruct.hdRadioEnable);
              SDL.RadioModel.set('radioControlCheckboxes.hdChannel',
              SDL.RadioModel.radioControlStruct.hdRadioEnable);
              return false;
            }
            else if(!SDL.RadioModel.radioControlStruct.hdRadioEnable){
              return false;
            }
            SDL.RadioModel.setHDRadioEnable(SDL.RadioModel.radioControlStruct.availableHdChannels.length >= 0);
            return (SDL.RadioModel.radioControlStruct.availableHdChannels.length >= 0);
          }.property('SDL.RadioModel.radioControlStruct.band',
                     'SDL.RadioModel.radioControlStruct.availableHdChannels.@each',
                     'SDL.RadioModel.radioControlStruct.hdRadioEnable'),
          STAName: function() {
            return 'STA-' + SDL.RadioModel.station.toString().replace('.', '');
          }.property('SDL.RadioModel.station'),
          StationName: function() {
            var station = SDL.RadioModel.station;
            if (SDL.RadioModel.radioControlStruct.availableHdChannels.length >= 0 &
              SDL.RadioModel.radioControlStruct.hdRadioEnable) {
              station += '-' + SDL.RadioModel.radioControlStruct.hdChannel;
            }
            return station;
          }.property('SDL.RadioModel.station',
                     'SDL.RadioModel.radioControlStruct.hdChannel',
                     'SDL.RadioModel.radioControlStruct.availableHdChannels.@each',
                     'SDL.RadioModel.radioControlStruct.hdRadioEnable'),
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
              '<div class = "HDRadio" onclick = "SDL.RadioView.setHD()" style="display: inline-flex; cursor: pointer; align-items: center;">' +              
              '{{#if HDRadio}}' +
              '<img src="images/media/hd_logo.png" style="width:27px;height:27px;">' +
              '{{else}}' +
              '<img src="images/media/hd_logo_gray.png" style="width:27px;height:27px;">' +
              '{{/if}}' +
              '</div>' +
              '{{#if HDRadio}}' +
              '<div class="hd-radio-info" style="top:4px;left: 30px;">' +
              '{{#if SDL.RadioModel.hdChannelAvailable.[0]}}' +
              '{{#if SDL.RadioModel.hdChannelCurrent.[0]}}' +
              '<span style="padding: 5px;color: orange;"> 0 </span>' +
              '{{else}}' +
              '<span style="padding: 5px;"> 0 </span>' +
              '{{/if}}' +
              '{{/if}}' +
              '{{#if SDL.RadioModel.hdChannelAvailable.[1]}}' +
              '{{#if SDL.RadioModel.hdChannelCurrent.[1]}}' +
              '<span style="padding: 5px;color: orange;"> 1 </span>' +
              '{{else}}' +
              '<span style="padding: 5px;"> 1 </span>' +
              '{{/if}}' +
              '{{/if}}' +
              '{{#if SDL.RadioModel.hdChannelAvailable.[2]}}' +
              '{{#if SDL.RadioModel.hdChannelCurrent.[2]}}' +
              '<span style="padding: 5px;color: orange;"> 2 </span>' +
              '{{else}}' +
              '<span style="padding: 5px;"> 2 </span>' +
              '{{/if}}' +
              '{{/if}}' +
              '{{#if SDL.RadioModel.hdChannelAvailable.[3]}}' +
              '{{#if SDL.RadioModel.hdChannelCurrent.[3]}}' +
              '<span style="padding: 5px;color: orange;"> 3 </span>' +
              '{{else}}' +
              '<span style="padding: 5px;"> 3 </span>' +
              '{{/if}}' +
              '{{/if}}' +
              '{{#if SDL.RadioModel.hdChannelAvailable.[4]}}' +
              '{{#if SDL.RadioModel.hdChannelCurrent.[4]}}' +
              '<span style="padding: 5px;color: orange;"> 4 </span>' +
              '{{else}}' +
              '<span style="padding: 5px;"> 4 </span>' +
              '{{/if}}' +
              '{{/if}}' +
              '{{#if SDL.RadioModel.hdChannelAvailable.[5]}}' +
              '{{#if SDL.RadioModel.hdChannelCurrent.[5]}}' +
              '<span style="padding: 5px;color: orange;"> 5 </span>' +
              '{{else}}' +
              '<span style="padding: 5px;"> 5 </span>' +
              '{{/if}}' +
              '{{/if}}' +
              '{{#if SDL.RadioModel.hdChannelAvailable.[6]}}' +
              '{{#if SDL.RadioModel.hdChannelCurrent.[6]}}' +
              '<span style="padding: 5px;color: orange;"> 6 </span>' +
              '{{else}}' +
              '<span style="padding: 5px;"> 6 </span>' +
              '{{/if}}' +
              '{{/if}}' +
              '{{#if SDL.RadioModel.hdChannelAvailable.[7]}}' +
              '{{#if SDL.RadioModel.hdChannelCurrent.[7]}}' +
              '<span style="padding: 5px;color: orange;"> 7 </span>' +
              '{{else}}' +
              '<span style="padding: 5px;"> 7 </span>' +
              '{{/if}}' +
              '{{/if}}' +
              '{{/if}}' +
              '</div>' +
              '<div class="STAName">{{STAName}}</div>' +
              '<div class="station">{{StationName}}</div>' +
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
                    if (!SDL.RadioModel.radioControlStruct.radioEnable) {
                      return true;
                    }
                    return false;
                  }.property(
                    'SDL.RadioModel.radioControlStruct.radioEnable',
                    'SDL.RadioModel.radioControlStruct.band',
                    'SDL.RadioModel.radioControlStruct.availableHdChannels.@each'
                  ),
                  disabledBinding: 'onEnableRadioClick',
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
                    if (!SDL.RadioModel.radioControlStruct.radioEnable) {
                      return true;
                    }
                    return false;
                  }.property(
                    'SDL.RadioModel.radioControlStruct.radioEnable',
                    'SDL.RadioModel.radioControlStruct.band',
                    'SDL.RadioModel.radioControlStruct.availableHdChannels.@each'
                  ),
                  disabledBinding: 'onEnableRadioClick',
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
                    if (!SDL.RadioModel.radioControlStruct.radioEnable) {
                      return true;
                    }
                    return false;
                  }.property(
                    'SDL.RadioModel.radioControlStruct.radioEnable',
                    'SDL.RadioModel.radioControlStruct.band',
                    'SDL.RadioModel.radioControlStruct.availableHdChannels.@each'
                  ),
                  disabledBinding: 'onEnableRadioClick',
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
                    if (!SDL.RadioModel.radioControlStruct.radioEnable) {
                      return true;
                    }
                    return false;
                  }.property(
                    'SDL.RadioModel.radioControlStruct.radioEnable',
                    'SDL.RadioModel.radioControlStruct.band',
                    'SDL.RadioModel.radioControlStruct.availableHdChannels.@each'
                  ),
                  disabledBinding: 'onEnableRadioClick',
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
                    if (!SDL.RadioModel.radioControlStruct.radioEnable) {
                      return true;
                    }
                    return false;
                  }.property(
                    'SDL.RadioModel.radioControlStruct.radioEnable',
                    'SDL.RadioModel.radioControlStruct.band',
                    'SDL.RadioModel.radioControlStruct.availableHdChannels.@each'
                  ),
                  disabledBinding: 'onEnableRadioClick',
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
                    if (!SDL.RadioModel.radioControlStruct.radioEnable) {
                      return true;
                    }
                    return false;
                  }.property(
                    'SDL.RadioModel.radioControlStruct.radioEnable',
                    'SDL.RadioModel.radioControlStruct.band',
                    'SDL.RadioModel.radioControlStruct.availableHdChannels.@each'
                  ),
                  disabledBinding: 'onEnableRadioClick',
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
              isDisabled: function() {
                if (SDL.RadioModel.radioControlStruct.band == 'XM') {
                  return true;
                }
                return !SDL.RadioModel.radioControlStruct.radioEnable;
              }.property(
                'SDL.RadioModel.radioControlStruct.radioEnable',
                'SDL.RadioModel.radioControlStruct.band'
              ),
              disabledBinding: 'isDisabled',
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
                return !SDL.RadioModel.radioControlStruct.radioEnable;
              }.property(
                'SDL.RadioModel.radioControlStruct.radioEnable'
              ),
              disabledBinding: 'onEnableRadioClick',
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
              isDisabled: function() {
                if (SDL.RadioModel.radioControlStruct.band == 'XM') {
                  return true;
                }
                return false;
              }.property(
                'SDL.RadioModel.radioControlStruct.radioEnable',
                'SDL.RadioModel.radioControlStruct.band'
              ),
              disabledBinding: 'isDisabled',
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
                return !SDL.RadioModel.radioControlStruct.radioEnable;
              }.property(
                'SDL.RadioModel.radioControlStruct.radioEnable'
              ),
              disabledBinding: 'onEnableRadioClick',
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
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlStruct.radioEnable;
                  }.property(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabledBinding: 'isDisabled',
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
                  isDisabled: function() {
                    return !SDL.RadioModel.radioControlStruct.radioEnable;
                  }.property(
                    'SDL.RadioModel.radioControlStruct.radioEnable'
                  ),
                  disabledBinding: 'isDisabled',
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
