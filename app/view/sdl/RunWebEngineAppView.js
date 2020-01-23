/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
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
 * @name SDL.RunWebEngineAppView
 * @desc Run web engine application with params representation
 * @category View
 * @filesource app/view/sdl/RunWebEngineAppView.js
 * @version 1.0
 */

SDL.RunWebEngineAppView = Em.ContainerView.create(
    {
      elementId: 'runWebEngineAppView',
      classNames: 'runWebEngineAppView',
      classNameBindings: [
        'active'
      ],
      childViews: [
        'runWebEngineAppLabel',
        'runWebEngineHTMLPathLabel',
        'runWebEngineHTMLPathInput',
        'runWebEngineSDLHostLabel',
        'runWebEngineSDLHostInput',
        'runWebEngineSDLPortLabel',
        'runWebEngineSDLPortInput',
        'runWebEngineSDLTransportLabel',
        'runWebEngineSDLTransportSelect',
        'runWebEngineCancelButton',
        'runWebEngineLaunchButton'
      ],

      /**
       * Property indicates the activity state of RunWebEngineAppView
       */
      active: false,

      /**
       * Policy app id to launch
       */
      policyAppIdToLaunch: 0,

      /**
       * Title text to display
       */
      titleText: 'Run WebEngine App',

      /**
       * Title of RunWebEngineAppView
       */
      runWebEngineAppLabel: SDL.Label.extend(
        {
          elementId: 'runWebEngineAppLabel',
          classNames: 'runWebEngineAppLabel',
          contentBinding: 'parentView.titleText'
        }
      ),

      /**
       * Path to HTML page to execute label
       */
      runWebEngineHTMLPathLabel: SDL.Label.extend(
        {
          elementId: 'runWebEngineHTMLPathLabel',
          classNames: 'runWebEngineHTMLPathLabel',
          content: 'HTML path:'
        }
      ),

      /**
       * Path to HTML page to execute input
       */
      runWebEngineHTMLPathInput: Ember.TextField.extend(
        {
            elementId: 'runWebEngineHTMLPathInput',
            classNames: 'runWebEngineHTMLPathInput',
            value: document.location.pathname.replace(
                'index.html', 'webengine/hello-sdl/index.html'
            )
        }
      ),

      /**
       * SDL host param label
       */
      runWebEngineSDLHostLabel: SDL.Label.extend(
        {
          elementId: 'runWebEngineSDLHostLabel',
          classNames: 'runWebEngineSDLHostLabel',
          content: 'SDL host:'
        }
      ),

      /**
       * SDL host param input
       */
      runWebEngineSDLHostInput: Ember.TextField.extend(
        {
            elementId: 'runWebEngineSDLHostInput',
            classNames: 'runWebEngineSDLHostInput',
            value: 'localhost'
        }
      ),

      /**
       * SDL port param label
       */
      runWebEngineSDLPortLabel: SDL.Label.extend(
        {
          elementId: 'runWebEngineSDLPortLabel',
          classNames: 'runWebEngineSDLPortLabel',
          content: 'SDL port:'
        }
      ),

      /**
       * SDL port param input
       */
      runWebEngineSDLPortInput: Ember.TextField.extend(
        {
            elementId: 'runWebEngineSDLPortInput',
            classNames: 'runWebEngineSDLPortInput',
            value: '2020'
        }
      ),

      /**
       * SDL transport role param label
       */
      runWebEngineSDLTransportLabel: SDL.Label.extend(
        {
          elementId: 'runWebEngineSDLTransportLabel',
          classNames: 'runWebEngineSDLTransportLabel',
          content: 'SDL transport:'
        }
      ),

      /**
       * SDL transport role param selection box
       */
      runWebEngineSDLTransportSelect: Em.Select.extend(
        {
          elementId: 'runWebEngineSDLTransportSelect',
          classNames: 'runWebEngineSDLTransportSelect',
          content: [
            'ws-server',
            'wss-server',
            'ws-client',
            'wss-client',
            'tcp-server',
            'tcp-client'
          ],
          selection: 'ws-client'
        }
      ),

      /**
       * Button to cancel web application activation process
       */
      runWebEngineCancelButton: SDL.Button.extend(
        {
          classNames: 'button runWebEngineCancelButton',
          text: 'Cancel Activation',
          onDown: false,
          action: function() {
            SDL.RunWebEngineAppView.toggleActivity();
          }
        }
      ),

      /**
       * Button to launch web application with specified params
       */
      runWebEngineLaunchButton: SDL.Button.extend(
        {
          classNames: 'button runWebEngineLaunchButton',
          text: 'Activate App',
          onDown: false,
          action: function(element) {
            var properties = {
                'policyAppID': SDL.RunWebEngineAppView.policyAppIdToLaunch,
                'url' : SDL.RunWebEngineAppView.runWebEngineHTMLPathInput.value,
                'host': SDL.RunWebEngineAppView.runWebEngineSDLHostInput.value,
                'port': SDL.RunWebEngineAppView.runWebEngineSDLPortInput.value,
                'role': SDL.RunWebEngineAppView.runWebEngineSDLTransportSelect.selection
            };
            SDL.InfoController.runAppWithProperties(properties);
            SDL.RunWebEngineAppView.toggleActivity();
          }
        }
      ),

      /**
       * Trigger function that activates and deactivates tbtClientStateView
       */
      toggleActivity: function() {
        this.toggleProperty('active');
      }
    }
  );
