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
 * @name SDL.OptionsView
 * @desc Options visual representation
 * @category View
 * @filesource app/view/sdl/shared/optionsView.js
 * @version 1.0
 */

SDL.OptionsView = SDL.SDLAbstractView.create(
  {
    elementId: 'sdl_options',
    childViews: [
      'backButton',
      'captionText',
      'commands'
    ],
    // Menu caption text
    captionBinding: 'SDL.SDLController.model.currentSubMenuLabel',
    activate: function(text) {
      this._super();
      SDL.SDLController.buttonsSort('top', SDL.SDLController.model.appID);
      SDL.OptionsView.commands.addPageListener(this.onOptionsPageChanged);
      SDL.OptionsView.commands.refreshItems();
      SDL.SDLController.onSystemContextChange();
      SDL.SDLModel.data.registeredApps.forEach(app => {
        app.activeWindows.forEach(widget => {
          SDL.SDLController.onSystemContextChange(app.appID, widget.windowID);
        })
      })
    },
    /**
     * Listener for options page scroller
     * @param {Integer} new_page
     */
    onOptionsPageChanged: function(new_page) {
      const items_per_page = SDL.OptionsView.commands.itemsOnPage;
      const start_index = new_page * items_per_page;
      const end_index = Math.min(start_index + items_per_page,
        SDL.OptionsView.commands.items.length);

      let items = SDL.OptionsView.commands.items;
      let menu_nested_items = SDL.SDLController.model.get('commandsList');
      for (let i = start_index; i < end_index; ++i) {
        const menuID = items[i].params.menuID;
        if (menuID && menuID >= 0 && menu_nested_items[menuID].length === 0) {
          // Notify mobile to update submenu
          SDL.SDLController.onUpdateSubMenu(menuID);
        }
      }
    },
    // Extend deactivate window
    deactivate: function() {
      if (SDL.SDLController.model) {
        var currentSubMenuID = SDL.SDLController.model.get('currentSubMenuId');
        if (currentSubMenuID != 'top' &&
          currentSubMenuID >= 0) {
          var commandsList = SDL.SDLController.model.get('commandsList');
          var findParentID = (commands, menuID) => {
            for (id in commands) {
              var subMenuCommands = commands[id];
              for (element of subMenuCommands) {
                if (element.menuID === menuID) {
                  return element.parent;
                }
              }
            }
            return 'top';
          }
          SDL.SDLController.onSubMenu(findParentID(commandsList, currentSubMenuID));
        } else {
          SDL.SDLController.onSubMenu('top');
          this._super();
        }
      }
      SDL.SDLController.onSystemContextChange();
      SDL.SDLModel.data.registeredApps.forEach(app => {
        app.activeWindows.forEach(widget => {
          SDL.SDLController.onSystemContextChange(app.appID, widget.windowID);
        })
      })
    },
    commands: SDL.List.extend(
      {
        elementId: 'info_nonMedia_options_list',
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
          if (SDL.SDLController.model) {
            var commands = SDL.SDLController.model.get('currentCommandsList'),
              allMenuItems = SDL.SDLController.model.get('commandsList'),
              i,
              len,
              template;
            this.items = [];
            if (SDL.SDLModel.data.driverDistractionState) {
              var ddMaxLength = SDL.systemCapabilities.driverDistractionCapability.menuLength;
              len = (ddMaxLength > commands.length) ? commands.length : ddMaxLength;
            } else {
              len = commands.length;
            }
            for (i = 0; i < len; i++) {
              var menuID = commands[i].menuID;
              if (menuID && menuID >= 0) {
                template = 'arrowExtended';
              } else {
                template = 'extended';
              }
              this.items.push(
                {
                  type: SDL.Button,
                  params: {
                    templateName: template,
                    text: commands[i].name,
                    commandID: commands[i].commandID,
                    menuID: menuID,
                    icon: commands[i].icon,
                    isTemplate: commands[i].isTemplate,
                    target: 'SDL.SDLController',
                    action: 'onCommand',
                    onDown: false,
                    secondaryText: commands[i].secondaryText,
                    tertiaryText: commands[i].tertiaryText,
                    secondaryIcon: commands[i].secondaryImage,
                    isSecondaryTemplate: commands[i].isSecondaryTemplate 
                  }
                }
              );
            }
            if (commands.length !== len) {
              this.items.push(
                {
                  type: SDL.Button,
                  params: {
                    templateName: "text",
                    text: "Some Menu Items Are Hidden",
                    onDown: false,
                    disabled: true
                  }
                }
              );
            }
            this.list.refresh();
          }
        }.observes(
          'SDL.SDLController.model.currentSubMenuId'
        )
      }
    )
  }
);
