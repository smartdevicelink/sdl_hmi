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
 SDL.audioView= Em.ContainerView.extend(
	{
	elementId: 'media_options_menu',
    // classNameBindings: [
    //   'SDL.States.media.player.audioOptions.active:active_state:inactive_state'
    // ],
    childViews:[
    'optionsMenu',
    'preferencesButton'
    ],
    optionsMenu: Em.ContainerView.create(
        {
          elementId:'audio_options_view_container',
          classNames:'option',
          classNameBindings: ['SDL.MediaController.optionsEnabled:active_state:inactive_state'],
        
        childViews:[
          'keepContextSelect',
          'keepContextLabel',
          'keepContextCheckBox',
          'volumeInput',
          'volumeLabel',
          'volumeCheckBox',
          'equalizerSettingsLabel',
          'equalizerChannelIdInput',
          'equalizerChannelIdLabel',
          'equalizerChannelNameInput',
          'equalizerChannelNameLabel',
          'equalizerChannelSettingLabel',
          'equalizerChannelSettingInput',
          'equalizerSettingsCheckBox',
          'save'
        ],
        equalizerSettingsCheckBox:Em.Checkbox.extend(
            {
              elementId: 'equalizerSettingsCheckBox',
              classNames: 'equalizerSettingsCheckBox',
              checkedBinding: 'SDL.MediaController.radioControlAudioValue.equalizerSettings'
            }
          ),
        equalizerChannelSettingLabel: SDL.Label.extend(
            {
              elementId: 'equalizerChannelSettingLabel',
              classNames: 'equalizerChannelSettingLabel',
              content: 'Channel set:',
            }
          ),
        equalizerChannelSettingInput:Ember.TextField.extend(
         {
              attributeBindings: ['disabled'],
             elementId:'equalizerChannelSettingInput',
             classNames:'equalizerChannelSettingInput',
             valueBinding:'SDL.MediaController.radioControlStruct.equalizerSettings.channelSetting',
             isDisabled: function() {
                return !SDL.MediaController.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.MediaController.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
           }
           ),
        equalizerChannelIdLabel: SDL.Label.extend(
            {
              elementId: 'equalizerChannelIdLabel',
              classNames: 'equalizerChannelIdLabel',
              content: 'Channel id:',
            }
          ),
        equalizerSettingsLabel:SDL.Label.extend({
          elementId:'equalizerSettingsLabel',
          classNames:'equalizerSettingsLabel',
          content:'Equalizer settings:'
        }
        ),
         equalizerChannelNameLabel: SDL.Label.extend(
             {
              elementId: 'equalizerChannelNameLabel',
              classNames: 'equalizerChannelNameLabel',
              content: 'Channel name:',
             }
           ),
         equalizerChannelNameInput:Ember.TextField.extend(
         {
              attributeBindings: ['disabled'],
             elementId:'equalizerChannelNameInput',
             classNames:'equalizerChannelNameInput',
             valueBinding:'SDL.MediaController.radioControlStruct.equalizerSettings.channelName',
             isDisabled: function() {
                return !SDL.MediaController.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.MediaController.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
           }
           ),
         equalizerChannelIdInput: Ember.TextField.extend(
         {
            attributeBindings: ['disabled'],
             elementId:'equalizerChannelIdInput',
             classNames:'equalizerChannelIdInput',
             valueBinding:'SDL.MediaController.radioControlStruct.equalizerSettings.channelId',
             isDisabled: function() {
                return !SDL.MediaController.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.MediaController.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
           }
          ),
         keepContextSelect: Em.Select.extend(
         {
          attributeBindings: ['disabled'],
           elementId:'keepContextSelect',
           classNames:'keepContextSelect',
           valueBinding: 'SDL.MediaController.radioControlStruct.keepContext',
           contentBinding: 'SDL.USBModel.boolStruct',
           isDisabled: function() {
                return !SDL.MediaController.radioControlAudioValue.keepContext;
              }.property(
                'SDL.MediaController.radioControlAudioValue.keepContext'
              ),
              disabledBinding: 'isDisabled'
         }
         ),
         keepContextLabel: SDL.Label.extend(
             {
               elementId: 'keepContextLabel',
              classNames: 'keepContextLabel',
              content: 'Keep context:'
            }
          ),
         keepContextCheckBox:Em.Checkbox.extend(
            {
              elementId: 'keepContextCheckBox',
              classNames: 'keepContextCheckBox',
              checkedBinding: 'SDL.MediaController.radioControlAudioValue.keepContext'
            }
          ),
        volumeInput: Ember.TextField.extend(
         {
           elementId:'volumeInput',
           classNames:'volumeInput',
           valueBinding: 'SDL.MediaController.currentVolume',
           disabled:true
           }
           ),
         volumeLabel: SDL.Label.extend(
            {
               elementId: 'volumeLabel',
               classNames: 'volumeLabel',
              content: 'Volume:'
            }
          ),
         volumeCheckBox:Em.Checkbox.extend(
            {
              elementId: 'volumeCheckBox',
              classNames: 'volumeCheckBox',
              checkedBinding: 'SDL.MediaController.radioControlAudioValue.volume'
            }
          ),
         save: SDL.Button.extend(
             {
               elementId: 'save',
               classNames: 'save',
               text: 'Save',
               onDown: false,
               target: 'SDL.MediaController',
               action: 'saveButtonPress'
             }
           )
        }
      ),
      preferencesButton: Em.ContainerView.extend(
      {
        elementId:'preferences',
        classNames:'pref',
        childViews:['optionsButton'],
			   optionsButton: SDL.Button.extend(
            {
              
              attributeBindings: ['disabled'],
              elementId: 'media_optionButton',
              classNames: 'media_optionButton',
              text: 'Audio',
              onDown: false,
              target: 'SDL.MediaController',
              action: 'toggleOptions',
              isDisabled: function() {
                return SDL.MediaController.optionsEnabled;
              }.property(
                'SDL.MediaController.optionsEnabled'
              ),
              disabledBinding: 'isDisabled'

            }
          ),
	}
  ),
}
);


