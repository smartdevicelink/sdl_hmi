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
 * @name SDL.SDLMediaModel
 * @desc SDL data model
 * @category Model
 * @filesource app/model/media/SDLMediaModel.js
 * @version 1.0
 */

SDL.SDLMediaModel = SDL.ABSAppModel.extend({

  init: function() {

    this._super();

    var subscribeVIData = {};

    for (var key in SDL.SDLVehicleInfoModel.vehicleData) {
      subscribeVIData[key] = false;
    }
    this.NAV_BUTTONS = SDL.deepCopy(this.NAV_BUTTONS_INITIAL);

    this.set('subscribedData', subscribeVIData);

    // init properties here
    this.set('appInfo', Em.Object.create({
          field1: '<field1>',
          field2: '<field2>',
          field3: '<field3>',
          field4: '<field4>',
          title: '',
          mediaClock: '<mediaClock>',
          mainImage: SDL.SDLModel.data.defaultListOfIcons.trackIcon,
          customPresets: [
            '<no definition>',
            '<no definition>',
            '<no definition>',
            '<no definition>',
            '<no definition>',
            '<no definition>',
            '<no definition>',
            '<no definition>',
            '<no definition>',
            '<no definition>'
          ],
          alignment:['text-align:center','top:100px'],
        }
        )
      );

    this.set('activeRequests', Em.Object.create({
          uiPerformInteraction: null
        }
        )
      );

    this.set('initialColorScheme.dayColorScheme', this.dayColorScheme);
    this.set('initialColorScheme.nightColorScheme', this.nightColorScheme);
    this.set('initialColorScheme.displayLayout', this.displayLayout);
    this.set('VRCommands', []);
    this.set('tbtActivate', false);
    this.set('isPlaying', true);
    this.set("forwardSeekIndicator", {type: 'TRACK', seekTime: null});
    this.set("backSeekIndicator", {type: 'TRACK', seekTime: null});

    this.set('commandsList', {'top': []});
    this.set('softButtons', []);
    this.set('cachedIconFileNamesList', []);
    this.set('cachedSubmenuIdsList', []);

    this.set('inactiveWindows', []);
    this.set('backgroundWindows', []);
    this.set('activeWindows', []);
    this.set('unregisteringInProgress', false);
    this.set('ttsSpeakListenerCallbacks', []);

    this.resetGlobalProperties();
  },

  /**
   * Parameter for presets for Media App to show presets on media screen
   *
   * @type bool
   */
  mediaPreset: false,

  /**
   * Flag for media playing state
   *
   * @param {Boolean}
   */
  isPlaying: false,
  isTemplate:false,
  mode:'',
  forwardSeekIndicator: {type: 'TRACK', seekTime: null},
  backSeekIndicator: {type: 'TRACK', seekTime: null},

  /**
   * Flag for model active state currently used for status bar
   *
   * @param {Boolean}
   */
  active: false,

  /**
   * Timer for Media Clock
   */
  timer: null,

  /**
   * Current sdl Sub Menu identificator
   */
  currentSDLSubMenuid: null,

  /**
   * Current sdl Perform Interaction Choise identificator
   */
  currentSDLPerformInteractionChoiseId: null,

  countUp: true,
  pause: null,
  maxTimeValue: 68400, // 19 hours
  startTime: 0,
  endTime: 0,
  currTime: 0,
  countRate: 1.0,

  /**
   * @description Callback for display image mode change.
   */
  imageModeChanged: function() { 
    const mode = SDL.SDLModel.data.imageMode;
    if(this.isTemplate){
      switch(mode){
        case SDL.SDLModel.data.imageModeList[0]:this.set('mode','day-mode');break;
        case SDL.SDLModel.data.imageModeList[1]:this.set('mode','night-mode');break;
        case SDL.SDLModel.data.imageModeList[2]:this.set('mode','high-lighted-mode');break;
        default:this.set('mode','day-mode');
        }
    }else this.set('mode','');
  }.observes('SDL.SDLModel.data.imageMode', 'this.isTemplate'),

  onDeleteApplication: function(appID) {

    SDL.SDLMediaController.onDeleteApplication(appID);
  },

  /**
   * Activate current application model
   */
  turnOnSDL: function() {

    SDL.SDLMediaController.activateApp(this);
  },

  startTimer: function() {

    var self = this;

    if (this.pause === false) {
      this.setDuration()
      this.timer = setInterval(function() {
        self.set('currTime', self.currTime + 1);
      }, 1000 / this.countRate
    );
    } else {
      clearInterval(this.timer);
    }
  }.observes('this.pause'),

  stopTimer: function() {

    clearInterval(this.timer);
    this.pause = null;
    this.appInfo.set('mediaClock', '');
    this.endTime = 0;
    this.countRate = 1.0;
  },

  setDuration: function() {

    var position, str = '', hrs = 0, min = 0, sec = 0;
    if (this.countUp) {
      position = this.startTime + this.currTime;
    } else {
      if (this.startTime <= this.currTime) {
        clearInterval(this.timer);
        this.currTime = 0;
        this.appInfo.set('mediaClock', '00:00:00');
        return;
      }
      position = this.startTime - this.currTime;
    }

    hrs = parseInt(position / 3600), // hours
      min = parseInt(position / 60) % 60, // minutes
      sec = position % 60; // seconds

    str = (
        hrs < 10 ? '0' : '') + hrs + ':';
    str += (
        min < 10 ? '0' : '') + min + ':';
    str += (
        sec < 10 ? '0' : '') + sec;
    if (this.endTime) {
      const time2str = (time) => {
        var hrs = parseInt(time / 3600);
        var min = parseInt(time / 60) % 60;
        var sec = time % 60;
        var str = (
            hrs < 10 ? '0' : '') + hrs + ':';
        str += (
            min < 10 ? '0' : '') + min + ':';
        str += (
            sec < 10 ? '0' : '') + sec;
        return str;
      }
      if(this.countUp) {
        str += ` /  ${time2str(this.endTime)}`;
      } else if(this.endTime !== 0) {
        const timeRemaining = this.startTime - this.endTime - this.currTime;
        str += ` (-${time2str(timeRemaining)})`;
      }

    }
    this.appInfo.set('mediaClock', str);

    if (this.get('countUp') && this.endTime != 0 && this.endTime == (this.startTime + this.currTime)) {
      clearInterval(this.timer);
      return;
    }
    else if(!this.get('countUp') && this.currTime == (this.startTime - this.endTime)) {
      clearInterval(this.timer);
      return;
    }

  }.observes('this.currTime'),

  changeTimer: function() {

    clearInterval(this.timer);
    this.currTime = 0;
    this.startTimer();
  }.observes('this.startTime',
    'this.endTime'),

  changeRate: function() {

    clearInterval(this.timer);
    this.startTimer();
  }.observes(
    'this.countRate'),

  /**
   * SDL Setter for Media Clock Timer
   *
   * @param {Object}
   */
  sdlSetMediaClockTimer: function(params) {

    if ((
      params.updateMode == 'PAUSE' && this.pause) || (
      params.updateMode == 'RESUME' && !this.pause) || (
      (
      params.updateMode == 'RESUME' || params.updateMode == 'PAUSE') &&
      this.pause === null)) {
      return SDL.SDLModel.data.resultCode['IGNORED'];
    }

    if (params.updateMode == 'CLEAR') {
      this.stopTimer();
      return SDL.SDLModel.data.resultCode.SUCCESS;
    }

    if (params.countRate) {
      this.set('countRate', params.countRate);
    } else {
      this.set('countRate', 1.0);
    }

    if (params.updateMode == 'PAUSE') {
      this.set('pause', true);
    } else if (params.updateMode == 'RESUME') {
      this.set('pause', false);
    } else {
      if (params.startTime) {
        this.set('countUp', params.updateMode == 'COUNTUP' ? true : false);
        this.set('startTime', null);
        this.set('startTime',
          params.startTime.hours * 3600 + params.startTime.minutes * 60 +
          params.startTime.seconds
        );
      }
      if (params.endTime) {
        this.set('endTime',
          params.endTime.hours * 3600 + params.endTime.minutes * 60 +
          params.endTime.seconds
        );
      } else {
        this.set('endTime', 0)
      }
      this.set('pause', false);
    }

    this.set("forwardSeekIndicator", params.forwardSeekIndicator ? params.forwardSeekIndicator : {type: 'TRACK', seekTime: null})
    this.set("backSeekIndicator", params.backSeekIndicator ? params.backSeekIndicator : {type: 'TRACK', seekTime: null})

    return SDL.SDLModel.data.resultCode.SUCCESS;
  },

  /**
   * Method to clear App OverLay
   */
  clearAppOverLay: function() {

    clearInterval(this.timer);
    this.appInfo.set('field1', '');
    this.appInfo.set('field2', '');
    this.appInfo.set('field3', '');
    this.appInfo.set('field4', '');
    this.appInfo.set('title' , '');
    this.appInfo.set('alignment', '');
    this.set('statusText', '');
    this.appInfo.set('mediaClock', '');
    this.appInfo.set('mediaTrack', '');
    this.appInfo.set('mainImage', 'images/sdl/audio_icon.jpg');
    this.updateSoftButtons();
    for (i = 0; i < 10; i++) {
      this.appInfo.set('customPresets.' + i, '');
    }
    this.set('mediaPreset', false);

  },

  /**
   * Applin UI Show handler
   *
   * @param {Object}
   */
  onSDLUIShow: function(params) {
    let isWidget = (("windowID" in params) && params.windowID !== 0);
    let windowID = isWidget ? params.windowID : 0;
    let that = this;
    let isDuplicateWidget = function(params) {
      let widgetModel = that.getWidgetModel(params.windowID);
       if(widgetModel && "duplicateUpdatesFromWindowID" in widgetModel) {
         return true;
       }
       return false;
    };

    if(isWidget) {
      if(isDuplicateWidget(params)) {
        return SDL.SDLModel.data.resultCode.REJECTED;
      }
      this.widgetShow(params);
      return;
    }

    this.mainWindowShow(params);
    let duplicateWidgets = this.getDuplicateWidgets(windowID);
    for(widget of duplicateWidgets) {
      this.widgetShow(params);
    }

    if(this.getWidgetModel(params.windowID)) {
      this.widgetShow(params);
    }
  },

  mainWindowShow: function(params) {
    for (var i = 0; i < params.showStrings.length; i++) {
      switch (params.showStrings[i].fieldName) {
        case 'mainField1': {
          this.appInfo.set('field1', params.showStrings[i].fieldText);
          break;
        }
        case 'mainField2': {
          this.appInfo.set('field2', params.showStrings[i].fieldText);
          break;
        }
        case 'mainField3': {
          this.appInfo.set('field3', params.showStrings[i].fieldText);
          break;
        }
        case 'mainField4': {
          this.appInfo.set('field4', params.showStrings[i].fieldText);
          break;
        }
        case 'statusBar': {
          this.set('statusText', params.showStrings[i].fieldText);
          SDL.SDLModel.updateStatusBar();
          break;
        }
        case 'mediaClock': {
          this.appInfo.set('mediaClock', params.showStrings[i].fieldText);
          break;
        }
        case 'mediaTrack': {
          this.appInfo.set('mediaTrack', params.showStrings[i].fieldText);
          break;
        }
        case 'templateTitle': {
          this.appInfo.set('title', params.showStrings[i].fieldText);
          break;
        }
        default : {
          break;
        }
      }
    }

    if (params.alignment) {
      switch (params.alignment) {
        case 'CENTERED': {
          this.appInfo.set('alignment', 'text-align:center');
          break;
        }
        case 'LEFT_ALIGNED': {
          this.appInfo.set('alignment', 'text-align:left');
          break;
        }
        case 'RIGHT_ALIGNED': {
          this.appInfo.set('alignment', 'text-align:right');
          break;
        }
      }
    } else {

      this.appInfo.set('alignment', 'text-align:center');
    }

    if (params.graphic != null) {
      var image = params.graphic.value;
      var search_offset = image.lastIndexOf('.');
      str = '.png';
      var isPng = image.includes(str,search_offset);
      if (isPng) {
        if (params.graphic.value != '') {
          this.appInfo.set('mainImage', params.graphic.value);
        } else {
          this.appInfo.set('mainImage', 'images/sdl/audio_icon.jpg');
        }
        this.set('isTemplate', 'DYNAMIC' == params.graphic.imageType && params.graphic.isTemplate === true);
      }
    }

    if ('softButtons' in params) {
      this.updateSoftButtons(params.softButtons);
    }

    // Magic number is a count of Preset Buttons on HMI = 8
    for (var i = 0; i < 10; i++) {
      if (!params.customPresets || (
        params.customPresets[i] == '' || params.customPresets[i] == null)) {
        this.appInfo.set('customPresets.' + i, 'PRESET_' + i);
      } else {
        this.appInfo.set('customPresets.' + i, params.customPresets[i]);
      }
    }

    if('templateConfiguration' in params) {
      this.set('templateConfiguration', params.templateConfiguration);
    }
    this.set('mediaPreset', true);
  }
}
);
