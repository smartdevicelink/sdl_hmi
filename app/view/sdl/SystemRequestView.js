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
 * @name SDL.systemRequest
 * @desc Exit All Applications reason select visual representation
 * @category View
 * @filesource app/view/sdl/systemRequestView.js
 * @version 1.0
 */

SDL.SystemRequest = Em.ContainerView.create(
  {
    elementId: 'systemRequestView',
    classNames: 'systemRequestView',
    classNameBindings: [
      'active'
    ],
    childViews: [
      'systemRequestViewLabel',
      'systemRequestViewTitle',
      'systemRequestViewSelect',
      'urlsLabel',
      'systemRequestLabel',
      'urlsInput',
      'requestSubTypeInput',
      'appIDSelect',
      'appIDSelectTitle',
      'sendButton',
      'fileNameLabel',
      'fileNameInput'
    ],
    /**
     * Title of systemRequest PopUp view
     */
    systemRequestViewLabel: SDL.Label.extend(
      {
        elementId: 'systemRequestViewLabel',
        classNames: 'systemRequestViewLabel',
        content: 'System Request'
      }
    ),
    /**
     * Property indicates the activity state of SystemRequest View
     */
    active: false,
    /**
     * Title of systemRequest group of parameters
     */
    systemRequestViewTitle: SDL.Label.extend(
      {
        elementId: 'systemRequestViewTitle',
        classNames: 'systemRequestViewTitle',
        content: 'System Request reason'
      }
    ),
    /**
     * HMI element Select with parameters of systemRequest requestType's
     */
    systemRequestViewSelect: Em.Select.extend(
      {
        elementId: 'systemRequestViewSelect',
        classNames: 'systemRequestViewSelect',
        contentBinding: 'SDL.SDLModel.data.systemRequestState',
        optionValuePath: 'content.id',
        optionLabelPath: 'content.name'
      }
    ),
    /**
     * Label for URLs Input
     */
    urlsLabel: SDL.Label.extend(
      {
        elementId: 'urlsLabel',
        classNames: 'urlsLabel',
        content: 'URL'
      }
    ),
    /**
     * Label for System Request Input
     */
    systemRequestLabel: SDL.Label.extend(
      {
        elementId: 'systemRequestLabel',
        classNames: 'systemRequestLabel',
        content: 'requestSubType'
      }
    ),
    /**
     * Input for urls value changes
     */
    urlsInput: Ember.TextField.extend(
      {
        elementId: 'urlsInput',
        classNames: 'urlsInput',
        value: document.location.pathname.replace(
          'index.html', 'IVSU/PROPRIETARY_REQUEST'
        )
      }
    ),

    requestSubTypeInput: Ember.TextField.extend(
      {
        elementId: 'requestSubTypeInput',
        classNames: 'requestSubTypeInput',
        value: 'OEM specific request'
      }
    ),
    /**
     * Title of appID group of parameters
     */
    appIDSelectTitle: SDL.Label.extend(
      {
        elementId: 'appIDSelectTitle',
        classNames: 'appIDSelectTitle',
        content: 'appID'
      }
    ),
    /**
     * HMI element Select with parameters of registered applications id's
     */
    appIDSelect: Em.Select.extend(
      {
        elementId: 'appIDSelect',
        classNames: 'appIDSelect',
        contentBinding: 'this.appIDList',
        appIDList: function() {
          var list = [];
          for (var i = 0; i < SDL.SDLModel.data.registeredApps.length; i++) {
            list.addObject(SDL.SDLModel.data.registeredApps[i].appID);
            this.selection = list[0];
          }
          list.addObject('');
          return list;
        }.property('SDL.SDLModel.data.registeredApps.@each'),
        valueBinding: 'SDL.SDLVehicleInfoModel.prndlSelectState'
      }
    ),
    /**
     * Label for fileName Input
     */
    fileNameLabel: SDL.Label.extend(
      {
        elementId: 'fileNameLabel',
        classNames: 'fileNameLabel',
        content: 'fileName'
      }
    ),
    /**
     * Input for fileName value changes
     */
    fileNameInput: Ember.TextField.extend(
      {
        elementId: 'fileNameInput',
        classNames: 'fileNameInput',
        value: document.location.pathname.replace(
          'index.html', 'IVSU/PROPRIETARY_REQUEST'
        )
      }
    ),
    /**
     * Button to send OnSystemRequest notification to SDL
     */
    sendButton: SDL.Button.extend(
      {
        classNames: 'button sendButton',
        text: 'Send OnSystemRequest',
        action: function(element) {
          FFW.BasicCommunication.OnSystemRequest(
            element._parentView.systemRequestViewSelect.selection.name,
            element._parentView.fileNameInput.value,
            element._parentView.urlsInput.value,
            element._parentView.appIDSelect.selection,
            element._parentView.requestSubTypeInput.value
          );
        },
        onDown: false
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
