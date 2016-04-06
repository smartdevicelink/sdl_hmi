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
 * @name SDL.SDLMediaController
 * @desc SDL Media Controller logic
 * @category Controller
 * @filesource app/controller/sdl/SDLMediaController.js
 * @version 1.0
 */

SDL.SDLMediaController = Em.Object.create({

  /**
   * Current Media application id
   *
   * @type {Number}
   */
  currentAppId: null,

  /**
   * Return current Media application name used for application button
   */
  currentAppName: function() {

    if (this.currentAppId != null) {
      return SDL.SDLController.getApplicationModel(this.currentAppId).appName;
    }
  }.property('this.currentAppId'),

  /**
   * Return current Media application icon used for application button
   */
  currentAppIcon: function() {

    if (this.currentAppId != null) {
      return SDL.SDLController.getApplicationModel(this.currentAppId).appIcon;
    }
  }.property('this.currentAppId', 'SDL.SDLController.model.appIcon'),

  /** Call notification OnCommand on UIRPC */
  onCommand: function(element) {

    FFW.UI.onCommand(element.commandID, element.appID);
  },

  /** Call notification OnCommandSoftButton on UIRPC */
  onCommandSoftButton: function(element) {

    FFW.UI.onCommandSoftButton(element.softButtonID, element.appID);
  },

  /** Switching on Application */
  activateApp: function(applicationModel) {

    // store active application id
    this.set('currentAppId', applicationModel.appID);

    // set active model
    SDL.SDLController.set('model', applicationModel);

    SDL.MediaController.turnOnSDL();

  },

  /**
   * Restore current application to active state
   */
  activateCurrentApp: function() {

    FFW.BasicCommunication.ActivateApp(this.currentAppId);
  },

  /**
   * Method hides sdl activation button and sdl application
   *
   * @param {Number}
   */
  onDeleteApplication: function(appID) {

    if (this.currentAppId == appID) {

      if (SDL.States.media.sdlmedia.active          ||
                SDL.SDLController.model) {

        SDL.SDLController.getApplicationModel(appID).set('active', false);

        SDL.States.goToStates('info.apps');

        SDL.MediaController.set('activeState', 'media.player');
      }

      this.set('currentAppId', null);
    }

    SDL.SDLModel.stopStream(appID);
    SDL.SDLModel.data.get('registeredApps').removeObjects(SDL.SDLModel.data.get('registeredApps').filterProperty('appID', appID));
  }
});
