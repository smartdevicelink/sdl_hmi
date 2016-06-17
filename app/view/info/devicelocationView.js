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
 * @name SDL.DeviceLocationView
 * @desc Media App Options module visual representation
 * @category View
 * @filesource app/view/media/devicelocationView.js
 * @version 1.0
 */

SDL.DeviceLocationView = Em.ContainerView.create({

  classNames: [
    'info_apps_deviceLocation_view',
    'sdl-window'
  ],

  classNameBindings: [
    'SDL.States.info.devicelocation.active:active_state:inactive_state'
  ],

  /**
   * View Id
   */
  elementId: 'info_apps_deviceLocation_view',

  /**
   * View Components
   */
  childViews: [
    'backButton',
    'deviceLocationLabel',
    'devicesSelect',
    'locationSelect',
    'setButton'
  ],

  /**
   * Button to return to previous view
   */
  backButton: SDL.Button.extend({
        classNames: [
          'backButton', 'button'
        ],
        action: 'turnChangeDeviceViewBack',
        target: 'SDL.SDLController',
        icon: 'images/media/ico_back.png'
      }
    ),

  /**
   * Label in title
   */
  deviceLocationLabel: SDL.Label.extend({

    elementId: 'deviceLocationLabel',

    classNames: 'caption-text',

    content: 'Devices Location Manage Window'
  }
),

  /**
   * HMI element Select with parameters of transmission state from VehicleInfo
   * Model
   */
  devicesSelect: Em.Select.extend({

    elementId: 'devicesSelect',

    classNames: 'devicesSelect',

    contentBinding: 'SDL.SDLModel.data.connectedDevicesArray',

    optionValuePath: 'content.id',

    optionLabelPath: 'content.name',

    selectUpdate: function() {
          this.selection = this.content[0];
        }.observes('this.content')
  }
),

  /**
   * HMI element Select with parameters of transmission state from VehicleInfo
   * Model
   */
  locationSelect: Em.Select.extend({

    elementId: 'locationSelect',

    classNames: 'locationSelect',

    contentBinding: 'SDL.SDLModel.interiorZone',

    valueBinding: 'this._parentView.location'
  }
),

  /**
   * Button to set device location
   */
  setButton: SDL.Button.extend({
        classNames: 'button sendLocationButton',
        text: 'Set location',
        click: function() {
          FFW.RC.OnDeviceLocationChanged(this._parentView.devicesSelect.selection,
            this._parentView.location
          );
        },
        enabled: false,
        onDown: false
      }
    )
}
);
