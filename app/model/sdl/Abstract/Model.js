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
 * @name SDL.ABSModel
 * @desc General model for SDL applications
 * @category Model
 * @filesource app/model/sdl/Abstract/Model.js
 * @version 1.0
 */

SDL.SDLModel = Em.Object.extend({

  /**
   * Model's data
   */
  data: SDL.SDLModelData,

  /**
   * Function make diff between two arrays of permissions
   * remove argument array from existed array of permissions
   */
  setAppPermissions: function(appID, permissions) {

    var messageCodes = [];

    permissions.forEach(function(x) {
          messageCodes.push(x.name);
        }
      );

    messageCodes.push('AppPermissionsRevoked');

    FFW.BasicCommunication.GetUserFriendlyMessage(
      SDL.SettingsController.simpleParseUserFriendlyMessageData, appID,
      messageCodes
    );

  },

  /**
   * List of subscribed data on VehicleInfo model
   *
   * @type {Object}
   */
  subscribedData: {},

  applicationStatusBar: '',

  updateStatusBar: function() {

    if (this.data.limitedExist &&
      SDL.SDLController.getApplicationModel(this.data.stateLimited)) {
      this.set('applicationStatusBar',
        SDL.SDLController.getApplicationModel(this.data.stateLimited).statusText
      );
    } else {
      this.set('applicationStatusBar', '');
    }
  }.observes('this.data.limitedExist'),

  /**
   * Method to set selected state of settings Info List
   */
  settingsInfoListStateChange: function() {

    FFW.BasicCommunication.AddStatisticsInfo(this.data.settingsInfoListState);
  }.observes('this.data.settingsInfoListState'),

  /**
   * Method to set selected state of settings Info List
   */
  systemErrorListStateChange: function() {

    FFW.BasicCommunication.OnSystemError(this.data.systemErrorListState);
  }.observes('this.data.systemErrorListState'),

  /**
   * Method to open Phone view and dial phone number
   *
   * @param {Object}
   */
  dialNumber: function(params) {

    this.data.set('phoneCall', true);
    SDL.States.goToStates('phone.dialpad');
    SDL.PhoneModel.set('dialpadNumber', params.number);
    SDL.PhoneController.onDialCall();
  },

  /**
   * Notification method to send touch event data to SDLCore
   *
   * @param {Object}
   */
  onTouchEvent: function(event) {

    if (event.target.parentElement.className.indexOf('navButton') >= 0 ||
      event.target.className.indexOf('navButton') >= 0) {
      return;
    }

    var type = '',
      changedTouches = event.originalEvent.changedTouches ?
        event.originalEvent.changedTouches.length : 1;

    switch (event.originalEvent.type) {
      case 'touchstart': {
        FLAGS.TOUCH_EVENT_STARTED = true;
        type = 'BEGIN';
        break;
      }
      case 'touchmove': {
        type = 'MOVE';
        break;
      }
      case 'touchend': {
        type = 'END';
        break;
      }
      case 'mousedown': {
        FLAGS.TOUCH_EVENT_STARTED = true;
        type = 'BEGIN';
        break;
      }
      case 'mousemove': {
        type = 'MOVE';
        break;
      }
      case 'mouseup': {
        type = 'END';
        break;
      }
    }

    if (FLAGS.TOUCH_EVENT_STARTED) {

      var events = [];
      for (var i = 0; i < changedTouches; i++) {

        if (event.originalEvent.changedTouches && (
          event.originalEvent.changedTouches[i].pageX >
          SDL.SDLVehicleInfoModel.vehicleData.displayResolution.width ||
          event.originalEvent.changedTouches[i].pageY >
          SDL.SDLVehicleInfoModel.vehicleData.displayResolution.height)) {
          return;
        }

        events[i] = {};
        events[i].c = [{}];

        events[i].id = event.originalEvent.changedTouches ?
          event.originalEvent.changedTouches[i].identifier : 0;
        events[i].c[0].x = event.originalEvent.changedTouches ?
          event.originalEvent.changedTouches[i].pageX :
          event.originalEvent.pageX;
        events[i].c[0].y = event.originalEvent.changedTouches ?
          event.originalEvent.changedTouches[i].pageY :
          event.originalEvent.pageY;
        events[i].ts = [parseInt(event.timeStamp)];

      }
      FFW.UI.onTouchEvent(type, events);
    }

    if (event.originalEvent.type == 'mouseup') {
      FLAGS.TOUCH_EVENT_STARTED = false;
    }
  },

  /**
   * Method to remove deleted by SDL Core images used in HMI
   * check images came in request from SDLCore like UI.Show, UI.AddCommand, UI.SetGlobalProperties,
   * UI.SeAppIcon, Navigation.ShowConstantTBT, Navigation.UpdateTurnList, UI.ShowNotification
   *
   * @param {Object}
   */
  onFileRemoved: function(params) {

    var result = false;

    if ((
      params.fileType === 'GRAPHIC_PNG' || params.fileType === 'GRAPHIC_BMP' ||
      params.fileType === 'GRAPHIC_JPEG') &&
      SDL.SDLController.getApplicationModel(params.appID)) {
      result = SDL.SDLController.getApplicationModel(params.appID).
                   onImageRemoved(params.fileName);

      if (SDL.SDLController.getApplicationModel(params.appID).appIcon.
              indexOf(params.fileName) != -1 &&
        params.fileName.length ==
        SDL.SDLController.getApplicationModel(params.appID).appIcon.length) {
        SDL.SDLController.getApplicationModel(params.appID).
            set('appIcon', SDL.SDLModel.data.defaultListOfIcons.app);
      }

      if (SDL.SDLController.getApplicationModel(params.appID
        ).constantTBTParams) {

        if (SDL.SDLController.getApplicationModel(params.appID
          ).constantTBTParams.turnIcon &&
          SDL.SDLController.getApplicationModel(params.appID).constantTBTParams.
              turnIcon.value.indexOf(params.fileName) != -1 &&
          params.fileName.length == SDL.SDLController.getApplicationModel(
            params.appID
          ).constantTBTParams.turnIcon.value.length) {
          SDL.SDLController.getApplicationModel(params.appID
          ).constantTBTParams.turnIcon.value            =
              SDL.SDLModel.data.defaultListOfIcons.command;
          SDL.TurnByTurnView.activate(params.appID);
        }

        if (SDL.SDLController.getApplicationModel(params.appID
          ).constantTBTParams.nextTurnIcon &&
          SDL.SDLController.getApplicationModel(params.appID).constantTBTParams.
              nextTurnIcon.value.indexOf(params.fileName) != -1 &&
          params.fileName.length == SDL.SDLController.getApplicationModel(
            params.appID
          ).constantTBTParams.nextTurnIcon.value.length) {
          SDL.SDLController.getApplicationModel(params.appID
          ).constantTBTParams.nextTurnIcon.value            =
              SDL.SDLModel.data.defaultListOfIcons.command;
          SDL.TurnByTurnView.activate(params.appID);
        }
      }

      if (SDL.SDLController.model.appInfo.trackIcon &&
        SDL.SDLController.model.appInfo.trackIcon.indexOf(params.fileName) !=
        -1 &&
        params.fileName.length ==
        SDL.SDLController.model.appInfo.trackIcon.length) {
        SDL.SDLController.model.appInfo.set('trackIcon',
          SDL.SDLModel.data.defaultListOfIcons.trackIcon
        );
      }

      if (SDL.SDLController.model.appInfo.mainImage &&
        SDL.SDLController.model.appInfo.mainImage.indexOf(params.fileName) !=
        -1 &&
        params.fileName.length ==
        SDL.SDLController.model.appInfo.mainImage.length) {
        SDL.SDLController.model.appInfo.set('mainImage',
          SDL.SDLModel.data.defaultListOfIcons.trackIcon
        );
      }

      var len = SDL.SDLController.getApplicationModel(params.appID
      ).turnList.length;
      for (var i = 0; i < len; i++) {
        if (!SDL.SDLController.getApplicationModel(params.appID
          ).turnList[i].turnIcon) {
          continue;
        }
        if (SDL.SDLController.getApplicationModel(params.appID
          ).turnList[i].turnIcon.value.indexOf(params.fileName) != -1 &&
          params.fileName.length == SDL.SDLController.getApplicationModel(
            params.appID
          ).turnList[i].turnIcon.value.length) {
          SDL.SDLController.getApplicationModel(params.appID
          ).turnList[i].turnIcon.value            =
              SDL.SDLModel.data.defaultListOfIcons.command;
        }
      }

      SDL.TBTTurnList.updateList(params.appID);

      if (SDL.SDLController.getApplicationModel(params.appID).softButtons) {
        var len = SDL.SDLController.getApplicationModel(params.appID
        ).softButtons.length;
        for (var i = 0; i < len; i++) {
          if (!SDL.SDLController.getApplicationModel(params.appID
            ).softButtons[i].image) {
            continue;
          }
          if (SDL.SDLController.getApplicationModel(params.appID
            ).softButtons[i].image.value.indexOf(params.fileName) != -1 &&
            params.fileName.length == SDL.SDLController.getApplicationModel(
              params.appID
            ).softButtons[i].image.value.length) {
            SDL.SDLController.getApplicationModel(params.appID
            ).softButtons[i].image.value              =
                SDL.SDLModel.data.defaultListOfIcons.command;
          }
        }

        if (params.appID == SDL.SDLController.model.appID) {
          SDL.sdlView.innerMenu.refreshItems();
        }
      }

      var len = SDL.VRHelpListView.helpList.items.length;
      for (var i = 0; i < len; i++) {
        if (!SDL.VRHelpListView.helpList.items[i].params.icon) {
          continue;
        }
        if (SDL.VRHelpListView.helpList.items[i].params.icon.indexOf(
            params.fileName
          ) != -1 &&
          params.fileName.length ==
          SDL.VRHelpListView.helpList.items[i].params.icon.length) {
          SDL.VRHelpListView.helpList.items[i].params.icon            =
              SDL.SDLModel.data.defaultListOfIcons.command;
        }
      }

      if (SDL.SDLController.getApplicationModel(params.appID
        ).globalProperties.vrHelp) {
        for (var i = 0; i < SDL.SDLController.getApplicationModel(params.appID
        ).globalProperties.vrHelp.length; i++) {
          if (SDL.SDLController.getApplicationModel(params.appID
            ).globalProperties.vrHelp[i].image.value === params.fileName) {
            SDL.SDLController.getApplicationModel(params.appID
            ).globalProperties.vrHelp[i].image.value =
              SDL.SDLModel.data.defaultListOfIcons.command;
          }
        }
      }

      SDL.VRHelpListView.helpList.list.refresh();

      var len = SDL.InteractionChoicesView.listOfChoices.items.length;
      for (var i = 0; i < len; i++) {
        if (!SDL.InteractionChoicesView.listOfChoices.items[i].params.icon) {
          continue;
        }
        if (SDL.InteractionChoicesView.listOfChoices.items[i].params.icon.indexOf(
            params.fileName
          ) != -1 &&
          params.fileName.length ==
          SDL.InteractionChoicesView.listOfChoices.items[i].params.icon.length) {
          SDL.InteractionChoicesView.listOfChoices.items[i].params.icon            =
              SDL.SDLModel.data.defaultListOfIcons.command;
        }
      }

      SDL.InteractionChoicesView.listOfChoices.list.refresh();

      var len = SDL.InteractionChoicesView.listWrapper.naviChoises._childViews.length;
      for (var i = 0; i < len; i++) {
        if (!SDL.InteractionChoicesView.listWrapper.naviChoises._childViews[i].icon) {
          continue;
        }
        if (SDL.InteractionChoicesView.listWrapper.naviChoises._childViews[i].icon.indexOf(
            params.fileName
          ) != -1 &&
          params.fileName.length ==
          SDL.InteractionChoicesView.listWrapper.naviChoises._childViews[i].icon.length) {
          SDL.InteractionChoicesView.listWrapper.naviChoises._childViews[i].icon            =
              SDL.SDLModel.data.defaultListOfIcons.command;
        }
      }

      SDL.InteractionChoicesView.listWrapper.naviChoises.rerender();

    }

    if (result && SDL.OptionsView.active &&
      SDL.SDLController.model.appID == params.appID) {
      SDL.OptionsView.commands.refreshItems();
    }
  },

  /**
   * Method to start playing video from streaming video source
   * provided by SDLCore
   *
   * @param {Object}
   */
  startStream: function(request) {

    var appID = null;

    if (SDL.SDLController.model &&
      this.appTypeComparison(SDL.SDLController.model, 'NAVIGATION')) {

      appID = SDL.SDLController.model.appID;
    } else if (SDL.SDLModel.data.stateLimited &&
      this.appTypeComparison(
        SDL.SDLController.getApplicationModel(SDL.SDLModel.data.stateLimited),
        'NAVIGATION'
      )) {

      appID = SDL.SDLModel.data.stateLimited;
    }

    SDL.SDLModel.playVideo(appID);
  },

  /**
   * Function to verify if application hasrequested type
   *
   * @param model
   * @param type
   * @returns {boolean}
   */
  appTypeComparison: function(model, type) {

    var result = false;

    model.appType.forEach(function(item) {
          if (item == type) {
            result = true;
          }
        }
      );

    return result;
  },

  /**
   * Method to stop playing video streaming
   *
   * @param {Number}
   */
  stopStream: function(appID) {

    var createVideoView = Ember.View.create({
          templateName: 'video',
          template: Ember.Handlebars.compile('<video id="html5Player"></video>')
        }
        ),
        videoChild = null;

    SDL.NavigationAppView.videoView.remove();
    SDL.NavigationAppView.videoView.destroy();

    videoChild = SDL.NavigationAppView.createChildView(createVideoView);

    SDL.NavigationAppView.get('childViews').pushObject(videoChild);
    SDL.NavigationAppView.set('videoView', videoChild);
  },

  /**
   * Method to start playing audio from streaming audio source
   * provided by SDLCore
   *
   * @param {Object}
   */
  startAudioStream: function() {

    var appID = null;

    if (SDL.SDLController.model &&
      this.appTypeComparison(SDL.SDLController.model, 'NAVIGATION')) {

      appID = SDL.SDLController.model.appID;
    } else if (SDL.SDLModel.data.stateLimited &&
      this.appTypeComparison(
        SDL.SDLController.getApplicationModel(SDL.SDLModel.data.stateLimited),
        'NAVIGATION'
      )) {

      appID = SDL.SDLModel.data.stateLimited;
    }

    SDL.StreamAudio.play(
      SDL.SDLController.getApplicationModel(appID).navigationAudioStream
    );
  },

  /**
   * Method to set navigationApp streaming url to current app model
   *
   * @param {Number}
   */
  stoptAudioStream: function() {

    var appID = null;

    if (SDL.SDLController.model &&
      SDL.SDLController.model.appType == 'NAVIGATION') {

      appID = SDL.SDLController.model.appID;
    } else if (SDL.SDLModel.data.stateLimited &&
      SDL.SDLController.getApplicationModel(SDL.SDLModel.data.stateLimited
      ).appType == 'NAVIGATION') {

      appID = SDL.SDLModel.data.stateLimited;
    }

    SDL.StreamAudio.stop();
  },

  /**
   * Method to reset navigationApp streaming url from current app model
   */
  playVideo: function(appID) {
      if (SDL.SDLController.getApplicationModel(appID).navigationStream !==
        null) {

        SDL.SDLModel.data.naviVideo = document.getElementById('html5Player');
        SDL.SDLModel.data.naviVideo.src = SDL.SDLController.getApplicationModel(
          appID
        ).navigationStream;
        SDL.SDLModel.data.naviVideo.play();
      }
    },

  /**
   * Video player trigger to stop playing video
   */
  pauseVideo: function() {
      if (SDL.SDLModel.data.naviVideo != null) {

        SDL.SDLModel.data.naviVideo.pause();
      }
    },

  /**
   * Method to open Turn By Turn view
   *
   * @param {Object} params
   */
  tbtActivate: function(params) {

    if (SDL.SDLModel.driverDeviceInfo.name ==
      SDL.SDLController.getApplicationModel(params.appID).deviceName
    ) {
      var text1 = params.navigationTexts.
                         filterProperty('fieldName', 'navigationText1'
                         )[0].fieldText;
      var text2 = params.navigationTexts.
                         filterProperty('fieldName', 'navigationText2'
                         )[0].fieldText;

      SDL.NavigationModel.set('startLoc', text1);
      SDL.NavigationModel.set('endLoc', text2);
    }
    SDL.SDLController.getApplicationModel(params.appID).
        set('constantTBTParams', params);
    SDL.SDLController.getApplicationModel(params.appID).
        set('tbtActivate', true);
  
    if (SDL.SDLController.model) {
      SDL.SDLController.activateTBT();
    }
  },

  /**
   * Method to set data for Turn List in applications model
   *
   * @param {Object}
   */
  tbtTurnListUpdate: function(params) {

    SDL.SDLController.getApplicationModel(params.appID).turnList      =
        params.turnList ? params.turnList : [];
    SDL.SDLController.getApplicationModel(params.appID).turnListSoftButtons      =
        params.softButtons ? params.softButtons : [];
    SDL.TBTTurnList.updateList(params.appID);
  },

  /**
   * Method to VRHelpList on UI with request parameters
   * It opens VrHelpList PopUp with current list of readable VR commands
   *
   * @param {Object}
   */
  ShowVrHelp: function(vrHelpTitle, vrHelp) {

    SDL.VRHelpListView.showVRHelp(vrHelpTitle, vrHelp);
  },

  /**
   * Method to set language for UI component with parameters sent from
   * SDLCore to UIRPC
   *
   * @type {String} lang
   */
  changeRegistrationUI: function(lang, appID, appName) {

    if (SDL.SDLController.getApplicationModel(appID)) {
      SDL.SDLController.getApplicationModel(appID).set('UILanguage', lang);
    }

    if (appName) {
      SDL.SDLMediaController.currentAppId = null;
      SDL.SDLController.getApplicationModel(appID).appName = appName;
      SDL.SDLMediaController.set('currentAppId', appID);
    }
  },

  /**
   * Method to set language for TTS and VR components with parameters sent
   * from SDLCore to UIRPC
   *
   * @type {String} lang
   */
  changeRegistrationTTSVR: function(lang, appID) {

    if (SDL.SDLController.getApplicationModel(appID)) {
      SDL.SDLController.getApplicationModel(appID).set('TTSVRLanguage', lang);
    }
  },

  /**
   * Method to add activation button to VR commands and set device
   * parameters to model
   *
   * @param {Object}
   */
  onAppRegistered: function(params, vrSynonyms) {

    if (!params.appType) {              // According to APPLINK-19979 if appType parameter is empty
      params.appType = [];            // HMI should use "DEFAULT" value from AppHMIType enum of
      params.appType.push('DEFAULT'); // HMI_API documentation
    }

    for (var i = 0; i < params.appType.length; i++) {
      if ('NAVIGATION' === params.appType[i] && !FLAGS.Navigation) {
        FFW.BasicCommunication.ExitApplication(params.appID,
          'UNSUPPORTED_HMI_RESOURCE'
        );
      }
    }

    var message = {};

    var applicationType = null,//Default value - NonMediaModel see SDL.SDLController.applicationModels
      app = SDL.SDLController.getApplicationModel(params.appID);

    if (app != undefined && app.initialized == false) {

      if (app.isMedia != params.isMediaApplication) { // If current not initialized model doe not matches the registered application type
        this.convertModel(params);                   // then model should be changed
      } else {
        app.disabledToActivate = params.greyOut;
      }
      return;
    } else if (app != undefined && app.initialized == true) {
      console.log(
        'Application with appID ' + params.appID + ' already registered!'
      );
      return; // if application already registered and correctly initialized and BC.UpdateAppList came from SDL than nothing shoul happend
    }

    if (params.isMediaApplication === true) {
      //Magic number 0 - Default media model
      applicationType = 0;
    } else if (params.isMediaApplication === false) {
      //Magic number 1 - Default non-media model
      applicationType = 1;
    }

    SDL.SDLController.registerApplication(params, applicationType);

    if (SDL.SDLModel.data.unRegisteredApps.indexOf(params.appID) >= 0) {
      setTimeout(function() {
            SDL.PopUp.create().appendTo('body').popupActivate(
              'Connection with ' + params.appName + '  is re-established.'
            );
          }, 1000
        );
      this.data.unRegisteredApps.pop(params.appID);
    }

    //Magic number if predefined VR command USER_EXIT
    message = {
        'cmdID': -2,
        'vrCommands': ['USER_EXIT'],
        'appID': params.appID,
        'type': 'Command'
      };
    this.addCommandVR(message);

    if (vrSynonyms) {

      message = {
          'cmdID': 0,
          'vrCommands': vrSynonyms,
          'appID': params.appID,
          'type': 'Application'
        };
      this.addCommandVR(message);
    }
  },

  /**
   * Method to convert existed model to registered type
   */
  convertModel: function(params) {

    SDL.SDLModel.data.get('registeredApps').removeObjects(
      SDL.SDLModel.data.get('registeredApps').
          filterProperty('appID', params.appID)
    );

    this.onAppRegistered(params);
  },

  /**
   * Method to delete activation button from VR commands and delete device
   * parameters from model
   *
   * @param {Object}
   */
  onAppUnregistered: function(params) {

    if (SDL.SDLController.getApplicationModel(params.appID)) {

      if (params.unexpectedDisconnect) {
        SDL.PopUp.create().appendTo('body').popupActivate(
          'The connection with the ' +
          SDL.SDLController.getApplicationModel(params.appID).appName +
          ' was unexpectedly lost.'
        );
        this.data.unRegisteredApps.push(params.appID);
      }

      if (SDL.SDLController.getApplicationModel(params.appID
        ).activeRequests.uiPerformInteraction) {
        SDL.InteractionChoicesView.deactivate('ABORTED');
      }

      if (FFW.UI.performAudioPassThruRequestID != -1 ||
        SDL.SDLModel.data.AudioPassThruState) {
        SDL.SDLController.performAudioPassThruResponse(
          this.data.resultCode['ABORTED']
        );
      }

      SDL.SDLController.getApplicationModel(params.appID).level = 'NONE';

      SDL.SDLController.unregisterApplication(params.appID);
    }
  },

  /**
   * SDL UI ScrolableMessage activation function dependent of Driver
   * Distraction toggle state
   *
   * @param {Object}
   *            params Object with parameters come from SDLCore.
   * @param {Number}
   *            messageRequestId Identification of unique request
   */
  onSDLScrolableMessage: function(request, messageRequestId) {

    if (!SDL.ScrollableMessage.active) {
      if (SDL.SDLModel.data.driverDistractionState) {
        SDL.DriverDistraction.activate();
        FFW.UI.sendError(SDL.SDLModel.data.resultCode.REJECTED, request.id,
          request.method, 'DD mode is active!'
        );
      } else {
        SDL.ScrollableMessage.activate(
          SDL.SDLController.getApplicationModel(request.params.appID).appName,
          request.params, messageRequestId
        );
      }
      return true;
    } else {
      FFW.UI.sendError(SDL.SDLModel.data.resultCode.REJECTED, request.id,
        request.method, 'Higher priority request is being processed on HMI!'
      );
      return false;
    }
  },

  /**
   * setGlobalProperties
   *
   * @param {Object}
   *            message Object with parameters come from SDLCore.
   */
  setProperties: function(params) {
    function mergeKeyboardProperties(properties) {
      for (var name in properties) {
        SDL.SDLController.getApplicationModel(params.appID).
            set('globalProperties.keyboardProperties.' + name,
              properties[name]
            );
      }
    }
    if (SDL.SDLController.getApplicationModel(params.appID)) {
      for (var i in params) {
        if (i === 'keyboardProperties') {
          mergeKeyboardProperties(params[i]);
        } else {
          SDL.SDLController.getApplicationModel(params.appID).
              set('globalProperties.' + i, params[i]);
        }
      }
    } else {
      console.error('CriticalError! No app registered with current appID!');
    }
  },

  /**
   * Method to call function from DeviceListView to show list of connected
   * devices
   *
   * @param {Object}
   *            params
   */
  onGetDeviceList: function(params) {

    var exist = false,
      listObj = {};

    if (SDL.SDLModel.driverDevice && SDL.SDLModel.driverDeviceInfo === null &&
      params.deviceList.length > 0) {
      SDL.SDLModel.set('driverDeviceInfo', params.deviceList[0]);

      // According to SDL.SDLModel.deviceRank enum 0 - is driver's device
      FFW.RC.OnDeviceRankChanged(params.deviceList[0],
        SDL.SDLModel.deviceRank[0]
      );
      SDL.InfoAppsView.showAppList();
    }

    for (var j in SDL.SDLModel.data.connectedDevices) {
      listObj[j] = SDL.SDLModel.data.connectedDevices[j];
    }

    for (var i = 0; i < params.deviceList.length; i++) {

      if (params.deviceList[i].id in listObj) {
        exist = true;
      }

      if (!exist) {
        listObj[params.deviceList[i].id] = {
            'name': params.deviceList[i].name,
            'id': params.deviceList[i].id,
            'isSDLAllowed': false
          };
      } else {

        exist = false;
      }
    }
    SDL.SDLModel.data.set('connectedDevices', listObj);

    if (SDL.States.info.devicelist.active) {
      SDL.DeviceListView.ShowDeviceList(params);
    }

    SDL.SDLModel.data.set('deviceSearchProgress', false);
  },

  /**
   * SDL UI SetAppIcon handler
   *
   * @param {Object}
   *            message
   * @param {Number}
   *            id
   * @param {String}
   *            method
   */
  onSDLSetAppIcon: function(message, id, method) {

    if (!SDL.SDLController.getApplicationModel(message.appID)) {
      FFW.UI.sendUIResult(
        SDL.SDLModel.data.resultCode['APPLICATION_NOT_REGISTERED'], id, method
      );
    } else {

      var img = new Image();
      img.onload = function() {
        var model=SDL.SDLController.getApplicationModel(message.appID);
        // code to set the src on success
        model.set('appIcon', message.syncFileName.value);
        model.set('isTemplateIcon', message.syncFileName.isTemplate === true);
        FFW.UI.sendUIResult(SDL.SDLModel.data.resultCode.SUCCESS, id, method);
      };
      img.onerror = function(event) {

        // doesn't exist or error loading
        FFW.UI.sendError(SDL.SDLModel.data.resultCode['INVALID_DATA'], id,
          method, 'Image does not exist!'
        );
        return false;
      };

      img.src = message.syncFileName.value;
    }
  },

  /**
   * SDL UI Alert response handler show popup window
   *
   * @param {Object}
   *            message Object with parameters come from SDLCore
   * @param {Number}
   *            alertRequestId Id of current handled request
   */
  onUIAlert: function(message, alertRequestId) {

    if (!SDL.AlertPopUp.active) {
      SDL.AlertPopUp.AlertActive(message, alertRequestId);
      return true;
    } else {
      SDL.SDLController.alertResponse(this.data.resultCode.REJECTED,
        alertRequestId
      );
      return false;
    }
  },

  /**
   * SDL UI PerformInteraction response handler show popup window
   *
   * @param {Object}
   *            message Object with parameters come from SDLCore
   */
  uiPerformInteraction: function(message) {

    if (!SDL.SDLController.getApplicationModel(message.params.appID
      ).activeRequests.uiPerformInteraction) {
      SDL.SDLController.getApplicationModel(message.params.appID
      ).activeRequests.uiPerformInteraction = message.id;

      if (message.params && message.params.vrHelpTitle &&
        message.params.vrHelp) {

        SDL.SDLModel.data.set('interactionData.vrHelpTitle',
          message.params.vrHelpTitle
        );
        SDL.SDLModel.data.set('interactionData.vrHelp', message.params.vrHelp);
      }

      SDL.InteractionChoicesView.activate(message);
      SDL.SDLController.VRMove();

      return true;
    } else {

      FFW.UI.sendError(SDL.SDLModel.data.resultCode.REJECTED, message.id,
        message.method, 'UI PerformInterection REJECTED on HMI'
      );
      return false;
    }
  },

  /**
   * SDL VR PerformInteraction response handler
   *
   * @param {Object}
   *            message Object with parameters come from SDLCore
   */
  vrPerformInteraction: function(message) {

    if (!SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction) {
      SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction = message.id;
    } else {
      FFW.VR.sendError(SDL.SDLModel.data.resultCode.REJECTED, message.id,
        message.method, 'VR PerformInterection REJECTED on HMI'
      );
      return;
    }

    var appID = message.params.appID;

    setTimeout(function() {
        if (SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction) { // If VR PerformInteraction session is still active
          SDL.SDLModel.onPrompt(message.params.timeoutPrompt);
        } else if (!message.params.grammarID &&
          SDL.SDLController.getApplicationModel(message.params.appID
          ).activeRequests.uiPerformInteraction) {
          // If UI PerformInteraction session is still active and PerformInteraction mode is MANUAL only
          SDL.SDLModel.onPrompt(message.params.timeoutPrompt);
        }

      }, message.params.timeout - 2000
      ); //Magic numer is a platform depended HMI behavior: -2 seconds for timeout prompt

    SDL.SDLModel.onPrompt(message.params.initialPrompt);

    SDL.SDLModel.data.interactionData.helpPrompt = message.params.helpPrompt;

    if (message.params.grammarID) {

      this.data.set('performInteractionSession', message.params.grammarID);
      SDL.SDLModel.data.set('VRActive', true);

      setTimeout(function() {
            if (SDL.SDLModel.data.VRActive) {
              if (SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction) {
                SDL.SDLController.vrInteractionResponse(
                  SDL.SDLModel.data.resultCode['TIMED_OUT']
                );
              } else {
                console.error(
                  'SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction is empty!'
                );
              }

              SDL.SDLModel.data.set('VRActive', false);
            }
          }, message.params.timeout
        );

      SDL.InteractionChoicesView.timerUpdate();
    } else {

      SDL.SDLController.vrInteractionResponse(
        SDL.SDLModel.data.resultCode.SUCCESS
      );
    }
  },

  /**
   * SDL UI Slider response handler show popup window
   *
   * @param {Object}
   *            message Object with parameters come from SDLCore
   */
  uiSlider: function(message) {

    if (!SDL.SliderView.active) {
      SDL.SDLController.getApplicationModel(message.params.appID).
          onSlider(message);
      return true;
    } else {
      FFW.UI.sendSliderResult(this.data.resultCode.REJECTED, message.id);
      return false;
    }
  },

  /**
   * SDL ShowKeyboard show method with incoming parameters of layout, language etc...
   *
   * @param {Object}
   *            message Object with parameters come from SDLCore
   */
  uiShowKeyboard: function(element) {
      SDL.Keyboard.activate(element);
    },

  /**
   * SDL UI AudioPassThru response handler show popup window
   *
   * @param {Object}
   *            message Object with parameters come from SDLCore.
   */
  UIPerformAudioPassThru: function(message) {

    this.data.set('AudioPassThruData', message);
    this.data.set('AudioPassThruState', true);
  },

  /**
   * Method ends processing of AudioPassThru and call AudioPassThru UI
   * response handler
   */
  UIEndAudioPassThru: function() {

    if (this.data.AudioPassThruState) {
      FFW.UI.sendUIResult(this.data.resultCode.SUCCESS,
        FFW.UI.endAudioPassThruRequestID, 'UI.EndAudioPassThru'
      );
      SDL.SDLController.performAudioPassThruResponse(
        this.data.resultCode.SUCCESS
      );
    } else {
      FFW.UI.sendError(this.data.resultCode.REJECTED,
        FFW.UI.endAudioPassThruRequestID, 'UI.EndAudioPassThru',
        'UI.PerformAudioPassThru are not processed at the moment!'
      );
    }
  },

  /**
   * Prompt activation
   *
   * @param {Object} ttsChunks
   * @param {Number} appID
   */
  onPrompt: function(ttsChunks, appID) {

    var message = '';
    if (ttsChunks) {
      for (var i = 0; i < ttsChunks.length; i++) {
        message += ttsChunks[i].text + '\n';
      }
      SDL.TTSPopUp.ActivateTTS(message, appID);
    }
  },

  /**
   * Play audio file on PlayTone notification
   */
  onPlayTone: function() {

    SDL.Audio.play('audio/initial.wav');
  },

  /**
   * Prompt deactivation
   */
  TTSStopSpeaking: function() {
      //true parameter makes send error response ABORTED
      FFW.TTS.set('aborted', true);
      SDL.TTSPopUp.DeactivateTTS();
    },

  /**
   * SDL DeleteCommand response handler to sent delete command error or normal result
   *
   * @param {Number}
   * @param {Number}
   */
  deleteCommandResponse: function(resultCode, requestID) {

    if (resultCode === SDL.SDLModel.data.resultCode.SUCCESS) {
      FFW.UI.sendUIResult(resultCode, requestID, 'UI.DeleteCommand');
    } else {
      FFW.UI.sendError(resultCode, requestID, 'UI.DeleteCommand',
        'SubMenu is opened'
      );
    }
  },

  /**
   * SDL VR AddCommand response handler add command to voice recognition
   * window
   *
   * @param {Object}
   */
  addCommandVR: function(message) {

    if (message.type == 'Application') {

      SDL.SDLModel.data.VRCommands.push(message);
      SDL.VRPopUp.AddCommand(message.cmdID, message.vrCommands, message.appID,
        message.type
      );
    } else if ('appID' in message) {

      SDL.SDLController.getApplicationModel(message.appID).VRCommands.
          push(message);

      if (SDL.SDLController.model &&
        SDL.SDLController.model.appID == message.appID) {

        SDL.VRPopUp.AddCommand(message.cmdID, message.vrCommands, message.appID,
          message.type, message.grammarID
        );
      }
    } else {

      SDL.SDLModel.data.VRCommands.push(message);
      SDL.VRPopUp.AddCommand(message.cmdID, message.vrCommands, 0, message.type,
        message.grammarID
      );
    }
  },

  /**
   * SDL VR DeleteCommand response handler delete command from voice
   * recognition window
   *
   * @param {Number}
   */
  deleteCommandVR: function(request) {

    var appModel = SDL.SDLController.getApplicationModel(request.params.appID);

    if (appModel.currentSubMenuId != 'top') {
      for (var i in appModel.commandsList) {
        if (appModel.commandsList[i].filterProperty('commandID',
            request.params.cmdID
          ).length) {
          if (i == appModel.currentSubMenuId) {

            FFW.VR.sendError(SDL.SDLModel.data.resultCode['IN_USE'], request.id,
              request.method, 'SubMenu is currently opened on UI!'
            );
            return;
          }
        }
      }
    }

    SDL.VRPopUp.DeleteCommand(request.params.cmdID, request.params.appID);
    var len = appModel.VRCommands.length;

    for (var i = len - 1; i >= 0; i--) {
      if (appModel.VRCommands[i].appID == request.params.appID &&
        appModel.VRCommands[i].cmdID == request.params.cmdID) {
        appModel.VRCommands.splice(i, 1);
      }
    }

    FFW.VR.sendVRResult(SDL.SDLModel.data.resultCode.SUCCESS,
      request.id,
      request.method
    );

  },

  onDeactivateApp: function(target, appID) {

    if (SDL.SDLController.getApplicationModel(appID)) {
      /**
       * Close Options menu if opened
       */
      if (SDL.OptionsView.active) {
        SDL.OptionsView.deactivate();
      }

      var dest = target.split('.'), reason;

      switch (dest[0]) {
        case 'media': {
          reason = 'AUDIO';
          break;
        }
        case 'phone': {
          reason = 'PHONEMENU';
          break;
        }
        case 'navigation': {
          reason = 'NAVIGATIONMAP';
          break;
        }
        case 'settings': {
          reason = 'SYNCSETTINGS';
          break;
        }
        case 'call': {
          reason = 'PHONECALL';
          break;
        }
        default: {
          reason = 'GENERAL';
          break;
        }
      }

      if (SDL.SDLModel.data.stateLimited &&
        reason === 'AUDIO' &&
        SDL.SDLController.getApplicationModel(SDL.SDLModel.data.stateLimited).
            appType.indexOf('NAVIGATION') < 0) {

        SDL.SDLModel.data.stateLimited = null;
        SDL.SDLModel.data.set('limitedExist', false);
      }

      SDL.TurnByTurnView.deactivate();

      if (!SDL.SDLModel.data.phoneCallActive && reason == 'GENERAL') {
        FFW.BasicCommunication.OnAppDeactivated(appID);
      }
    }
  }
}
);
