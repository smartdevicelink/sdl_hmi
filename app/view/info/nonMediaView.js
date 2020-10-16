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
 * @name SDL.InfoNonMedia
 * @desc NonMedia application visual representation
 * @category View
 * @filesource app/view/info/nonMedia.js
 * @version 1.0
 */

SDL.InfoNonMedia = Em.ContainerView.create(
  {

    elementId: 'info_nonMedia',

    controller: SDL.SDLController,

    childViews: [
      'content'
    ],

    classNameBindings: [
      'this.activeState:active_state:inactive_state'
    ],

    activeState: function() {
      if (SDL.TurnByTurnView.activeTBT) {
        return false;
      } else if (SDL.States.info.nonMedia.active) {
        return true;
      } else {
        return false;
      }
    }.property(
      'SDL.States.info.nonMedia.active', 'SDL.TurnByTurnView.activeTBT'
    ),

    content: Em.ContainerView.extend(
      {
        classNames: [
          'inner_content'
        ],

        childViews: [
          'templateTitle', 'image', 'fields', 'innerMenu', 'presets'
        ],

        /**
         * Deactivate View
         */
        deactivate: function() {

          SDL.States.goToStates('info.apps');
        },

        templateTitle: SDL.Label.extend(
          {

            classNames: [
              'app_title'
            ],

            contentBinding: 'SDL.SDLController.model.appInfo.title'
          }
        ),

        image: Em.View.extend(
          {

            classNames: [
              'app_image'
            ],

            template: Ember.Handlebars.compile(
              '<img width="150px" onerror="this.style.display=\'none\'" {{bindAttr src="SDL.SDLController.model.appInfo.mainImage"}}>'
            )
          }
        ),

        fields: Em.ContainerView.extend(
          {

            classNames: [
              'app_fields'
            ],

            childViews: [
              'field1', 'field2', 'field3', 'field4'
            ],

            field1: SDL.Label.extend(
              {
                contentBinding: 'SDL.SDLController.model.appInfo.field1',
                attributeBindings: ['style'],
                style: function() {
                  if (SDL.SDLController.model) {
                    return SDL.SDLController.model.appInfo.alignment;
                  } else {
                    return null;
                  }
                }.property('SDL.SDLController.model.appInfo.alignment')
              }
            ),

            field2: SDL.Label.extend(
              {
                contentBinding: 'SDL.SDLController.model.appInfo.field2',
                attributeBindings: ['style'],
                style: function() {
                  if (SDL.SDLController.model) {
                    return SDL.SDLController.model.appInfo.alignment;
                  } else {
                    return null;
                  }
                }.property('SDL.SDLController.model.appInfo.alignment')
              }
            ),

            field3: SDL.Label.extend(
              {
                contentBinding: 'SDL.SDLController.model.appInfo.field3'
              }
            ),

            field4: SDL.Label.extend(
              {
                contentBinding: 'SDL.SDLController.model.appInfo.field4'
              }
            )

          }
        ),

        innerMenu: SDL.MenuList.extend(
          {

            refreshItems: function() {

              if (SDL.SDLController.model && SDL.SDLController.model.appID ==
                SDL.NonMediaController.currentAppId) {
                this.addItems(
                  SDL.SDLController.model.softButtons,
                  SDL.SDLController.model.appID
                );
              }
            }.observes('SDL.SDLController.model.softButtons.@each'),
            updateOptionsButton: function() {
              if (SDL.SDLController.model && SDL.SDLController.model.appID ==
                SDL.NonMediaController.currentAppId) {
                var menuTitle = SDL.SDLController.model.globalProperties.menuTitle
                this.get('content.optionsButton').set('text', menuTitle && menuTitle.length ? menuTitle : 'Options')
                var menuIcon = SDL.SDLController.model.globalProperties.menuIcon
                this.get('content.optionsButton').set('icon', menuIcon && menuIcon.value && menuIcon.value.length ? menuIcon.value : null)
                this.get('content.optionsButton').set('templateName', menuIcon && menuIcon.isTemplate ? 'arrowShortOverLay' : 'arrowShort')
              }
            }.observes(
              'SDL.SDLController.model.globalProperties.menuTitle',
              'SDL.SDLController.model.globalProperties.menuIcon'),

            groupName: 'NonMediaView',

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
        ),

        presets: Em.ContainerView.extend(
          {
            classNames: [
              'presets'
            ],

            classNameBindings: [
              'hidden'
            ],

            hidden: function() {

              if (SDL.SDLController.model) {
                return !Boolean(
                  SDL.SDLController.model.get('appInfo.customPresets').length
                );
              }

            }.property('SDL.SDLController.model.appInfo.customPresets.@each'),

            childViews: [
              'perset1',
              'perset2',
              'perset3',
              'perset4',
              'perset5',
              'perset6',
              'perset7',
              'perset8',
              'perset9',
              'perset10'
            ],

            perset1: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.0',
                presetName: 'PRESET_0',
                templateName: 'text'
              }
            ),
            perset2: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.1',
                presetName: 'PRESET_1',
                templateName: 'text'
              }
            ),
            perset3: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.2',
                presetName: 'PRESET_2',
                templateName: 'text'
              }
            ),
            perset4: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.3',
                presetName: 'PRESET_3',
                templateName: 'text'
              }
            ),
            perset5: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.4',
                presetName: 'PRESET_4',
                templateName: 'text'
              }
            ),
            perset6: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.5',
                presetName: 'PRESET_5',
                templateName: 'text'
              }
            ),
            perset7: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.6',
                presetName: 'PRESET_6',
                templateName: 'text'
              }
            ),
            perset8: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.7',
                presetName: 'PRESET_7',
                templateName: 'text'
              }
            ),
            perset9: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.8',
                presetName: 'PRESET_8',
                templateName: 'text'
              }
            ),
            perset10: SDL.Button.extend(
              SDL.PresetEvents, {
                textBinding: 'SDL.SDLController.model.appInfo.customPresets.9',
                presetName: 'PRESET_9',
                templateName: 'text'
              }
            )
          }
        )
      }
    )
  }
);
