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
 * @name SDL.ExitApp
 * @desc Exit All Applications reason select visual representation
 * @category View
 * @filesource app/view/sdl/ExitAppView.js
 * @version 1.0
 */

SDL.ExitApp = Em.ContainerView.create(
  {
    elementId: 'exitAppView',
    classNames: 'exitAppView',
    classNameBindings: [
      'active'
    ],
    childViews: [
      'exitAppViewLabel',
      'exitAppViewTitle',
      'exitAppViewSelect',
      'onAwakeSDLLabel',
      'onAwakeSDLButton',
      'onDeactivateSelect',
      'onDeactivateLabel',
      'mqSignalLabel',
      'mqSignalSelect',
      'sendAppStateButton',
      'sendMQSignalButton'
    ],
    /**
     * Title of VehicleInfo PopUp view
     */
    exitAppViewLabel: SDL.Label.extend(
      {
        elementId: 'exitAppViewLabel',
        classNames: 'exitAppViewLabel',
        content: 'Exit Application'
      }
    ),
    /**
     * Property indicates the activity state of TBTClientStateView
     */
    active: false,
    /**
     * Title of tbtClientState group of parameters
     */
    exitAppViewTitle: SDL.Label.extend(
      {
        elementId: 'exitAppViewTitle',
        classNames: 'exitAppViewTitle',
        content: 'Exit Application reason'
      }
    ),
    /**
     * Title of MQ signal PopUp view
     */
    mqSignalLabel: SDL.Label.extend(
      {
        elementId: 'mqSignalLabel',
        classNames: 'mqSignalLabel',
        content: 'MQ Signal'
      }
    ),
    /**
     * HMI element Select with parameters of MQ signal states
     */
    mqSignalSelect: Em.Select.extend(
      {
        elementId: 'mqSignalSelect',
        classNames: 'mqSignalSelect',
        contentBinding: 'SDL.SDLModel.data.mqSignals',
        optionValuePath: 'content.id',
        optionLabelPath: 'content.name'
      }
    ),
    /**
     * HMI element Select with parameters of TBTClientStates
     */
    exitAppViewSelect: Em.Select.extend(
      {
        elementId: 'exitAppViewSelect',
        classNames: 'exitAppViewSelect',
        contentBinding: 'SDL.SDLModel.data.exitAppState',
        optionValuePath: 'content.id',
        optionLabelPath: 'content.name'
      }
    ),
    onAwakeSDLLabel: SDL.Label.extend(
      {
        elementId: 'onAwakeSDLLabel',
        classNames: 'onAwakeSDLLabel',
        content: 'onAwakeSDL notification send'
      }
    ),
    onAwakeSDLButton: SDL.Button.extend(
      {
        classNames: 'button onAwakeSDLButton',
        text: 'Send onAwakeSDL',
        action: 'onAwakeSDLNotificationSend',
        target: 'SDL.SDLController',
        buttonAction: true,
        onDown: false
      }
    ),
    /**
     * HMI element Button for send exit state
     */
    sendAppStateButton:SDL.Button.extend(
      {
        elementId:'sendAppStateButton',
        classNames: 'button sendAppStateButton',
        text: 'Send state',
        action:function(){
          SDL.SDLController.exitAppViewSelected(SDL.ExitApp.exitAppViewSelect.selection.name);
        },
        target: 'SDL.SDLController',
        buttonAction: true,
        onDown: false
    }
  ),
    /**
     * HMI element Button for send MQ signal
     */
 sendMQSignalButton:SDL.Button.extend(
  {
    elementId:'sendMQSignalButton',
    classNames: 'button sendMQSignalButton',
    text: 'Send MQ signal',
    action:function(){
      FFW.RPCSimpleClient.send(SDL.ExitApp.mqSignalSelect.selection);
    },
    target: 'SDL.SDLController',
    buttonAction: true,
    onDown: false
}
),
    onDeactivateLabel: SDL.Label.extend(
      {
        elementId: 'onDeactivateLabel',
        classNames: 'onDeactivateLabel',
        content: 'OnDeactivate notification send'
      }
    ),
    /**
     * HMI element Select with parameters of TBTClientStates
     */
    onDeactivateSelect: Em.Select.extend(
      {
        elementId: 'onDeactivateSelect',
        classNames: 'onDeactivateSelect',
        content: [true, false],
        /**
         * Selected data sent on model for further processing
         */
        click: function() {
          SDL.SDLController.onEventChanged('onDeactivateHMI', this.selection);
        }
      }
    ),
    /**
     * Trigger function that activates and deactivates tbtClientStateView
     */
    toggleActivity: function() {
      this.toggleProperty('active');
    }
  }
);
