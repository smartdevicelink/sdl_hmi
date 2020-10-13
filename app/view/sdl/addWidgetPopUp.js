/*
 * Copyright (c) 2019, Ford Motor Company All rights reserved.
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
 * @name SDL.AddWidgetPopUp
 * @desc Pop Up for adding widgets to the container of widgets
 * @category View
 * @filesource app/view/sdl/addWidgetPopUp.js
 * @version 1.0
 */

SDL.AddWidgetPopUp = Em.ContainerView.create(
    {
      elementId: 'addWidgetPopUp',
      classNames: 'addWidgetPopUp',
      classNameBindings: [
        'active'
      ],
      childViews: [
        'deactivate',
        'listOfWidgets'
      ],

      /**
       * @name active
       * @type {Boolean}
       * @description Property indicates the activity state of AddWidgetPopUp
       */
      active: false,
      
      deactivate: SDL.Button.create({
        classNames: 'button backButton',
        text: 'X',
        click: function() {
          this._parentView.toggleActivity();
        },
        buttonAction: true,
        onDown: false,
      }),
      listOfWidgets: SDL.List.extend({

        elementId: 'info_widgets_list',
    
        itemsOnPage: 5,
    
        /** Items */
        items: new Array()
      }),

      /**
       * @function updateWidgetList
       * @description show and update list of non active widgets
       */
      updateWidgetList: function() {
        var apps = SDL.SDLModel.data.registeredApps;
        this.get('listOfWidgets.list').removeAllChildren();
        this.listOfWidgets.list.refresh();
        apps.forEach(element => {
          var appID = element.appID;
          element.inactiveWindows.forEach(nonActive => {
            this.get('listOfWidgets.list.childViews').
               pushObject(SDL.Button.create({
                        classNames: 'list-item button',
                        text: nonActive.windowName,
                        icon: element.appIcon,
                        target: 'SDL.SDLController',
                        action: 'activateWidget',
                        windowID: nonActive.windowID,
                        appID: appID,
                        windowName: nonActive.windowName
                    }
                )
            );
          });
        });
      },

      /**
       * @function toggleActivity
       * @description Trigger function that activates and deactivates AddWidgetPopUp
       */
      toggleActivity: function() {
        this.toggleProperty('active');
        this.updateWidgetList();
        SDL.SDLController.setWebEngineFramesActive(!this.active);
      }
    }
  );
  