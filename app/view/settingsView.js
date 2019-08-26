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
 * @name SDL.PlayerControllsView
 * @desc Video player visual representation
 * @category View
 * @filesource app/view/player/PlayerView.js
 * @version 1.0
 */
SDL.SettingsView = Em.ContainerView.create(
  {
    /** View Id */
    elementId: 'settingsView',
    classNameBindings: [
      'SDL.States.settings.active:active_state:inactive_state'
    ],
    /** Settings components */
    childViews: [
      'leftMenu',
      SDL.DeviceStateChangeView,
      SDL.PoliciesView,
      SDL.AppPermissionsListView,
      SDL.AppPermissionsView,
      SDL.DeviceConfigView,
      SDL.StatisticsInfoView,
      SDL.SystemErrorView,
      SDL.ConnectionSettingsView,
      SDL.RSDLOptionsView,
      SDL.HMISettingsView,
      SDL.LightView,
      SDL.SingleLightView,
      SDL.LocationLightView,
      SDL.InteriorLightView,
      SDL.ExteriorLightView,
      SDL.SeatView,
      SDL.PolicyConfigListView
    ],
    /** Left menu */
    leftMenu: Em.ContainerView.extend(
      {
        elementId: 'settings_leftMenu',
        classNameBindings: [
          'parentView.controller.hiddenLeftMenu:hidden'
        ],
        classNames: 'menu-items',
        childViews: [
          'border',
          'items'
        ],
        border: Em.View.extend(
          {
            classNames: 'ls_border'
          }
        ),
        items: Em.ContainerView.extend(
          {
            classNames: 'ls-items',
            childViews: [
              'policies',
              'HMISettings',
              'light',
              'seat'
            ],
            policies: SDL.Button.extend(
              {
                elementId: 'policies_leftMenu',
                goToState: 'policies',
                classNames: 'menu-item lsp1_p',
                classNameBindings: [
                  'SDL.States.settings.policies.active:info_active'
                ],
                text: 'Policies',
                icon: 'images/settings/ico_settings.png',
                action: 'turnOnPoliciesSettings',
                target: 'SDL.SettingsController'
              }
            ),
            HMISettings: SDL.Button.extend({
              elementId: 'HMISettings_leftMenu',
              goToState: 'HMISettings',
              classNames: 'menu-item lsp1_p',
              classNameBindings: [
                'SDL.States.settings.HMISettings.active:info_active',
              ],
              text: 'HMI',
              icon: 'images/settings/ico_settings.png',
              action: 'turnOnHMISettings',
              target: 'SDL.SettingsController'
            }),
            light: SDL.Button.extend({
              elementId: 'light_leftMenu',
              goToState: 'light',
              classNames: 'menu-item lsp1_p',
              classNameBindings: [
                'SDL.States.settings.light.active:info_active',
              ],
              text: 'Light',
              icon: 'images/settings/ico_settings.png',
              action: 'turnOnLight',
              target: 'SDL.SettingsController'
            }),
            seat: SDL.Button.extend({
              elementId: 'seat_leftMenu',
              goToState: 'seat',
              classNames: 'menu-item lsp1_p',
              classNameBindings: [
                'SDL.States.settings.seat.active:info_active',
              ],
              text: 'Seat',
              icon: 'images/settings/ico_settings.png',
              action: 'turnOnSeat',
              target: 'SDL.SettingsController'
            })
          }
        )
      }
    )
  }
);
