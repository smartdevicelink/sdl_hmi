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
 * @name SDL.ScrollableMessage
 * @desc ScrollableMessage module visual representation
 * @category View
 * @filesource app/view/sdl/shared/scrollableMessage.js
 * @version 1.0
 */

SDL.ScrollableMessage = SDL.SDLAbstractView.create(
  {
    elementId: 'ScrollableMessage',
    classNames: 'ScrollableMessage',
    classNameBindings: [
      'active:active'
    ],
    /**
     * Id of current request
     *
     * @type {Number}
     */
    messageRequestId: null,
    active: false,
    appID: null,
    timer: null,
    timeout: null,
    endTime: null,
    areAllImagesValid: true,
    validationMessage: null,
    childViews: [
      'backButton', 'captionText', 'softButtons', 'listOfCommands'
    ],
    imageModeChanged: function() {
      this.get('softButtons').setMode(SDL.SDLModel.data.imageMode);
    }.observes('SDL.SDLModel.data.imageMode'),
    /**
     * Deactivate View
     *
     * @param {Object} ABORTED Parameter to indicate status for
     *            UI.ScrollableMessageResponse
     */
    deactivate: function(ABORTED) {
      clearTimeout(this.timer);
      this.set('endTime', null);
      this.set('active', false);
      this.softButtons.set('page', 0);
      this.timeout = null;

      let calculate_result_code = function(areAllImagesValid) {
        if (ABORTED) {
          return SDL.SDLModel.data.resultCode.ABORTED;
        }

        if (!areAllImagesValid) {
          return SDL.SDLModel.data.resultCode.WARNINGS;
        }

        return SDL.SDLModel.data.resultCode.SUCCESS;
      };

      SDL.SDLController.scrollableMessageResponse(
        calculate_result_code(this.areAllImagesValid), this.validationMessage, this.messageRequestId
      );
      SDL.SDLController.onSystemContextChange();
      SDL.SDLModel.data.registeredApps.forEach(app => {
        app.activeWindows.forEach(widget => {
          SDL.SDLController.onSystemContextChange(app.appID, widget.windowID);
        })
      })
    },

    activate: function(appName, params, messageRequestId) {
      if (appName) {
        var self = this;
        if (params.messageText.fieldName == 'scrollableMessageBody') {
          this.set('listOfCommands.items', params.messageText.fieldText);
        }

        this.set('messageRequestId', messageRequestId);
        this.set('areAllImagesValid', true);
        this.set('validationMessage', null);
        this.set('captionText.content', appName);
        this.softButtons.addItems(params.softButtons, params.appID);
        this.set('active', true);
        this.set('cancelID', params.cancelID);
        clearTimeout(this.timer);
        this.timeout = params.timeout;
        this.set('endTime', Date.now() + this.timeout);
        this.timer = setTimeout(
          function() {
            self.deactivate();
          }, params.timeout
        );

        if(params.softButtons) {
          var imageList = [];
          for(var i = 0; i < params.softButtons.length; i++) {
            if(params.softButtons[i].image) {
              imageList.push(params.softButtons[i].image);
            }
          }
          var that = this;
          var callback = function(failed, info) {
            that.set('areAllImagesValid', !failed);
            that.set('validationMessage', info);
          };

          SDL.SDLModel.validateImages(messageRequestId, callback, imageList);
        }
      }
    },
    softButtons: SDL.MenuList.extend(
      {
        itemsOnPage: 4,
        groupName: 'ScrollableMessage',
        content: Em.ContainerView.extend(
          {
            classNames: [
              'content'
            ],
            attributeBindings: [
              'parentView.contentPositon:style'
            ]
          }
        )
      }
    ),
    /**
     * List for option on SDLOptionsView screen
     */
    listOfCommands: SDL.ScrollableText.extend(
      {
        elementId: 'scrollable_message_list',
        itemsOnPage: 11,
        /** Items array */
        items: 'asdasdasd',
        /**
         * Reset timeout function
         */
        click: function() {
          var self = this._parentView;
          clearTimeout(this._parentView.timer);
          SDL.SDLController.onResetTimeout(
            SDL.SDLController.model.appID, 'UI.ScrollableMessage'
          );
          this._parentView.timer = setTimeout(
            function() {
              self.deactivate();
            }, this._parentView.timeout
          );
        }
      }
    )
  }
);
