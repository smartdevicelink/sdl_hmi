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
      valueBinding: 'SDL.RCModulesController.currentAudioModel.tempEqualizerSettIndex',
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
      valueBinding: 'SDL.RCModulesController.currentAudioModel.tempEqualizerSettings.channelId'
    }),

    channelNameInput:Ember.TextField.extend({
      elementId:'channelNameInput',
      classNames:'channelNameInput',
      valueBinding: 'SDL.RCModulesController.currentAudioModel.tempEqualizerSettings.channelName'
    }),

    channelSettingInput:Ember.TextField.extend({
      elementId:'channelSettingInput',
      classNames:'channelSettingInput',
      valueBinding: 'SDL.RCModulesController.currentAudioModel.tempEqualizerSettings.channelSetting'
    }),

    leftButton:  SDL.Button.extend({
      classNames: [
        'leftButton'
      ],
      action: function(){
        if(SDL.RCModulesController.currentAudioModel.tempEqualizerSettIndex-1 == 0){
          return;
        }  
        
          SDL.RCModulesController.currentAudioModel.lastRadioControlStruct.equalizerSettings[SDL.RCModulesController.currentAudioModel.tempEqualizerSettIndex-1]=
          SDL.RCModulesController.currentAudioModel.tempEqualizerSettings;
        SDL.RCModulesController.currentAudioModel.set('tempEqualizerSettIndex',SDL.RCModulesController.currentAudioModel.tempEqualizerSettIndex-1);
        SDL.RCModulesController.currentAudioModel.set('tempEqualizerSettings', 
          SDL.RCModulesController.currentAudioModel.lastRadioControlStruct.equalizerSettings
          [SDL.RCModulesController.currentAudioModel.tempEqualizerSettIndex-1]);

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
          SDL.RCModulesController.currentAudioModel.lastRadioControlStruct.equalizerSettings.length;
        if(SDL.RCModulesController.currentAudioModel.tempEqualizerSettIndex == length ){
          return;
        }  
        SDL.RCModulesController.currentAudioModel.set('tempEqualizerSettIndex',SDL.RCModulesController.currentAudioModel.tempEqualizerSettIndex+1);
        SDL.RCModulesController.currentAudioModel.set('tempEqualizerSettings', 
          SDL.RCModulesController.currentAudioModel.lastRadioControlStruct.equalizerSettings[SDL.RCModulesController.currentAudioModel.tempEqualizerSettIndex-1]);
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
          classNameBindings: ['SDL.RCModulesController.currentAudioModel.optionsEnabled:active_state:inactive_state'],
        
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
             valueBinding:'SDL.RCModulesController.currentAudioModel.lastRadioControlStruct.equalizerSettings.channelSetting',
             isDisabled: function() {
                return !SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
           }
           ),
      
         equalizerChannelNameCheckBox: Em.Checkbox.extend(
            {
              attributeBindings: ['disabled'],
              elementId: 'equalizerChannelNameCheckBox',
              classNames: 'equalizerChannelNameCheckBox',
              checkedBinding: 'SDL.RCModulesController.currentAudioModel.radioControlAudioValue.channelName',
              isDisabled: function() {
                return !SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
            }
          ),
         equalizerChannelNameInput:Ember.TextField.extend(
         {
              attributeBindings: ['disabled'],
             elementId:'equalizerChannelNameInput',
             classNames:'equalizerChannelNameInput',

             valueBinding:'SDL.RCModulesController.currentAudioModel.lastRadioControlStruct.equalizerSettings.channelName',
             isDisabled: function() {
                return !SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings ?
                !SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings
                :!SDL.RCModulesController.currentAudioModel.radioControlAudioValue.channelName;
              }.property(
                'SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings',
                'SDL.RCModulesController.currentAudioModel.radioControlAudioValue.channelName'
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
             valueBinding:'SDL.RCModulesController.currentAudioModel.lastRadioControlStruct.equalizerSettings.channelId',
             isDisabled: function() {
                return !SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings;
              }.property(
                'SDL.RCModulesController.currentAudioModel.radioControlAudioValue.equalizerSettings'
              ),
              disabledBinding: 'isDisabled'
           }
          ),
        volumeInput: Ember.TextField.extend(
         {
           elementId:'volumeInput',
           classNames:'volumeInput',
           valueBinding: 'SDL.RCModulesController.currentAudioModel.currentVolume',
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
              checkedBinding: 'SDL.RCModulesController.currentAudioModel.radioControlAudioValue.volume'
            }
          ),
         save: SDL.Button.extend(
             {
               elementId: 'save',
               classNames: 'save',
               text: 'Save',
               onDown: false,
               model: 'currentAudioModel',
               method: 'saveButtonPress',
               target: 'SDL.RCModulesController',
               action: 'action'
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
              target: 'SDL.RCModulesController.currentAudioModel',
              action: 'toggleOptions',
              isDisabled: function() {
                return SDL.RCModulesController.currentAudioModel.optionsEnabled;
              }.property(
                'SDL.RCModulesController.currentAudioModel.optionsEnabled'
              ),
              disabledBinding: 'isDisabled'

            }
          ),
	}
  ),
}
);
