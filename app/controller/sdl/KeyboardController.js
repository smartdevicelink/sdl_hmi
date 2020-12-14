/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: ·
 * Redistributions of source code must retain the above copyright notice, SDL.Keyboard
 * list of conditions and the following disclaimer. · Redistributions in binary
 * form must reproduce the above copyright notice, SDL.Keyboard list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. · Neither the name of the Ford Motor Company nor the
 * names of its contributors may be used to endorse or promote products derived
 * from SDL.Keyboard software without specific prior written permission.
 *
 * SDL.Keyboard SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF SDL.Keyboard SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * @name SDL.KeyboardController
 * @desc Keyboard Controller
 * @category Controller
 * @filesource app/controller/sdl/KeyboardController.js
 * @version 1.0
 */

SDL.KeyboardController = Em.Object.create({

    /**
     * Target element that initiated keyboard
     */
    target: null,

    /**
     * Flag to check should characters be masked or not
     */
    maskCharacters: false,

    /**
     * Flag to check should masking button be displayed or not
     */
    showMaskButton: false,

    /**
     * @description Closes keyboard view and cancels active interaction request
     */
    closeKeyboardView: function() {
        if (SDL.SDLController.model &&
            SDL.SDLController.model.activeRequests.uiPerformInteraction &&
            !SDL.InteractionChoicesView.active) {
            FFW.UI.OnKeyboardInput('', 'ENTRY_CANCELLED');
            SDL.InteractionChoicesView.deactivate('ABORTED');
          }
          SDL.Keyboard.deactivate();
    },

    /**
     * @description Inputs the information depending on key pressed
     * @param {Object} element key that was pressed by user
     */
    inputChanges: function(element) {
        if (SDL.SDLController.model &&
          SDL.SDLController.model.activeRequests.uiPerformInteraction) {
          SDL.SDLController.onResetTimeout(
            SDL.SDLController.model.appID, 'UI.PerformInteraction'
          );
        }

        switch (element.text) {
          case 'Space':
          {
            SDL.SDLModel.set('data.keyboardInputValue',
              SDL.SDLModel.data.keyboardInputValue + ' '
            );
            this.target.set('value', SDL.SDLModel.data.keyboardInputValue);
            SDL.SDLController.onKeyboardChanges();
            break;
          }
          case 'Search':
          {
            if (this.target.value == null) {
              this.target.set('value', '');
            }
            this.target.search();
            SDL.Keyboard.deactivate();
            break;
          }
          default:
          {
            SDL.SDLModel.set('data.keyboardInputValue',
              SDL.SDLModel.data.keyboardInputValue + element.text
            );
            this.target.set('value', SDL.SDLModel.data.keyboardInputValue);
            SDL.SDLController.onKeyboardChanges();
          }
        }
    },

    /**
     * @description Removes last symbol from the input string
     * Sends cancel event if it was the only symbol in the input
     */
    clearBtn: function() {
        const text = SDL.SDLModel.data.keyboardInputValue;
        if (text == '') {
            return;
        }

        const new_text = text.slice(0, -1);
        SDL.SDLModel.set('data.keyboardInputValue', new_text);
        this.target.set('value', new_text);

        if (new_text == '') {
          FFW.UI.OnKeyboardInput('', 'ENTRY_CANCELLED');
        } else {
          SDL.SDLController.onKeyboardChanges();
        }

        if (SDL.SDLController.model &&
          SDL.SDLController.model.activeRequests.uiPerformInteraction) {
          SDL.SDLController.onResetTimeout(
            SDL.SDLController.model.appID, 'UI.PerformInteraction'
          );
        }
    },

    /**
     * @description Disables or enables charaters depeding on global properties
     */
    disableButtons: function() {
        if (SDL.SDLController.model) {
          if (!SDL.SDLController.model.globalProperties.keyboardProperties) {
            return;
          }
          var list = SDL.SDLController.model.globalProperties.keyboardProperties.limitedCharacterList ?
            SDL.SDLController.model.globalProperties.keyboardProperties.limitedCharacterList :
            [];
          for (var i = 0; i < list.length; i++) {
            list[i] = list[i].toLowerCase();
          }
          if (SDL.SDLController.model && list.length) {
            for (var i = 0; i < SDL.Keyboard.buttonsAreaQWERTY._childViews.length; i++) {
              if (list.indexOf(SDL.Keyboard.buttonsAreaQWERTY._childViews[i].text) < 0) {
                SDL.Keyboard.buttonsAreaQWERTY._childViews[i].set('disabled', true);
                SDL.Keyboard.buttonsAreaQWERTZ._childViews[i].set('disabled', true);
                SDL.Keyboard.buttonsAreaAZERTY._childViews[i].set('disabled', true);
              } else {
                SDL.Keyboard.buttonsAreaQWERTY._childViews[i].set('disabled', false);
                SDL.Keyboard.buttonsAreaQWERTZ._childViews[i].set('disabled', false);
                SDL.Keyboard.buttonsAreaAZERTY._childViews[i].set('disabled', false);
              }
            }
          } else if (SDL.SDLController.model && !list.length) {
            for (var i = 0; i < SDL.Keyboard.buttonsAreaQWERTY._childViews.length; i++) {
              SDL.Keyboard.buttonsAreaQWERTY._childViews[i].set('disabled', false);
            }
          }
        }
    }.observes(
        'SDL.SDLController.model.globalProperties.keyboardProperties.limitedCharacterList.@each'
    ),

    /**
     * @description Checks if current layout is active or not
     * @param {String} layout to check
     * @returns true if layout is active, false otherwise
     */
    isLayoutActive: function(layout) {
        const default_layout = "QWERTY";

        if (SDL.SDLController.model == null && layout == default_layout) {
            return true;
        }

        return SDL.SDLController.model ?
            SDL.SDLController.model.globalProperties.keyboardProperties.keyboardLayout == layout :
            false;
    },

    /**
     * @description Changes input masking if global properties have been
     * changed by application
     */
    maskInputCharacters: function() {
        if (SDL.SDLController.model == null ||
            SDL.SDLController.model.globalProperties.keyboardProperties == null) {
            return;
        }

        const value = SDL.SDLController.model.globalProperties.keyboardProperties.maskInputCharacters;
        switch (value) {
            case 'ENABLE_INPUT_KEY_MASK': {
                Em.Logger.log('Masking keyboard input characters');
                this.set('maskCharacters', true);
                this.set('showMaskButton', false);
                this.updateInputMasking();
                break;
            }

            case 'USER_CHOICE_INPUT_KEY_MASK': {
                Em.Logger.log('Showing user button for masking');
                this.set('showMaskButton', true);
                break;
            }

            case 'DISABLE_INPUT_KEY_MASK':
            default: {
                Em.Logger.log('Unmasking keyboard input characters');
                this.set('maskCharacters', false);
                this.set('showMaskButton', false);
                this.updateInputMasking();
            }
        }
    }.observes(
        'SDL.SDLController.model.globalProperties.keyboardProperties.maskInputCharacters'
    ),

    /**
     * @description Toggles current masking property
     */
    toggleMaskingOption: function() {
        SDL.KeyboardController.toggleProperty('maskCharacters');
        SDL.KeyboardController.updateInputMasking();
    },

    /**
     * @description Updates keyboard input according to current values
     * of internal controller flags
     */
    updateInputMasking: function() {
        if (SDL.KeyboardController.maskCharacters) {
            SDL.Keyboard.searchBar.input.type = 'password';
            FFW.UI.OnKeyboardInput(null, 'INPUT_KEY_MASK_ENABLED');
        } else {
            SDL.Keyboard.searchBar.input.type = 'text';
            FFW.UI.OnKeyboardInput(null, 'INPUT_KEY_MASK_DISABLED');
        }

        // To apply style updates on UI
        SDL.Keyboard.searchBar.input.rerender();
    }
});
