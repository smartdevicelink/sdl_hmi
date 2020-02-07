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
 * @name SDL.InfoController
 * @desc Info Controller logic
 * @category Controller
 * @filesource app/controller/InfoController.js
 * @version 1.0
 */

SDL.InfoController = Em.Object.create(
  {
    activeState: 'info.apps',
    hiddenLeftMenu: false,

    /**
     * @description Default app properties for editor
     */
    defaultAppProperties: {
      "nicknames": [
        "Hello JS"
      ],
      "policyAppID": "hello-js",
      "enabled": true,
      "transportType": "ws",
      "hybridAppPreference": "BOTH"
    },

    /**
     * @description The list of installed web applications properties
     */
    availableApps: [],

    /**
     * @description Edited new properties which should be applied for app after successful response from SDL
     */
    editedAppPropertiesToApply: null,

    /**
     * @description Changes current state according to incoming event
     * @param {Object} event
     */
    onState: function(event) {
      SDL.States.goToStates('info.' + event.goToState);
    },

    /**
     * @description Changes current child state according to incoming event
     * @param {Object} event
     */
    onChildState: function(event) {
      SDL.States.goToStates(
        SDL.States.currentState.get('path') + '.' +
        event.goToState
      );
    },

    /**
     * @description Refreshes the content of list of installed web apps
     */
    refreshAvailableAppsList: function() {
      var available_apps_view = SDL.AppsStoreView.availableAppsView;
      available_apps_view.get('availableAppsList.list').removeAllChildren();
      available_apps_view.get('availableAppsList.list').refresh();

      for (app of this.availableApps) {
        var app_title = app['policyAppID'];
        if (app.hasOwnProperty('nicknames') && Array.isArray(app['nicknames']) && app['nicknames'].length > 0) {
          app_title = app['nicknames'][0];
        }

        available_apps_view.get('availableAppsList.list.childViews').pushObject(
          SDL.Button.create({
            action: 'showAppProperties',
            classNames: 'list-item button',
            target: 'SDL.InfoController',
            text: app_title,
            appData: app
          })
        );
      }
    },

    /**
     * @description Opens selected web application properties editor
     * @param {Object} event
     */
    showAppProperties: function(event) {
      SDL.WebAppSettingsView.editorAppSettings = event.appData;
      SDL.States.goToStates('info.web_app_settings');
    },

    /**
     * @description Opens properties editor with default settings
     */
    setNewAppProperties: function() {
      SDL.WebAppSettingsView.editorAppSettings = SDL.deepCopy(this.defaultAppProperties);
      SDL.States.goToStates('info.web_app_settings');
    },

    /**
     * @description Sends GetAppProperties request to SDL for selected web app
     * @param {Object} properties
     */
    getAppProperties: function(properties) {
      FFW.BasicCommunication.GetAppProperties(properties.policyAppID);
    },

    /**
     * @description Sends GetAppProperties request to SDL for all web apps
     */
    getAvailableAppsProperties: function() {
      FFW.BasicCommunication.GetAppProperties(null);
    },

    /**
     * @description Sends SetAppProperties request to SDL for edited web app
     * @param {Object} new_properties
     */
    setAppProperties: function(new_properties) {
      this.set('editedAppPropertiesToApply', new_properties);
      FFW.BasicCommunication.SetAppProperties(new_properties);
    },

    /**
     * @description Callback function to run on getting GetAppProperties response
     * @param {Number} result_code
     * @param {Object} properties
     */
    onGetAppProperties: function(result_code, properties) {
      if (result_code == SDL.SDLModel.data.resultCode.SUCCESS && properties) {
        var current_policy_app_id = SDL.WebAppSettingsView.editorAppSettings.policyAppID;

        for (app_properties of properties) {
          let updated_properties = this.updateAppProperties(app_properties);
          if (updated_properties.policyAppID == current_policy_app_id) {
            SDL.WebAppSettingsView.set('editorAppSettings', updated_properties);
            SDL.WebAppSettingsView.showProperties();
          }
        }
      }
    },

    /**
     * @description Callback function to run on getting OnAppProperties notification
     * @param {Object} new_properties
     */
    onAppPropertiesNotification: function(new_properties) {
      let updated_properties = this.updateAppProperties(new_properties);

      var current_policy_app_id = SDL.WebAppSettingsView.editorAppSettings.policyAppID;
      if (current_policy_app_id != updated_properties.policyAppID) {
        // Don't refresh displayed properties for a different app
        return;
      }

      for (properties of this.availableApps) {
        if (properties.policyAppID == current_policy_app_id) {
          SDL.WebAppSettingsView.set('editorAppSettings', properties);
          SDL.WebAppSettingsView.showProperties();
          break;
        }
      }

      // Drop pending properties if notification received during Set request
      this.set('editedAppPropertiesToApply', null);
    },

    /**
     * @description Callback function to run on getting SetAppProperties response
     * @param {Number} result_code
     */
    onSetAppProperties: function(result_code) {
      if (!this.editedAppPropertiesToApply) {
        return;
      }

      if (result_code == SDL.SDLModel.data.resultCode.SUCCESS) {
        let updated_properties = this.updateAppProperties(this.editedAppPropertiesToApply);
        SDL.WebAppSettingsView.set('editorAppSettings', updated_properties);
        SDL.WebAppSettingsView.showProperties();
      }

      this.set('editedAppPropertiesToApply', null);
    },

    /**
     * @description Deletes web app properties from the list
     * @param {Object} properties
     */
    deleteAppProperties: function(properties) {
      SDL.States.goToStates('info.apps_store');
      for (var i = 0; i < this.availableApps.length; ++i) {
        if (this.availableApps[i]['policyAppID'] == properties.policyAppID) {
          this.availableApps.splice(i, 1);
          this.refreshAvailableAppsList();
          return;
        }
      }
    },

    /**
     * @description Updates web app properties in the list
     * @param {Object} new_properties
     * @returns {Object} updated app properties
     */
    updateAppProperties: function(new_properties) {
      var properties_index = -1;
      for (var i = 0; i < this.availableApps.length; ++i) {
        if (this.availableApps[i].policyAppID == new_properties.policyAppID) {
          properties_index = i;
          break;
        }
      }

      if (properties_index < 0) {
        this.availableApps.push(new_properties);
        this.refreshAvailableAppsList();
        return new_properties;
      }

      var current_properties = this.availableApps[properties_index];
      Object.keys(new_properties).forEach(property => {
        if (new_properties.hasOwnProperty(property)) {
          current_properties[property] = new_properties[property];
        }
      });

      this.refreshAvailableAppsList();
      return current_properties;
    },

    /**
     * @description Starts web app with specified set of properties
     * @param {Object} properties
     */
    runAppWithProperties: function(properties) {
      var policyAppID = properties['policyAppID'];

      var popup = SDL.PopUp.create().appendTo('body').popupActivate(
        `Waiting for web application ${policyAppID} to be registered...`, null, true
      );

      SDL.SDLModel.set('pendingActivationAppID', policyAppID);
      SDL.SDLModel.set('pendingActivationPopUp', popup);

      var target_url = properties['url'];
      target_url += "?sdl-host=" + properties['host']
      target_url += "&sdl-port=" + properties['port']
      target_url += "&sdl-transport-role=" + properties['role'];

      window.open(target_url, "_blank");
    },

    /**
     * @description Switching on Application
     */
    turnOnSDL: function() {

      //SDL.CDModel.set('active', false);
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
      SDL.States.goToStates('info.nonMedia');
      //SDL.States.goToStates('media.sdlmedia');
    }
  }
);
