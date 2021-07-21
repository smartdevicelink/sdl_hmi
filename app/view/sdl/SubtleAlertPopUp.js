/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
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
 * @name SDL.SubtleAlertPopUp
 * @desc SubtleAlertPopUp module visual representation
 * @category View
 * @filesource app/view/sdl/SubtleAlertPopUp.js
 * @version 1.0
 */

SDL.SubtleAlertPopUp = Em.ContainerView.create(
    {
        elementId: 'SubtleAlertPopUp',
        classNames: 'SubtleAlertPopUp',
        classNameBindings: [
            'active:SubtleAlertActive'
        ],
        childViews: [
            'image',
            'messages',
            'softbuttons'
        ],
        /**
         * Id of current request
         *
         * @type {Number}
         */
        defaultTimeout: 30000,
        alertRequestId: null,
        appID: null,
        content1: '',
        content2: '',
        active: false,
        timer: null,
        timeout: null,
        ttsTimer: null,
        ttsTimeout: null,
        endTime: null,
        reason: '',
        message: undefined,

        /**
         * Warning image on Subtle Alert PopUp
         */
        image: Em.View.extend(
            {
                elementId: 'subtleAlertPopUpImage',
                classNames: 'subtleAlertPopUpImageContainer',
                template: Ember.Handlebars.compile(
                    '<img class="subtleAlertPopUpImage" \
              onerror="SDL.SubtleAlertPopUp.imageUndefined(event)"\
              onload="SDL.SubtleAlertPopUp.imageLoaded(event)"\
              {{bindAttr src="SDL.SubtleAlertPopUp.icon"}}>'
                )
            }
        ),
        /**
         * @function imageUndefined
         * @param {Object} event
         * @description action if an image is undefined.
         */
        imageUndefined: function (event) {
            event.target.style.display = 'none';
            this.message = "Requested image(s) not found";
            this.reason = "WARNINGS"
        },
        /**
         * @function imageLoaded
         * @param {Object} event
         * @description action if an image is loaded.
         */
        imageLoaded: function (event) {
            event.target.style.display = 'block';
        },
        messages: Em.ContainerView.extend(
            {
                childViews: [
                    'message1',
                    'message2'
                ],
                classNames: 'messages',
                message1: SDL.Label.extend(
                    {
                        elementId: 'message1',
                        classNames: 'message1',
                        contentBinding: 'parentView.parentView.content1'
                    }
                ),
                message2: SDL.Label.extend(
                    {
                        elementId: 'message2',
                        classNames: 'message2',
                        contentBinding: 'parentView.parentView.content2'
                    }
                )
            }
        ),
        /**
         * Deactivate PopUp
         */
        deactivate: function (reason, info) {
            this.set('active', false);
            clearTimeout(this.timer);
            this.set('endTime', null);
            this.set('content1', '');
            this.set('content2', '');
            if ((reason == 'timeout' &&
                this.softbuttons.buttons._childViews.length > 0) ||
                reason === 'ABORTED') {
                SDL.SDLController.subtleAlertResponse(
                    SDL.SDLModel.data.resultCode.ABORTED, this.alertRequestId, info
                );
            } else if (reason === 'WARNINGS' ||
                this.reason === 'WARNINGS') {
                info = info ? info : this.message;
                SDL.SDLController.subtleAlertResponse(
                    SDL.SDLModel.data.resultCode.WARNINGS, this.alertRequestId, info
                );
            } else {
                SDL.SDLController.subtleAlertResponse(
                    SDL.SDLModel.data.resultCode.SUCCESS, this.alertRequestId, info
                );
            }
            SDL.SDLController.onSystemContextChange();
            SDL.SDLModel.data.registeredApps.forEach(app => {
              app.activeWindows.forEach(widget => {
                SDL.SDLController.onSystemContextChange(app.appID, widget.windowID);
              });
            });
        },
        /**
         * Container for softbuttons
         */
        softbuttons: Em.ContainerView.extend(
            {
                childViews: [
                    'buttons'
                ],
                classNames: 'buttons',
                buttons: Em.ContainerView.extend(
                    {
                        elementId: 'subtleAlertSoftButtons',
                        classNames: 'subtleAlertSoftButtons'
                    }
                )
            }
        ),
        /**
         * @desc Function creates Soft Buttons on SubtleAlertPopUp
         * @param {Object} params
         */
        addSoftButtons: function (params, appID) {
            this.softbuttons.buttons.removeAllChildren();
            this.softbuttons.buttons.rerender();
            if (params) {
                var softButtonsClass;
                switch (params.length) {
                    case 1:
                        softButtonsClass = 'oneSubtle';
                        break;
                    case 2:
                        softButtonsClass = 'twoSubtle';
                        break;
                }
                for (var i = 0; i < params.length; i++) {
                    this.get('softbuttons.buttons.childViews')
                        .pushObject(
                            SDL.Button.create(
                                SDL.PresetEventsCustom, {
                                systemAction: params[i].systemAction,
                                groupName: 'SubtleAlertPopUp',
                                classNameBindings: ['isHighlighted:isHighlighted',
                                    'getCurrentDisplayModeClass'],
                                getCurrentDisplayModeClass: function () {
                                    return SDL.ControlButtons.getCurrentDisplayModeClass(
                                        SDL.ControlButtons.imageMode.selection);
                                }.property('SDL.ControlButtons.imageMode.selection'),
                                isHighlighted: params[i].isHighlighted ? true : false,
                                softButtonID: params[i].softButtonID,
                                icon: params[i].image ? params[i].image.value : '',
                                text: params[i].text,
                                classNames: 'softButton ' + softButtonsClass,
                                elementId: 'softButton' + i,
                                templateName: params[i].image ? params[i].image.isTemplate ? 'subtleOverlay' : 'subtle' : 'text',
                                appID: appID
                            }
                            )
                        );
                }
            }
        },
        SubtleAlertActive: function (message, alertRequestId) {
            var self = this;
            this.set('alertRequestId', alertRequestId);
            this.set('cancelID', message.cancelID);
            this.set('reason', 'timeout');
            this.set('message', undefined);
            this.addSoftButtons(message.softButtons, message.appID);
            this.set('appID', message.appID);
            this.set('icon', message.alertIcon ? message.alertIcon.value : "images/sdl/Warning.png");
            for (var i = 0; i < message.alertStrings.length; i++) {
                switch (message.alertStrings[i].fieldName) {
                    case 'subtleAlertText1':
                    {
                        this.set('content1', message.alertStrings[i].fieldText);
                        break;
                    }
                    case 'subtleAlertText2':
                    {
                        this.set('content2', message.alertStrings[i].fieldText);
                        break;
                    }
                }
            }
            this.set('active', true);
            this.setTimerUI(message.duration ? message.duration : this.defaultTimeout);
        },

        /*
        * function setTimerTTS. Sets the active timer of the view for TTS RPC
        */
        setTimerTTS: function(time){},
  
        /*
        * function setTimerUI. Sets the active timer of the view for UI RPC
        */
        setTimerUI: function(time){
            var self = SDL.SubtleAlertPopUp;
            self.set('timeout', time);
            clearTimeout(self.timer);
            self.timer = setTimeout(
            function() {
                self.set('active', false);
                clearTimeout(self.timer);
                self.set('content1', '');
                self.set('content2', '');
          }, self.timeout
        );
        }
    }
);
