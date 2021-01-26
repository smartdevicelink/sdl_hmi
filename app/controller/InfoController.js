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
     * @description Flag defining whether HMI recevied response from App Store server or not
     */
    isAppStoreResponseReceived: false,

    /**
     * @description Mapping of bundle download urls for each web application
     */
    appPackageDownloadUrlsMap: {},

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

        const icon_url = ('icon_url' in app) ? app['icon_url'] : 'images/info/info_leftMenu_apps_ico.png';

        available_apps_view.get('availableAppsList.list.childViews').pushObject(
          SDL.Button.create({
            action: 'showAppProperties',
            classNames: 'list-item button',
            target: 'SDL.InfoController',
            text: app_title,
            appData: app,
            templateName: 'rightText',
            icon: icon_url
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
     * @param {Object} old_properties
     * @param {Object} new_properties
     */
    setAppProperties: function(old_properties, new_properties) {
      this.set('editedAppPropertiesToApply', new_properties);

      let is_app_installation_required = function() {
        const old_app_id = old_properties['policyAppID'];
        const new_app_id = new_properties['policyAppID'];

        const old_enabled_state = ('enabled' in old_properties) ? old_properties['enabled'] : false;
        const new_enabled_state = ('enabled' in new_properties) ? new_properties['enabled'] : false;

        if (old_app_id != new_app_id) {
          return new_enabled_state;
        }

        return new_enabled_state && !old_enabled_state;
      }

      if (!is_app_installation_required()) {
        FFW.BasicCommunication.SetAppProperties(new_properties);
        return;
      }

      let that = this;
      const policyAppID = new_properties['policyAppID'];

      let get_app_title = function() {
        let title = policyAppID;
        if ('nicknames' in new_properties && new_properties['nicknames'].length > 0) {
          title = new_properties['nicknames'][0];
        }
        return title;
      };

      let on_installation_failed = function() {
        SDL.PopUp.create().appendTo('body').popupActivate(
          `Can't install "${get_app_title()}" app from applications store...`, null, false
        );
        SDL.WebAppSettingsView.editorAppSettings = old_properties;
        SDL.WebAppSettingsView.showProperties();
        FFW.RPCSimpleClient.disconnect();
      };

      that.downloadAppBundle(policyAppID)
        .then( function() {
          Em.Logger.log(`App store: app installed successfully`);
          FFW.BasicCommunication.SetAppProperties(new_properties);
          FFW.RPCSimpleClient.disconnect();
        }, on_installation_failed);
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
      if ('package' in new_properties && 'url' in new_properties.package) {
        SDL.InfoController.appPackageDownloadUrlsMap[new_properties.policyAppID] = new_properties['package']['url'];
      }

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

      if (policyAppID in SDL.SDLModel.webApplicationFramesMap) {
        let frame = SDL.SDLModel.webApplicationFramesMap[policyAppID];
        const web_engine_view = document.getElementById("webEngineView");
        if (web_engine_view) {
          web_engine_view.removeChild(frame);
        }
      }

      const frame_name = `web_app_frame_${policyAppID}`;
      let web_app_frame =  document.createElement("iframe");
      web_app_frame.name = frame_name;
      web_app_frame.id = frame_name;
      web_app_frame.className = 'WebEngineFrame'; 
      web_app_frame.hidden = false;

      const web_engine_view = document.getElementById("webEngineView");
      if (web_engine_view) {
        web_engine_view.appendChild(web_app_frame);
      }

      SDL.SDLModel.webApplicationFramesMap[policyAppID] = web_app_frame;

      setTimeout(function() {
        frames[frame_name].location.href = target_url;
      }, 100);
    },

    /**
     * @description Callback function executed when user clicks App Store button
     */
    onAppsStoreButtonClick: function() {
      if (!this.isAppStoreResponseReceived) {
        let that = this;
        $.ajax({
          url: FLAGS.appStoreUrl,
          type: "GET",
          success: (response) => {
            Em.Logger.log('App store: Received available apps list JSON');
            that.processAppsStoreResponse(response);
          },
          error: (err) => {
            Em.Logger.log('App store: Failed to get available apps list');
          }
        });
      }
    },

    /**
     * @description Processes response received from App Store server
     * @param {String} response string containing server response
     */
    processAppsStoreResponse: function(response) {
      var json_content = [];
      if (response.data && response.data.applications) {
        json_content = response.data.applications
      } else {
        json_content = response
      }

      if (!Array.isArray(json_content)) {
        Em.Logger.log('Wrong data format!');
        return;
      }

      SDL.InfoController.set('isAppStoreResponseReceived', true);

      json_content.forEach(property_item => {
        property_item['enabled'] = false; // apps from store always should be initially disabled
        SDL.InfoController.updateAppProperties(property_item);
      });
    },

    /**
     * @description Provides output folder path for web engine apps
     */
    getWebEngineOutputFolder: function() {
      return document.location.pathname.replace('index.html', 'web_engine/');
    },

    /**
     * @description Sends request to backend to download bundle for a speicifed app
     * @param {String} policyAppID Id of application to download
     */
    downloadAppBundle: function(policyAppID) {
      return new Promise( (resolve, reject) => {
        if (!(policyAppID in SDL.InfoController.appPackageDownloadUrlsMap)) {
          Em.Logger.log(`App store: download URL for ${policyAppID} was not found. Assume bundle was installed manually.`);
          return resolve();
        }

        let download_url = SDL.InfoController.appPackageDownloadUrlsMap[policyAppID];
        let output_path = SDL.InfoController.getWebEngineOutputFolder();
        let client = FFW.RPCSimpleClient;

        let bundle_receive_timer = setTimeout(function() {
          Em.Logger.log('App store: Timeout for getting App bundle expired');
          client.unsubscribeFromEvent('GetAppBundleResponse');
          reject();
        }, 10000);

        let bundle_received_callback = function(params) {
          Em.Logger.log('App store: Bundle downloading has finished');
          clearTimeout(bundle_receive_timer);
          client.unsubscribeFromEvent('GetAppBundleResponse');

          if (params.success == false) {
            Em.Logger.log('App store: Bundle downloading was not successful');
            return reject();
          }

          Em.Logger.log('App store: Bundle was downloaded successfully');
          resolve();
        }

        let message = {
          method: 'GetAppBundleRequest',
          params: {
            'appID': policyAppID,
            'fileName': output_path,
            'url': download_url
          }
        };

        Em.Logger.log(`App store: downloading app bundle for ${policyAppID}`);
        client.connect();
        client.subscribeOnEvent('GetAppBundleResponse', bundle_received_callback);
        client.send(message);
      });
    },

    /**
     * @description Sends request to backend to read manifest.js for a specified app
     * @param {String} policyAppID Id of application to read manifest
     */
    getWebAppManifestContent: function(policyAppID) {
      return new Promise( (resolve, reject) => {
        let manifest_path =
          `${SDL.InfoController.getWebEngineOutputFolder()}${policyAppID}/manifest.js`;
        let client = FFW.RPCSimpleClient;

        let manifest_receive_timer = setTimeout(function() {
          Em.Logger.log('App store: Timeout for getting manifest expired');
          client.unsubscribeFromEvent('GetAppManifestResponse');
          reject();
        }, 10000);

        let manifest_received_callback = function(params) {
          Em.Logger.log('App store: Manifest loading has finished');
          clearTimeout(manifest_receive_timer);
          client.unsubscribeFromEvent('GetAppManifestResponse');

          if (params.success == false) {
            Em.Logger.log('App store: Manifest loading was not successful');
            return reject();
          }

          Em.Logger.log('App store: Manifest was loaded successfully');
          resolve(params['content']);
        }

        let message = {
          method: 'GetAppManifestRequest',
          params: {
            'fileName': manifest_path
          }
        };

        Em.Logger.log(`App store: Loading manifest for ${policyAppID}`);
        client.connect();
        client.subscribeOnEvent('GetAppManifestResponse', manifest_received_callback);
        client.send(message);
      });
    },

    /**
     * @description Extracts entrypoint name from manifest content
     * @param {String} bundle_manifest stringified content of app manifest
     */
    extractEntryPointFromManifest: function(bundle_manifest) {
      return new Promise( (resolve, reject) => {
        Em.Logger.log(`App store: parsing manifest content`);

        var bundle_json;
        try {
          bundle_json = JSON.parse(bundle_manifest)
        }
        catch {
          Em.Logger.log(`App store: failed to parse JSON content`);
          return reject();
        }

        Em.Logger.log(`App store: manifest parsed successfully`);
        if (!('entrypoint' in bundle_json)) {
          Em.Logger.log(`App store: entrypoint is not specified - use default`);
          return resolve("index.html");
        }

        resolve(bundle_json['entrypoint']);
      });
    },

    /**
     * @description Tries to get entrypoint for a specified app
     * @param {String} policyAppID Id of application to get entrypoint
     * @param {Function} callback Function to call once entrypoint information is available
     */
    getWebAppEntryPointPath: function(policyAppID, callback) {
      let that = this;

      let on_extract_failed = function() {
        SDL.PopUp.create().appendTo('body').popupActivate(
          `Can't get entrypoint path for ${policyAppID}`, null, false
        );
        FFW.RPCSimpleClient.disconnect();
      };

      that.getWebAppManifestContent(policyAppID)
        .then( function(manifest_content) {
          that.extractEntryPointFromManifest(manifest_content)
            .then( function(entrypoint) {
              const entrypoint_path =
                `http://${FLAGS.webEngineConfiguration.file_server_host}:${FLAGS.webEngineConfiguration.file_server_port}/web_engine/${policyAppID}/${entrypoint}`;
              Em.Logger.log(`App store: entrypoint for ${policyAppID} is ${entrypoint_path}`);
              FFW.RPCSimpleClient.disconnect();
              callback(entrypoint_path);
              }, on_extract_failed
            )
          }, on_extract_failed
        );
    },

    /**
     * @description Start converting streaming from SDL to the HTML5 audio/video
     * @param {String} url SDL streaming path (pipe or socket)
     * @param {String} type Streaming data type
     * @return {Promise} promice that resolves streaming URL with HTML5 audio/video
     */
    startStreamingAdapter: function(url, type) {
      return new Promise( (resolve, reject) => {
        let client = FFW.RPCSimpleClient;

        let response_timer = setTimeout(function() {
          Em.Logger.log('StartStreamingAdapter timeout');

          client.unsubscribeFromEvent('StartStreamingAdapter');
          reject();
        }, 10000);

        let response_callback = function(params) {
          Em.Logger.log('StartStreamingAdapter response');

          clearTimeout(response_timer);
          client.unsubscribeFromEvent('StartStreamingAdapter');

          if (params.success == false) {
            Em.Logger.log('StartStreamingAdapter failed');
            reject();
            return;
          }

          Em.Logger.log('StartStreamingAdapter succesfully started');
          resolve(params['stream_endpoint']);
        }

        let message = {
          method: 'StartStreamingAdapter',
          params: {
            'url' : url,
            'streamingType' : type
          }
        };

        Em.Logger.log(`StartStreamingAdapter request`);
        client.connect();
        client.subscribeOnEvent('StartStreamingAdapter', response_callback);
        client.send(message);
      });
    },

    /**
     * Stops streaming data conversion thread
     * @param {String} type streaming data type
     * @return {Promise} promice that resolves stopping of conversion thread
     */
    stopStreamingAdapter: function(type) {
      return new Promise( (resolve, reject) => {
        let client = FFW.RPCSimpleClient;

        let response_timer = setTimeout(function() {
          Em.Logger.log('StopStreamingAdapter timeout');

          client.unsubscribeFromEvent('StopStreamingAdapter');
          reject();
        }, 10000);

        let response_callback = function(params) {
          Em.Logger.log('StopStreamingAdapter response');

          clearTimeout(response_timer);
          client.unsubscribeFromEvent('StopStreamingAdapter');

          if (params.success == false) {
            Em.Logger.log('StopStreamingAdapter failed');
            reject();
            return;
          }

          Em.Logger.log('StopStreamingAdapter succesfully stopped');
          resolve();
        }

        let message = {
          method: 'StopStreamingAdapter',
          params: {
            'streamingType' : type
          }
        };

        Em.Logger.log(`StopStreamingAdapter request`);
        client.connect();
        client.subscribeOnEvent('StopStreamingAdapter', response_callback);
        client.send(message);
      });
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
    }
  }
);
