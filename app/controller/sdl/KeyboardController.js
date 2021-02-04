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
     * Array of symbols not allowed to show on keyboard UI
     */
    unsupportedKeyboardSymbols: [ '^' ],

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
     * @description Disables or enables characters depending on global properties
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

          let disable_layout_buttons = (layout, list) => {
            for (var i = 0; i < layout._childViews.length; ++i) {
              let button = layout._childViews[i];

              if (list.length == 0) {
                button.set('disabled', false);
                continue;
              }

              let button_text = button.text;
              if (button.customKeyIndex != null) {
                button_text = this.getCustomKey(button.customKeyIndex, button.defaultText);
              }

              const is_disabled = list.indexOf(button_text) < 0;
              button.set('disabled', is_disabled);
            }
          };

          const layouts = [
            SDL.Keyboard.buttonsAreaQWERTY,
            SDL.Keyboard.buttonsAreaQWERTZ,
            SDL.Keyboard.buttonsAreaAZERTY,
            SDL.Keyboard.buttonsAreaNumeric
          ];

          layouts.forEach((layout) => {
            disable_layout_buttons(layout, list);
          });
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

        return SDL.SDLController.model &&
               SDL.SDLController.model.globalProperties.keyboardProperties ?
               SDL.SDLController.model.globalProperties.keyboardProperties.keyboardLayout == layout :
               false;
    },

    /**
     * @description Changes input masking if global properties have been
     * changed by application
     */
    maskInputCharacters: function() {
        let value = 'DISABLE_INPUT_KEY_MASK';
        if (SDL.SDLController.model &&
            SDL.SDLController.model.globalProperties.keyboardProperties) {
            value = SDL.SDLController.model.globalProperties.keyboardProperties.maskInputCharacters;
        }

        let is_mask_characters = false;
        let is_show_mask_button = false;

        switch (value) {
            case 'ENABLE_INPUT_KEY_MASK': {
                Em.Logger.log('Masking keyboard input characters');
                is_mask_characters = true;
                is_show_mask_button = false;
                break;
            }

            case 'USER_CHOICE_INPUT_KEY_MASK': {
                Em.Logger.log('Showing user button for masking');
                is_show_mask_button = true;
                is_mask_characters = SDL.SDLController.model.maskInputCharactersUserChoice;
                break;
            }

            case 'DISABLE_INPUT_KEY_MASK':
            default: {
                Em.Logger.log('Unmasking keyboard input characters');
                is_mask_characters = false;
                is_show_mask_button = false;
            }
        }

        this.set('maskCharacters', is_mask_characters);
        this.set('showMaskButton', is_show_mask_button);

        this.updateInputMasking();

    }.observes(
      'SDL.SDLController.model.globalProperties.keyboardProperties.maskInputCharacters'
    ),

    /**
     * @description Returns customized key for a specified key index
     * @param {Integer} index index of key
     * @param {String} defaultKey default key if no customization
     * @returns customized key according to global properties
     */
    getCustomKey: function(index, defaultKey) {
      if (SDL.SDLController.model == null) {
        return defaultKey;
      }

      if (SDL.SDLController.model.globalProperties.keyboardProperties.customKeys == null) {
        return defaultKey;
      }

      const keys = SDL.SDLController.model.globalProperties.keyboardProperties.customKeys;
      if (keys.length >= index + 1) {
        const customSymbol = keys[index];
        if (this.unsupportedKeyboardSymbols.includes(customSymbol)) {
          return defaultKey;
        }

        return customSymbol;
      }

      return defaultKey;
    },

    /**
     * @description Toggles current masking property
     */
    toggleMaskingOption: function() {
      SDL.KeyboardController.toggleProperty('maskCharacters');
      SDL.SDLController.model.set('maskInputCharactersUserChoice', SDL.KeyboardController.maskCharacters);
      if (SDL.SDLController.model) {
        SDL.KeyboardController.sendInputKeyMaskNotification(SDL.SDLController.model.appID);
      }
      SDL.KeyboardController.updateInputMasking();
    },

    /**
     * @description Sends OnKeyboardInput notification for key masking
     * @param {Integer} appID id of application model
     */
    sendInputKeyMaskNotification: function(appID) {
      if (SDL.SDLController.model == null) {
        Em.Logger.log("No currently active apps. No need to send notification");
        return;
      }

      if (SDL.SDLController.model.appID != appID) {
        Em.Logger.log("Properties change from inactive app. No need to send notification");
        return;
      }

      if (SDL.SDLController.model.isHmiLevelResumption === true) {
        Em.Logger.log("Application resumes HMI level. No need to send notification");
        return;
      }

      if (SDL.KeyboardController.maskCharacters) {
        FFW.UI.OnKeyboardInput(null, 'INPUT_KEY_MASK_ENABLED');
      } else {
        FFW.UI.OnKeyboardInput(null, 'INPUT_KEY_MASK_DISABLED');
      }
    },

    /**
     * @description Updates keyboard input according to current values
     * of internal controller flags
     */
    updateInputMasking: function() {
      if (SDL.Keyboard) {
        if (SDL.KeyboardController.maskCharacters) {
          SDL.Keyboard.searchBar.input.type = 'password';
        } else {
          SDL.Keyboard.searchBar.input.type = 'text';
        }

        // To apply style updates on UI
        SDL.Keyboard.searchBar.input.rerender();
      }
    }
});
