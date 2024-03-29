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
 * @name SDL.SDLNonMediaModel
 * @desc Concrate model for SDL NonMedia application
 * @category Model
 * @filesource app/model/sdl/NonMediaModel.js
 * @version 1.0
 */

SDL.SDLNonMediaModel = SDL.ABSAppModel.extend({

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
          alignment: 'text-align:center'
        }
        )
      );

    this.set('activeRequests', Em.Object.create({
          uiPerformInteraction: null
        }
        )
      );

    this.set('constantTBTParams', null);

    this.set('initialColorScheme.dayColorScheme', this.dayColorScheme);
    this.set('initialColorScheme.nightColorScheme', this.nightColorScheme);
    this.set('initialColorScheme.displayLayout', this.displayLayout);
    this.set('VRCommands', []);
    this.set('tbtActivate', false);

    this.set('inactiveWindows', []);
    this.set('backgroundWindows', []);
    this.set('activeWindows', []);

    this.set('commandsList', {'top': []});
    this.set('softButtons', []);
    this.set('ttsSpeakListenerCallbacks', []);
    this.set('cachedIconFileNamesList', []);
    this.set('cachedSubmenuIdsList', []);

    this.resetGlobalProperties();
  },

  isTemplate:false,

  /**
   * Method hides sdl activation button and sdl application
   *
   * @param {Number}
   */
  onDeleteApplication: function(appID) {

    SDL.NonMediaController.onDeleteApplication(appID);
  },

  /**
   * Activate current application model
   */
  turnOnSDL: function() {

    SDL.NonMediaController.activateApp(this);
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
    this.appInfo.set('title', '');
    this.appInfo.set('alignment', '');
    this.appInfo.set('mainImage', 'images/sdl/audio_icon.jpg');
    this.updateSoftButtons();
    for (i = 0; i < 10; i++) {
      this.appInfo.set('customPresets.' + i, '');
    }

  },

  /**
   * Applin UI Show handler
   *
   * @param {Object}
   */
  onSDLUIShow: function(params) {
    clearInterval(this.timer);
    
    let isWidget = (("windowID" in params) && params.windowID !== 0);
    let that = this;
    let windowID = isWidget ? params.windowID : 0;
    let isDuplicateWidget = (function(params) {
      let widgetModel = that.getWidgetModel(params.windowID);
       if(widgetModel && "duplicateUpdatesFromWindowID" in widgetModel) {
         return true;
       }
       return false;
    }(params));

    if(isWidget) {
      if(isDuplicateWidget) {
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

  /**
   * @function mainWindowShow
   * @param {Object} params 
   * @description UI show for main window of application
   */
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
          this.appInfo.set('statusText', params.showStrings[i].fieldText);
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
      if (params.graphic.value != '') {
        this.appInfo.set('mainImage', params.graphic.value);
      } else {
        this.appInfo.set('mainImage', 'images/sdl/audio_icon.jpg');
      }

      this.set('isTemplate', 'DYNAMIC' == params.graphic.imageType && params.graphic.isTemplate === true);
    }

    // Magic number is a count of Preset Buttons on HMI = 8
    this.appInfo.set('customPresets', []);
    for (var i = 0; i < 10; i++) {
      if (!params.customPresets || (
        params.customPresets[i] == '' || params.customPresets[i] == null)) {
        this.appInfo.get('customPresets').pushObject('PRESET_' + i);
      } else {
        this.appInfo.get('customPresets').pushObject(params.customPresets[i]);
      }
    }

    if ('softButtons' in params) {
      this.updateSoftButtons(params.softButtons);
    }

    if('templateConfiguration' in params) {
      this.set('templateConfiguration', params.templateConfiguration);
    }
  },

  sdlSetMediaClockTimer: function() {

    return;
  },

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

}
);
