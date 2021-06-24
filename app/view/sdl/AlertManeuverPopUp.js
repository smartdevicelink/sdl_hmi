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
 * @name SDL.AlertManeuverPopUp
 * @desc AlertManeuverPopUp module visual representation
 * @category View
 * @filesource app/view/sdl/AlertManeuverPopUp.js
 * @version 1.0
 */

SDL.AlertManeuverPopUp = Em.ContainerView.create(
  {
    elementId: 'AlertManeuverPopUp',
    classNames: 'AlertManeuverPopUp',
    classNameBindings: [
      'activate:AlertManeuverActive'
    ],
    childViews: [
      'applicationName',
      // 'image',
      // 'message1',
      // 'message2',
      // 'message3',
      'softbuttons'
    ],
    content1: 'Title',
    content2: 'Text',
    activate: false,
    endTime: null,
    timer: null,
    ttsTimeout: 5000,
    defaultTimeout: 5000,
    timeout: 5000,    
    alertManeuerRequestId: 0,
    /**
     * @desc Defines whether icons paths verified successfully.
     */
    iconsAreValid: false,
    /**
     * @desc Defines info message if validation is failed
     */
    infoMessage: null,
    /**
     * Wagning image on Alert Maneuver PopUp
     */
    image: Em.View.extend(
      {
        elementId: 'alertManeuverPopUpImage',
        classNames: 'alertManeuverPopUpImage'
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
     * Container for softbuttons
     */
    softbuttons: Em.ContainerView.extend(
      {
        childViews: [
          'buttons'
        ],
        buttons: Em.ContainerView.extend(
          {
            elementId: 'alertManeuverSoftButtons',
            classNames: 'alertManeuverSoftButtons'
          }
        )
      }
    ),
    /**
     * Close button
     */
    closeButton: SDL.Button.create(
      {
        text: 'Close',
        classNames: 'closeButton softButton',
        classNameBindings: [
          'SDL.AlertManeuverPopUp.isCloseButtonVisible::inactive_state'],
        actionUp: function() {
          this._super();
          SDL.SDLController.closeAlertMeneuverPopUp();
        },
        templateName: 'text'
      }
    ),

    /**
     * @description Callback for display image mode change.
     */
    imageModeChanged: function() {
      var items = this.get('softbuttons.buttons.childViews');
      for (var i = 0; i < items.length; ++i) {
          var button = items[i];
          button.setMode(SDL.SDLModel.data.imageMode);
      }
    }.observes('SDL.SDLModel.data.imageMode'),

    /**
     * @desc Function creates Soft Buttons on AlertPoUp
     * @param {Object} params
     */
    addSoftButtons: function(params) {
      const softButtons = params.softButtons;
      if (!softButtons || softButtons.length == 0) {
        this.get('softbuttons.buttons.childViews').pushObject(this.closeButton);
        return;
      }

      var softButtonsClass;
      switch (softButtons.length) {
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

      let is_template = function(image) {
        return image != null && image.isTemplate;
      }

      let get_template_type = function(button_type, image) {
        switch (button_type) {
          case "IMAGE":
            return is_template(image) ? "iconOverlay" : "icon";

          case "BOTH":
            return is_template(image) ? "rightTextOverLay" : "rightText";
        }

        return "text";
      }

      var imageList = [];
      for (var i = 0; i < softButtons.length; i++) {
        if (softButtons[i].image) {
          imageList.push(softButtons[i].image);
        }

        this.get('softbuttons.buttons.childViews').pushObject(
          SDL.Button.create(
            SDL.PresetEventsCustom, {
              softButtonID: softButtons[i].softButtonID,
              icon: softButtons[i].image ? softButtons[i].image.value : '',
              text: softButtons[i].text,
              groupName: 'AlertManeuverPopUp',
              classNames: 'list-item softButton ' + softButtonsClass,
              elementId: 'softButton' + i,
              classNameBindings: ['isHighlighted:isHighlighted',
                  'getCurrentDisplayModeClass'],

              getCurrentDisplayModeClass: function() {
                return SDL.ControlButtons.getCurrentDisplayModeClass();
              }.property('SDL.ControlButtons.imageMode.selection'),

              isHighlighted: softButtons[i].isHighlighted,
              templateName: get_template_type(softButtons[i].type, softButtons[i].image),
              systemAction: softButtons[i].systemAction,
              appID: params.appID
            }
          )
        );
      }

      var callback = function(failed, info) {
        SDL.AlertManeuverPopUp.iconsAreValid = !failed;
        SDL.AlertManeuverPopUp.infoMessage = info;
      }

      SDL.SDLModel.validateImages(this.alertManeuerRequestId, callback, imageList);
    },
    /**
     * Deactivate PopUp
     */
    deactivate: function(message) {
      if (SDL.TTSPopUp.active) {
        SDL.TTSPopUp.DeactivateTTS();
      }

      const resultCode = this.iconsAreValid ?
        SDL.SDLModel.data.resultCode.SUCCESS : SDL.SDLModel.data.resultCode.WARNINGS;
      
      if(!message) {
        if (SDL.ResetTimeoutPopUp.resetTimeoutRPCs.includes('TTS.Speak')) {
          SDL.SDLController.TTSResponseHandler();
          SDL.ResetTimeoutPopUp.resetTimeoutRPCs.removeObject('TTS.Speak');
        } 
      }
      FFW.Navigation.sendNavigationResult(
        resultCode,
        this.alertManeuerRequestId,
        'Navigation.AlertManeuver',
        this.infoMessage
      );
      this.set('activate', false );
      this.set('alertManeuerRequestId', 0);
      
      SDL.ResetTimeoutPopUp.resetTimeoutRPCs.removeObject('Navigation.AlertManeuver');      

      if(0 == SDL.ResetTimeoutPopUp.resetTimeoutRPCs.length) {
        SDL.ResetTimeoutPopUp.DeactivatePopUp();
      }
      this.set('timeout', this.defaultTimeout);
      this.set('ttsTimeout', this.defaultTimeout);
    },

    AlertManeuverActive: function(message) {
      this.softbuttons.buttons.removeAllChildren();
      this.softbuttons.buttons.rerender();

      this.set('iconsAreValid', true);
      this.set('infoMessage', null);
      this.set('alertManeuerRequestId', message.id);
      this.addSoftButtons(message.params);

      this.set('activate', true );
    },

    /*
     * function setTimerUI. Sets the active timer of the view for UI RPC
     */
    setTimerUI: function(time){
      var self = SDL.AlertManeuverPopUp;
      self.set('timeout', time);
      clearTimeout(self.timer);
      self.timer = setTimeout(
        function() {
          self.set('active', false);
          clearTimeout(self.timer);
          self.set('content1', '');
          self.set('content2', '');
          self.set('content3', '');
        }, self.timeout
      );
    },

    /*
     * function setTimerTTS. Sets the active timer of the view for TTS RPC
     */
    setTimerTTS: function(time){
      var self = SDL.AlertManeuverPopUp;
      self.set('ttsTimeout', time);
      clearTimeout(self.ttsTimer);
      self.ttsTimer = setTimeout(
        function() {
          clearTimeout(self.ttsTimer);
        }, self.ttsTimeout
      );
    },

  }
);
