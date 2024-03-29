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
      this.updateCustomVehicleDataTypesMapping();
    },
    /**
     * Active application model binding type {SDLAppModel}
     */
    model: null,
    /**
     * Function to add application to application list
     */
    showAppList: function() {
      SDL.InfoAppsView.showAppList();
      SDL.AppPermissionsListView.showAppList();
      SDL.RCModulesController.updateModuleSeatLocationContent();
      SDL.RPCControlView.showAppList();
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
          case SDL.SDLModel.data.exitCommandsEnum.DRIVER_DISTRACTION_VIOLATION:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'DRIVER_DISTRACTION_VIOLATION'
            );
            break;
          }
          case SDL.SDLModel.data.exitCommandsEnum.USER_EXIT:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'USER_EXIT'
            );
            break;
          }
          case SDL.SDLModel.data.exitCommandsEnum.UNAUTHORIZED_TRANSPORT_REGISTRATION:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'UNAUTHORIZED_TRANSPORT_REGISTRATION'
            );
            break;
          }
          case SDL.SDLModel.data.exitCommandsEnum.RESOURCE_CONSTRAINT:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'RESOURCE_CONSTRAINT'
            );
            break;
          }
          case SDL.SDLModel.data.exitCommandsEnum.CLOSE_CLOUD_CONNECTION:
          {
            FFW.BasicCommunication.ExitApplication(
              SDL.SDLController.model.appID,
              'CLOSE_CLOUD_CONNECTION'
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
        this.model.set('currentSubMenuId', 'top');
        SDL.OptionsView.deactivate();
      }
    },
    onNavButton: function(element) {
      // Empty target function.
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
      if (id >= 0 && id != 'top') {
        this.model.set('currentMenuDepth', this.model.currentMenuDepth + 1);
      } else {
        this.model.set('currentMenuDepth', 0);
      }      
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
        var that = this;
        setTimeout( function() { that.userExitAction(element.appID); }, 50);
      } else {
        FFW.VR.onCommand(element.commandID, element.appID, element.grammarID);
      }
    },
    userExitAction: function(appID) {
      FFW.BasicCommunication.ExitApplication(appID, 'USER_EXIT');
      this.closeApplication(appID);
    },
    /**
     * Handler for CloseApplication RPC
     *
     * @param appID {Number}
     */
    closeApplication: function(appID) {
      if (SDL.States.currentState.getPath('path') === 'media.sdlmedia'){
        SDL.SDLMediaController.onCloseApplication(appID)
      }
      if (SDL.States.currentState.getPath('path') === 'media.sdlmedia' ||
        SDL.States.currentState.getPath('path') === 'info.nonMedia' ||
        SDL.States.currentState.getPath('path') === 'navigationApp.baseNavigation' ||
        SDL.States.currentState.getPath('path') === 'webViewApp') {
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
      SDL.InteractionChoicesView.deactivate('SUCCESS', element.choiceID);
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
    openNavButtonsList: function() {
      SDL.NavigationSubscriptionButtonsView.activate();
    },
    /**
     * Notification of deactivation of current application model initiated in
     * StateManager
     */
    deactivateApp: function() {
      if (this.model) {
        SDL.SDLController.onSubMenu('top');
        SDL.SDLModel.onDeactivateApp(SDL.States.nextState, this.model.appID);
        SDL.SDLController.model.set('tbtActivate', false);
      }
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
      if (SDL.AlertPopUp.active || SDL.SubtleAlertPopUp.active) {
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
      'SDL.SubtleAlertPopUp.active',
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
          break;
        }
      }

      if (this.areAllComponentsReady()) {
        FFW.BasicCommunication.onReady();
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
     * @description Updates custom OEM data types according to current VD
     */
    updateCustomVehicleDataTypesMapping() {
      for (key in SDL.SDLVehicleInfoModel.eVehicleDataType) {
        if (SDL.SDLVehicleInfoModel.eVehicleDataType[key] == 'VEHICLEDATA_OEM_CUSTOM_DATA' &&
            !SDL.SDLVehicleInfoModel.vehicleData.hasOwnProperty(key)) {
          delete SDL.SDLVehicleInfoModel.eVehicleDataType[key];
        }
      }

      for (key in SDL.SDLVehicleInfoModel.vehicleData) {
        if (!SDL.SDLVehicleInfoModel.eVehicleDataType.hasOwnProperty(key)) {
          SDL.SDLVehicleInfoModel.eVehicleDataType[key] = 'VEHICLEDATA_OEM_CUSTOM_DATA';
        }
      }
    },
    /**
     * vehicleDataChange button handler on VehicleInfo View
     */
    vehicleDataChange: function() {
      SDL.VehicleInfo.vehicleDataCodeEditor.activate(
        function(parsedData) {
          var params = {};
          for (var i in parsedData) {
            if (undefined === SDL.SDLVehicleInfoModel.vehicleData[i] ||
                SDL.SDLController.compareObjects(
                  SDL.SDLVehicleInfoModel.vehicleData[i],
                  parsedData[i]
                )) {
              let paramKey = (i === "clusterModes") ? "clusterModeStatus" : i;
              params[paramKey] = parsedData[i];
            }
          }
          SDL.SDLVehicleInfoModel.vehicleData = parsedData;
          SDL.SDLController.updateCustomVehicleDataTypesMapping();

          if (Object.keys(params).length > 0) {
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
     * @function policyConfigDataChange
     * @description Policy config data button handler on Vehicle Info view
     */
    policyConfigDataChange: function() {
      SDL.PolicyConfigListView.policyConfigCodeEditor.activate(
        function(data) {
          SDL.SDLModel.data.policyConfigData = data;
        }
      );
      SDL.PolicyConfigListView.policyConfigCodeEditor.editor.set(
        'code',
        JSON.stringify(SDL.SDLModel.data.policyConfigData, null, 2)
      );
    },
    /**
     * Checks whether HMI is ready and all components are registered
     *
     * @return {Boolean}
     */
    areAllComponentsReady: function() {
      for (var i = 0; i < SDL.SDLModel.data.registeredComponents.length; i++) {
        if (FLAGS[SDL.SDLModel.data.registeredComponents[i].type] !=
          SDL.SDLModel.data.registeredComponents[i].state) {
          return false;
        }
      }
      return true;
    },
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
        SDL.ResetTimeoutPopUp.setContext('');
        SDL.ResetTimeoutPopUp.stopRpcProcessing('TTS.Speak');
        FFW.TTS.Stopped();
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
          SDL.AlertPopUp.deactivate();
          break;
        }
        case 'AlertManeuverPopUp':
        {
          SDL.AlertManeuverPopUp.deactivate();
          break;
        }
        case 'SubtleAlertPopUp':
        {
          SDL.SubtleAlertPopUp.deactivate();
          break;
        }
        case 'ScrollableMessage':
        {
          SDL.ScrollableMessage.deactivate();
          break;
        }
      }
    },

    /**
     * Action to show Voice Recognition PopUp
     */
    activateVRPopUp: function() {
      if (FFW.TTS.requestId) {
        FFW.TTS.aborted = true;
        SDL.ResetTimeoutPopUp.stopRpcProcessing('TTS.Speak', true);
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
        case 'AlertManeuverPopUp':
        {
          SDL.AlertManeuverPopUp.deactivate();
          this.onActivateSDLApp(element);
          break;
        }
        case 'SubtleAlertPopUp':
        {
          SDL.SubtleAlertPopUp.deactivate();
          this.onActivateSDLApp(element);
          break;
        }
        case 'ScrollableMessage':
        {
          SDL.ScrollableMessage.deactivate();
          this.onActivateSDLApp(element);
          break;
        }
        case 'WidgetAction': 
        {
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
        case 'AlertManeuverPopUp':
          {
            SDL.ResetTimeoutPopUp.resetTimeoutSpecificRpc('Navigation.AlertManeuver');
            break;
          }
        case 'ScrollableMessage':
          {
            SDL.ResetTimeoutPopUp.resetTimeoutSpecificRpc('UI.ScrollableMessage');
            break;
          }
        case 'AlertPopUp':
          {
            SDL.ResetTimeoutPopUp.resetTimeoutSpecificRpc('UI.Alert');
            break;
          }
        case 'SubtleAlertPopUp':
          {
            SDL.ResetTimeoutPopUp.resetTimeoutSpecificRpc('UI.SubtleAlert');
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
      } else if (methodName === 'UI.SubtleAlert') {
        SDL.SubtleAlertPopUp.deactivate();
      } else if (methodName == 'UI.PerformAudioPassThru') {
        SDL.AudioPassThruPopUp.deactivate();
        this.performAudioPassThruResponse(SDL.SDLModel.data.resultCode.SUCCESS);
      } else if (methodName == 'UI.PerformInteraction') {
        SDL.InteractionChoicesView.deactivate('ABORTED');
      } else if (methodName == 'UI.ScrollableMessage') {
        SDL.ScrollableMessage.deactivate(true);
      } else if (methodName == 'UI.Slider') {
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
      SDL.AlertManeuverPopUp.deactivate();
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
      manualTextEntry, info) {
      FFW.UI.interactionResponse(
        SDL.SDLController.getApplicationModel(
          appID
        ).activeRequests.uiPerformInteraction,
        result,
        choiceID,
        manualTextEntry,
        info
      );
      SDL.SDLModel.data.set('interactionData.vrHelpTitle', null);
      SDL.SDLModel.data.set('interactionData.vrHelp', null);
      clearTimeout(SDL.SDLModel.promptTimeout);
      SDL.SDLModel.set('timeoutPromptCallback', undefined);
      SDL.SDLController.getApplicationModel(
        appID
      ).activeRequests.uiPerformInteraction = null;
    },
    /**
     * Method to sent notification ABORTED for VR PerformInteraction
     */
    vrInteractionResponse: function(result, choiceID) {
      FFW.VR.interactionResponse(
        SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction, result,
        choiceID
      );
      if(SDL.SDLModel.data.resultCode.TIMED_OUT !== result) {
        SDL.ResetTimeoutPopUp.stopRpcProcessing('VR.PerformInteraction', false, false);
      }
      SDL.ResetTimeoutPopUp.startCountTimeoutByRPCName('UI.PerformInteraction');
      SDL.SDLModel.data.interactionData.helpPrompt = null;
      SDL.SDLModel.data.vrActiveRequests.vrPerformInteraction = null;
      SDL.SDLModel.data.set('VRActive', false);
      SDL.SDLModel.set('allowUIPerformInteraction', true);
    },
    /**
     * Method to sent notification for Alert
     *
     * @param {Number}
     *            result code
     * @param {Number}
     *            alertRequestID
     */
    alertResponse: function(result, alertRequestID, info) {
      FFW.UI.alertResponse(result, alertRequestID, info);
    },
    /**
     * Method to send response for SubtleAlert
     *
     * @param {Number}
     *            result code
     * @param {Number}
     *            subtleAlertRequestID
     * @param {String}
     *            info
     * @param {Number}
     *            tryAgainTime time in ms until current SubtleAlert finished
     */
    subtleAlertResponse: function(result, subtleAlertRequestID, info, tryAgainTime) {
      FFW.UI.subtleAlertResponse(result, subtleAlertRequestID, info, tryAgainTime);
    },
    /**
     * Method to send notification when subtle alert is clicked
     *
     * @param {Number}
     *            appID
     */
    onSubtleAlertPressed: function(appID) {
      FFW.UI.onSubtleAlertPressed(appID);
    },
    /**
     * Method to sent notification for Scrollable Message
     *
     * @param {String}
     *            result
     * @param {Number}
     *            messageRequestId
     */
    scrollableMessageResponse: function(result, info, messageRequestId) {
      if (result == SDL.SDLModel.data.resultCode.SUCCESS) {
        FFW.UI.sendUIResult(
          result,
          messageRequestId,
          'UI.ScrollableMessage'
        );
      } else if(result == SDL.SDLModel.data.resultCode.WARNINGS) {
        FFW.UI.sendUIResult(
          result,
          messageRequestId,
          'UI.ScrollableMessage',
          info
        );
      } else {
        FFW.UI.sendUIResult(
          result,
          messageRequestId,
          'UI.ScrollableMessage',
          'ScrollableMessage aborted!'
        );
      }
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
      if (result === SDL.SDLModel.data.resultCode.SUCCESS
         || result === SDL.SDLModel.data.resultCode.RETRY) {
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
    onLanguageChangeUI: function(newLanguage) {
      FFW.UI.OnLanguageChange(newLanguage);
      FFW.BasicCommunication.OnSystemInfoChanged(newLanguage);
    },
    /**
     * Method to set language for TTS and VR components with parameters sent
     * from SDLCore to UIRPC
     */
    onLanguageChangeTTSVR: function(newLanguage) {
      FFW.TTS.OnLanguageChange(newLanguage);
      FFW.VR.OnLanguageChange(newLanguage);
    },
    /**
     * Register application
     *
     * @param {Object}
     *            params
     * @param {Number}
     *            applicationType
     */
    registerApplication: function(params, applicationType) {
      const isDayColorSchemeDefined = "dayColorScheme" in params;
      const isNightColorSchemeDefined = "nightColorScheme" in params;
      const isWebEngineApp =
        "transportType" in params.deviceInfo &&
        params.deviceInfo.transportType == "WEBENGINE_WEBSOCKET";

      if (applicationType === undefined || applicationType === null) {
        SDL.SDLModel.data.get('registeredApps').pushObject(
          this.applicationModels[0].create(
            { //Magic number 0 - Default media model for not initialized applications
              appID: params.appID,
              appName: params.appName,
              deviceName: params.deviceInfo.name,
              appType: params.appType,
              isMedia: 0,
              disabledToActivate: params.greyOut ? true : false,
              dayColorScheme: isDayColorSchemeDefined ? params.dayColorScheme : SDL.SDLModelData.data.defaultColorScheme,
              nightColorScheme: isNightColorSchemeDefined ? params.nightColorScheme : SDL.SDLModelData.data.defaultColorScheme,
              policyAppID: params.policyAppID,
              webEngineApp: isWebEngineApp,
              priority: params.priority ? params.priority : 'NONE'
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
              disabledToActivate: params.greyOut ? true : false,
              dayColorScheme: isDayColorSchemeDefined ? params.dayColorScheme : SDL.SDLModelData.data.defaultColorScheme,
              nightColorScheme: isNightColorSchemeDefined ? params.nightColorScheme : SDL.SDLModelData.data.defaultColorScheme,
              policyAppID: params.policyAppID,
              webEngineApp: isWebEngineApp,
              priority: params.priority ? params.priority : 'NONE'
            }
          )
        );
      }
      var exitCommands = [
        {
          'id': -10,
          'params': {
            'menuParams': {
              'parentID': 0,
              'menuName': 'Exit \'DRIVER_DISTRACTION_VIOLATION\'',
              'position': 0
            },
            cmdID: SDL.SDLModel.data.exitCommandsEnum.DRIVER_DISTRACTION_VIOLATION
          }
        },
        {
          'id': -10,
          'params': {
            'menuParams': {
              'parentID': 0,
              'menuName': 'Exit \'USER_EXIT\'',
              'position': 0
            },
            cmdID: SDL.SDLModel.data.exitCommandsEnum.USER_EXIT
          }
        },
        {
          'id': -10,
          'params': {
            'menuParams': {
              'parentID': 0,
              'menuName': 'Exit \'UNAUTHORIZED_TRANSPORT_REGISTRATION\'',
              'position': 0
            },
            cmdID: SDL.SDLModel.data.exitCommandsEnum.UNAUTHORIZED_TRANSPORT_REGISTRATION
          }
        },
        {
          'id': -10,
          'params': {
            'menuParams': {
              'parentID': 0,
              'menuName': 'Exit \'RESOURCE_CONSTRAINT\'',
              'position': 0
            },
            cmdID: SDL.SDLModel.data.exitCommandsEnum.RESOURCE_CONSTRAINT
          }
        },
        {
          'id': -10,
          'params': {
            'menuParams': {
              'parentID': 0,
              'menuName': 'Exit \'CLOSE_CLOUD_CONNECTION\'',
              'position': 0
            },
            cmdID: SDL.SDLModel.data.exitCommandsEnum.CLOSE_CLOUD_CONNECTION
          }
        }
      ];

      let model = SDL.SDLController.getApplicationModel(params.appID);
      exitCommands.forEach(command => {
        model.addCommand(command);
      });
    },
    /**
     * Unregister application
     *
     * @param {Number}
     *            appID
     */
    unregisterApplication: function(appID) {
      var app = this.getApplicationModel(appID);
      app.VRCommands = [];
      app.removeWidgets();
      SDL.AddWidgetPopUp.updateWidgetList();
      app.onDeleteApplication(appID);
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
      if (app.webEngineApp && app.policyAppID in SDL.SDLModel.webApplicationFramesMap) {
        let frame = SDL.SDLModel.webApplicationFramesMap[app.policyAppID];
        const web_engine_view = document.getElementById("webEngineView");
        if (web_engine_view) {
          web_engine_view.removeChild(frame);
        }
        delete SDL.SDLModel.webApplicationFramesMap[app.policyAppID];
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

      params.applications.forEach(appRecord => {
        SDL.SDLModel.appIDtoPolicyAppIDMapping[appRecord.appID] = appRecord.policyAppID;
      });
      SDL.SettingsController.runScheduledPtuIteration();
    },
    /**
     * SDL Driver Distraction ON/OFF switcher
     */
    selectDriverDistraction: function(driverDistractionState) {
      if (driverDistractionState) {
        FFW.UI.onDriverDistraction('DD_ON');
      } else {
        FFW.UI.onDriverDistraction('DD_OFF');
      }
    },
    /**
     * Ondisplay keyboard event handler
     * Sends notification on SDL Core with changed value
     */
    onKeyboardChanges: function() {
      if (null !== SDL.SDLModel.data.keyboardInputValue) {
        var str = SDL.SDLModel.data.keyboardInputValue;

        let mode = 'RESEND_CURRENT_ENTRY';
        if (SDL.SDLController.model &&
            SDL.SDLController.model.globalProperties.keyboardProperties.keypressMode) {
          mode = SDL.SDLController.model.globalProperties.keyboardProperties.keypressMode;
        }

        switch (mode) {
          case 'SINGLE_KEYPRESS': {
            FFW.UI.OnKeyboardInput(str.charAt(str.length - 1), 'KEYPRESS');
            break;
          }
          case 'QUEUE_KEYPRESS': {
            break;
          }
          case 'RESEND_CURRENT_ENTRY': {
            FFW.UI.OnKeyboardInput(str, 'KEYPRESS');
            break;
          }
        }
      }
    },
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
     * Enter screen of applications store
     */
    onClickAppsStore: function() {
      SDL.States.goToStates('info.apps_store');
      SDL.InfoController.onAppsStoreButtonClick();
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
     * Method activates selected registered application
     *
     * @param {Object}
     */
    onActivateSDLApp: function(element) {  
      reverseFunctionalityEnabled = SDL.SDLModel.get('reverseFunctionalityEnabled');    
      function ActivateSDLApp(enable_rc){
        if(enable_rc && !reverseFunctionalityEnabled){
          SDL.SDLController.toggleRSDLFunctionality();
        }

        if (SDL.SDLModel.data.VRActive) {
          SDL.SDLModel.data.toggleProperty('VRActive');
        }

        var model = SDL.SDLController.getApplicationModel(element.appID);
        if (model.webEngineApp && !model.initialized) {
          let callback = function(entrypoint) {
            SDL.RunWebEngineAppView.set('policyAppIdToLaunch', model.policyAppID);
            SDL.RunWebEngineAppView.set('titleText',
              'Run WebEngine App - ' + model.appName + ' - ' +  model.policyAppID
            );
            SDL.RunWebEngineAppView.set('appEntryPoint', entrypoint);
            SDL.RunWebEngineAppView.toggleActivity();
          }

          SDL.InfoController.getWebAppEntryPointPath(model.policyAppID, callback);
        } else if (model.webEngineApp !== true && model.appType.indexOf('WEB_VIEW') >= 0) {
          SDL.PopUp.create().appendTo('body')
            .popupActivate("Only Web Engine apps with app type WEB_VIEW can be activated!");
        } else {
          FFW.BasicCommunication.ActivateApp(element.appID);
        }
      }

      if (reverseFunctionalityEnabled){
        ActivateSDLApp(true);
        return;
      }

      if(SDL.SDLController.getApplicationModel(element.appID).appType.indexOf('REMOTE_CONTROL')!=-1){
      popUp = SDL.PopUp.create();
      popUp.buttonOk.text = "Yes";
      popUp.buttonCancel.text = "No";

      popUp.appendTo('body').popupActivate(
        'Enable remote control feature for all mobile apps?' +
        'Please press Yes to enable remote control or No to cancel.',
        ActivateSDLApp
        );
      }else
      {
      ActivateSDLApp(false);
      }
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
    onSystemContextChange: function(appID, windowID) {
      var sysContextValue = this.get('sysContext');
      SDL.SDLController.setWebEngineFramesActive(sysContextValue == 'MAIN');

      if ((
        appID &&
        SDL.SDLController.getApplicationModel(appID) !=
        SDL.SDLController.model && undefined === windowID ) ||
        (
        this.backgroundAlertAppID &&
        SDL.SDLController.getApplicationModel(this.backgroundAlertAppID) !=
        SDL.SDLController.model && undefined === windowID)) {
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
      } else if (windowID && appID) {
        FFW.UI.OnSystemContext(sysContextValue, appID, windowID);
        return;
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
     * @param {Object} audioStreamingIndicator audioStreamingIndicator name
     * @constructor
     * @return {boolean}
     */
    SetAudioStreamingIndicator: function(audioStreamingIndicator) {
      if (SDL.SDLController.model) {
        SDL.SDLController.model.set(
          'mediaPlayerIndicator',
          SDL.SDLModel.data.
            mediaPlayerIndicatorEnum[audioStreamingIndicator]
        );
        return true;
      }
      return false;
    },

    /**
     * @function expandWidgetView
     * @param {Boolean} expand 
     * @description action to expand widget container
     */
    expandWidgetView: function(expand) {      
      if(expand) {
        var glider_slides = SDL.RightSideView.getWidgetContainer().widgetContainer.view.slides;
        var length = glider_slides.length;
        for(var i=0; i< length; ++i) {
          var item = glider_slides.item(i);
          if('add-window' == item.id) {
            continue;
          }
          if(-1 !== item.className.indexOf('visible')) {
            var window = {
              'appID': item.appID,
              'windowID': item.windowID
            };
            SDL.SDLController.getApplicationModel(item.appID).activateWindow(window);
          }
        }
        return;
      }
      var apps = SDL.SDLModel.data.registeredApps;
        apps.forEach(app => {
          var windows = [];
          app.activeWindows.forEach(element => {
            var window = {};
            window['appID'] = app.appID;
            window['windowID'] = element.windowID;
            windows.push(window);
          });
          windows.forEach(element => {
            app.deactivateWindow(element);
          });
        });
    },

    /**
     * @function activateWidget
     * @param {Object} event 
     * @description action to activate widgets
     */
    activateWidget: function(event) {
      var app = this.getApplicationModel(event.appID);
      app.activateWindow(event);
      SDL.AddWidgetPopUp.updateWidgetList();
      SDL.RightSideView.getWidgetContainer().addWidget(event);
    },

    /**
     * @function closeWidget
     * @param {Object} event 
     * @description action to close widget
     */
    closeWidget:function(event) {
      var window = event._parentView;
      var app = SDL.SDLController.getApplicationModel(window.appID);
      SDL.RightSideView.getWidgetContainer().removeWidget(window.appID, window.windowID);
      app.deactivateWindow(window);
      app.deactivateWindow(window);
      SDL.AddWidgetPopUp.updateWidgetList();
    },

    /**
     * @function widgetVisible
     * @param {Object} event 
     * @param {Object} widgetContainer 
     * @description action when a widget got a visible state
     */
    widgetVisible: function(event, widgetContainer) {
      var window = widgetContainer.view.slides[event.detail.slide];
      if('add-window' == window.id) {
        return;
      }
      var app = SDL.SDLController.getApplicationModel(window.appID);
      app.activateWindow(window);
    },

    /**
     * @function widgetNonVisible
     * @param {Object} event 
     * @param {Object} widgetContainer
     * @description action when a widget got an invisible state
     */
    widgetNonVisible: function(event, widgetContainer) {
      var window = widgetContainer.view.slides[event.detail.slide];
      if('add-window' == window.id) {
        return;
      }
      var app = SDL.SDLController.getApplicationModel(window.appID);
      app.deactivateWindow(window);
    },

    /**
     * @function getDisplayCapability
     * @param {Integer} appID
     * @param {Integer} windowID
     * @description returns string of system capabilities for selected app
     */
    getDisplayCapability: function(appID, windowID){
      const appModel = SDL.SDLController.getApplicationModel(appID);
      const windowType = (windowID === undefined || windowID === 0) ? "MAIN" : "WIDGET";
      const windowTypeSupported = SDL.SDLModelData.defaultWindowCapability[windowType].systemCapability.displayCapabilities[0].windowTypeSupported;

      let template = appModel.templateConfiguration.template;
      if(template === 'DEFAULT') {
        if(appModel.appType.includes('WEB_VIEW')) {
          template = 'WEB_VIEW';
        } else if(appModel.appType.includes('NAVIGATION') || appModel.appType.includes('PROJECTION')) {
          template = 'NAV_FULLSCREEN_MAP';
        } else if(appModel.isMedia === true) {
          template = 'MEDIA';
        } else {
          template = 'NON-MEDIA';
        }
      }

      let templateCapabilities = SDL.deepCopy(SDL.templateCapabilities[template])
      let displayCapability = {
        displayName: templateCapabilities.displayCapabilities.displayName,
        windowCapabilities: [{
          textFields: templateCapabilities.displayCapabilities.textFields,
          imageFields: templateCapabilities.displayCapabilities.imageFields,
          imageTypeSupported: templateCapabilities.displayCapabilities.imageCapabilities,
          templatesAvailable: templateCapabilities.displayCapabilities.templatesAvailable,
          numCustomPresetsAvailable: templateCapabilities.displayCapabilities.numCustomPresetsAvailable,
          buttonCapabilities: templateCapabilities.buttonCapabilities,
          softButtonCapabilities: templateCapabilities.softButtonCapabilities
        }],
        windowTypeSupported: windowTypeSupported
      };

      if(windowType === "WIDGET") {
        displayCapability.windowCapabilities[0].windowID = windowID;
      }
      
      return {
        systemCapability: {
          systemCapabilityType: "DISPLAYS",
          displayCapabilities: [ displayCapability ]
        },
        appID: appID
      }
    },
    /**
     * @function isColorSchemesEqual
     * @param {Object} left - color scheme object
     * @param {Object} right - color scheme object
     * @return {Boolean} true if colorschemes are equel, otherwise - false
     * @description utility function, compares two color scheme objects
     */
    isColorSchemesEqual: function (left, right) {
      //utility functions to compare colors
      let isColorEqual = function (colorLeft, colorRight) {
        return colorLeft["red"] === colorRight["red"] 
          && colorLeft["green"] === colorRight["green"]
          && colorLeft["blue"] === colorRight["blue"];
      };

      let compareSchemesByColor = function (lhs, rhs, color) {
         let colorInLhs = lhs ? color in lhs : null;
         let colorRhs = rhs ? color in rhs : null;
         if(colorInLhs && colorRhs) {
           return isColorEqual(lhs[color], rhs[color]);
         } else if (!colorInLhs && !colorRhs) {
           return true;
         }

         return false;
      };

      return compareSchemesByColor(left, right, "primaryColor") 
        && compareSchemesByColor(left, right, "secondaryColor") 
        && compareSchemesByColor(left, right, "backgroundColor");
    },

    /**
     * @function generateAppWidgetTitle
     * @param {Object} titleData
     * @description generate title message for widget or application by the templateConfiguration
     * @returns {String}
     */
    generateAppWidgetTitle: function(titleData) {
      var title = '';
      for(key in titleData) {
        title = title + key + ': \n' + JSON.stringify(titleData[key]) + '\n\n';
      }
      return title;
    },

    /**
     * @function setWebEngineFramesActive
     * @param {Boolean} isActive
     * @description set touch events activity for all currently active WEP frames
     */
    setWebEngineFramesActive: function(isActive) {
      var frames = document.getElementsByClassName("WebEngineFrame");
      for (var i = 0; i < frames.length; ++i) {
        if (isActive) {
          frames[i].style.pointerEvents = null;
        } else {
          frames[i].style.pointerEvents = "none";
        }
      }
    },

    /**
     * @function hideWebApps
     * @description Makes all web application view disabled
     */
    hideWebApps: function() {
      for(var key in SDL.SDLModel.webApplicationFramesMap) {
        SDL.SDLModel.webApplicationFramesMap[key].hidden = true;
      }
    },

    /**
     * @function showWebViewApp
     * @param {Number} appID
     * @description Activates web view for application specified by appID
     */
    showWebViewApp: function(appID) {
      this.hideWebApps();
      let policyAppID = SDL.SDLModel.appIDtoPolicyAppIDMapping[appID];
      SDL.SDLModel.webApplicationFramesMap[policyAppID].hidden = false;
    },

    /**
     * @function onUpdateFile
     * @param {String} fileName
     * @description Checks whether provided file was requested from SDL or not
     * and sends notification if file was not requested yet
     */
    onUpdateFile: function(fileName) {
      if(SDL.SDLController.model && SDL.SDLController.model.appID) {
        let model = SDL.SDLController.model;
        if (!model.cachedIconFileNamesList.includes(fileName)) {
          model.cachedIconFileNamesList.push(fileName);
          FFW.UI.OnUpdateFile(model.appID, fileName);
        }
      }
    },

    /**
     * @function onUpdateSubMenu
     * @param {Integer} menuID
     * @description Checks whether provided menuID update was requested from SDL
     * or not and sends notification if submenu was not updated yet
     */
    onUpdateSubMenu: function(menuID) {
      if(SDL.SDLController.model && SDL.SDLController.model.appID) {
        let model = SDL.SDLController.model;
        if (!model.cachedSubmenuIdsList.includes(menuID)) {
          model.cachedSubmenuIdsList.push(menuID);
          FFW.UI.OnUpdateSubMenu(model.appID, menuID);
        }
      }
    },

    /**
     * @function onDeleteSubMenu
     * @param {Integer} menuID
     * @description Removes menuID from application model cache if it was cached before
     */
    onDeleteSubMenu: function(menuID) {
      if (SDL.SDLController.model && SDL.SDLController.model.appID) {
        let model = SDL.SDLController.model;
        const index = model.cachedSubmenuIdsList.indexOf(menuID);
        if (index >= 0) {
          model.cachedSubmenuIdsList.splice(index, 1);
        }
      }
    },

    /**
     * @description Callback for display image mode change.
     */
    imageModeChanged: function() { 
      const length = SDL.OptionsView.commands.items.length;
      for (var i=0; i<length; i++) {
        SDL.OptionsView.commands.items[i].type.prototype.setMode(SDL.SDLModel.data.imageMode);
      }

      SDL.OptionsView.commands.refreshItems();
    }.observes('SDL.SDLModel.data.imageMode')
  }
);
