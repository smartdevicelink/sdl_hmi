/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *  · Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *  · Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *  · Neither the name of the Ford Motor Company nor the names of its
 * contributors may be used to endorse or promote products derived from this
 * software without specific prior written permission.
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
 * @name SDL.VRPopUp
 * @desc VRPopUp module visual representation
 * @category View
 * @filesource app/view/sdl/VRPopUp.js
 * @version 1.0
 */

SDL.VRPopUp = Em.ContainerView.create(
  {
    elementId: 'VRPopUp',
    classNames: 'VRPopUp',
    classNameBindings: [
      'SDL.SDLModel.data.VRActive:active',
      'SDL.SDLModel.data.VRHelpListActivated:move'
    ],
    childViews: [
      'popUp',
      'VRLabel',
      'VRImage',
      'listOfCommands'
    ],
    VRImage: Em.View.extend(
      {
        elementId: 'VRImage',
        classNames: 'VRImage'
      }
    ),
    VRLabel: SDL.Label.extend(
      {
        elementId: 'VRLabel',
        classNames: 'VRLabel',
        content: 'Speak the command'
      }
    ),
    VRActiveBinding: 'SDL.SDLModel.data.VRActive',
    popUp: Em.View.extend(
      {
        elementId: 'popUp',
        classNames: 'popUp'
      }
    ),
    AddCommand: function(cmdID, vrCommands, appID, type, grammarID) {
      if (type == 'Application') {
        for (var i = 0; i < vrCommands.length; i++) {
          this.get('listOfCommands.list.childViews').pushObject(
            SDL.Button.create(
              {
                action: 'onActivateSDLApp',
                target: 'SDL.SDLController',
                appID: appID,
                text: vrCommands[i],
                classNames: 'list-item',
                templateName: 'text'
              }
            )
          );
        }
      } else {
        for (var j = 0; j < vrCommands.length; j++) {
          this.get('listOfCommands.list.childViews').pushObject(
            SDL.Button.create(
              {
                action: type == 'Command' ? 'onVRCommand' : 'VRPerformAction',
                target: 'SDL.SDLController',
                appID: appID,
                grammarID: grammarID,
                commandID: cmdID,
                text: vrCommands[j],
                type: type,
                hideButtons: function() {
                  if (this.type == 'Command' &&
                    SDL.SDLModel.data.performInteractionSession.length == 0) {
                    return false;
                  } else if (SDL.SDLModel.data.performInteractionSession &&
                    SDL.SDLModel.data.performInteractionSession.indexOf(
                      this.grammarID
                    ) >= 0) {
                    return false;
                  } else {
                    return true;
                  }
                }.property('SDL.SDLModel.data.performInteractionSession'),
                classNameBindings: ['this.hideButtons:hide'],
                classNames: 'list-item',
                templateName: 'text'
              }
            )
          );
        }
      }
    },
    updateVR: function() {
      this.listOfCommands.list.removeAllChildren();
      this.listOfCommands.list.refresh();
      var len = SDL.SDLModel.data.VRCommands.length;
      for (var i = 0; i < len; i++) {
        this.AddCommand(
          SDL.SDLModel.data.VRCommands[i].cmdID,
          SDL.SDLModel.data.VRCommands[i].vrCommands,
          SDL.SDLModel.data.VRCommands[i].appID,
          SDL.SDLModel.data.VRCommands[i].type
        );
      }
      if (SDL.SDLController.model) {
        len = SDL.SDLController.model.VRCommands.length;
        for (var i = 0; i < len; i++) {
          this.AddCommand(
            SDL.SDLController.model.VRCommands[i].cmdID,
            SDL.SDLController.model.VRCommands[i].vrCommands,
            SDL.SDLController.model.VRCommands[i].appID,
            SDL.SDLController.model.VRCommands[i].type,
            SDL.SDLController.model.VRCommands[i].grammarID
          );
        }
      }
      if (SDL.SDLModel.data.stateLimited) {
        len = SDL.SDLController.getApplicationModel(
          SDL.SDLModel.data.stateLimited
        ).VRCommands.length;
        for (var i = 0; i < len; i++) {
          this.AddCommand(
            SDL.SDLController.getApplicationModel(
              SDL.SDLModel.data.stateLimited
            ).VRCommands[i].cmdID,
            SDL.SDLController.getApplicationModel(
              SDL.SDLModel.data.stateLimited
            ).VRCommands[i].vrCommands,
            SDL.SDLController.getApplicationModel(
              SDL.SDLModel.data.stateLimited
            ).VRCommands[i].appID,
            SDL.SDLController.getApplicationModel(
              SDL.SDLModel.data.stateLimited
            ).VRCommands[i].type,
            SDL.SDLController.getApplicationModel(
              SDL.SDLModel.data.stateLimited
            ).VRCommands[i].grammarID
          );
        }
      }
      var apps = SDL.SDLModel.data.registeredApps;
      for (var i = 0; i < apps.length; i++) {
        if (apps[i].level == 'LIMITED') {
          var commands = apps[i].VRCommands;
          for (var j = 0; j < commands.length; j++) {
            this.AddCommand(
              commands[j].cmdID,
              commands[j].vrCommands,
              commands[j].appID,
              commands[j].type,
              commands[j].grammarID
            );
          }
        }
      }
    }.observes('SDL.SDLController.model'),
    DeleteCommand: function(commandID, appID) {
      if (commandID != 0) {
        var t = this.get('listOfCommands.list.childViews').filterProperty(
          'commandID', commandID
        );
        for (var i = 0; i < t.length; i++) {
          t[i].remove();
          t[i].destroy();
        }
      } else {
        var t = this.get('listOfCommands.list.childViews').filterProperty(
          'appID', appID
        );
        for (var i = 0; i < t.length; i++) {
          t[i].remove();
          t[i].destroy();
        }
      }
    },
    DeleteActivateApp: function(appID) {
      var t = this.get('listOfCommands.list.childViews').filterProperty(
        'appID', appID
      );
      for (var i = 0; i < t.length; i++) {
        t[i].remove();
        t[i].destroy();
      }
    },
    /**
     * List for option on SDLOptionsView screen
     */
    listOfCommands: SDL.List.extend(
      {
        elementId: 'VR_list',
        itemsOnPage: 5,
        /** Items array */
        items: [
          {
            type: SDL.Button,
            params: {
              //templateName: template,
              text: 'Help',
              target: 'SDL.SDLController',
              action: 'vrHelpAction',
              onDown: false
            }
          }
        ]
      }
    ),
    // deactivate VR on change application state
    onStateChange: function() {
      if (this.VRActive) {
        FFW.VR.Started();
        this.set('VRActive', false);
      } else {
        FFW.VR.Stopped();
      }
    }.observes('SDL.TransitionIterator.ready'),
    onActivate: function() {
      SDL.SDLController.VRMove();
      if (this.VRActive) {
        FFW.VR.Started();
        SDL.SDLController.onSystemContextChange();
        SDL.SDLModel.data.registeredApps.forEach(app => {
          app.activeWindows.forEach(widget => {
            SDL.SDLController.onSystemContextChange(app.appID, widget.windowID);
          })
        })
      } else {
        FFW.VR.Stopped();
        SDL.SDLController.onSystemContextChange();
        SDL.SDLModel.data.registeredApps.forEach(app => {
          app.activeWindows.forEach(widget => {
            SDL.SDLController.onSystemContextChange(app.appID, widget.windowID);
          })
        })
      }
    }.observes('this.VRActive'),
    /**
     * This event triggered when component is placed to
     * document DOM structure
     */
    didInsertElement: function() {
      this._super();
    }
  }
);
