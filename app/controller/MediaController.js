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
 * @name SDL.MediaController
 * @desc Media module logic
 * @category Controller
 * @filesource app/controller/MediaController.js
 * @version 1.0
 */
SDL.MediaController = Em.Object.create(
  {
    /**
     * Initial substate
     */
    activeState: 'media.player.cd',
    /** Current selected players module Data reference*/
    //currentPlayerModuleData: SDL.CDModel,
    /** Current selected player object  reference*/
    currentSelectedPlayer: SDL.CDModel.player,
    /**
     * Current volume level in percents
     */
     currentVolume: 50,
     radioControlStruct:{
      source:'AUDIO',
      keepContext:true,
      equalizerSettings:{
        channelSetting:50,
        channelId: 50,
        channelName: ' '
      },
     },
     radioControlAudioValue:
     {
        keepContext:true,
        volume:true,
        equalizerSettings:{
          channelSetting:true,
          channelId:true,
          channelName:true
        },
     },

      usbControl:{
      keepContext: false
    },
    boolStruct: [
    true,
    false
    ],
    saveButtonPress:function(){
      SDL.MediaController.toggleProperty('optionsEnabled');
    },
    optionsEnabled:false,
    toggleOptions:function(){
      SDL.MediaController.toggleProperty('optionsEnabled');
    },
    /**
     * Turn on CD
     */
    turnOnCD: function() {
      //this.onPlayerEnter(SDL.CDModel, 'cd');
      if (!SDL.States.media.player.cd.active) {
        SDL.States.goToStates('media.player.cd');
      }
      this.onPlayerEnter(SDL.CDModel, 'cd');
    },
    /**
     * Turn on USB
     */
    turnOnUSB: function() {
      if (!SDL.States.media.player.usb.active) {
        SDL.States.goToStates('media.player.usb');
      }
      this.onPlayerEnter(SDL.USBModel, 'usb');
    },
    /**
     * Turn on Radio
     */
    turnOnRadio: function() {
      if (!SDL.States.media.player.radio.active) {
        SDL.States.goToStates('media.player.radio');
      }
      SDL.RadioModel.saveCurrentOptions();
      SDL.RadioModel.set('active', true);
    },
    turnOnBluetooth: function(){
      if(!SDL.States.media.player.bluetooth.active)
      {
        SDL.States.goToStates('media.player.bluetooth');
      }
      this.onPlayerEnter(SDL.BluetoothModel,'bluetooth');
    },

    turnOnLineIn:function(){
    if(!SDL.States.media.player.lineIn.active)
      {
        SDL.States.goToStates('media.player.lineIn');
      }
      this.onPlayerEnter(SDL.LineInModel,'lineIn');
    },

    turnOnIPod:function(){
      if(!SDL.States.media.player.ipod.active)
      {
        SDL.States.goToStates('media.player.ipod');
      }
      this.onPlayerEnter(SDL.IPodModel,'ipod');
    },
    // turnOnAudioOptions:function(){

      
    //   // if(!SDL.States.media.player.audioOptions.active)
    //   // {
    //   //   SDL.States.goToStates('media.player.audioOptions');
    //   // }
    //   // this.onPlayerEnter(SDL.AudioModel,'audioOptions');
    // },
    /**
     * Switching on Application
     */
    turnOnSDL: function() {
      SDL.CDModel.set('active', false);
      /**
       * Set SDL Data active, flag for status bar
       */
      if (SDL.SDLController.model) {
        SDL.SDLController.model.set('active', true);
      }
      /**
       * Go to SDL state
       */
      if (SDL.SDLController.model.appType) {
        for (var i = 0; i < SDL.SDLController.model.appType.length; i++) {
          if (SDL.SDLController.model.appType[i] == 'NAVIGATION' ||
              SDL.SDLController.model.appType[i] == 'PROJECTION') {
            SDL.BaseNavigationView.update();
            SDL.States.goToStates('navigationApp.baseNavigation');
            return;
          }
        }
      }

      SDL.States.goToStates('media.sdlmedia');
    },
    /**
     * Volume level up
     */
    volumeUpPress: function() {
      if (this.currentVolume < 100) {
        this.set('currentVolume', this.currentVolume + 1);
      }
    },
    /**
     * Volume level down
     */
    volumeDownPress: function() {
      if (this.currentVolume > 0) {
        this.set('currentVolume', this.currentVolume - 1);
      }
    },
    /**
     * Switching off CD
     */
    deactivateCD: function() {
      SDL.CDModel.set('active', false);
    },
    /**
     * Switching off USB
     */
    deactivateUSB: function() {
      SDL.USBModel.set('active', false);
    },
    /**
     * Switching off Radio
     */
    deactivateRadio: function() {
      SDL.RadioModel.set('active', false);
    },

    deactivateBluetooth: function(){
      SDL.BluetoothModel.set('active',false);
    },
    deactivateLineIn: function(){
      SDL.LineInModel.set('active',false);
    },
    deactivateIPod:function(){
      SDL.IPodModel.set('active',false);
    },
    /**  On player module enter event */
    onPlayerEnter: function(data, state) {
      if (this.currentSelectedPlayer) {
        this.currentSelectedPlayer.pause();
      }
      data.set('active', true);
      this.set('currentSelectedPlayer', data.player);
      if (state) {
        SDL.States.goToState('media.player.' + state);
      }
    },
    /**
     * Player Prev track event
     */
    prevTrack: function() {
      this.currentSelectedPlayer.prevTrackPress();
    },
    /**
     * Player Play track event
     */
    playTrack: function() {
      this.currentSelectedPlayer.playTrackPress();
    },
    /**
     * Player Next track event
     */
    nextTrack: function() {
      this.currentSelectedPlayer.nextTrackPress();
    },
    /**
     * Turn on shuffle help video event
     */
    turnOnShuffle: function() {
      this.currentSelectedPlayer.shufflePress();
    },
    /**
     * Repeat mode pressed
     */
    repeatPress: function() {
      this.currentSelectedPlayer.repeatPress();
    },
    /**
     * Eject/insert CD
     */
    ejectCD: function() {
      this.currentSelectedPlayer.ejectPress();
    },
    /**
     * Change media audio source
     */
    changeSource: function() {
      var is_background =
        SDL.States.currentState.get('path').indexOf('media.') < 0;

      switch (SDL.MediaController.activeState) {
        case 'media.player.radio': {
          this.changeSourceFromRadio(is_background);
          break;
        }
        case 'media.player.cd': {
          this.changeSourceFromCD(is_background);
          break;
        }
        case 'media.player.usb': {
          this.changeSourceFromUSB(is_background);
          break;
        }
        case 'media.player.bluetooth':{
          break;
        }
        default: {
          this.changeSourceFromUnknown(is_background);
        }
      }
    },
    /**
     * Switches to next after radio source
     * @param is source switched from background or not
     */
    changeSourceFromRadio: function(is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateRadio();
      this.turnOnCD();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    /**
     * Switches to next after CD source
     * @param is source switched from background or not
     */
    changeSourceFromCD: function(is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateCD();
      this.turnOnUSB();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    /**
     * Switches to next after USB source
     * @param is source switched from background or not
     */
    changeSourceFromUSB: function(is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateUSB();
      if (SDL.SDLMediaController.currentAppId != null && !is_background) {
        SDL.SDLMediaController.activateCurrentApp();
      } else {
        this.turnOnRadio();
      }
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    /**
     * Switches to next after unknown source
     * @param is source switched from background or not
     */
    changeSourceFromUnknown: function(is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.turnOnRadio();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },

    getAudioControlData:function()
    { 
      if(this.radioControlAudioValue.keepContext || this.radioControlAudioValue.volume 
        || this.radioControlAudioValue.equalizerSettings.channelId || this.radioControlAudioValue.equalizerSettings.channelName 
        || this.radioControlAudioValue.equalizerSettings.channelSetting)
      {
      var result={};
      var equalizer={};
      result.source=this.radioControlStruct.source;
      if(this.radioControlAudioValue.volume){
        result.volume=this.currentVolume;
      }
      if(this.radioControlAudioValue.equalizerSettings.channelId){
        equalizer.channelId=this.radioControlStruct.equalizerSettings.channelId;
        result.equalizerSettings=equalizer;
      }
      if(this.radioControlAudioValue.equalizerSettings.channelName){
        equalizer.channelName=this.radioControlStruct.equalizerSettings.channelName;
        result.equalizerSettings=equalizer;
      }
      if(this.radioControlAudioValue.equalizerSettings.channelSetting){
        equalizer.channelSetting=this.radioControlStruct.equalizerSettings.channelSetting;
        result.equalizerSettings=equalizer;
      }
      return result;
      }
      return null;
    },
    setAudioControlData:function(data){
        if(data.source!=null){
          this.set('radioControlStruct.source',data.source);
        }
        if(data.equalizerSettings!=null)
        {
          if(data.equalizerSettings.channelSetting!=null)
          {
              this.set('radioControlStruct.equalizerSettings.channelSetting',data.equalizerSettings.channelSetting);
          }
          if(data.equalizerSettings.channelId!=null)
          {
            this.set('radioControlStruct.equalizerSettings.channelId',data.equalizerSettings.channelId);
          }
          if(data.equalizerSettings.channelName!=null)
          {
            this.set('radioControlStruct.equalizerSettings.channelName',data.equalizerSettings.channelName);
          }
        }
    },
    /**
     * turn on scan event
     */
    turnOnScan: function() {
    },
    /**
     * turn on more info event
     */
    turnOnMoreInfo: function() {
    },
    /**
     * turn on options event
     */
    turnOnOptions: function() {
    },
    /**
     * turn on browse event
     */
    turnOnBrowse: function() {
    }
  }
);
