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
 * @name SDL.WebEngineView
 * @desc WebEngine view
 * @category View
 * @filesource app/view/webEngine/webEngineView.js
 * @version 1.0
 */
SDL.WebEngineView = Em.ContainerView.create({
      elementId: 'webEngineView',

      classNameBindings: [
        'SDL.States.webViewApp.active:active_state:inactive_state'
      ],

      childViews: [
        'TemplateTitleLabel',
        'ExitButton',
        'MenuButton'
      ],

      isExitButtonVisible : true,

      TemplateTitleLabel : SDL.Label.extend({
        elementId: 'template_title_label',
        contentBinding: 'SDL.SDLController.model.templateConfiguration.template'
      }),

      ExitButton: SDL.Button.extend({
        classNames: 'button ExitButton',
        classNameBindings: ['parentView.isExitButtonVisible::inactive_state'],
        text: 'EXIT',
        commandID: -2,
        target: 'SDL.SDLController',
        action: 'onCommand',
        onDown: false
      }),

      MenuButton: SDL.Button.extend({
        classNames: 'button MenuButton',
        classNameBindings: ['parentView.isExitButtonVisible:inactive_state'],
        text: 'MENU',
        target: 'SDL.SDLController',
        action: 'openCommandsList',
        onDown: false
      }),

      trackApplicationCommands: function() {
        if (SDL.SDLController.model) {
          let commands = SDL.SDLController.model.get('currentCommandsList');
          if (commands == null) {
            commands = [];
          }

          let is_custom_commands = false;
          commands.forEach(command => {
            if (command.commandID >= 0) {
              is_custom_commands = true;
            }
          });

          this.set('isExitButtonVisible', !is_custom_commands);
        }
      }.observes(
        'SDL.SDLController.model.currentSubMenuId',
        'SDL.SDLController.model.currentCommandsList.@each'
      )
});
