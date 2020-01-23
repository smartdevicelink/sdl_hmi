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

    defaultAppProperties: {
      "nicknames": [
        "Hello JS"
      ],
      "policyAppID": "hello-js",
      "enabled": true,
      "transportType": "ws",
      "hybridAppPreference": "BOTH"
    },

    availableApps: [],

    /**
     * @description Edited new settings which should be applied after confirmation from SDL
     */
    pendingNewSettings: null,

    onState: function(event) {
      SDL.States.goToStates('info.' + event.goToState);
    },
    onChildState: function(event) {
      SDL.States.goToStates(
        SDL.States.currentState.get('path') + '.' +
        event.goToState
      );
    },

    loadManifestFile(input, index) {
      var reader = new FileReader();
      var that = this;

      reader.onload = function() {
        var file_content = reader.result;
        var json_content;

        try {
          json_content = JSON.parse(file_content);
          SDL.InfoController.addNewApplication(json_content);
        }
        catch (err) {
          SDL.PopUp.create().appendTo('body').popupActivate(
            "Unable to load manifest file #" + index + ": " + err.message
          );
        }

        if (index < input.files.length - 1) {
          that.loadManifestFile(input, index + 1);
        } else {
          input.value = null;
        }
      };

      reader.readAsText(input.files[index]);
    },

    onManifestFilesUploaded: function(event) {
      var input = event.target;
      if (input.files.length > 0) {
        this.loadManifestFile(input, 0);
      }
    },

    addNewApplication: function(new_app_json) {
      if (!new_app_json.hasOwnProperty('policyAppID')) {
        SDL.PopUp.create().appendTo('body').popupActivate(
          "App definition does not contain policyAppID value!"
        );
        return;
      }

      for (available_app of this.availableApps) {
        if (new_app_json['policyAppID'] == available_app['policyAppID']) {
          SDL.PopUp.create().appendTo('body').popupActivate(
            "Application with such policyAppID is already loaded!"
          );
          return;
        }
      }

      new_app_json['enabled'] = false;
      this.availableApps.push(new_app_json);
      this.refreshAvailableAppsList();
    },

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

    showAppProperties: function(event) {
      SDL.WebAppSettingsView.tempAppSettings = event.appData;
      SDL.States.goToStates('info.web_app_settings');
    },

    setNewAppProperties: function() {
      SDL.WebAppSettingsView.tempAppSettings = SDL.deepCopy(this.defaultAppProperties);
      SDL.States.goToStates('info.web_app_settings');
    },

    getAppProperties: function(properties) {
      FFW.BasicCommunication.GetAppProperties(properties.policyAppID);
    },

    getAvailableAppsProperties: function() {
      FFW.BasicCommunication.GetAppProperties(null);
    },

    setAppProperties: function(old_properties, new_properties) {
      this.set('pendingNewSettings', new_properties);
      FFW.BasicCommunication.SetAppProperties(new_properties);
    },

    onGetAppProperties: function(result_code, properties) {
      if (result_code == SDL.SDLModel.data.resultCode.SUCCESS && properties) {
        var current_properties = SDL.deepCopy(SDL.WebAppSettingsView.tempAppSettings);

        for (app_properties of properties) {
          this.updateAppProperties(app_properties);
          if (app_properties.policyAppID == current_properties.policyAppID) {
            SDL.WebAppSettingsView.set('tempAppSettings', app_properties);
            SDL.WebAppSettingsView.showProperties();
          }
        }
      }
    },

    onAppPropertiesNotification: function(new_properties) {
      this.updateAppProperties(new_properties);

      var current_properties = SDL.deepCopy(SDL.WebAppSettingsView.tempAppSettings);
      if (current_properties.policyAppID != new_properties.policyAppID) {
        // Don't refresh displayed properties for a different app
        return;
      }

      for (properties of this.availableApps) {
        if (properties.policyAppID == current_properties.policyAppID) {
          SDL.WebAppSettingsView.set('tempAppSettings', properties);
          SDL.WebAppSettingsView.showProperties();
          break;
        }
      }

      // Drop pending properties if notification received during Set request
      this.set('pendingNewSettings', null);
    },

    onSetAppProperties: function(result_code) {
      if (!this.pendingNewSettings) {
        return;
      }

      if (result_code == SDL.SDLModel.data.resultCode.SUCCESS) {
        this.updateAppProperties(this.pendingNewSettings);
        SDL.WebAppSettingsView.set('tempAppSettings', this.pendingNewSettings);
        SDL.WebAppSettingsView.showProperties();
      }

      this.set('pendingNewSettings', null);
    },

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
        return;
      }

      var current_properties = SDL.deepCopy(this.availableApps[properties_index]);
      Object.keys(new_properties).forEach(property => {
        if (new_properties.hasOwnProperty(property)) {
          current_properties[property] = new_properties[property];
        }
      });

      this.availableApps[properties_index] = current_properties;
      this.refreshAvailableAppsList();
    },

    runAppWithProperties: function(properties) {
      var policyAppID = properties['policyAppID'];

      var popup = SDL.PopUp.create().appendTo('body').popupActivate(
        'Waiting for web application ' + policyAppID + ' to be registered...', null, true
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
     * Switching on Application
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
