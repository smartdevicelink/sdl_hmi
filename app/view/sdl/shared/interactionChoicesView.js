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
 * @name SDL.InteractionChoicesView
 * @desc Interaction Choices visual representation
 * @category View
 * @filesource app/view/sdl/shared/interactionChoicesView.js
 * @version 1.0
 */

SDL.InteractionChoicesView = SDL.SDLAbstractView.create(
  {
    elementId: 'perform_interaction_view',
    childViews: [
      'backButton',
      'captionText',
      'listOfChoices',
      'input',
      'listWrapper'
    ],
    requestID: 0,
    didInsertElement: function() {
      SDL.SDLModel.data.interactionListWrapper = new iScroll(
        'listWrapper', {
          hideScrollbar: false,
          hScrollbar: true,
          vScrollbar: true,
          hScroll: true,
          vScroll: true
        }
      );
    },
    backButton: SDL.Button.extend(
      {
        classNames: [
          'back-button'
        ],
        target: 'SDL.SDLController',
        action: 'InteractionChoicesDeactivate',
        icon: 'images/media/ico_back.png',
        onDown: false
      }
    ),
    input: Ember.TextArea.extend(
      {
        classNameBindings: ['this.parentView.search::hide'],
        tagName: 'input',
        attribute: ['type:text'],
        attributeBindings: ['disabled'],
        disabled: false,
        click: function() {
          SDL.SDLModel.uiShowKeyboard(this);
        },
        search: function() {
          FFW.UI.OnKeyboardInput(
            SDL.SDLModel.data.keyboardInputValue, 'ENTRY_SUBMITTED'
          );
          this.get('parentView').deactivate('SUCCESS');
        }
      }
    ),
    listWrapper: Em.ContainerView.extend(
      {
        classNameBindings: ['this.parentView.icon::hide'],
        elementId: 'listWrapper',
        classNames: 'listWrapper',
        childViews: [
          'naviChoises'
        ],
        click: function() {
          if (this._parentView.active) {
            SDL.ResetTimeoutPopUp.resetTimeoutSpecificRpc('UI.PerformInteraction');
          }
          SDL.ResetTimeoutPopUp.DeactivatePopUp();
        },
        naviChoises: Em.ContainerView.extend(
          {
            classNames: 'naviChoises',
            childViews: [
              'captionText'
            ],
            captionText: SDL.Label.extend(
              {
                classNameBindings: ['this.parentView.search:hide'],
                classNames: ['caption-text'],
                contentBinding: 'this.parentView.caption'
              }
            )
          }
        )
      }
    ),
    captionText: SDL.Label.extend(
      {
        classNameBindings: ['this.parentView.search:hide'],
        classNames: ['caption-text'],
        contentBinding: 'this.parentView.caption'
      }
    ),
    listOfChoices: SDL.List.extend(
      {
        classNameBindings: ['this.parentView.list::hide'],
        elementId: 'perform_interaction_view_list',
        itemsOnPage: 5,
        items: [],
        click: function() {
          if (this._parentView.active) {
            SDL.ResetTimeoutPopUp.resetTimeoutSpecificRpc('UI.PerformInteraction');
          }
        }
      }
    ),
    timeout: null,
    endTime: null,
    search: false,
    list: false,
    icon: false,
    areAllImagesValid: true,
    imagesValidationInfo: null,
    /**
    /**
     * Id of app initiated performInteraction request
     */
    appID: null,
    /**
     * Activate window and set caption text
     *
     * @param text: String
     */
    activate: function(message) {
      this.clean();
      if (message.params && message.params.initialText) {
        this.set('caption', message.params.initialText.fieldText);
      }
      this.appID = message.params.appID;
      this.requestID = message.id;
      this.set('areAllImagesValid', true);
      this.set('imagesValidationInfo', null);
      if (message.params.interactionLayout) {
        switch (message.params.interactionLayout) {
          case 'ICON_ONLY' :
          {
            this.preformChoicesNavigation(
              message.params.choiceSet, message.params.timeout
            );
            this.set('search', false);
            this.set('list', false);
            this.set('icon', true);
            this.set('active', true);
            break;
          }
          case 'ICON_WITH_SEARCH' :
          {
            this.preformChoicesNavigation(
              message.params.choiceSet, message.params.timeout
            );
            this.set('icon', true);
            this.set('search', true);
            this.set('list', false);
            this.set('active', true);
            break;
          }
          case 'LIST_ONLY' :
          {
            this.preformChoices(
              message.params.choiceSet, message.params.timeout
            );
            this.set('list', true);
            this.set('icon', false);
            this.set('search', false);
            this.set('active', true);
            break;
          }
          case 'LIST_WITH_SEARCH' :
          {
            this.preformChoices(
              message.params.choiceSet, message.params.timeout
            );
            this.set('list', true);
            this.set('search', true);
            this.set('icon', false);
            this.set('active', true);
            break;
          }
          case 'KEYBOARD' :
          {
            this.preformChoices(null, message.params.timeout);
            SDL.SDLModel.uiShowKeyboard(this.input);
            this.set('list', false);
            this.set('search', false);
            this.set('icon', false);
            // this.set('active', true);
            break;
          }
          default:
          {
            // default action
          }
        }
      } else {
        if (message.params.choiceSet) {
          this.preformChoices(message.params.choiceSet, message.params.timeout);
          this.set('list', true);
          this.set('icon', false);
          this.set('search', false);
          this.set('active', true);
        }
      }
    },
    /**
     * Deactivate window
     */
    deactivate: function(result, choiceID) {
      if (!this.appID) {
        return;
      }
      if (SDL.SDLModel.data.performInteractionSession.length > 0 &&
        result != 'ABORTED') {
      } else {
        this.set('endTime', null);
        this.set('active', false);
        SDL.SDLController.VRMove();
        SDL.Keyboard.deactivate();

        if (!this.areAllImagesValid && result == 'SUCCESS') {
          result = 'WARNINGS';
        }

        switch (result) {
          case 'ABORTED':
          {
            SDL.SDLController.interactionChoiseCloseResponse(
              this.appID, SDL.SDLModel.data.resultCode['ABORTED'],
              null, null, "UI.PerformInteraction has been aborted"
            );
            SDL.ResetTimeoutPopUp.stopRpcProcessing('UI.PerformInteraction',false,false);
            break;
          }
          case 'TIMED_OUT':
          {
            SDL.SDLController.interactionChoiseCloseResponse(
              this.appID, SDL.SDLModel.data.resultCode['TIMED_OUT'],
              null, null, "UI.PerformInteraction has been timed out"
            );
            break;
          }
          case 'SUCCESS':
          {
            SDL.SDLController.interactionChoiseCloseResponse(
              this.appID, SDL.SDLModel.data.resultCode.SUCCESS, choiceID,
              this.input.value
            );
            SDL.ResetTimeoutPopUp.stopRpcProcessing('UI.PerformInteraction',false,false);
            break;
          }
          case 'WARNINGS':
          {
            SDL.SDLController.interactionChoiseCloseResponse(
              this.appID, SDL.SDLModel.data.resultCode.WARNINGS, choiceID,
              this.input.value, this.imagesValidationInfo
            );
            SDL.ResetTimeoutPopUp.stopRpcProcessing('UI.PerformInteraction',false,false);
            break;
          }
          default:
          {
            // default action
          }
        }
        this.appID = null;
        SDL.SDLController.onSystemContextChange();
        SDL.SDLModel.data.registeredApps.forEach(app => {
          app.activeWindows.forEach(widget => {
            SDL.SDLController.onSystemContextChange(app.appID, widget.windowID);
          })
        })
      }
    },
    /**
     * Clean choices caption and list before new proform
     */
    clean: function() {
      this.input.set('value', null);
      this.set('captionText.content', 'Interaction Choices');
      this.set('timeout', null);
      this.listOfChoices.items = [];
      this.listOfChoices.list.refresh();
      var length = this.get('listWrapper.naviChoises.childViews').length;
      for (var i = 0; i < length; i++) {
        const obj = SDL.InteractionChoicesView.get('listWrapper.naviChoises.childViews')
          .shiftObject();
        obj.destroy();
      }
    },
    /**
     * Update choises list with actual set id
     *
     * @param data:
     *            Array
     */
    preformChoices: function(data, timeout) {
      this.set('timeout', timeout);
      if (data) {
        var imageList = [];

        // temp for testing
        for (var i = 0; i < data.length; i++) {
          this.listOfChoices.items
            .push(
              {
                type: SDL.Button,
                params: {
                  text: data[i].menuName,
                  choiceID: data[i].choiceID,
                  action: 'onChoiceInteraction',
                  onDown: false,
                  target: 'SDL.SDLController',
                  templateName: data[i].image ? 'rightIcon' : 'text',
                  icon: data[i].image ? data[i].image.value : null
                }
              }
            );

          if (data[i].image) {
            imageList.push(data[i].image);
          }
        }

        var model = SDL.SDLController.getApplicationModel(this.appID);
        if (model) {
          var that = this;
          var callback = function(failed, info) {
            that.set('areAllImagesValid', !failed);
            that.set('imagesValidationInfo', info);
          };

          SDL.SDLModel.validateImages(model.activeRequests.uiPerformInteraction, callback, imageList);
        }

        this.listOfChoices.list.refresh();
      }

      var self = this;
      this.set('endTime', Date.now() + timeout);
    },
    /**
     * Update choises list with actual set id
     *
     * @param data:
     *            Array
     */
    imageMode:'',
    updateIcons:function(){
      for(var i=0;i<this.get('listWrapper.naviChoises.childViews').length;i++){
    this.get('listWrapper.naviChoises.childViews')[0].setMode(SDL.ControlButtons.imageMode.selection);}
     },
    preformChoicesNavigation: function(data, timeout) {
      this.set('timeout', timeout);
      if (data) {
        var imageList = [];

        // temp for testing
        for (var i = 0; i < data.length; i++) {
          this.get('listWrapper.naviChoises.childViews').pushObject(
            SDL.Button.create(
              {
                text: data[i].menuName,
                choiceID: data[i].choiceID,
                action: 'onChoiceInteraction',

                classNameBindings: ['isHighlighted:isHighlighted',
                   'getCurrentDisplayModeClass'],
                   getCurrentDisplayModeClass: function() {
                    return SDL.ControlButtons.getCurrentDisplayModeClass();
                  }.property('SDL.InteractionChoicesView.imageMode'),
                onDown: false,
                target: 'SDL.SDLController',
                templateName: data[i].image ? data[i].image.isTemplate ? 'rightTextOverLay' : 'rightText' : 'text',
                icon: data[i].image ? data[i].image.value : null
              }
            )
          );

          if (data[i].image) {
            imageList.push(data[i].image);
          }
        }

        var model = SDL.SDLController.getApplicationModel(this.appID);
        if (model){
          var that = this;
          var callback = function(failed, info) {
            that.set('areAllImagesValid', !failed);
            that.set('imagesValidationInfo', info);
          };

          SDL.SDLModel.validateImages(model.activeRequests.uiPerformInteraction, callback, imageList);
        }
      }

      var self = this;
      setTimeout(
        function() {
          SDL.SDLModel.data.interactionListWrapper.refresh();
        }, 0
      );
    },

    /**
     * @description Callback for display image mode change.
     */
    imageModeChanged: function() { 
      SDL.InteractionChoicesView.set('imageMode',SDL.SDLModel.data.imageMode);
      SDL.InteractionChoicesView.updateIcons();
    }.observes('SDL.SDLModel.data.imageMode')
  }
);
