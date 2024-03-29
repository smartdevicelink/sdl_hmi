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
 * @name SDL.AlertPopUp
 * @desc AlertPopUp module visual representation
 * @category View
 * @filesource app/view/sdl/AlertPopUp.js
 * @version 1.0
 */

SDL.AlertPopUp = Em.ContainerView.create(
  {
    elementId: 'AlertPopUp',
    classNames: 'AlertPopUp',
    classNameBindings: [
      'active:AlertActive'
    ],
    childViews: [
      'applicationName',
      'image',
      'message1',
      'message2',
      'message3',
      'softbuttons',
      'progressIndicatorView'
    ],
    /**
     * Id of current request
     *
     * @type {Number}
     */
    defaultTimeout: 30000,
    alertRequestId: null,
    content1: '',
    content2: '',
    content3: '',
    active: false,
    endTime: null,
    progressIndicator: false,
    isTemplateAlertIcon: false,
    reason: '',
    message: undefined,
    /**
     * Wagning image on Alert PopUp
     */
    image: Em.View.extend(
      {
        elementId: 'alertPopUpImage',
        classNameBindings: [
          'this.parentView.isTemplateAlertIcon:is-template',
          'getCurrentDisplayModeClass'          
        ],
        getCurrentDisplayModeClass: function() {
          return SDL.ControlButtons.getCurrentDisplayModeClass(
            SDL.ControlButtons.imageMode.selection);
        }.property('SDL.ControlButtons.imageMode.selection'),
        template: Ember.Handlebars.compile(
          '<img {{bindAttr class="SDL.AlertPopUp.isTemplateAlertIcon:ico-overlay"}} /> \
           <img class="alertPopUpImage" \
            onerror="SDL.AlertPopUp.imageUndefined(event)"\
            onload="SDL.AlertPopUp.imageLoaded(event)"\
            {{bindAttr src="SDL.AlertPopUp.icon.value"}}>'
        )
      }
    ),

    /**
     * @function imageUndefined
     * @param {Object} event
     * @description action if an image undefined.
     */
    imageUndefined: function(event) {
      event.target.style.display='none';
    },

    /**
     * @function imageLoaded
     * @param {Object} event
     * @description action if an image loaded.
     */
    imageLoaded: function(event) {
      event.target.style.display='block';
    },

    /**
     * Wagning image on Alert PopUp
     */
    progressIndicatorView: Em.View.extend(
      {
        elementId: 'progressIndicator',
        classNameBindings: 'this.parentView.progressIndicator:progressIndicator:inactive_state'
      }
    ),
    applicationName: SDL.Label.extend(
      {
        elementId: 'applicationName',
        classNames: 'applicationName',
        contentBinding: 'parentView.appName'
      }
    ),
    message1: SDL.Label.extend(
      {
        elementId: 'message1',
        classNames: 'message1',
        contentBinding: 'parentView.content1'
      }
    ),
    message2: SDL.Label.extend(
      {
        elementId: 'message2',
        classNames: 'message2',
        contentBinding: 'parentView.content2'
      }
    ),
    message3: SDL.Label.extend(
      {
        elementId: 'message3',
        classNames: 'message3',
        contentBinding: 'parentView.content3'
      }
    ),
    /**
     * Deactivate PopUp
     */
    deactivate: function(reason, info) {
      this.set('active', false);
      clearTimeout(this.timer);
      this.set('endTime', null);
      this.set('content1', '');
      this.set('content2', '');
      this.set('content3', '');
      if(reason !== 'timeout') {
          SDL.SDLController.TTSResponseHandler();
          SDL.ResetTimeoutPopUp.stopRpcProcessing('UI.Alert');
      }
      if ((reason == 'timeout' &&
        this.softbuttons.buttons._childViews.length > 0) ||
        reason === 'ABORTED') {
        SDL.SDLController.alertResponse(
          SDL.SDLModel.data.resultCode['ABORTED'], this.alertRequestId, info
        );
      }else if(reason=='WARNINGS' ||
            this.reason == 'WARNINGS'){
        info = info ? info : this.message;
        SDL.SDLController.alertResponse(
          SDL.SDLModel.data.resultCode.WARNINGS, this.alertRequestId, info
        );
      }else {
        SDL.SDLController.alertResponse(
          SDL.SDLModel.data.resultCode.SUCCESS, this.alertRequestId, info
        );
      }
      SDL.SDLController.onSystemContextChange();
      SDL.SDLModel.data.registeredApps.forEach(app => {
        app.activeWindows.forEach(widget => {
          SDL.SDLController.onSystemContextChange(app.appID, widget.windowID);
        })
      })
    },
    /**
     * Container for softbuttons
     */
    softbuttons: Em.ContainerView.extend(
      {
        childViews: [
          'buttons'
        ],
        buttons: Em.ContainerView.extend(
          {
            elementId: 'alertSoftButtons',
            classNames: 'alertSoftButtons'
          }
        )
      }
    ),
    /**
     * @desc Function creates Soft Buttons on AlertPoUp
     * @param {Object} params
     */
    addSoftButtons: function(params, appID) {
      this.softbuttons.buttons.removeAllChildren();
      this.softbuttons.buttons.rerender();

      var imageList = [];
      if (params) {
        var softButtonsClass;
        switch (params.length) {
          case 1:
            softButtonsClass = 'one';
            break;
          case 2:
            softButtonsClass = 'two';
            break;
          case 3:
            softButtonsClass = 'three';
            break;
          case 4:
            softButtonsClass = 'four';
            break;
        }

        for (var i = 0; i < params.length; i++) {
          if (params[i].image) {
            imageList.push(params[i].image);
          }

          this.get('softbuttons.buttons.childViews')
            .pushObject(
              SDL.Button.create(
                SDL.PresetEventsCustom, {
                  systemAction: params[i].systemAction,
                  groupName: 'AlertPopUp',
                  classNameBindings: ['isHighlighted:isHighlighted',
                  'getCurrentDisplayModeClass'],
              getCurrentDisplayModeClass: function() {
                return SDL.ControlButtons.getCurrentDisplayModeClass(
                  SDL.ControlButtons.imageMode.selection);
              }.property('SDL.ControlButtons.imageMode.selection'),
                  isHighlighted: params[i].isHighlighted ? true : false,
                  softButtonID: params[i].softButtonID,
                  icon: params[i].image ? params[i].image.value : '',
                  text: params[i].text,
                  classNames: 'list-item softButton ' + softButtonsClass,
                  elementId: 'softButton' + i,
                  templateName: params[i].image ? params[i].image.isTemplate ? 'rightTextOverLay' : 'rightText' : 'text',
                  appID: appID
                }
              )
            );
        }
      }

      imageList.push(this.icon);

        var callback = function(failed, info) {
          if (failed) {
            SDL.AlertPopUp.reason = 'WARNINGS';
            SDL.AlertPopUp.message = info;
          }
        }

      SDL.SDLModel.validateImages(this.alertRequestId, callback, imageList);
    },

    AlertActive: function(message) {
      var self = this;
      this.set('alertRequestId', message.id);
      this.set('cancelID', message.params.cancelID);
      this.set('reason', 'timeout');
      this.set('message', undefined);
      this.set('icon', message.params.alertIcon ? message.params.alertIcon : { value: "images/sdl/Warning.png" });
      this.set('isTemplateAlertIcon', message.params.alertIcon && message.params.alertIcon.isTemplate === true);
      this.addSoftButtons(message.params.softButtons, message.params.appID);
      this.set('progressIndicator', message.params.progressIndicator);
      var appModel = SDL.SDLController.getApplicationModel(message.params.appID);
      this.set('appName', appModel.appName);
      this.set('priority', appModel.priority);
      for (var i = 0; i < message.params.alertStrings.length; i++) {
        switch (message.params.alertStrings[i].fieldName) {
          case 'alertText1':
          {
            this.set('content1', message.params.alertStrings[i].fieldText);
            break;
          }
          case 'alertText2':
          {
            this.set('content2', message.params.alertStrings[i].fieldText);
            break;
          }
          case 'alertText3':
          {
            this.set('content3', message.params.alertStrings[i].fieldText);
            break;
          }
        }
      }
      this.set('active', true);
      SDL.ResetTimeoutPopUp.addRpc(
        message,
        () => {SDL.AlertPopUp.deactivate('timeout')},
        SDL.AlertPopUp.resetTimeoutCallback,
        message.params.duration || this.defaultTimeout
      );
      SDL.ResetTimeoutPopUp.ActivatePopUp();
      SDL.ResetTimeoutPopUp.setContext('UI.Alert');
    },
    /*
        * function resetTimeoutCallback.
        */
    resetTimeoutCallback: function(time){
      let self = SDL.AlertPopUp;
      self.set('endTime', Date.now() + time);
  }
  }
);
