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
 * @name SDL.AppsStoreView
 * @desc Info Applications Store visual representation
 * @category View
 * @filesource app/view/info/appsStoreView.js
 * @version 1.0
 */

SDL.AppsStoreView = Em.ContainerView.create({

    elementId: 'info_apps_store',

    classNameBindings: [
      'SDL.States.info.apps_store.active:active_state:inactive_state'
    ],

    childViews: [
        'appsStoreLabel',
        'availableAppsView',
        'getAppsPropertiesButton',
        'setAppPropertiesButton'
    ],

    appsStoreLabel: SDL.Label.extend({
        elementId: 'appsStoreLabel',
        classNames: 'appsStoreLabel',
        content: 'Applications Store'
      }
    ),

    getAppsPropertiesButton: SDL.Button.create({
        elementId: 'get_apps_properties_button',
        classNames: 'get_apps_properties btn',
        text: 'Get Apps Properties',
        templateName: 'text',
        action: function() {
          SDL.InfoController.getAvailableAppsProperties();
        }
      }
    ),

    setAppPropertiesButton: SDL.Button.create({
      elementId: 'set_app_properties_button',
      classNames: 'set_app_properties btn',
      text: 'Set App Properties',
      templateName: 'text',
      action: function() {
        SDL.InfoController.setNewAppProperties();
      }
    }),

    availableAppsView: Em.ContainerView.extend({
      childViews: [
        'availableAppsLabel',
        'availableAppsList'
      ],

      elementId: 'availableAppsView',
      classNames: 'availableAppsView',

      availableAppsLabel: SDL.Label.extend({
        elementId: 'availableAppsLabel',
        classNames: 'availableAppsLabel',
        content: 'Available applications'
      }),

      availableAppsList: SDL.List.extend({
        elementId: 'availableAppsList',
        itemsOnPage: 5,
        items: new Array()
      })
    })
  }
);
