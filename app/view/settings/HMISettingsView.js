/*
 * Copyright (c) 2018, Ford Motor Company All rights reserved.
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
 * @name SDL.HMISettingsView
 * @desc Info Apps visual representation
 * @category View
 * @filesource app/view/settings/HMISettingsView.js
 * @version 1.0
 */

SDL.HMISettingsView = Em.ContainerView.create({

    elementId: 'hmi_settings',

    classNames: 'in_HMIsettings_view',

    classNameBindings: [
        'SDL.States.settings.HMISettings.active:active_state:inactive_state'
    ],

    childViews: [
      'SettingsList'
    ],

    getDisplayModeStatus: function() {
      return 'Display mode - ' + SDL.HmiSettingsModel.displayMode;
    }.property(
      'SDL.HmiSettingsModel.displayMode'
    ),

    getDistanceUnit: function() {
      return 'Distance unit - ' + SDL.HmiSettingsModel.distanceUnit;
    }.property(
      'SDL.HmiSettingsModel.distanceUnit'
    ),
    
    getTemperatureUnit: function() {
      return 'Temperature unit - ' + SDL.HmiSettingsModel.temperatureUnit;
    }.property(
      'SDL.HmiSettingsModel.temperatureUnit'
    ),

    SettingsList: SDL.List.extend({
        elementId: 'HMI_settings_list',
        classNames:'HMI_settings_list',
        itemsOnPage: 5,
        /** Items */
        items: [{
            type: SDL.Button,
            params: {
              action: 'toggleDisplayMode',
              target: 'SDL.SDLController',
              textBinding: 'SDL.HMISettingsView.getDisplayModeStatus'
            }
          },
          {
            type: SDL.Button,
            params: {
              action: 'toggleDistanceUnit',
              target: 'SDL.SDLController',
              textBinding: 'SDL.HMISettingsView.getDistanceUnit'
            }
          },
          {
            type: SDL.Button,
            params: {
              action: 'toggleTemperatureUnit',
              target: 'SDL.SDLController',
              textBinding: 'SDL.HMISettingsView.getTemperatureUnit'
            }
          }]
    })
});
