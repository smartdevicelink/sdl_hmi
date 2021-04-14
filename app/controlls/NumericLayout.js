/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
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
 * @name SDL.NumericLayout
 * @desc General list component for SDL application
 * @category Controlls
 * @filesource app/controlls/QWERTYLayout.js
 * @version 1.0
 */

SDL.NumericLayout = Em.ContainerView.extend({

    classNames: 'keyboardLayout NumericLayout',

    childViews: [
      'num1',
      'num2',
      'num3',
      'num4',
      'num5',
      'num6',
      'num7',
      'num8',
      'num9',
      'num0',
      'dash',
      'ampersand'
    ],

    num1: SDL.Button.extend({
          classNames: 'num1 col3 row0',
          text: '1',
          target: 'SDL.KeyboardController',
          action: 'inputChanges'
        }
    ),

    num2: SDL.Button.extend({
        classNames: 'num2 col4 row0',
        text: '2',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    num3: SDL.Button.extend({
        classNames: 'num3 col5 row0',
        text: '3',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    num4: SDL.Button.extend({
        classNames: 'num4 col3 row1',
        text: '4',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    num5: SDL.Button.extend({
        classNames: 'num5 col4 row1',
        text: '5',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    num6: SDL.Button.extend({
        classNames: 'num6 col5 row1',
        text: '6',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    num7: SDL.Button.extend({
        classNames: 'num7 col3 row2',
        text: '7',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    num8: SDL.Button.extend({
        classNames: 'num8 col4 row2',
        text: '8',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    num9: SDL.Button.extend({
        classNames: 'num9 col5 row2',
        text: '9',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    num0: SDL.Button.extend({
        classNames: 'num0 col4 row3',
        text: '0',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

    dash: SDL.Button.extend({
          classNames: 'dash col3 row3',
          textBinding: 'getText',
          defaultText: '-',
          customKeyIndex: 0,
          target: 'SDL.KeyboardController',
          action: 'inputChanges',
          getText: function() {
            return SDL.KeyboardController.getCustomKey(this.customKeyIndex, this.defaultText);
          }.property('SDL.SDLController.model.globalProperties.keyboardProperties.customKeys.@each')
        }
      ),

    ampersand: SDL.Button.extend({
          classNames: 'ampersand col5 row3',
          textBinding: 'getText',
          defaultText: '&',
          customKeyIndex: 1,
          target: 'SDL.KeyboardController',
          action: 'inputChanges',
          getText: function() {
            return SDL.KeyboardController.getCustomKey(this.customKeyIndex, this.defaultText);
          }.property('SDL.SDLController.model.globalProperties.keyboardProperties.customKeys.@each')
        }
      )
  }
  );
