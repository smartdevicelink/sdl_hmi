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
 * @name SDL.PrimaryDevice
 * @desc PrimaryDevice selection window
 * @category View
 * @filesource app/view/sdl/PrimaryDevice.js
 * @version 1.0
 */

SDL.PrimaryDevice = Em.ContainerView.create(
  {
    elementId: 'PrimaryDevice',
    classNames: 'PrimaryDevice',
    classNameBindings: [
      'active'
    ],
    childViews: [
      'primaryDeviceLabel',
      'chooseLabel',
      'deviceSelect',
      'primaryButton',
      'resetDeviceButton',
      'firstDeviceLabel',
      'firstDeviceCheckBox',
      'backButton'
    ],
    /**
     * Property indicates the activity state of VehicleInfo PopUp
     */
    active: false,
    /**
     * Button to return to previous view
     */
    backButton: SDL.Button.extend(
      {
        classNames: [
          'backButton', 'button'
        ],
        action: 'toggleDriverDeviceWindow',
        target: 'SDL.SDLController',
        icon: 'images/media/ico_back.png'
      }
    ),
    /**
     * Label of first device setting chackbox
     */
    firstDeviceLabel: SDL.Label.extend(
      {
        elementId: 'firstDeviceLabel',
        classNames: 'firstDeviceLabel',
        content: 'Set first device as Drivers'
      }
    ),
    /**
     * Check box to enable functionality of setting first connected device as
     * Drivers
     */
    firstDeviceCheckBox: Em.Checkbox.extend(
      {
        elementId: 'firstDeviceCheckBox',
        classNames: 'firstDeviceCheckBox',
        checkedBinding: 'SDL.SDLModel.driverDevice'
      }
    ),
    /**
     * Title of VehicleInfo PopUp view
     */
    primaryDeviceLabel: SDL.Label.extend(
      {
        elementId: 'primaryDeviceLabel',
        classNames: 'primaryDeviceLabel',
        content: 'Drivers Device Selection Window'
      }
    ),
    /**
     * Title of prndl group of parameters stored in VehicleInfo model
     */
    chooseLabel: SDL.Label.extend(
      {
        elementId: 'chooseLabel',
        classNames: 'chooseLabel',
        currentDevice: function() {
          if (SDL.SDLModel.driverDeviceInfo) {
            return 'Current drivers device is ' +
              SDL.SDLModel.driverDeviceInfo.name;
          } else {
            return 'No drivers device connected.';
          }
        }.property('SDL.SDLModel.driverDeviceInfo'),
        contentBinding: 'currentDevice'
      }
    ),
    /**
     * HMI element Select with parameters of transmission state from VehicleInfo
     * Model
     */
    deviceSelect: Em.Select.extend(
      {
        elementId: 'deviceSelect',
        classNames: 'deviceSelect',
        contentBinding: 'SDL.SDLModel.data.connectedDevicesArray',
        optionValuePath: 'content.id',
        optionLabelPath: 'content.name',
        selectUpdate: function() {
          SDL.PrimaryDevice.deviceSelect.selection
            = SDL.PrimaryDevice.deviceSelect.content[0];
        }.observes('this.content')
      }
    ),
    /**
     * Button to discard current drivers device
     */
    resetDeviceButton: SDL.Button.extend(
      {
        classNames: 'button resetDeviceButton',
        text: 'Set as Passenger\'s',
        click: function() {
          SDL.SDLController.driverDeviceWindowClose(
            this._parentView.deviceSelect.selection, 1
          ); //Magick number 1 is SDL.RModel.deviceRank enum value
        },
        onDown: false
      }
    ),
    /**
     * Button to send OnEmergencyEvent to SDL
     */
    primaryButton: SDL.Button.extend(
      {
        classNames: 'button primaryButton',
        text: 'Set as Driver\'s',
        click: function() {
          SDL.SDLController.driverDeviceWindowClose(
            this._parentView.deviceSelect.selection, 0
          ); //Magick number 0 is SDL.RModel.deviceRank enum value
        },
        onDown: false
      }
    ),
    /**
     * Trigger function that activates and deactivates VehicleInfo PopUp
     */
    toggleActivity: function() {
      this.set('active', !this.active);
    },
    /**
     * This event triggered when component is placed to
     * document DOM structure
     */
    didInsertElement: function() {
      this._super();
    }
  }
);
