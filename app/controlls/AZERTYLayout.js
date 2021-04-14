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
 * @name SDL.QWERTYLayout
 * @desc General list component for SDL application
 * @category Controlls
 * @filesource app/controlls/QWERTYLayout.js
 * @version 1.0
 */

SDL.AZERTYLayout = Em.ContainerView.extend({

  classNames: 'keyboardLayout AZERTYLayout wide',

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
    'a',
    'z',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    'q',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'w',
    'x',
    'c',
    'v',
    'b',
    'n',
    'dot',
    'space',
    'dash',
    'ampersand'
  ],

  num1: SDL.Button.extend({
          classNames: 'num1 col0 row0',
          text: '1',
          target: 'SDL.KeyboardController',
          action: 'inputChanges'
        }
    ),

  num2: SDL.Button.extend({
        classNames: 'num2 col1 row0',
        text: '2',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  num3: SDL.Button.extend({
        classNames: 'num3 col2 row0',
        text: '3',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  num4: SDL.Button.extend({
        classNames: 'num4 col3 row0',
        text: '4',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  num5: SDL.Button.extend({
        classNames: 'num5 col4 row0',
        text: '5',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  num6: SDL.Button.extend({
        classNames: 'num6 col5 row0',
        text: '6',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  num7: SDL.Button.extend({
        classNames: 'num7 col6 row0',
        text: '7',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  num8: SDL.Button.extend({
        classNames: 'num8 col7 row0',
        text: '8',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  num9: SDL.Button.extend({
        classNames: 'num9 col8 row0',
        text: '9',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  num0: SDL.Button.extend({
        classNames: 'num0 col9 row0',
        text: '0',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
    }),

  a: SDL.Button.extend({
        classNames: 'a col0 row1',
        text: 'a',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  z: SDL.Button.extend({
        classNames: 'z col1 row1',
        text: 'z',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  e: SDL.Button.extend({
        classNames: 'e col2 row1',
        text: 'e',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  r: SDL.Button.extend({
        classNames: 'r col3 row1',
        text: 'r',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  t: SDL.Button.extend({
        classNames: 't col4 row1',
        text: 't',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  y: SDL.Button.extend({
        classNames: 'y col5 row1',
        text: 'y',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  u: SDL.Button.extend({
        classNames: 'u col6 row1',
        text: 'u',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  i: SDL.Button.extend({
        classNames: 'i col7 row1',
        text: 'i',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  o: SDL.Button.extend({
        classNames: 'o col8 row1',
        text: 'o',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  p: SDL.Button.extend({
        classNames: 'p col9 row1',
        text: 'p',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  q: SDL.Button.extend({
        classNames: 'q col0 row2',
        text: 'q',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  s: SDL.Button.extend({
        classNames: 's col1 row2',
        text: 's',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  d: SDL.Button.extend({
        classNames: 'd col2 row2',
        text: 'd',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  f: SDL.Button.extend({
        classNames: 'f col3 row2',
        text: 'f',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  g: SDL.Button.extend({
        classNames: 'g col4 row2',
        text: 'g',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  h: SDL.Button.extend({
        classNames: 'h col5 row2',
        text: 'h',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  j: SDL.Button.extend({
        classNames: 'j col6 row2',
        text: 'j',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  k: SDL.Button.extend({
        classNames: 'k col7 row2',
        text: 'k',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  l: SDL.Button.extend({
        classNames: 'l col8 row2',
        text: 'l',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  m: SDL.Button.extend({
        classNames: 'm col9 row2',
        text: 'm',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  w: SDL.Button.extend({
        classNames: 'w col2 row3',
        text: 'w',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  x: SDL.Button.extend({
        classNames: 'x col3 row3',
        text: 'x',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  c: SDL.Button.extend({
        classNames: 'c col4 row3',
        text: 'c',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  v: SDL.Button.extend({
        classNames: 'v col5 row3',
        text: 'v',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  b: SDL.Button.extend({
        classNames: 'b col6 row3',
        text: 'b',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  n: SDL.Button.extend({
        classNames: 'n col7 row3',
        text: 'n',
        target: 'SDL.KeyboardController',
        action: 'inputChanges'
      }
    ),

  dot: SDL.Button.extend({
      classNames: 'dot col0 row3',
      textBinding: 'getText',
      defaultText: '.',
      customKeyIndex: 0,
      target: 'SDL.KeyboardController',
      action: 'inputChanges',
      getText: function() {
        return SDL.KeyboardController.getCustomKey(this.customKeyIndex, this.defaultText);
      }.property('SDL.SDLController.model.globalProperties.keyboardProperties.customKeys.@each')
    }
  ),

  space: SDL.Button.extend({
      classNames: 'space col1 row3',
      textBinding: 'getText',
      defaultText: ' ',
      customKeyIndex: 1,
      target: 'SDL.KeyboardController',
      action: 'inputChanges',
      getText: function() {
        return SDL.KeyboardController.getCustomKey(this.customKeyIndex, this.defaultText);
      }.property('SDL.SDLController.model.globalProperties.keyboardProperties.customKeys.@each')
    }
  ),

  dash: SDL.Button.extend({
      classNames: 'dash col8 row3',
      textBinding: 'getText',
      defaultText: '-',
      customKeyIndex: 2,
      target: 'SDL.KeyboardController',
      action: 'inputChanges',
      getText: function() {
        return SDL.KeyboardController.getCustomKey(this.customKeyIndex, this.defaultText);
      }.property('SDL.SDLController.model.globalProperties.keyboardProperties.customKeys.@each')
    }
  ),

  ampersand: SDL.Button.extend({
      classNames: 'ampersand col9 row3',
      textBinding: 'getText',
      defaultText: '&',
      customKeyIndex: 3,
      target: 'SDL.KeyboardController',
      action: 'inputChanges',
      getText: function() {
        return SDL.KeyboardController.getCustomKey(this.customKeyIndex, this.defaultText);
      }.property('SDL.SDLController.model.globalProperties.keyboardProperties.customKeys.@each')
    }
  )
}
);
