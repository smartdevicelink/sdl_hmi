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
    init:function(){
      this.tempEqualizerSettIndex=this.lastRadioControlStruct.equalizerSettings.length;
      this.tempEqualizerSettings.channelName=this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex-1].channelName;
      this.tempEqualizerSettings.channelId=parseInt(this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex-1].channelId);
      this.tempEqualizerSettings.channelSetting=parseInt(this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex-1].channelSetting);
    },
    activeState: 'media.player.cd',
    /** Current selected players module Data reference*/
    //currentPlayerModuleData: SDL.CDModel,
    /** Current selected player object  reference*/
    currentSelectedPlayer: SDL.CDModel.player,
    /**
     * Current volume level in percents
     */
    keepContext :false,
    tempSource:'',
     currentVolume: 50,
     radioControlStruct:{
      source:'AUDIO',
      equalizerSettings:[{
        channelSetting:50,
        channelId: 1,
        channelName: 'Treble'
      },
    {
      channelSetting:50,
        channelId: 2,
        channelName: 'Midrange'
    },{
      channelSetting:50,
        channelId: 3,
        channelName: 'Bass'
    }],
     },
     
     lastRadioControlStruct:{
      source:'AUDIO',
      equalizerSettings:[{
        channelSetting:50,
        channelId: 1,
        channelName: 'Treble'
      },
    {
      channelSetting:50,
        channelId: 2,
        channelName: 'Midrange'
    },{
      channelSetting:50,
        channelId: 3,
        channelName: 'Bass'
    }],
     },

     tempEqualizerSettIndex: 3,
     tempEqualizerSettings: {
      },

     radioControlAudioValue:
     {
        keepContext:true,
        volume:true,
        equalizerSettings:true,
        channelName:true

     },
     //lastParams:{},

      usbControl:{
      keepContext: false
    },
    boolStruct: [
    true,
    false
    ],
    saveButtonPress:function(){

      var equalizerSettings = []; 
      this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex-1].channelId=
      parseInt(this.tempEqualizerSettings.channelId);
      this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex-1].channelSetting=
      parseInt(this.tempEqualizerSettings.channelSetting);
      this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex-1].channelName=
      this.tempEqualizerSettings.channelName;

      var lengthLast = this.lastRadioControlStruct.equalizerSettings.length;
      for(var i;i<lengthLast;i++)
      {
        this.lastRadioControlStruct.equalizerSettings[i].channelId=
        parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelId);
        this.lastRadioControlStruct.equalizerSettings[i].channelSetting=
        parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelSetting);
      }
      var lengthCurrent = this.radioControlStruct.equalizerSettings.length;
      if(lengthLast>lengthCurrent){
      if(lengthLast != lengthCurrent){
        for(var i =lengthCurrent;i<lengthLast;i++)
        {
          equalizerSettings.push(this.lastRadioControlStruct.equalizerSettings[i]);
        }
      }
      for (var i=0;i<lengthCurrent;++i)
      {
        if(this.lastRadioControlStruct.equalizerSettings[i].channelId!=
          this.radioControlStruct.equalizerSettings[i].channelId || 
          this.lastRadioControlStruct.equalizerSettings[i].channelSetting!=
          this.radioControlStruct.equalizerSettings[i].channelSetting)
          {
            temp={};
            temp.channelId=
            parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelId);
            temp.channelSetting=
            parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelSetting);
            if(this.lastRadioControlStruct.equalizerSettings[i].channelName!=
              this.radioControlStruct.equalizerSettings[i].channelName)
              {
                temp.channelName=
                this.lastRadioControlStruct.equalizerSettings[i].channelName;
              }
            equalizerSettings.push(temp);
            continue;
          }
          if(this.lastRadioControlStruct.equalizerSettings[i].channelName!=
            this.radioControlStruct.equalizerSettings[i].channelName)
            {
              equalizerSettings.push(this.lastRadioControlStruct.equalizerSettings[i]);
            }
      }
    }
    else{
      for (var i=0;i<lengthLast;++i)
      {
        if(this.lastRadioControlStruct.equalizerSettings[i].channelId!=
          this.radioControlStruct.equalizerSettings[i].channelId || 
          this.lastRadioControlStruct.equalizerSettings[i].channelSetting!=
          this.radioControlStruct.equalizerSettings[i].channelSetting)
          {
            temp={};
            temp.channelId=
            parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelId);
            temp.channelSetting=
            parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelSetting);
            if(this.lastRadioControlStruct.equalizerSettings[i].channelName!=
              this.radioControlStruct.equalizerSettings[i].channelName)
              {
                temp.channelName=
                this.lastRadioControlStruct.equalizerSettings[i].channelName;
              }
            equalizerSettings.push(temp);
            continue;
          }
          if(this.lastRadioControlStruct.equalizerSettings[i].channelName!=
            this.radioControlStruct.equalizerSettings[i].channelName)
            {
              equalizerSettings.push(this.lastRadioControlStruct.equalizerSettings[i]);
            }
      }
    }
    SDL.MediaController.toggleProperty('optionsEnabled');
    if(equalizerSettings.length){
      var size=  equalizerSettings.length;
      for(var i=0;i<size;i++)
      {
          equalizerSettings[i].channelId = parseInt(equalizerSettings[i].channelId);
          equalizerSettings[i].channelSetting=
          parseInt(equalizerSettings[i].channelSetting);
      }
    FFW.RC.onInteriorVehicleDataNotification({moduleType:'AUDIO',audioControlData:{equalizerSettings:equalizerSettings}});
    this.setLastData();
    }
    },
    setLastData:function(){
      this.radioControlStruct=SDL.deepCopy(this.lastRadioControlStruct);
    },
    getCurrentData:function(){
      var result = {
        'source':this.lastRadioControlStruct.source,
        'equalizerSettings':{
          'channelSetting':this.lastRadioControlStruct.equalizerSettings.channelSetting,
          'channelId':this.lastRadioControlStruct.equalizerSettings.channelId,
          'channelName':this.lastRadioControlStruct.equalizerSettings.channelName
        },

      };
      return result;
    },


    optionsEnabled:false,
    toggleOptions:function(){
      SDL.MediaController.toggleProperty('optionsEnabled');
    },
    /**
     * Turn on CD
     */
    turnOnCD: function() {
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
        this.keepContext=false;
        SDL.States.goToStates('media.player.ipod');
      }
      this.onPlayerEnter(SDL.IPodModel,'ipod');
    },
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
        if(this.radioControlAudioValue.volume)
        {
          FFW.RC.onInteriorVehicleDataNotification({moduleType:'AUDIO',audioControlData:{'volume':this.currentVolume}});
        }
      }
    },
    /**
     * Volume level down
     */
    volumeDownPress: function() {
      if (this.currentVolume > 0) {
        this.set('currentVolume', this.currentVolume - 1);
        if(this.radioControlAudioValue.volume)
        {
          FFW.RC.onInteriorVehicleDataNotification({moduleType:'AUDIO',audioControlData:{'volume':this.currentVolume}});
        }
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
          this.changeSourceFromBluetooth(is_background);
          break;
        }
        case 'media.player.lieIn':{
          this.changeSourceFromLineIn(is_background);
          break;
        }
        case 'media.player.ipod':{
          this.changeSourceFromIpod(is_background);
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
    changeSourceFromBluetooth: function(is_background){
      var old_state = SDL.States.currentState.get('path');
      this.deactivateBluetooth();
      this.turnOnLineIn();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    changeSourceFromLineIn: function(is_background){
      var old_state = SDL.States.currentState.get('path');
      this.deactivateLineIn();
      this.turnOnIpod();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    changeSourceFromIpod: function(is_background){
      var old_state = SDL.States.currentState.get('path');
      this.deactivateIpod();
      this.turnOnIpod();
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
      if(this.keepContext)
      {
        return this.getResultWithKeepContext();
      }
      var size= this.lastRadioControlStruct.equalizerSettings.length;
      for(var i=0;i<size;i++)
      {
        this.lastRadioControlStruct.equalizerSettings[i].channelId=
        parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelId);
        this.lastRadioControlStruct.equalizerSettings[i].channelSetting=
        parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelSetting);

      }
      return this.lastRadioControlStruct;
    },
    getResultWithKeepContext:function()
    {
        equalizerSettings:[];
        equalizerSettings=SDL.deepCopy(this.lastRadioControlStruct.equalizerSettings);
        result={equalizerSettings};
        result.source=SDL.deepCopy(this.tempSource);
        var size= result.equalizerSettings.length;
      for(var i=0;i<size;i++)
      {
        result.equalizerSettings[i].channelId=
        parseInt(result.equalizerSettings[i].channelId);
        result.equalizerSettings[i].channelSetting=
        parseInt(result.equalizerSettings[i].channelSetting);

      }
      return result;

    },
    switchSource:function(source)
    {
      switch(source){
        case 'RADIO_TUNER':this.turnOnRadio();break;
        case 'BLUETOOTH_STEREO_BTST':this.turnOnBluetooth();break;
        case 'CD':this.turnOnCD();break;
        case 'USB':this.turnOnUSB();break;
        case 'LINE_IN':this.turnOnLineIn();break;
        case 'IPOD':this.turnOnIPod();break;
        case 'MOBILE_APP':SDL.SDLMediaController.activateCurrentApp();break;
      }
    },
    setAudioControlData:function(data){
      result={};
      this.keepContext=data.keepContext===true;
    if(!this.keepContext){
      if(data.source!=null){
        this.set('radioControlStruct.source',data.source);
        this.switchSource(data.source);
        result.source=data.source;
      }
    }else if (this.keepContext & this.radioControlStruct.source=='MOBILE_APP'){
      if(data.source!=null){
      this.tempSource = SDL.deepCopy(data.source);
      result.source=data.source;
      }else{
        this.tempSource=this.radioControlStruct.source;
      }
    }else if(this.keepContext & this.radioControlStruct.source!='MOBILE_APP'){
      if(data.source!=null){
        this.keepContext=false;
        this.set('radioControlStruct.source',data.source);
        this.switchSource(data.source);
        result.source=data.source;
      }
    }


        if(data.volume!=null){
          this.set('currentVolume',data.volume);
          result.volume=data.volume;
        }
        
        if(data.equalizerSettings!=null){
        var dataLength = data.equalizerSettings.length;
        var currentLength = this.lastRadioControlStruct.equalizerSettings.length;

        resultNew={equalizerSettings:[]};
        if(result.source!=null)
        {
          resultNew.source=data.source;
        }
        if(result.volume!=null)
        {
          resultNew.volume=data.volume;
        }
        for(var i = 0; i < dataLength; ++i){
          
          if(i==currentLength || i>currentLength)
          {
            temp={};
            this.lastRadioControlStruct.equalizerSettings.push(data.equalizerSettings[i]);
            temp.channelId=parseInt(data.equalizerSettings[i].channelId);
            temp.channelSetting=parseInt(data.equalizerSettings[i].channelSetting);
            resultNew.equalizerSettings.push(temp);
          }
          else{
            temp={};
            if(data.equalizerSettings[i].channelSetting!=null)
            {
                this.lastRadioControlStruct.equalizerSettings[i].channelSetting=
                SDL.deepCopy(data.equalizerSettings[i].channelSetting);
               
                temp.channelSetting=parseInt(data.equalizerSettings[i].channelSetting);
                
            }
            if(data.equalizerSettings[i].channelId!=null)
            {
              this.lastRadioControlStruct.equalizerSettings[i].channelId =
              SDL.deepCopy(parseInt(data.equalizerSettings[i].channelId));
              temp.channelId=parseInt(data.equalizerSettings[i].channelId);
            }
            resultNew.equalizerSettings.push(temp);
          }
        }
        this.setLastData();
        result=SDL.deepCopy(resultNew);
        }

        return result;
    },
    getAudioControlCapabilities:function(){
      var result=[];
      var capabilities = {
        moduleName :'AudioControlCapabilities',
        sourceAvailable: true,
        volumeAvailable : true,
        equalizerAvailable : true,
        equalizerMaxChannelId : 100
      };
      result.push(capabilities);
      return result;
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
