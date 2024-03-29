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
 * @name SDL.sdlView
 * @desc SDL Media application module visual representation
 * @category View
 * @filesource app/view/media/sdlView.js
 * @version 1.0
 */
SDL.sdlView = Em.ContainerView
  .create(
    {
      /**
       * View Id
       */
      elementId: 'sdl_view_container',
      classNameBindings: [
        'this.activeState:active_state:inactive_state'
      ],
      activeState: function() {
        if (SDL.TurnByTurnView.activeTBT) {
          return false;
        } else if (SDL.States.media.sdlmedia.active) {
          return true;
        } else {
          return false;
        }
      }.property(
        'SDL.States.media.sdlmedia.active', 'SDL.TurnByTurnView.activeTBT'
      ),
      /**
       * View Components
       */
      childViews: [
        'innerMenu',
        'controlls'
      ],
      controlls: SDL.SDLMediaControlls,
      /**
       * Deactivate View
       */
      deactivate: function() {
        SDL.States.goToStates('info.apps');
      },
      innerMenu: SDL.MenuList
        .extend(
          {
            refreshItems: function() {
              if (SDL.SDLController.model && 
                   (SDL.SDLController.model.appID == SDL.NonMediaController.currentAppId || 
                    SDL.SDLController.model.templateConfiguration.template == "MEDIA")) {
                this.addItems(
                  SDL.SDLController.model.softButtons,
                  SDL.SDLController.model.appID
                );
              }
            }.observes(
              'SDL.SDLController.model.softButtons.@each'),
            updateOptionsButton: function() {
              if (SDL.SDLController.model && 
                   (SDL.SDLController.model.appID == SDL.NonMediaController.currentAppId || 
                    SDL.SDLController.model.templateConfiguration.template == "MEDIA")) {
                var menuTitle = SDL.SDLController.model.globalProperties.menuTitle
                this.get('content.optionsButton').set('text', menuTitle && menuTitle.length ? menuTitle : 'Options')
                var menuIcon = SDL.SDLController.model.globalProperties.menuIcon
                this.get('content.optionsButton').set('icon', menuIcon && menuIcon.value && menuIcon.value.length ? menuIcon.value : null)
                this.get('content.optionsButton').set('templateName', menuIcon && menuIcon.isTemplate ? 'arrowShortOverLay' : 'arrowShort')
              }
            }.observes(
              'SDL.SDLController.model.globalProperties.menuTitle',
              'SDL.SDLController.model.globalProperties.menuIcon'),
            groupName: 'MediaView',
            elementId: 'sdl_view_container_menu',
            content: Em.ContainerView.extend(
              {
                classNames: [
                  'content'
                ],
                attributeBindings: [
                  'parentView.contentPositon:style'
                ],
                childViews: [
                  'optionsButton'
                ],
                optionsButton: SDL.Button.extend(
                  {
                    text: 'Options',
                    classNames: 'softButton',
                    templateName: 'arrowShort',
                    action: 'openCommandsList',
                    target: 'SDL.SDLController'
                  }
                )
              }
            )
          }
        )
    }
  );
