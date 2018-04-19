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
 * @name SDL.SDLController
 * @desc Main SDL Controller
 * @category Controller
 * @filesource app/controller/sdl/SDLController.js
 * @version 1.0
 */
SDL.SDLController = Em.Object.extend(
  {
    init: function() {
      /**
       * Added object size counter
       */
      Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            size++;
          }
        }
        return size;
      };
    },
    /**
     * Active application model binding type {SDLAppModel}
     */
    model: null,
    isWarning:false,
    /**
     * Function to add application to application list
     */
    showAppList: function() {
      SDL.InfoAppsView.showAppList();
      SDL.AppPermissionsListView.showAppList();
    }.observes('SDL.SDLModel.data.registeredApps.@each'),
    /**
     * Handeler for command button press
     *
     * @param element
     *            SDL.Button
     */
    onCommand: function(element) {
      if (element.commandID < 0) {
        switch (element.commandID) {
          case -1:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'DRIVER_DISTRACTION_VIOLATION'
            );
            break;
          }
          case -2:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'USER_EXIT'
            );
            break;
          }
          case -3:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'UNAUTHORIZED_TRANSPORT_REGISTRATION'
            );
            break;
          }
          default:
          {
            console.log('Unknown command with ID: ' + element.commandID);
          }
        }
        SDL.OptionsView.deactivate();
        SDL.States.goToStates('info.apps');
      } else if (element.menuID >= 0) {

        // if subMenu
        // activate driver destruction if necessary
        if (SDL.SDLModel.data.driverDistractionState) {
          SDL.DriverDistraction.activate();
        } else {
          this.onSubMenu(element.menuID);
        }
      } else {
        FFW.UI.onCommand(element.commandID, this.model.appID);
        SDL.OptionsView.deactivate();
      }
    },
    /**
     * Handeler for VR command button press
     *
     * @param element SDL.Button
     */
    VRPerformAction: function(element) {
      SDL.SDLController.vrInteractionResponse(
        SDL.SDLModel.data.resultCode.SUCCESS, element.commandID
      );
      if (SDL.SDLModel.data.VRActive) {
        SDL.SDLModel.data.toggleProperty('VRActive');
      }
    },
    /**
     * Open commands submenu
     *
     * @param id {Number}
     */
    onSubMenu: function(id) {
      this.model.set('currentSubMenuId', id);
    },
    /**
     * Comparison function for sort array of buttons in options list by
     * 'position' parameter
     *
     * @param arrayId {Object}
     * @param appID {Number}
     */
    buttonsSort: function(arrayId, appID) {
      SDL.SDLController.getApplicationModel(appID).commandsList[arrayId].sort(
        function(a, b) {
          return a.position - b.position;
        }
      );
    },
    /**
     * Handeler for command button press
     *
     * @param element
     *            SDL.Button
     */
    onVRCommand: function(element) {
      if (SDL.SDLModel.data.VRActive) {
        SDL.SDLModel.data.toggleProperty('VRActive');
      }
      if (element.commandID === -2) { //Magic number if predefined VR command USER_EXIT
        this.userExitAction(element.appID);
      } else {
        FFW.VR.onCommand(element.commandID, element.appID, element.grammarID);
      }
    },
    userExitAction: function(appID) {
      FFW.BasicCommunication.ExitApplication(appID, 'USER_EXIT');
      if (SDL.States.currentState.getPath('path') === 'media.sdlmedia' ||
        SDL.States.currentState.getPath('path') === 'info.nonMedia') {
        SDL.States.goToStates('info.apps');
      }
    },
    /**
     * Handler for preform interaction choice send response to device and
     * deactivate interactions window
     *
     * @param element
     *            SDL.Button
     */
    onChoiceInteraction: function(element) {
      if(!SDL.InteractionChoicesView.get('warning')){
      SDL.InteractionChoicesView.deactivate('SUCCESS', element.choiceID);
      }else{
        SDL.InteractionChoicesView.deactivate('WARNINGS', element.choiceID);
      }
    },
    /**
     * Call Keyboard view activation method
     * params {Object}
     */
    uiShowKeyboard: function(element) {
      SDL.SDLModel.uiShowKeyboard(element);
    },
    /**
     * Open commands list
     */
    openCommandsList: function() {
      SDL.OptionsView.activate();
    },
    /**
     * Notification of deactivation of current application model initiated in
     * StateManager
     */
    deactivateApp: function() {
      if (this.model) {
        SDL.SDLModel.onDeactivateApp(SDL.States.nextState, this.model.appID);
      }
      SDL.SDLController.onSubMenu('top');
      SDL.SDLController.model.set('tbtActivate', false);
      this.set('model', null);
    },
    /**
     * Notification to SDL about triggered events on HMI
     * @param reason
     * @param status
     */
    onEventChanged: function(reason, status) {
      var eventName = SDL.SDLModel.data.onEventChangedEnum[reason];
      if (!eventName) {
        return;
      }
      if ('AUDIO_SOURCE' == eventName) {
        SDL.SDLModel.data.mediaPlayerActive = status;
      }
      FFW.BasicCommunication.OnEventChanged(eventName, status);
    },
    /**
     * Method clears all applications data and unregister models
     */
    onSDLDisconected: function() {
      var i = 0, apps = SDL.SDLModel.data.registeredApps;
      for (i = 0; i < apps.length; i++) {
        SDL.SDLModel.onAppUnregistered(
          {
            'appID': apps[i].appID
          }
        );
      }
    },
    /**
     * Current system context
     *
     * @type {String}
     */
    sysContext: function() {
      if (SDL.SDLModel.data.VRActive) {
        return 'VRSESSION';
      }
      if (SDL.AlertPopUp.active) {
        return 'ALERT';
      }
      if (SDL.SliderView.active ||
        SDL.InteractionChoicesView.active ||
        SDL.ScrollableMessage.active ||
        SDL.SDLModel.data.AudioPassThruState ||
        SDL.Keyboard.active) {
        return 'HMI_OBSCURED';
      }
      if (SDL.OptionsView.active) {
        return 'MENU';
      }
      return 'MAIN';
    }.property(
      'SDL.OptionsView.active',
      'SDL.SliderView.active',
      'SDL.SDLModel.data.AudioPassThruState',
      'SDL.SDLModel.data.VRActive',
      'SDL.AlertPopUp.active',
      'SDL.States.info.nonMedia.active',
      'SDL.States.media.sdlmedia.active',
      'SDL.States.navigationApp.baseNavigation.active',
      'SDL.ScrollableMessage.active',
      'SDL.InteractionChoicesView.active',
      'SDL.VRHelpListView.active',
      'SDL.Keyboard.active',
      'SDL.States.media.sdlmedia.active',
      'SDL.States.info.nonMedia.active'
    ),
    /**
     * Flag consider that previously alert request was received from SDL for
     * app in BACKGROUND HMI level the applications appID will be stashed as
     * current value
     *
     * @type number
     */
    backgroundAlertAppID: null,
    /**
     * List of SDL application models
     *
     * @type object
     */
    applicationModels: {
      0: SDL.SDLMediaModel,
      1: SDL.SDLNonMediaModel
    },
    /**
     * Registered components handler
     *
     * @type object
     */
    activateTBT: function() {
      if (SDL.SDLController.model && SDL.SDLController.model.tbtActivate) {
        SDL.TurnByTurnView.activate(SDL.SDLController.model.appID);
      }
    },
    /**
     * Registered components handler
     *
     * @type object
     */
    registeredComponentStatus: function(component) {
      for (var i = 0; i < SDL.SDLModel.data.registeredComponents.length; i++) {
        if (SDL.SDLModel.data.registeredComponents[i].type == component) {
          SDL.SDLModel.data.set('registeredComponents.' + i + '.state', true);
          return;
        }
      }
    },
    /**
     * Registered components handler
     *
     * @type object
     */
    unregisterComponentStatus: function(component) {
      for (var i = 0; i < SDL.SDLModel.data.registeredComponents.length; i++) {
        if (SDL.SDLModel.data.registeredComponents[i].type == component) {
          SDL.SDLModel.data.set('registeredComponents.' + i + '.state', false);
          return;
        }
      }
    },
    /**
     * Notification from state manager about triggered state
     * Method aborts all popups and requests currently in process
     *
     * @type object
     */
    triggerState: function() {
      if (SDL.SliderView.active) {
        SDL.SliderView.deactivate(false);
      }
    },
    compareObjects: function(v, w) {
      for (var p in v) {
        if (!v.hasOwnProperty(p)) {
          continue;
        }
        if (!w.hasOwnProperty(p)) {
          return 1;
        }
        if (v[p] === w[p]) {
          continue;
        }
        if (typeof(v[p]) !== "object") {
          return 1;
        }
        var c = SDL.SDLController.compareObjects(v[p], w[p]);
        if (c) {
          return c;
        }
      }
      for (p in w) {
        if (w.hasOwnProperty(p) && !v.hasOwnProperty(p)) {
          return -1;
        }
      }
      if (typeof(v) !== "object" &&
        typeof(W) !== "object" &&
        v !== w
      ) {
        return 1;
      }
      return 0;
    },
    /**
     * vehicleDataChange button handler on VehicleInfo View
     */
    vehicleDataChange: function() {
      SDL.VehicleInfo.vehicleDataCodeEditor.activate(
        function(data) {
          var params = {};
          var parsedData = JSON.parse(data);
          for (var i in parsedData) {
            if (SDL.SDLController.compareObjects(
                SDL.SDLVehicleInfoModel.vehicleData[i],
                parsedData[i]
              )
            ) {
              params[i] = parsedData[i];
            }
          }
          SDL.SDLVehicleInfoModel.vehicleData = parsedData;
          if (params) {
            FFW.VehicleInfo.OnVehicleData(params);
          }
        }
      );
      SDL.VehicleInfo.vehicleDataCodeEditor.editor.set(
        'code',
        JSON.stringify(SDL.SDLVehicleInfoModel.vehicleData, null, 2)
      );
    },
    /**
     * Notify SDLCore that HMI is ready and all components are registered
     *
     * @type {String}
     */
    componentsReadiness: function(component) {
      for (var i = 0; i < SDL.SDLModel.data.registeredComponents.length; i++) {
        if (FLAGS[SDL.SDLModel.data.registeredComponents[i].type] !=
          SDL.SDLModel.data.registeredComponents[i].state) {
          return;
        }
      }
      FFW.BasicCommunication.onReady();
    }.observes('SDL.SDLModel.data.registeredComponents.@each.state'),
    /**
     * Show VrHelpItems popup with necessary params
     * if VRPopUp is active - show data from Global Properties
     * if VRPopUp and InteractionChoicesView are active - show data from
     * PerformInteraction request
     *
     */
    showVRHelpItems: function() {
      if (SDL.SDLController.model) {
        if (SDL.SDLModel.data.VRActive &&
          SDL.SDLModel.data.interactionData.vrHelp) {
          SDL.SDLModel.ShowVrHelp(
            SDL.SDLModel.data.interactionData.vrHelpTitle,
            SDL.SDLModel.data.interactionData.vrHelp
          );
        } else if (SDL.SDLModel.data.VRActive &&
          !SDL.SDLModel.data.interactionData.vrHelp &&
          SDL.SDLController.model.globalProperties.vrHelp) {
          if (SDL.SDLController.model) {
            SDL.SDLModel.ShowVrHelp(
              SDL.SDLController.model.globalProperties.vrHelpTitle,
              SDL.SDLController.model.globalProperties.vrHelp
            );
          }
        } else {
          if (SDL.VRHelpListView.active) {
            SDL.VRHelpListView.deactivate();
          }
        }
      } else if (SDL.VRHelpListView.active) {
        SDL.VRHelpListView.deactivate();
      }
    }.observes(
      'SDL.SDLModel.data.VRActive',
      'SDL.SDLModel.data.interactionData.vrHelp'
    ),
    /**
     * Handler for Help button in VR menu
     * triggers helpPrompt on HMI
     *
     */
    vrHelpAction: function() {
      if (SDL.SDLModel.data.interactionData.helpPrompt) {
        SDL.SDLModel.onPrompt(SDL.SDLModel.data.interactionData.helpPrompt);
      } else if (SDL.SDLController.model &&
        SDL.SDLController.model.globalProperties.helpPrompt.length) {
        SDL.SDLModel.onPrompt(
          SDL.SDLController.model.globalProperties.helpPrompt
        );
      }
    },
    /**
     * Notify SDLCore that TTS haas finished processing
     *
     * @type {String}
     */
    TTSResponseHandler: function() {
      if (FFW.TTS.requestId) {
        if (FFW.TTS.aborted) {
          FFW.TTS.sendError(
            SDL.SDLModel.data.resultCode['ABORTED'],
            FFW.TTS.requestId, 'TTS.Speak', 'TTS Speak request aborted'
          );
        } else {
          FFW.TTS.sendTTSResult(
            SDL.SDLModel.data.resultCode.SUCCESS,
            FFW.TTS.requestId, 'TTS.Speak'
          );
        }
        FFW.TTS.requestId = null;
        FFW.TTS.aborted = false;
      }
    },
    /**
     * Move VR list to right side when VRHelpList was activated
     *
     * @type {String}
     */
    VRMove: function() {
      if (SDL.VRHelpListView.active || SDL.InteractionChoicesView.active) {
        SDL.SDLModel.data.set('VRHelpListActivated', true);
      } else {
        SDL.SDLModel.data.set('VRHelpListActivated', false);
      }
    },
    /**
     * Activate navigationApp method to set navigationApp data to controlls on
     * main screen
     */
    navigationAppUpdate: function() {
      SDL.BaseNavigationView.update(SDL.SDLController.model.appID);
    },
    /**
     * Default action for SoftButtons: closes window, popUp or clears
     * applications screen
     *
     * @param {Object}
     */
    defaultActionSoftButton: function(element) {
      switch (element.groupName) {
        case 'AlertPopUp':
        {
          if(!this.isWarning){
          SDL.AlertPopUp.deactivate();
          }else{
            SDL.AlertPopUp.deactivate(this.isWarning);
            this.set('isWarning',false);
          }
          break;
        }
        case 'ScrollableMessage':
        {
          SDL.ScrollableMessage.deactivate(true);
          break;
        }
      }
    },
    /**
     * SDL notification call function
     * to notify that SDL Core should reset timeout for some method
     */
    onResetTimeout: function(appID, methodName) {
      FFW.UI.onResetTimeout(appID, methodName);
    },
    /**
     * Action to show Voice Recognition PopUp
     */
    activateVRPopUp: function() {
      if (FFW.TTS.requestId) {
        FFW.TTS.aborted = true;
        SDL.TTSPopUp.DeactivateTTS();
      }
      if (SDL.AlertPopUp.active) {
        SDL.AlertPopUp.deactivate('ABORTED');
      }
      SDL.SDLModel.data.toggleProperty('VRActive');
    },
    /**
     * Action for SoftButtons that closes popUp or window and opens
     * applications screen
     *
     * @param {Object}
     */
    stealFocusSoftButton: function(element) {
      switch (element.groupName) {
        case 'AlertPopUp':
        {
          SDL.AlertPopUp.deactivate();
          this.onActivateSDLApp(element);
          break;
        }
        case 'ScrollableMessage':
        {
          SDL.ScrollableMessage.deactivate();
          this.onActivateSDLApp(element);
          break;
        }
      }
    },
    /**
     * Action for SoftButtons that clears popUps timer and it become visible
     * all the time until user user closes it
     *
     * @param {Object}
     */
    keepContextSoftButton: function(element) {
      switch (element.groupName) {
        case 'AlertPopUp':
        {
          clearTimeout(SDL.AlertPopUp.timer);
          SDL.AlertPopUp.timer = setTimeout(
            function() {
              SDL.AlertPopUp.deactivate();
            }, SDL.AlertPopUp.timeout
          );
          this.onResetTimeout(element.appID, 'UI.Alert');
          break;
        }
        case 'ScrollableMessage':
        {
          clearTimeout(SDL.ScrollableMessage.timer);
          SDL.ScrollableMessage.timer = setTimeout(
            function() {
              SDL.ScrollableMessage.deactivate();
            }, SDL.ScrollableMessage.timeout
          );
          this.onResetTimeout(element.appID, 'UI.ScrollableMessage');
          break;
        }
      }
    },
    /**
     * Action for ClosePopUp request that triggers deactivate function from
     * opened popUp
     */
    closePopUp: function(methodName) {
      if (methodName == 'UI.Alert') {
        SDL.AlertPopUp.deactivate();
      }
      if (methodName == 'UI.PerformAudioPassThru') {
        SDL.AudioPassThruPopUp.deactivate();
        this.performAudioPassThruResponse(SDL.SDLModel.data.resultCode.SUCCESS);
      }
      if (methodName == 'UI.PerformInteraction') {
        SDL.InteractionChoicesView.deactivate('ABORTED');
      }
      if (methodName == 'UI.ScrollableMessage') {
        SDL.ScrollableMessage.deactivate(true);
      }
      if (methodName == 'UI.Slider') {
        SDL.SliderView.deactivate(true);
      }
      //            if (SDL.VRHelpListView.active) {
      //                SDL.VRHelpListView.deactivate();
      //            }
    },
    /**
     * Method to close InteractionChoices view
     */
    InteractionChoicesDeactivate: function() {
      SDL.InteractionChoicesView.deactivate('ABORTED');
    },
    /**
     * Method to close AlertMeneuverPopUp view
     */
    closeAlertMeneuverPopUp: function() {
      SDL.AlertManeuverPopUp.set('activate', false);
    },
    /**
     * Method to open Turn List view from TBT
     *
     * @param {Number}
     *            appID AppID of activated sdl application
     */
    tbtTurnList: function(appID) {
      SDL.TBTTurnList.activate(appID);
    },
    /**
     * Method to sent notification with selected state of TBT Client State
     *
     * @param {String}
     */
    tbtClientStateSelected: function(state) {
      FFW.Navigation.onTBTClientState(state);
    },
    /**
     * Method to sent notification with selected reason of Exit Application
     *
     * @param {String}
     */
    exitAppViewSelected: function(state) {

      //if ignition off if executed than OnIgnitionCycleOver must be sent
      if (state == SDL.SDLModel.data.exitAppState[0].name) {
        FFW.BasicCommunication.OnIgnitionCycleOver();
      }
      FFW.BasicCommunication.ExitAllApplications(state);
    },
    /**
     * OnAwakeSDL from HMI returns SDL to normal operation
     * after OnExitAllApplications(SUSPEND)
     *
     */
    onAwakeSDLNotificationSend: function() {
      FFW.BasicCommunication.OnAwakeSDL();
    },
    /**
     * Method to sent notification ABORTED for PerformInteractionChoise
     */
    interactionChoiseCloseResponse: function(appID, result, choiceID,
      manualTextEntry) {
      FFW.UI.interactionResponse(
        SDL.SDLController.getApplicationModel(
          appID
        ).activeRequests.uiPerformInteraction, result, choiceID, manualTextEntry
      );
      SDL.SDLModel.data.set('interactionData.vrHelpTitle', null);
      SDL.SDLModel.data.set('interactionData.vrHelp', null);
      SDL.SDLController.getApplicationModel(
        appID
      ).activeRequests.uiPerformInteraction = null;
      if (SDL.TTSPopUp.active && FFW.TTS.requestId == null) {
        SDL.TTSPopUp.DeactivateTTS();
      }
    },
    /**
     * Method to sent notification ABORTED for VR PerformInteraction
     */
    vrInteractionResponse: function(result, choiceID) {
      FFW.VR.interactionResponse(
        SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction, result,
        choiceID
      );
      SDL.InteractionChoicesView.timerUpdate();
      if (choiceID && SDL.TTSPopUp.active && FFW.TTS.requestId == null) {
        SDL.TTSPopUp.DeactivateTTS();
      }
      SDL.SDLModel.data.interactionData.helpPrompt = null;
      SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction = null;
      SDL.SDLModel.data.set('VRActive', false);
    },
    /**
     * Method to sent notification for Alert
     *
     * @param {String}
     *            result
     * @param {Number}
     *            alertRequestID
     */
    alertResponse: function(result, alertRequestID) {
      FFW.UI.alertResponse(result, alertRequestID);
    },
    /**
     * Method to sent notification for Scrollable Message
     *
     * @param {String}
     *            result
     * @param {Number}
     *            messageRequestId
     */
    scrollableMessageResponse: function(result, messageRequestId) {
      if (result == SDL.SDLModel.data.resultCode.SUCCESS) {
        FFW.UI.sendUIResult(
          result,
          messageRequestId,
          'UI.ScrollableMessage'
        );
      }else if(result == SDL.SDLModel.data.resultCode.WARNINGS) {
        FFW.UI.sendUIResult(
          result,
          messageRequestId,
          'UI.ScrollableMessage'
        );
      }
      else {
        FFW.UI.sendError(
          result,
          messageRequestId,
          'UI.ScrollableMessage',
          'ScrollableMessage aborted!'
        );
      }
      SDL.ScrollableMessage.set('warning',false);
    },
    /**
     * Method to do necessary actions when user navigate throught the menu
     */
    userStateAction: function() {
      if (SDL.ScrollableMessage.active) {
        SDL.ScrollableMessage.deactivate(true);
      }
    },
    /**
     * Method to sent notification for Slider
     *
     * @param {String}
     *            result
     * @param {Number}
     *            sliderRequestId
     */
    sliderResponse: function(result, sliderRequestId) {
      FFW.UI.sendUIResult(result, sliderRequestId, 'UI.Slider');
    },
    /**
     * Method to call performAudioPassThruResponse with Result code
     * parameters
     *
     * @param {Object}
     *            element Button object
     */
    callPerformAudioPassThruPopUpResponse: function(element) {
      this.performAudioPassThruResponse(element.responseResult);
    },
    /**
     * Method close PerformAudioPassThruPopUp and call response from UI RPC
     * back to SDLCore
     *
     * @param {String}
     *            result Result code
     */
    performAudioPassThruResponse: function(result) {
      SDL.SDLModel.data.set('AudioPassThruState', false);
      if (result === SDL.SDLModel.data.resultCode.SUCCESS) {
        FFW.UI.sendUIResult(
          result,
          FFW.UI.performAudioPassThruRequestID,
          'UI.PerformAudioPassThru'
        );
      } else {
        FFW.UI.sendError(
          result,
          FFW.UI.performAudioPassThruRequestID,
          'UI.PerformAudioPassThru',
          'PerformAudioPassThru aborterd due to Unregister application!'
        );
      }
      FFW.UI.performAudioPassThruRequestID = -1;
    },
    /**
     * Method close PerformAudioPassThruPopUp and call error response from
     * UI RPC back to SDLCore
     *
     * @param {String}
     *            result Result code
     */
    callPerformAudioPassThruPopUpErrorResponse: function(element) {
      SDL.SDLModel.data.set('AudioPassThruState', false);
      FFW.UI.sendError(
        element.responseResult,
        FFW.UI.performAudioPassThruRequestID,
        'UI.PerformAudioPassThru',
        'PerformAudioPassThru was not completed successfully!'
      );
      FFW.UI.performAudioPassThruRequestID = -1;
    },
    /**
     * Method to set language for UI component with parameters sent from
     * SDLCore to UIRPC
     */
    onLanguageChangeUI: function() {
      FFW.UI.OnLanguageChange(SDL.SDLModel.data.hmiUILanguage);
      FFW.BasicCommunication.OnSystemInfoChanged(
        SDL.SDLModel.data.hmiUILanguage
      );
    }.observes('SDL.SDLModel.data.hmiUILanguage'),
    /**
     * Method to set language for TTS and VR components with parameters sent
     * from SDLCore to UIRPC
     */
    onLanguageChangeTTSVR: function() {
      FFW.TTS.OnLanguageChange(SDL.SDLModel.data.hmiTTSVRLanguage);
      FFW.VR.OnLanguageChange(SDL.SDLModel.data.hmiTTSVRLanguage);
    }.observes('SDL.SDLModel.data.hmiTTSVRLanguage'),
    /**
     * Register application
     *
     * @param {Object}
     *            params
     * @param {Number}
     *            applicationType
     */
    registerApplication: function(params, applicationType) {
      if (applicationType === undefined || applicationType === null) {
        SDL.SDLModel.data.get('registeredApps').pushObject(
          this.applicationModels[0].create(
            { //Magic number 0 - Default media model for not initialized applications
              appID: params.appID,
              appName: params.appName,
              deviceName: params.deviceInfo.name,
              appType: params.appType,
              isMedia: 0,
              disabledToActivate: params.greyOut ? true : false
            }
          )
        );
      } else {
        SDL.SDLModel.data.get('registeredApps').pushObject(
          this.applicationModels[applicationType].create(
            {
              appID: params.appID,
              appName: params.appName,
              deviceName: params.deviceInfo.name,
              appType: params.appType,
              isMedia: applicationType == 0 ? true : false,
              initialized: true,
              disabledToActivate: params.greyOut ? true : false
            }
          )
        );
      }
      var exitCommand = {
        'id': -10,
        'params': {
          'menuParams': {
            'parentID': 0,
            'menuName': 'Exit \'DRIVER_DISTRACTION_VIOLATION\'',
            'position': 0
          },
          cmdID: -1
        }
      };
      SDL.SDLController.getApplicationModel(params.appID).addCommand(
        exitCommand
      );
      exitCommand = {
        'id': -10,
        'params': {
          'menuParams': {
            'parentID': 0,
            'menuName': 'Exit \'USER_EXIT\'',
            'position': 0
          },
          cmdID: -2
        }
      };
      SDL.SDLController.getApplicationModel(params.appID).addCommand(
        exitCommand
      );
      exitCommand = {
        'id': -10,
        'params': {
          'menuParams': {
            'parentID': 0,
            'menuName': 'Exit \'UNAUTHORIZED_TRANSPORT_REGISTRATION\'',
            'position': 0
          },
          cmdID: -3
        }
      };
      SDL.SDLController.getApplicationModel(params.appID).addCommand(
        exitCommand
      );
    },
    /**
     * Unregister application
     *
     * @param {Number}
     *            appID
     */
    unregisterApplication: function(appID) {
      this.getApplicationModel(appID).VRCommands = [];
      this.getApplicationModel(appID).onDeleteApplication(appID);
      var len = SDL.SDLModel.data.VRCommands.length;
      for (var i = len - 1; i >= 0; i--) {
        if (SDL.SDLModel.data.VRCommands[i].appID == appID) {
          SDL.SDLModel.data.VRCommands.splice(i, 1);
        }
      }
      SDL.VRPopUp.DeleteActivateApp(appID);
      if (SDL.SDLModel.data.stateLimited == appID) {
        SDL.SDLModel.data.set('stateLimited', null);
      }
      if (SDL.VRHelpListView.active) {
        this.showVRHelpItems();
      }
      if (appID === SDL.SDLMediaController.currentAppId) {
        SDL.SDLMediaController.set('currentAppId', null);
      }
      if (appID === SDL.SDLNonMediaModel.currentAppId) {
        SDL.SDLNonMediaModel.set('currentAppId', null);
      }
    },
    /**
     *
     * @param params
     * @constructor
     */
    UpdateAppList: function(params) {
      var list_changed = false;
      for (var i = SDL.SDLModel.data.registeredApps.length - 1; i >= 0; i--) {
        if (params.applications.filterProperty(
            'appID',
            SDL.SDLModel.data.registeredApps[i].appID
          ).length === 0) {
          list_changed = true;
          SDL.SDLModel.onAppUnregistered(SDL.SDLModel.data.registeredApps[i]);
        }
      }
      for (var i = 0; i < params.applications.length; i++) {
        if (SDL.SDLModel.data.registeredApps.filterProperty(
            'appID',
            params.applications[i].appID
          ).length === 0) {
          list_changed = true;
          SDL.SDLModel.onAppRegistered(params.applications[i]);
          SDL.SDLController.getApplicationModel(params.applications[i].appID)
            .set('isUpdatedByAppList', true);
        } else {
          var appModel =
            SDL.SDLController.getApplicationModel(
              params.applications[i].appID
          );
          if (!appModel.isUpdatedByAppList) {
            list_changed = true;
            appModel.set('isUpdatedByAppList', true);
          }
          appModel.set('disabledToActivate', params.applications[i].greyOut);
        }
      }
      if (list_changed) {
        var message = 'Was found ' + params.applications.length + ' apps';
        SDL.PopUp.create().appendTo('body').popupActivate(message);
      }
      SDL.InfoAppsView.showAppList();
    },
    /**
     * SDL Driver Distraction ON/OFF switcher
     */
    selectDriverDistraction: function() {
      if (SDL.SDLModel.data.driverDistractionState) {
        FFW.UI.onDriverDistraction('DD_ON');
      } else {
        FFW.UI.onDriverDistraction('DD_OFF');
      }
    }.observes('SDL.SDLModel.data.driverDistractionState'),
    /**
     * Ondisplay keyboard event handler
     * Sends notification on SDL Core with changed value
     */
    onKeyboardChanges: function() {
      if (null !== SDL.SDLModel.data.keyboardInputValue) {
        var str = SDL.SDLModel.data.keyboardInputValue;
        if (SDL.SDLController.model &&
          SDL.SDLController.model.globalProperties.keyboardProperties.keypressMode) {
          switch (SDL.SDLController.model.globalProperties.keyboardProperties.keypressMode) {
            case 'SINGLE_KEYPRESS':
            {
              FFW.UI.OnKeyboardInput(str.charAt(str.length - 1), 'KEYPRESS');
              break;
            }
            case 'QUEUE_KEYPRESS':
            {
              break;
            }
            case 'RESEND_CURRENT_ENTRY':
            {
              if (str) {
                FFW.UI.OnKeyboardInput(str, 'KEYPRESS');
              }
              break;
            }
          }
        }
      }
    }.observes('SDL.SDLModel.data.keyboardInputValue'),
    /**
     * Get application model
     *
     * @param {Number}
     */
    getApplicationModel: function(applicationId) {
      return SDL.SDLModel.data.registeredApps.filterProperty(
        'appID',
        applicationId
      )[0];
    },
    /**
     * Function returns ChangeDeviceView back to previous state
     */
    turnChangeDeviceViewBack: function() {
      SDL.States.goToStates('info.apps');
    },
    /**
     * Enter screen vith list of devices application model
     */
    onGetDeviceList: function() {
      SDL.States.goToStates('info.devicelist');
      SDL.SDLModel.data.set('deviceSearchProgress', true);
    },
    /**
     * Send notification if device was choosed
     *
     * @param element:
     *            SDL.Button
     */
    onDeviceChoosed: function(element) {
      SDL.SDLModel.data.set('CurrDeviceInfo.name', element.deviceName);
      SDL.SDLModel.data.set('CurrDeviceInfo.id', element.id);
      FFW.BasicCommunication.OnDeviceChosen(
        element.deviceName,
        element.id
      );
      this.turnChangeDeviceViewBack();
    },
    /**
     * Method call's request to get list of applications
     */
    findNewApps: function() {
      FFW.BasicCommunication.OnFindApplications();
    },
    /**
     * Method activates selected registered application
     *
     * @param {Object}
     */
    onActivateSDLApp: function(element) {
      if (SDL.SDLModel.data.VRActive) {
        SDL.SDLModel.data.toggleProperty('VRActive');
      }
      FFW.BasicCommunication.ActivateApp(element.appID);
    },
    /**
     * Method sent custom softButtons pressed and event status to RPC
     *
     * @param {Object}
     */
    onSoftButtonActionUpCustom: function(element) {
      if (element.time > 0) {
        FFW.Buttons.buttonEventCustom(
          'CUSTOM_BUTTON',
          'BUTTONUP',
          element.softButtonID,
          element.appID
        );
      } else {
        FFW.Buttons.buttonEventCustom(
          'CUSTOM_BUTTON',
          'BUTTONUP',
          element.softButtonID,
          element.appID
        );
        FFW.Buttons.buttonPressedCustom(
          'CUSTOM_BUTTON',
          'SHORT',
          element.softButtonID,
          element.appID
        );
      }
      clearTimeout(element.timer);
      element.time = 0;
    },
    /**
     * Method sent custom softButtons pressed and event status to RPC
     *
     * @param {Object}
     */
    onSoftButtonActionDownCustom: function(element) {
      FFW.Buttons.buttonEventCustom(
        'CUSTOM_BUTTON',
        'BUTTONDOWN',
        element.softButtonID,
        element.appID
      );
      element.time = 0;
      element.timer = setTimeout(
        function() {
          FFW.Buttons.buttonPressedCustom(
            'CUSTOM_BUTTON',
            'LONG',
            element.softButtonID,
            element.appID
          );
          element.time++;
        }, 2000
      );
    },
    /**
     * Method sent softButtons pressed and event status to RPC
     *
     * @param {String}
     * @param {Object}
     */
    onSoftButtonActionUp: function(element) {
      if (element.time > 0) {
        FFW.Buttons.buttonEvent(element.presetName, 'BUTTONUP');
      } else {
        FFW.Buttons.buttonEvent(element.presetName, 'BUTTONUP');
        FFW.Buttons.buttonPressed(element.presetName, 'SHORT');
      }
      clearTimeout(element.timer);
      element.time = 0;
    },
    /**
     * Method sent softButtons Ok pressed and event status to RPC
     *
     * @param {String}
     */
    onSoftButtonOkActionDown: function(name) {
      FFW.Buttons.buttonEvent(name, 'BUTTONDOWN');
    },
    /**
     * Method sent softButton OK pressed and event status to RPC
     *
     * @param {String}
     */
    onSoftButtonOkActionUp: function(name) {
      FFW.Buttons.buttonEvent(name, 'BUTTONUP');
      FFW.Buttons.buttonPressed(name, 'SHORT');
      if (SDL.SDLController.model) {
        SDL.SDLController.model.set(
          'isPlaying',
          !SDL.SDLController.model.isPlaying
        );
      }
    },
    /**
     * Method to send OnEmergencyEvent to SDL
     *
     * @param {String}
     */
    OnEmergencyEventNotificationSend: function(element) {
      SDL.SDLController.onEventChanged('emergencyEvent', element.enabled);
      element.set('enabled', !element.enabled);
    },
    /**
     * Method sent softButtons pressed and event status to RPC
     *
     * @param {String}
     * @param {Object}
     */
    onSoftButtonActionDown: function(element) {
      FFW.Buttons.buttonEvent(element.presetName, 'BUTTONDOWN');
      element.time = 0;
      element.timer = setTimeout(
        function() {
          FFW.Buttons.buttonPressed(element.presetName, 'LONG');
          element.time++;
        }, 2000
      );
    },
    /**
     * Send system context
     */
    onSystemContextChange: function(appID) {
      var sysContextValue = this.get('sysContext');
      if ((
        appID &&
        SDL.SDLController.getApplicationModel(appID) !=
        SDL.SDLController.model) ||
        (
        this.backgroundAlertAppID &&
        SDL.SDLController.getApplicationModel(this.backgroundAlertAppID) !=
        SDL.SDLController.model)) {
        if (appID) {
          this.backgroundAlertAppID = appID;
          FFW.UI.OnSystemContext(sysContextValue, appID);
          if (SDL.SDLController.model) {
            FFW.UI.OnSystemContext(
              'HMI_OBSCURED', SDL.SDLController.model.appID
            );
          }
        } else if (this.backgroundAlertAppID) {
          FFW.UI.OnSystemContext('MAIN', this.backgroundAlertAppID);
          if (SDL.SDLController.model) {
            FFW.UI.OnSystemContext(
              sysContextValue, SDL.SDLController.model.appID
            );
          }
        }
      } else {
        if (SDL.SDLController.model) {
          appID = SDL.SDLController.model.appID;
        } else {
          appID = null;
        }
        FFW.UI.OnSystemContext(sysContextValue, appID);
      }
    },
    /**
     * SetAudioStreamingIndicator notification handler
     *
     * @param {Object} params
     * @constructor
     * @return {boolean}
     */
    SetAudioStreamingIndicator: function(params) {
      if (SDL.SDLController.model) {
        SDL.SDLController.model.set(
          'mediaPlayerIndicator',
          SDL.SDLModel.data.
            mediaPlayerIndicatorEnum[params.audioStreamingIndicator]
        );
        return true;
      }
      return false;
    }
  }
);
