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
 * @name SDL.AppModel
 * @desc Abstarct model for SDL applications
 * @category Model
 * @filesource app/model/sdl/Abstract/AppModel.js
 * @version 1.0
 */

SDL.ABSAppModel = Em.Object.extend(
  {
    /**
     * Flag to display/fide PLAY_PAUSE button on media screen
     * depends on BC.SubscribeButton request
     */
    PLAY_PAUSE: false,
    /**
     * Flag to display/fide SEEKLEFT button on media screen
     * depends on BC.SubscribeButton request
     */
    SEEKLEFT: false,
    /**
     * Flag to display/fide SEEKRIGHT button on media screen
     * depends on BC.SubscribeButton request
     */
    SEEKRIGHT: false,
    /**
     * Flag to display/fide TUNEUP button on media screen
     * depends on BC.SubscribeButton request
     */
    TUNEUP: false,
    /**
     * Flag to display/fide TUNEDOWN button on media screen
     * depends on BC.SubscribeButton request
     */
    TUNEDOWN: false,
    /*
     * Set of display text and subscription flags to display 
     * navigation subscription buttons.
     * Depends on BC.SubscribeButton request.
     */    
    NAV_BUTTONS: {
        NAV_CENTER_LOCATION: {
          subscribed: false,
          text: "Center"
        },
        NAV_ZOOM_IN: {
          subscribed: false,
          text: "Zoom In"
        },
    
        NAV_ZOOM_OUT: {
          subscribed: false,
          text: "Zoom Out"
        },
    
        NAV_PAN_UP: {
          subscribed: false,
          text: "Pan Up"
        },
    
        NAV_PAN_UP_RIGHT: {
          subscribed: false,
          text: "Pan Up Right"
        },
    
        NAV_PAN_RIGHT: {
          subscribed: false,
          text: "Pan Right"
        },
    
        NAV_PAN_DOWN_RIGHT: {
          subscribed: false,
          text: "Pan Down Right"
        },
    
        NAV_PAN_DOWN: {
          subscribed: false,
          text: "Pan Down"
        },
    
        NAV_PAN_DOWN_LEFT: {
          subscribed: false,
          text: "Pan Down Left"
        },
    
        NAV_PAN_LEFT: {
          subscribed: false,
          text: "Pan Left"
        },
    
        NAV_PAN_UP_LEFT: {
          subscribed: false,
          text: "Pan Up Left"
        },
    
        NAV_TILT_TOGGLE: {
          subscribed: false,
          text: "Pan Tilt Toggle"
        },
    
        NAV_ROTATE_CLOCKWISE: {
          subscribed: false,
          text: "Rotate Clockwise"
        },
    
        NAV_ROTATE_COUNTERCLOCKWISE: {
          subscribed: false,
          text: "Rotate Counterclockwise"
        },
    
        NAV_HEADING_TOGGLE: {
          subscribed: false,
          text: "Toggle Heading"
        }
    },
    /**
     * mediaPlayerIndicator flag for SDL.SDLMediaControlls view
     */
    mediaPlayerIndicator: 0,
    playIndicator: function() {
      return this.mediaPlayerIndicator ===
        SDL.SDLModel.data.mediaPlayerIndicatorEnum.PLAY;
    }.property('this.mediaPlayerIndicator'),
    pauseIndicator: function() {
      return this.mediaPlayerIndicator ===
        SDL.SDLModel.data.mediaPlayerIndicatorEnum.PAUSE;
    }.property('this.mediaPlayerIndicator'),
    playPauseIndicator: function() {
      return this.mediaPlayerIndicator ===
        SDL.SDLModel.data.mediaPlayerIndicatorEnum.PLAY_PAUSE;
    }.property('this.mediaPlayerIndicator'),
    stopIndicator: function() {
      return this.mediaPlayerIndicator ===
      SDL.SDLModel.data.mediaPlayerIndicatorEnum.STOP ? 'STOP' : null;
    }.property('this.mediaPlayerIndicator'),
    /**
     * Application's container for current processed requests on HMI
     *
     * @type {Object}
     */
    activeRequests: {},
    /**
     * Application Id
     *
     * @type {Number}
     */
    appID: null,
    /**
     * Application name
     *
     * @type {String}
     */
    appName: '',
    /**
     * Flag to define if application was initialized (registered) correctly
     * Has correct application type
     *
     * @type {Boolean}
     */
    initialized: false,
    /**
     * Current HMI level of registered application
     */
    level: 'NONE',
    /**
     * Media application flag
     * If application was successfully initialized this flag it set into
     * correct value
     *
     * @type {Boolean}
     */
    isMedia: null,
    /**
     * Flag to determine if app in application list can not be activated from
     * HMI
     *
     * @type {Boolean}
     */
    disabledToActivate: false,
    /**
     * Application type
     * If application was successfully initialized this parameter it set into
     * correct value
     *
     * @type {String}
     */
    appType: '',

    /**
     * @name initialColorScheme
     */
    initialColorScheme: {},
    /**
     * Navigation streaming url
     */
    navigationStream: null,
    /**
     * Navigation streaming url
     */
    navigationAudioStream: null,
    /**
     * Chosen device name
     *
     * @type {String}
     */
    deviceName: '',
    /**
     * Chosen device id
     *
     * @type {String}
     */
    deviceID: null,
    /**
     * Global properties for current application
     *
     * @type {Object}
     */
    globalProperties: {},
    /**
     * Statusbar text
     *
     * @type {String}
     */
    statusText: '',
    /**
     * Info data
     *
     * @type: {Em.Object}
     */
    appInfo: null,
    /**
     * Current language of applications UI component
     *
     * @type {String}
     */
    UILanguage: 'EN-US',
    /**
     * Current language of applications TTS and applications VR component
     *
     * @type {String}
     */
    TTSVRLanguage: 'EN-US',
    /**
     * List of VR commands
     */
    VRCommands: [],
    /**
     * Array of Soft Buttons
     *
     * @type {Array}
     */
    softButtons: [],
    /**
     * Array of Soft Buttons
     *
     * @type {Array}
     */
    turnListSoftButtons: [],
    /**
     * Array of Objects for TBTTurnList
     *
     * @type {Array}
     */
    turnList: [],
    /**
     * Policies
     * Array of avaliable permission codes for current app
     * came from SDLCore in SDL.GetListOfPermissions response
     *
     * @type {Array}
     */
    allowedFunctions: [],
    /**
     * URL to application Icon
     *
     * @type {String}
     */
    appIcon: 'images/info/info_leftMenu_apps_ico.png',
    /**
     * Application commands list
     *
     * @type {Array}
     */
    commandsList: {
      0: []
    },
    /**
     * Flag to open ShowConstantTBTview when entering to current screen
     *
     * @type {Boolean}
     */
    tbtActivate: false,

    /**
     * @param inactiveWindows
     * @type {Array}
     * @description Created window by the current application in NONE state
     */
    inactiveWindows: [],

     /**
     * @param backgroundWindows
     * @type {Array}
     * @description Created window by the current application in not visible state
     */
    backgroundWindows: [],

    /**
     * @param activeWindows
     * @type {Array}
     * @description Created window by the current application in visible state
     */
    activeWindows: [],

    /**
     * @param defaultTemplateConfiguration
     * @type {Object}
     * @description template configuration app is registered with
     */
    defaultTemplateConfiguration: {},

    /**
     * @param templateConfiguration
     * @type {Object}
     * @description current template configuration of an app
     */
    templateConfiguration: {},

    /**
     * @param unregisteringInProgress
     * @type {Boolean}
     * @description parameter to handle an application currently is in unregistering
     *  and clearing data
     */
    unregisteringInProgress: false,

    /**
     * Setter method for navigation subscription buttons
     *
     * @return none
     */
    setNavButton: function(button, subscribe) {
      if (!this.NAV_BUTTONS[button]) {
        return;
      }
      this.NAV_BUTTONS[button].subscribed = subscribe
    },
    /**
     * Return current menu commands
     *
     * @return {Array}
     */
    currentCommandsList: function() {
      return this.get('commandsList.' + this.get('currentSubMenuId'));
    }.property('this.currentSubMenuId'),

    /**
     * Indicator where submenu was called
     */
    subMenuInitFromApp: false,

    /**
     * Current command submenu identificator
     *
     * @type {Number}
     */
    currentSubMenuId: 'top',
    /**
     * Return current submenu name
     *
     * @return {String}
     */
    currentSubMenuLabel: function() {

      //Param "top" is Top level menu index
      var submenu, commands = this.commandsList['top'];
      for (var i = 0; i < commands.length; i++) {
        if (commands[i].menuID == this.currentSubMenuId) {
          submenu = commands[i].name;
        }
      }
      return this.get('currentSubMenuId') != 'top' ? submenu : 'Options';
    }.property('this.currentSubMenuId'),
    /**
     * Interaction chooses data
     *
     * @type {Object}
     */
    interactionChoices: {},
    /**
     * Method to remove deleted by SDL Core images used in HMI
     *
     * @param imageName
     */
    onImageRemoved: function(imageName) {
      var result = false;
      // Get list of subMenus with commands
      for (var commands in this.commandsList) {

        // Check if object item (subMenu list of commands) is added list with
        // command in object and not an inherited method of object
        if (this.commandsList.hasOwnProperty(commands)) {
          var len = this.commandsList[commands].length;
          for (var i = 0; i < len; i++) {

            // Check image name with each command in each subMenu
            if (this.commandsList[commands][i].icon) {
              if (this.commandsList[commands][i].icon.indexOf(imageName) !=
                -1 &&
                imageName.length ==
                this.commandsList[commands][i].icon.length) {

                // If found same image path than set default icon path
                this.commandsList[commands][i].icon =
                  SDL.SDLModel.data.defaultListOfIcons.command;
                result = true;
              }
            }
          }
        }
      }
      return result;
    },
    /**
     * Method to refresh updated images used in HMI
     *
     * @param imageName
     */
    onPutFile: function(imageName) {
      var result = false;
      // Get list of subMenus with commands
      for (var commands in this.commandsList) {

        // Check if object item (subMenu list of commands) is added list with
        // command in object and not an inherited method of object
        if (this.commandsList.hasOwnProperty(commands)) {
          for (var i = 0; i < this.commandsList[commands].length; i++) {

            // Check image name with each command in each subMenu
            if (this.commandsList[commands][i].icon) {
              if (this.commandsList[commands][i].icon.indexOf(imageName) !=
                -1) {

                // If found same image path than set default icon path
                this.commandsList[commands][i].icon =
                  imageName + "?m=" + new Date().getTime();
                result = true;
              }
            }
          }
        }
      }
      return result;
    },
    /**
     * Update Soft Buttons will handle on command Show
     *
     * @param {Array}
     */
    updateSoftButtons: function(buttons) {

      // delete existing buttons from array
      this.softButtons.splice(0);
      // push new buttons to array
      this.get('softButtons').pushObjects(buttons);
    },
    /**
     * Add command to list
     *
     * @param {Object}
     */
    addCommand: function(request) {
      var parentID = request.params.menuParams.parentID > 0 ?
        request.params.menuParams.parentID : 'top';
      if (!this.get('commandsList.' + parentID)) {
        this.commandsList[parentID] = [];
      }
      var commands = this.get('commandsList.' + parentID);
      // Magic number is limit of 1000 commands added on one menu
      if (commands.length <= 999) {
        commands.pushObject({
          commandID: request.params.cmdID,
          name: request.params.menuParams.menuName,
          parent: parentID,
          position: request.params.menuParams.position ?
          request.params.menuParams.position : 0,
          isTemplate:request.params.cmdIcon ?
          request.params.cmdIcon.isTemplate ?request.params.cmdIcon.isTemplate : null
          : null,
          icon: request.params.cmdIcon ? request.params.cmdIcon.value : null
        });
        if (SDL.SDLController.getApplicationModel(request.params.appID) &&
          SDL.OptionsView.active) {
          SDL.SDLController.buttonsSort(parentID, this.appID);
          SDL.OptionsView.commands.refreshItems();
        }
        if(request.params.cmdIcon){
          var image = request.params.cmdIcon.value;
          var search_offset = image.lastIndexOf('.');
          str='.png';
          var isPng=image.includes(str, search_offset);
          if(!isPng){
          FFW.UI.sendUIResult(
            SDL.SDLModel.data.resultCode.WARNINGS, request.id,
            request.method
          );
          return;
        }
      }
        if (request.id >= 0) {
          FFW.UI.sendUIResult(
            SDL.SDLModel.data.resultCode.SUCCESS, request.id,
            request.method
          );
        }
      } else {
        FFW.UI.sendError(
          SDL.SDLModel.data.resultCode.REJECTED, request.id,
          request.method,
          'Adding more than 1000 item to the top menu or to submenu is not allowed.'
        );
      }
    },
    /**
     * Delete command from list
     *
     * @param {Number}
     */
    deleteCommand: function(commandID, requestID) {
      for (var i in this.commandsList) {
        if (this.commandsList[i].filterProperty(
            'commandID', commandID
          ).length) {
          if (i != this.currentSubMenuId || this.currentSubMenuId == 'top') {
            this.get('commandsList.' + i).removeObjects(
              this.get('commandsList.' + i).filterProperty(
                'commandID', commandID
              )
            );
            SDL.SDLModel.deleteCommandResponse(
              SDL.SDLModel.data.resultCode.SUCCESS, requestID
            );
            return;
          } else {
            SDL.SDLModel.deleteCommandResponse(
              SDL.SDLModel.data.resultCode['IN_USE'], requestID
            );
            return;
          }
        }
      }
    },
    /**
     * Add submenu to commands list
     *
     * @param {Object}
     */
    addSubMenu: function(request) {

      // parentID is equal to 'top' cause Top level menu ID
      var parentID = 'top';
      var commands = this.get('commandsList.' + parentID);
      // Magic number is limit of 1000 commands added on one menu
      if (commands.length <= 999) {
        this.commandsList[request.params.menuID] = [];
        commands[commands.length] = {
          menuID: request.params.menuID,
          name: request.params.menuParams.menuName ?
            request.params.menuParams.menuName : '',
          parent: 0,
          position: request.params.menuParams.position ?
            request.params.menuParams.position : 0,
          icon: request.params.menuIcon ? request.params.menuIcon.value : null
        };
        if (SDL.SDLController.getApplicationModel(request.params.appID) &&
          SDL.OptionsView.active) {
          SDL.SDLController.buttonsSort(parentID, this.appID);
          SDL.OptionsView.commands.refreshItems();
        }
        FFW.UI.sendUIResult(
          SDL.SDLModel.data.resultCode.SUCCESS, request.id,
          request.method
        );
      } else {
        FFW.UI.sendError(
          SDL.SDLModel.data.resultCode.REJECTED, request.id,
          request.method,
          'Adding more than 1000 item to the top menu or to submenu is not allowed.'
        );
      }
    },
    /**
     * Delete submenu and related commands from list
     *
     * @param {Number}
     */
    deleteSubMenu: function(menuID) {
      if (this.commandsList['top'].filterProperty('commandID', menuID)) {
        this.get('commandsList.top').removeObjects(
          this.get('commandsList.top').filterProperty('menuID', menuID)
        );
        //delete(this.commandsList[menuID]);
      }
      return SDL.SDLModel.data.resultCode.SUCCESS;
    },
    /**
     * SDL UI CreateInteraction response handeler push set of commands to
     * voice recognition list
     *
     * @param {Object}
     */
    onCreateInteraction: function(message) {
      this.interactionChoices[message.interactionChoiceSetID] =
        message.choiceSet;
    },
    /**
     * SDL UI DeleteInteraction response handeler close current interaction
     * set window (if opened) and delete current set commands from voice
     * recognition list
     *
     * @param {Object}
     */
    onDeleteInteraction: function(message) {
      delete this.interactionChoices[message.interactionChoiceSetID];
    },
    /**
     * SDL UI Slider response handeler open Slider window with received
     * parameters
     *
     * @param {Object}
     */
    onSlider: function(message) {
      SDL.SliderView.loadData(message);
      SDL.SliderView.activate(this.appName, message.params.timeout);
    },

    /**
     * @function createWindow
     * @param {Object} windowParam
     * @description Called after receiving CreateWindow request 
     */
    createWindow: function(windowParam) {
      var content = {};
      if (windowParam.duplicateUpdatesFromWindowID === 0) {
        var showStringsArray = [];
        SDL.SDLController.model.appInfo.field1 ? showStringsArray.push({
          "fieldName": "mainField1",
          "fieldText": SDL.SDLController.model.appInfo.field1
        }) : null ;

        SDL.SDLController.model.appInfo.field2 ? showStringsArray.push({
          "fieldName": "mainField2",
          "fieldText": SDL.SDLController.model.appInfo.field2
        }) : null ;

        content["showStrings"] = showStringsArray;    
        
        content["softButtons"] = this.get("softButtons").slice(0,4);

        if (SDL.SDLController.model.appInfo.mainImage) {
          content["graphic"] = {
            "value" : SDL.SDLController.model.appInfo.mainImage
          };
        } else if (SDL.SDLController.model.appInfo.trackIcon) {
          content["graphic"] = {
            "value" : SDL.SDLController.model.appInfo.trackIcon
          };
        }

        content["templateConfiguration"] = this.templateConfiguration;

        windowParam.content = content;
      } else if (windowParam.duplicateUpdatesFromWindowID && windowParam.duplicateUpdatesFromWindowID > 0) {
        var duplicateWindowID = windowParam.duplicateUpdatesFromWindowID;
        var modelToDuplicate = this.getWidgetModel(duplicateWindowID);
        windowParam.content = modelToDuplicate.content ? modelToDuplicate.content : 
                                {"templateConfiguration" : this.defaultTemplateConfiguration};
      } else {
        windowParam.content = {"templateConfiguration" : this.defaultTemplateConfiguration};
      }
      this.inactiveWindows.push(windowParam);
    },

    /**
     * @function deleteWindow
     * @param {Object} windowParam
     * @description Called after receiving DeleteWindow request 
     */
    deleteWindow: function(windowParam) {
      if(this.unregisteringInProgress) {
        return;
      }
      
      this.inactiveWindows.forEach(function(element, index, array) {
        if(element.windowID == windowParam.windowID) {
          array.splice(index,1);
          return;
        }
      });

      var self = this;
      this.backgroundWindows.forEach(function(element, index, array) {
        if(element.windowID == windowParam.windowID) {
          array.splice(index,1);
          SDL.RightSideView.getWidgetContainer().removeWidget(self.appID, windowParam.windowID);
        }
      });

      this.activeWindows.forEach(function(element, index, array) {
        if(element.windowID == windowParam.windowID) {
          array.splice(index,1);
          SDL.RightSideView.getWidgetContainer().removeWidget(self.appID, windowParam.windowID);
        }
      });
    },
    
    /**
     * @function getDuplicateWidgets
     * @param {Integer} windowID 
     * @description Get widget models that duplicate windowID
     * @return {Array} array of duplicate widgets
     */
    getDuplicateWidgets: function (windowID) {
      let duplicateWidgets = [];

      let populateDuplicateWidgets = function (element) {
        if (element.duplicateUpdatesFromWindowID === windowID) {
          duplicateWidgets.push(element);
        }
      };

      this.activeWindows.forEach(populateDuplicateWidgets);
      this.backgroundWindows.forEach(populateDuplicateWidgets);
      this.inactiveWindows.forEach(populateDuplicateWidgets);

      return duplicateWidgets;
    },
    
    /**
     * @function activateWindow
     * @param {Object} window 
     * @description Called for moving widget to active state
     */
    activateWindow: function(window) {
      if(this.unregisteringInProgress) {
        return;
      }
      var self = this;
      this.backgroundWindows.forEach(function(element, index, array) {
        if(element.windowID == window.windowID) {
          self.activeWindows.push(element);
          array.splice(index,1);
        }
      });

      this.inactiveWindows.forEach(function(element, index, array) {
        if(element.windowID == window.windowID) {
          self.backgroundWindows.push(element);
          array.splice(index,1);
        }
      });
      FFW.BasicCommunication.OnAppActivated(window.appID, window.windowID);
    },

    /**
     * @function deactivateWindow
     * @param {Object} window 
     * @description Called for moving widget to inactive state
     */
    deactivateWindow: function(window) {
      if(this.unregisteringInProgress) {
        return;
      }

      var self = this;
      this.backgroundWindows.forEach(function(element, index, array) {
        if(element.windowID == window.windowID) {
          delete element.content;
          element.content = {"templateConfiguration" : self.defaultTemplateConfiguration};
          self.inactiveWindows.push(element);
          array.splice(index,1);
        }
      });

      this.activeWindows.forEach(function(element, index, array) {
        if(element.windowID == window.windowID) {
          self.backgroundWindows.push(element);
          array.splice(index,1);
        }
      });
      FFW.BasicCommunication.OnAppDeactivated(window.appID, window.windowID);      
    },

    /**
     * @function widgetShow
     * @param {Object} params
     * @description Call after receiving request show for widgets 
     */
    widgetShow: function(params) {
      var setElementsToShow = function(element) {
        var masStringsToShow = 2;
        if(masStringsToShow < params.showStrings.length) {
          params.showStrings.length = masStringsToShow;
        }
        let currentTemplateConfiguation = element.content.templateConfiguration;
        if (!element.content.showStrings) {
          element['content']['showStrings'] = params.showStrings;
        } else {
          var mergedShowStrings = [];
          // Deep Copy
          element.content.showStrings.forEach(function(value, index, array) {
            mergedShowStrings.push(value);
          });
          // Merge existing show strings with new show request
          for(var i=0; i<params.showStrings.length; i++) {
            var newField = params.showStrings[i];
            var existingField = mergedShowStrings.find(oldField => oldField.fieldName == newField.fieldName);

            if (existingField) {
              existingField.fieldText = newField.fieldText;
            } else {
              mergedShowStrings.push(newField);
            }
          }
          element.content.showStrings = mergedShowStrings;
        }
        
        if('softButtons' in params) {
          var maxSoftButtonsToShow = 4;
          if(maxSoftButtonsToShow < params.softButtons.length) {
            params.softButtons.length = maxSoftButtonsToShow;
          }
          element['content']['softButtons'] =  params.softButtons;
        } else {
          delete element.softButtons;
        }
        if('graphic' in params) {
          element['content']['graphic'] = params.graphic;
        }
        if('templateConfiguration' in params) {
          element['content']['templateConfiguration'] = params.templateConfiguration;
        } else {
          element['content']['templateConfiguration'] = currentTemplateConfiguation;
        }
      }

      let getWindowIDToApplyShow = function(params, element) {
        let windowID = "windowID" in params ? params.windowID : 0;
        if(windowID === element.windowID ||
            windowID === element.duplicateUpdatesFromWindowID) {
          return element.windowID;
        }

        return null;
      };

      this.inactiveWindows.forEach(element => {
        let windowID = getWindowIDToApplyShow(params, element);
        if(windowID) {
          setElementsToShow(element);
          SDL.RightSideView.getWidgetContainer().updateWidgetContent(this, windowID);
        }
      });

      this.backgroundWindows.forEach(element => {
        let windowID = getWindowIDToApplyShow(params, element);
        if(windowID) {
          setElementsToShow(element);
          SDL.RightSideView.getWidgetContainer().updateWidgetContent(this, windowID);
        }
      });

      this.activeWindows.forEach(element => {
        let windowID = getWindowIDToApplyShow(params, element);
        if(windowID) {
          setElementsToShow(element);
          SDL.RightSideView.getWidgetContainer().updateWidgetContent(this, windowID);
        }
      });
    },

    /**
     * @function getWidgetModel
     * @param {Number} windowID
     * @returns {Object} 
     * @description Returns widget model for current app by the windowID 
     */
    getWidgetModel: function(windowID) {
      var elementToReturn = null;
      this.inactiveWindows.forEach(element => {
        if(windowID == element.windowID) {
          elementToReturn = element;
        }
      });

      this.backgroundWindows.forEach(element => {
        if(windowID == element.windowID) {
          elementToReturn = element;
        }
      });

      this.activeWindows.forEach(element => {
        if(windowID == element.windowID) {
          elementToReturn = element;
        }
      });
      return elementToReturn;
    },

    /**
     * @function removeWidgets
     * @description Clear all widget after disconected app
     */
    removeWidgets: function() {
      this.inactiveWindows.forEach(element => {
          SDL.RightSideView.getWidgetContainer().removeWidget(this.appID, element.windowID);
      });
      this.inactiveWindows.length = 0;

      this.backgroundWindows.forEach(element => {
          SDL.RightSideView.getWidgetContainer().removeWidget(this.appID, element.windowID);
      });
      this.backgroundWindows.length = 0;

      this.activeWindows.forEach(element => {
          SDL.RightSideView.getWidgetContainer().removeWidget(this.appID, element.windowID);
      });
      this.activeWindows.length = 0;
    },

  }
);
