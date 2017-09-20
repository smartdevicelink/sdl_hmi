/*
 * Copyright (c) 2017, Ford Motor Company All rights reserved.
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
 * @name SDL.RSDLOptionsView
 * @desc RSDL options visual representation
 * @category View
 * @filesource app/view/settings/policies/rsdlOptionsView.js
 * @version 1.0
 */

SDL.RSDLOptionsView = Em.ContainerView.create(
  {
    elementId: 'policies_settings_rsdlOptions',
    classNames: 'in_settings_separate_view',
    classNameBindings: [
      'SDL.States.settings.policies.rsdlOptionsList.active:active_state:inactive_state'
    ],
    childViews: [
      'backButton',
      'listOfOptions',
      'label'
    ],
    getRSDLFunctionalityStatus: function() {
      var result = 'RC Functionality - ';
      result += SDL.SDLModel.reverseFunctionalityEnabled ?
        'Allowed' : 'Disallowed';
      return result;
    }.property(
      'SDL.SDLModel.reverseFunctionalityEnabled'
    ),
    getRSDLAccessModeStatus: function() {
      var result = 'Access Mode - ';
      switch (SDL.SDLModel.reverseAccessMode) {
        case 'AUTO_ALLOW': {
          result += 'Auto Allow';
          break;
        }
        case 'AUTO_DENY': {
          result += 'Auto Deny';
          break;
        }
        case 'ASK_DRIVER': {
          result += 'Ask Driver';
          break;
        }
        default: {
          result += SDL.SDLModel.reverseAccessMode;
        }
      }
      return result;
    }.property(
      'SDL.SDLModel.reverseAccessMode'
    ),
    checkRCAccessModeDisabled: function() {
      return !SDL.SDLModel.reverseFunctionalityEnabled;
    }.property(
      'SDL.SDLModel.reverseFunctionalityEnabled'
    ),
    /**
     * Label in title
     */
    label: SDL.Label.extend(
      {
        elementId: 'label',
        classNames: 'label',
        content: 'Please specify RSDL functionality options'
      }
    ),
    backButton: SDL.Button.extend(
      {
        classNames: [
          'backButton'
        ],
        action: 'onState',
        target: 'SDL.SettingsController',
        goToState: 'policies',
        icon: 'images/media/ico_back.png',
        onDown: false
      }
    ),
    listOfOptions: SDL.List.extend(
      {
        elementId: 'policies_rsdl_options_list',
        itemsOnPage: 5,
        /** Items */
        items: [
          {
            type: SDL.Button,
            params: {
              action: 'toggleRSDLFunctionality',
              target: 'SDL.SDLController',
              textBinding: 'SDL.RSDLOptionsView.getRSDLFunctionalityStatus'
            }
          },
          {
            type: SDL.Button,
            params: {
              action: 'toggleRCAccessMode',
              disabledBinding: 'SDL.RSDLOptionsView.checkRCAccessModeDisabled',
              target: 'SDL.SDLController',
              textBinding: 'SDL.RSDLOptionsView.getRSDLAccessModeStatus'
            }
          }
        ]
      }
    )
  }
);
