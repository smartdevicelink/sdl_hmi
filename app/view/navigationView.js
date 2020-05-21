/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
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
 * @name SDL.NavigationView
 * @desc Navigation component
 * @category View
 * @filesource app/view/navigationView.js
 * @version 1.0
 */
SDL.NavigationView = Em.ContainerView.create(
  {
    /** View Id */
    elementId: 'navigationView',
    classNames: ['navigationView'],
    classNameBindings: [
      'SDL.States.navigation.active:active_state:inactive_state'
    ],
    childViews: [
      'POIList',
      'codeEditor',
      'POIButton',
      'map',
      'navigate'
    ],
    POIList: SDL.List.extend(
      {
        elementId: 'poiList', //info_apps_list
        itemsOnPage: 5,
        classNameBindings: ['SDL.NavigationModel.poi::hidden'],
        itemsBinding: 'this.itemGenerator',
        itemGenerator: function() {
          var items = [];
          for (var i = 0; i < SDL.NavigationModel.LocationDetails.length; i++) {
            items.push(
              {
                type: SDL.Button,
                params: {
                  itemID: i,
                  className: 'button',
                  text: SDL.NavigationModel.LocationDetails[i].locationName,
                  disabled: false,
                  icon: SDL.NavigationModel.LocationDetails[i].locationImage.value,
                  templateName: SDL.NavigationModel.LocationDetails[i].locationImage
                    ? '' : 'text',
                  action: 'openWayPoint',
                  target: 'SDL.NavigationController'
                }
              }
            );
          }
          return items;
        }.property('SDL.NavigationModel.LocationDetails.@each')
      }
    ),
    codeEditor: SDL.CodeEditor.extend(
      {
        codeEditorId: 'navigationEditor',
        contentBinding: 'SDL.NavigationModel.currentWayPointData'
      }
    ),
    POIButton: SDL.Button.extend(
      {
        classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',
        elementId: 'POIButton',
        disabledBinding: Em.Binding.oneWay(
          'SDL.NavigationController.isRouteSet'
        ),
        classNames: 'POIButton button',
        text: 'POI',
        action: 'showPoiList',
        target: 'SDL.NavigationController'
      }
    ),
    map: Em.View.extend(
      {
        classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',
        elementId: 'map'
      }
    ),
    navigate: SDL.Button.extend(
      {
        classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',
        elementId: 'navigationButton',
        disabledBinding: Em.Binding.oneWay(
          'SDL.NavigationController.isRouteSet'
        ),
        classNames: 'navigationButton button',
        text: 'Navigate',
        action: 'setRoutes',
        target: 'SDL.NavigationController'
      }
    ),

    /**
     * @description Callback for display image mode change.
     */
    imageModeChanged: function() { 
      SDL.NavigationView.POIButton.setMode(SDL.SDLModel.data.imageMode);
      SDL.NavigationView.navigate.setMode(SDL.SDLModel.data.imageMode);
    }.observes('SDL.SDLModel.data.imageMode')
  }
);
