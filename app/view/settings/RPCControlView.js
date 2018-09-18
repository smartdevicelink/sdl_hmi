/*
 * Copyright (c) 2018, Ford Motor Company All rights reserved.
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
SDL.RPCControlView = Em.ContainerView.create(
    {
        elementId: 'rpc_settings',
        classNames: 'in_settings_view',
        classNameBindings: [
            'SDL.States.settings.rpccontrol.active:active_state:inactive_state'
        ],
        childViews: [
            'AppsList'
        ],
        showAppList: function() {
          this.get('AppsList.list').removeAllChildren();
          this.AppsList.list.refresh();
          var i, apps = SDL.SDLModel.data.registeredApps, appIndex;
          if (0 == apps.length && SDL.States.currentState.name == 'rpccontrol') {
            SDL.States.goToStates('settings.policies');
          }

          this.get('AppsList.list.childViews').pushObject(SDL.Button.create(
            {
              action: 'onState',
              target: 'SDL.SettingsController',
              goToState:'rpccontrol.rpcwaypointconfig',
              text: 'Subscribe Way Points',
              classNames: 'list-item button'
            }));
          this.get('AppsList.list.childViews').pushObject(SDL.Button.create(
            {
              action: 'onState',
              target: 'SDL.SettingsController',
              goToState:'rpccontrol.rpcvehicledataconfig',
              text: 'Vehicle Data',
              classNames: 'list-item button'
            }));
            
          for (i = 0; i < apps.length; i++) {
            appIndex = SDL.SDLModel.data.registeredApps.indexOf(apps[i]);
            this.get('AppsList.list.childViews').pushObject(SDL.Button.create(
              {
                action: 'onState',
                target: 'SDL.SettingsController',
                goToState:'rpccontrol.rpcconfig',
                text: apps[i].appName,
                appName: apps[i].appName,
                appID: apps[i].appID,
                classNames: 'list-item button',
                iconBinding: 'SDL.SDLModel.data.registeredApps.' + appIndex +
                  '.appIcon',
                disabled: apps[i].disabledToActivate
              }));
          }
        },
        
        AppsList: SDL.List.extend({
          elementId: 'rpc_settings_list',
          classNames: 'rpc_settings_list',
          itemsOnPage: 5,
          items: new Array()
        })
    }
);
