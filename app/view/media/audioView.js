/*
 * Copyright (c) 2018, Ford Motor Company All rights reserved.
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
EqualizerSettingsView = Em.ContainerView.create({ 
  elementId:'EqualizerSettingsView',
  classNames:'EqualizerSettingsView',

  childViews:[
      'equalizerSettingsLabel',
      'equalizerSettingsArray'
  ],

  equalizerSettingsLabel: SDL.Label.create({
    elementId: 'equalizerSettingsLabel',
    classNames: 'equalizerSettingsLabel',
    content: 'Equalizer settings'
  }),

  equalizerSettingsArray:  Em.ContainerView.create({ 
    elementId: 'equalizerSettingsArray',
    classNames: 'equalizerSettingsArray',
    childViews: [
      'leftButton',
      'rightbutton',
      'stateInput',
      'channelIdLabel',
      'channelNameLabel',
      'channelSettingLabel',
      'channelIdInput',
      'channelNameInput',
      'channelSettingInput'
    ],

    stateInput: Ember.TextField.extend({
      elementId: 'stateInput',
      classNames: 'stateInput',
      valueBinding: 'SDL.MediaController.tempEqualizerSettIndex',
      disabled:true
    }),

    channelIdLabel: SDL.Label.extend({
      elementId: 'channelIdLabel',
      classNames: 'channelIdLabel',
      content: 'Channel id:'
    }),

    channelNameLabel: SDL.Label.extend({
       elementId: 'channelNameLabel',
       classNames: 'channelNameLabel',
       content: 'Channel name:'
    }),

    channelSettingLabel: SDL.Label.extend({
      elementId: 'channelSettingLabel',
      classNames: 'channelSettingLabel',
      content: 'Channel set:'
    }),


    channelIdInput:Ember.TextField.extend({
      elementId:'channelIdInput',
      classNames:'channelIdInput',
      valueBinding: 'SDL.MediaController.tempEqualizerSettings.channelId'
    }),

    channelNameInput:Ember.TextField.extend({
      elementId:'channelNameInput',
      classNames:'channelNameInput',
      valueBinding: 'SDL.MediaController.tempEqualizerSettings.channelName'
    }),

    channelSettingInput:Ember.TextField.extend({
      elementId:'channelSettingInput',
      classNames:'channelSettingInput',
      valueBinding: 'SDL.MediaController.tempEqualizerSettings.channelSetting'
    }),

    leftButton:  SDL.Button.extend({
      classNames: [
        'leftButton'
      ],
      action: function(){
        if(SDL.MediaController.tempEqualizerSettIndex-1 == 0){
          return;
        }  
        
          SDL.MediaController.lastRadioControlStruct.equalizerSettings[SDL.MediaController.tempEqualizerSettIndex-1]=
          SDL.MediaController.tempEqualizerSettings;
        SDL.MediaController.set('tempEqualizerSettIndex',SDL.MediaController.tempEqualizerSettIndex-1);
        SDL.MediaController.set('tempEqualizerSettings', 
          SDL.MediaController.lastRadioControlStruct.equalizerSettings
          [SDL.MediaController.tempEqualizerSettIndex-1]);

      },
      icon: 'images/media/left_button.png',
      onDown: false,
    }),

    rightbutton: SDL.Button.extend({
      classNames: [
        'rightbutton'
      ],
      action: function(){
        var length = 
          SDL.MediaController.lastRadioControlStruct.equalizerSettings.length;
        if(SDL.MediaController.tempEqualizerSettIndex == length ){
          return;
        }  
        SDL.MediaController.set('tempEqualizerSettIndex',SDL.MediaController.tempEqualizerSettIndex+1);
        SDL.MediaController.set('tempEqualizerSettings', 
          SDL.MediaController.lastRadioControlStruct.equalizerSettings[SDL.MediaController.tempEqualizerSettIndex-1]);
      },
      icon: 'images/media/left_button.png',
      onDown: false,
    })
  }),
});

SDL.audioView= Em.ContainerView.extend(
	{
	elementId: 'media_options_menu',
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
          'volumeInput',
          'volumeLabel',
          'volumeCheckBox',
          'save',
          'equalizerSettings'
        ],
        equalizerChannelSettingInput:Ember.TextField.extend(
         {
              attributeBindings: ['disabled'],
             elementId:'equalizerChannelSettingInput',
             classNames:'equalizerChannelSettingInput',
             type:'Number',
             valueBinding:'SDL.MediaController.lastRadioControlStruct.equalizerSettings.channelSetting',
             isDisabled: function() {
                return !SDL.MediaController.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.MediaController.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
           }
           ),
      
         equalizerChannelNameCheckBox: Em.Checkbox.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'equalizerChannelNameCheckBox',
              classNames: 'equalizerChannelNameCheckBox',
              checkedBinding: 'SDL.MediaController.radioControlAudioValue.channelName',
              isDisabled: function() {
                return !SDL.MediaController.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.MediaController.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
         equalizerChannelNameInput:Ember.TextField.extend(
         {
              attributeBindings: ['disabled'],
             elementId:'equalizerChannelNameInput',
             classNames:'equalizerChannelNameInput',

             valueBinding:'SDL.MediaController.lastRadioControlStruct.equalizerSettings.channelName',
             isDisabled: function() {
                return !SDL.MediaController.radioControlAudioValue.equalizerSettings ?
                !SDL.MediaController.radioControlAudioValue.equalizerSettings
                :!SDL.MediaController.radioControlAudioValue.channelName;
              }.property(
                'SDL.MediaController.radioControlAudioValue.equalizerSettings',
                'SDL.MediaController.radioControlAudioValue.channelName'
              ),
              disabledBinding: 'isDisabled'
           }
           ),
         equalizerChannelIdInput: Ember.TextField.extend(
         {
            attributeBindings: ['disabled'],
             elementId:'equalizerChannelIdInput',
             classNames:'equalizerChannelIdInput',
             type:'Number',
             valueBinding:'SDL.MediaController.lastRadioControlStruct.equalizerSettings.channelId',
             isDisabled: function() {
                return !SDL.MediaController.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.MediaController.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
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
           ),
        equalizerSettings: EqualizerSettingsView
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




