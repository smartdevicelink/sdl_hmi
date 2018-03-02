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
      'WPList',
      'codeEditor',
      'clearButton',
      'WPButton',
      'AddWP',
      'map',
      'navigate',
      'animate'
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
            var details = SDL.deepCopy(SDL.NavigationModel.LocationDetails[i]);
            items.push(
              {
                type: SDL.Button,
                params: {
                  itemID: i,
                  className: 'button',
                  text: details.locationName ? details.locationName : "Unknown location",
                  disabled: false,
                  icon: details.locationImage ? details.locationImage.value : null,
                  templateName: details.locationImage ? '' : 'text',
                  action: 'openDestPoint',
                  target: 'SDL.NavigationController'
                }
              }
            );
          }
          this.set('disableScrollbar', items.length <= this.itemsOnPage);
          return items;
        }.property('SDL.NavigationModel.LocationDetails.@each')
      }
    ),
    WPList: SDL.List.extend(
      {
        elementId: 'wpList',
        itemsOnPage: 5,
        classNameBindings: ['SDL.NavigationModel.wp::hidden'],
        itemsBinding: 'this.itemGenerator',
        itemGenerator: function() {
          var items = [];
          for (var i = 0; i < SDL.NavigationModel.WayPointDetails.length; i++) {
            var details = SDL.deepCopy(SDL.NavigationModel.WayPointDetails[i]);
            items.push(
              {
                type: SDL.Button,
                params: {
                  itemID: i,
                  className: 'button',
                  text: details.locationDescription ? details.locationDescription : "Unknown waypoint",
                  disabled: false,
                  icon: details.locationImage ? details.locationImage.value : null,
                  templateName: details.locationImage ? 'rightText' : 'text',
                  action: 'selectWayPoint',
                  target: 'SDL.NavigationController'
                }
              }
            );
          }
          this.set('disableScrollbar', items.length <= this.itemsOnPage);
          return items;
        }.property('SDL.NavigationModel.WayPointDetails.@each')
      }
    ),
    codeEditor: SDL.CodeEditor.extend(
      {
        codeEditorId: 'navigationEditor',
        contentBinding: 'SDL.NavigationModel.currentWayPointData',
        childViews: [
          'editor',
          'buttonOk',
          'buttonSelect',
          'buttonDelete',
          'backButton'
        ],
        buttonSelect: SDL.Button.extend(
          {
            classNames: 'button ResetButton',
            text: 'Select',
            action: 'waypointSelected',
            target: 'SDL.NavigationController',
            onDown: false
          }
        )
      }
    ),
    clearButton: SDL.Button.extend(
      {
      isButtonDisabled: function() {
        return SDL.NavigationModel.WayPointDetails.length == 0 ||
               SDL.NavigationController.isAnimateStarted;
      }.property('SDL.NavigationModel.WayPointDetails',
                 'SDL.NavigationController.isAnimateStarted'),
      classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',
      elementId: 'clearButton',
      disabledBinding: 'isButtonDisabled',
      classNames: 'clearButton button',
      text: 'Clear',
      action: 'clearRoutes',
      target: 'SDL.NavigationController'
    }
  ),
    WPButton: SDL.Button.extend(
      {
        isButtonDisabled: function() {
          return SDL.NavigationModel.WayPointDetails.length == 0 ||
                 SDL.NavigationController.isAnimateStarted;
        }.property('SDL.NavigationModel.WayPointDetails',
                   'SDL.NavigationController.isAnimateStarted'),
        classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',
        disabledBinding: 'isButtonDisabled',
        elementId: 'WPButton',
        classNames: 'WPButton button',
        text: 'Waypoints',
        action: 'showWpList',
        target: 'SDL.NavigationController'
      }
    ),
    AddWP: SDL.Button.extend(
      {
        classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',
        disabledBinding: 'SDL.NavigationController.isAnimateStarted',
        elementId: 'AddWP',
        classNames: 'AddWP button',
        text: 'Add waypoint',
        action: 'addWP',
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
          'SDL.NavigationController.isAnimateStarted'
        ),
        classNames: 'navigationButton button',
        text: 'Navigate',
        action: 'setRoutes',
        target: 'SDL.NavigationController'
      }
    ),
    animate: SDL.Button.extend(
      {
        classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',
        elementId: 'animateButton',
        classNames: 'animateButton button',
        disabledBinding: 'getDisabled',
        getDisabled: function() {
          return !SDL.NavigationController.isRouteSet;
        }
        .property('SDL.NavigationController.isRouteSet'),
        textBinding: 'getAnimateText',
        getAnimateText: function() {
          return !SDL.NavigationController.isAnimateStarted ?
                 'Start animation' :
                 'Stop animation';
        }
        .property('SDL.NavigationController.isAnimateStarted'),
        action: 'startAnimation',
        target: 'SDL.NavigationController'
      }
    )
  }
);