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
 * @name SDL.Keyboard
 * @desc Slider visual representation
 * @category View
 * @filesource app/view/sdl/shared/keyboard.js
 * @version 1.0
 */

SDL.Keyboard = SDL.SDLAbstractView.create(
  {
    elementId: 'keyboard_view',
    childViews: [
      'backButton',
      'microphone',
      'searchBar',
      'buttonsAreaQWERTY',
      'buttonsAreaQWERTZ',
      'buttonsAreaAZERTY',
      'buttonsAreaNumeric'
    ],

    /**
     * Activate keyboard method
     *
     * @param {Object}
     */
    activate: function(element) {
      if (element) {
        this.set('active', true);
        SDL.KeyboardController.set('target', element);
      }
    },
    /**
     * Extend deactivate method send SUCCESS response on deactivate with current
     * slider value
     */
    deactivate: function() {
      this._super();
      SDL.SDLModel.set('data.keyboardInputValue', '');
      SDL.KeyboardController.set('target', null);
    },

    backButton: SDL.Button.extend(
      {
        classNames: [
          'back-button'
        ],
        action: SDL.KeyboardController.closeKeyboardView,
        icon: 'images/media/ico_back.png',
        onDown: false
      }
    ),
    microphone: SDL.Button.extend(
      {
        classNames: 'microphone',
        text: 'mic'
      }
    ),
    searchBar: Em.ContainerView.extend(
      {
        classNames: 'searchBar',
        childViews: [
          'input',
          'maskBtn',
          'clearBtn',
          'searchBtn'
        ],
        maskBtn: SDL.Button.extend(
          {
            classNames: 'maskBtn',
            classNameBindings: 'SDL.KeyboardController.showMaskButton::inactive_state',
            text: 'Mask',
            action: 'toggleMaskingOption',
            target: 'SDL.KeyboardController',
            templateName: 'icon',
            iconBinding: 'getIcon',
            getIcon: function() {
              if (SDL.KeyboardController.maskCharacters) {
                return 'images/common/unmask.png';
              } else {
                return 'images/common/mask.png';
              }
            }.property('SDL.KeyboardController.maskCharacters')
          }
        ),
        clearBtn: SDL.Button.extend(
          {
            classNames: 'clearBtn',
            text: 'X',
            action: 'clearBtn',
            target: 'SDL.KeyboardController'
          }
        ),
        searchBtn: SDL.Button.extend(
          {
            classNames: 'searchBtn',
            text: 'Search',
            action: 'inputChanges',
            target: 'SDL.KeyboardController',
            templateName: 'icon',
            icon: 'images/common/search.png',
            onDown: false
          }
        ),
        input: Ember.TextField.extend(
          {
            elementId: 'keyboardInput',
            classNames: 'keyboardInput',
            valueBinding: 'SDL.SDLModel.data.keyboardInputValue'
          })
      }
    ),
    buttonsAreaQWERTY: SDL.QWERTYLayout.create(
      {
        classNameBindings: 'this.isEnabled::hide',
        isEnabled: function() {
          return SDL.KeyboardController.isLayoutActive("QWERTY");
        }.property(
          'SDL.SDLController.model.globalProperties.keyboardProperties.keyboardLayout'
        )
      }
    ),
    buttonsAreaQWERTZ: SDL.QWERTZLayout.create(
      {
        classNameBindings: 'this.isEnabled::hide',
        isEnabled: function() {
          return SDL.KeyboardController.isLayoutActive("QWERTZ");
        }.property(
          'SDL.SDLController.model.globalProperties.keyboardProperties.keyboardLayout'
        )
      }
    ),
    buttonsAreaAZERTY: SDL.AZERTYLayout.create(
      {
        classNameBindings: 'this.isEnabled::hide',
        isEnabled: function() {
          return SDL.KeyboardController.isLayoutActive("AZERTY");
        }.property(
          'SDL.SDLController.model.globalProperties.keyboardProperties.keyboardLayout'
        )
      }
    ),
    buttonsAreaNumeric: SDL.NumericLayout.create(
      {
        classNameBindings: 'this.isEnabled::hide',
        isEnabled: function() {
          return SDL.KeyboardController.isLayoutActive("NUMERIC");
        }.property(
          'SDL.SDLController.model.globalProperties.keyboardProperties.keyboardLayout'
        )
      }
    )
  }
);
