/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
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
 * @name SDL.WebAppSettingsView
 * @desc Web app settings visual representation
 * @category View
 * @filesource app/view/info/webAppSettingsView.js
 * @version 1.0
 */

SDL.WebAppSettingsView = Em.ContainerView.create({

    elementId: 'info_web_app_settings',

    classNameBindings: [
      'SDL.States.info.web_app_settings.active:active_state:inactive_state'
    ],

    childViews: [
      'appPropertiesEditor',
      'backButton',
      'delButton',
      'getButton',
      'setButton'
    ],

    /**
     * @description Current application settings displayed by editor
     */
    editorAppSettings: {},

    /**
     * @description Code editor element
     */
    appPropertiesEditor: SDL.CodeEditor.create(
        {
          codeEditorId: 'app_properties_code_editor',
          elementId: 'app_properties_editor'
        }
    ),

    /**
     * @description Back button element
     */
    backButton: SDL.Button.create({
        elementId: 'back_button',
        classNames: 'back_button btn',
        text: 'Back',
        templateName: 'text',
        action: function() {
            SDL.States.goToStates('info.apps_store');
        }
      }
    ),

    /**
     * @description Delete button element
     */
    delButton: SDL.Button.create({
        elementId: 'del_button',
        classNames: 'del_button btn',
        text: 'Delete',
        templateName: 'text',
        action: function() {
          SDL.InfoController.deleteAppProperties(SDL.WebAppSettingsView.editorAppSettings);
        }
      }
    ),

    /**
     * @description Get button element
     */
    getButton: SDL.Button.create({
        elementId: 'get_button',
        classNames: 'get_button btn',
        text: 'Get',
        templateName: 'text',
        action: function() {
          SDL.WebAppSettingsView.appPropertiesEditor.set('callback',
            function(new_properties) {
              SDL.WebAppSettingsView.editorAppSettings = SDL.deepCopy(new_properties);
              SDL.InfoController.getAppProperties(new_properties);
          });

          SDL.WebAppSettingsView.appPropertiesEditor.saveWithComments();
          SDL.WebAppSettingsView.showProperties();
        }
      }
    ),

    /**
     * @description Set button element
     */
    setButton: SDL.Button.create({
        elementId: 'set_button',
        classNames: 'set_button btn',
        text: 'Set',
        templateName: 'text',
        action: function() {
          SDL.WebAppSettingsView.appPropertiesEditor.set('callback',
            function(new_properties) {
              SDL.WebAppSettingsView.editorAppSettings = SDL.deepCopy(new_properties);
              SDL.InfoController.setAppProperties(new_properties);
          });

          SDL.WebAppSettingsView.appPropertiesEditor.saveWithComments();
          SDL.WebAppSettingsView.showProperties();
        }
      }
    ),

    /**
     * @function showProperties
     * @description Shows current app properties in editor
     */
    showProperties: function() {
      var settings = JSON.stringify(this.editorAppSettings, null, 2);
      var settings_array = settings.split(/\r?\n/);
      var insert_index = settings_array.length - 1;

      if (!this.editorAppSettings.hasOwnProperty('endpoint')) {
        settings_array.splice(insert_index, 0, '  // "endpoint": "endpoint"');
      }

      if (!this.editorAppSettings.hasOwnProperty('authToken')) {
        settings_array.splice(insert_index, 0, '  // "authToken": "token"');
      }

      this.appPropertiesEditor.set('content', settings_array.join('\r\n'));
      this.appPropertiesEditor.activate();
    }
  }
);
