/*
 * Copyright (c) 2019, Livio All rights reserved.
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
 * @name SDL.NavigationSubscriptionButtonsView
 * @desc Options visual representation
 * @category View
 * @filesource app/view/sdl/shared/optionsView.js
 * @version 1.0
 */

SDL.NavigationSubscriptionButtonsView = SDL.SDLAbstractView.create(
  {
    elementId: 'sdl_sub_nav_buttons_list',
    childViews: [
      'backButton',
      'captionText',
      'commands'
    ],
    // Menu caption text
    caption: 'Subscribed Navigation Buttons',
    activate: function(text) {
      this._super();
      SDL.SDLController.buttonsSort('top', SDL.SDLController.model.appID);
      SDL.NavigationSubscriptionButtonsView.commands.refreshItems();
      //SDL.SDLController.onSystemContextChange();
    },
    // Extend deactivate window
    deactivate: function() {
      if (SDL.SDLController.model) {
        if (SDL.SDLController.model.get('currentSubMenuId') >= 0) {
          SDL.SDLController.onSubMenu('top');
        } else {
          this._super();
        }
      }
      //SDL.SDLController.onSystemContextChange();
    },
    commands: SDL.List.extend(
      {
        elementId: 'info_navbuttons_list',
        itemsOnPage: 5,
        items: [],
        /*
         * itemsDefault: [ { type: SDL.Button,
         *
         * params: { templateName: 'text', text: 'Exit', target:
         * 'this.parentView.parentView.parentView', action: 'deactivate',
         * onDown: false } }, { type: SDL.Button,
         *
         * params: { templateName: 'arrow', text: 'Device Information', } } ],
         */

        refreshItems: function() {
          Em.Logger.log('Refresh items??? ' + SDL.SDLController.model);
          if (SDL.SDLController.model) {
            var buttons = SDL.SDLController.model.get('NAV_BUTTONS'),
              i,
              template;
            this.items = [];
            for (var key in buttons) {
              template = "text";
              var obj = buttons[key];
              if (!obj.subscribed) {
                continue;
              }
              this.items.push(
                {
                  type: SDL.Button.extend(SDL.PresetEvents),
                  params: {
                    templateName: template,
                    text: obj.text,
                    presetName: key,
                    target: 'SDL.SDLController',
                    action: 'onNavButton',
                    onDown: true
                  }
                }
              );
            }
            this.list.refresh();
          }
        }.observes(
          'SDL.SDLController.model.NAV_BUTTONS.@each'
        )
      }
    )
  }
);
