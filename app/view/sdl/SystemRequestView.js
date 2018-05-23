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
      'jsonOffsetLabel',
      'jsonOffsetInput',
      'jsonLengthLabel',
      'jsonLengthInput',
      'jsonTimeoutLabel',
      'jsonTimeoutInput',
      'jsonOffsetCheckBox',
      'jsonLengthCheckBox',
      'jsonTimeoutCheckBox',
      'urlsCheckBox',
      'appIDSelectTitleCheckBox',
      'subTypeCheckBox',
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
    offsetEnabled: true,
    lengthEnabled: true,
    timeoutEnabled: true,
    urlsInputEnabled: true,
    appIDSelectEnabled: true,
    requestSubTypeInputEnabled: true,

    /**
     * Title of systemRequest group of parameters
     */
    systemRequestViewTitle: SDL.Label.extend(
      {
        elementId: 'systemRequestViewTitle',
        classNames: 'systemRequestViewTitle',
        content: 'Reason'
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
        optionLabelPath: 'content.name',
        classNameBindings: [
                            'SDL.SystemRequest.systemRequestViewSelectEnabled::inactiveTextField'
                           ],
      }
    ),
    /**
     * Label for "JSON" parameter "offset" Input
     */
    jsonOffsetLabel: SDL.Label.extend(
      {
        elementId: 'jsonOffsetLabel',
        classNames: 'jsonOffsetLabel',
        content: 'Offset'
      }
    ),
    /**
     * Input for offset value changes
     */
    jsonOffsetInput: Ember.TextField.extend(
      {
        elementId: 'jsonOffsetInput',
        classNames: 'jsonOffsetInput',
        classNameBindings: [
                            'SDL.SystemRequest.offsetEnabled::inactiveTextField'
                           ],
                           value:'1000',
      }
    ),

    /**
     * Label for "JSON" parameter "length" Input
     */
    jsonLengthLabel: SDL.Label.extend(
      {
        elementId: 'jsonLengthLabel',
        classNames: 'jsonLengthLabel',
        content: 'Length'
      }
    ),
    /**
     * Input for Length value changes
     */
    jsonLengthInput: Ember.TextField.extend(
      {
        elementId: 'jsonLengthInput',
        classNames: 'jsonLengthInput',
        classNameBindings: [
                            'SDL.SystemRequest.lengthEnabled::inactiveTextField'
                           ],
                           value:'1500',
      }
    ),

    /**
     * Label for "JSON" parameter "timeout" Input
     */
    jsonTimeoutLabel: SDL.Label.extend(
      {
        elementId: 'jsonTimeoutLabel',
        classNames: 'jsonTimeoutLabel',
        content: 'Timeout'
      }
    ),
    /**
     * Input for Length value changes
     */
    jsonTimeoutInput: Ember.TextField.extend(
      {
        elementId: 'jsonTimeoutInput',
        classNames: 'jsonTimeoutInput',
        classNameBindings: [
                            'SDL.SystemRequest.timeoutEnabled::inactiveTextField'
                           ],
                           value:'2000',
      }
    ),
     
     /**
     * CheckBox for Offset parameter in OnSystemRequest
     */
    jsonOffsetCheckBox: Em.Checkbox.extend({

          elementId: 'jsonOffsetCheckBox',

          classNames: 'jsonOffsetCheckBox',

          checked: function(){
            return SDL.SystemRequest.offsetEnabled;
          }.property('SDL.SystemRequest.offsetEnabled'),

          click: function (evt) {
               var isCheked = SDL.SystemRequest.get('offsetEnabled');
               SDL.SystemRequest.set('offsetEnabled',!isCheked);
           }
         }
      ),

    /**
     * CheckBox for Length parameter in OnSystemRequest
     */
    jsonLengthCheckBox: Em.Checkbox.extend({

          elementId: 'jsonLengthCheckBox',

          classNames: 'jsonLengthCheckBox',

          checked: function(){
            return SDL.SystemRequest.lengthEnabled;
          }.property('SDL.SystemRequest.offsetEnabled'),

          click: function (evt) {
               var isCheked = SDL.SystemRequest.get('lengthEnabled');
               SDL.SystemRequest.set('lengthEnabled',!isCheked);
           }

        }
      ),

    /**
     * CheckBox for Timeout parameter in OnSystemRequest
     */
    jsonTimeoutCheckBox: Em.Checkbox.extend({

          elementId: 'jsonTimeoutCheckBox',

          classNames: 'jsonTimeoutCheckBox',

          checked: function(){
            return SDL.SystemRequest.timeoutEnabled;
          }.property('SDL.SystemRequest.timeoutEnabled'),

          click: function (evt) {
               var isCheked = SDL.SystemRequest.get('timeoutEnabled');
               SDL.SystemRequest.set('timeoutEnabled',!isCheked);
           }
        }
      ),

    /**
     * CheckBox for URL parameter in OnSystemRequest
     */
    urlsCheckBox: Em.Checkbox.extend({

          elementId: 'urlsCheckBox',

          classNames: 'urlsCheckBox',

          checked: function(){
            return SDL.SystemRequest.urlsInputEnabled;
          }.property('SDL.SystemRequest.urlsInputEnabled'),

          click: function (evt) {
               var isCheked = SDL.SystemRequest.get('urlsInputEnabled');
               SDL.SystemRequest.set('urlsInputEnabled',!isCheked);
           }
        }
      ),

    /**
     * CheckBox for SubType parameter in OnSystemRequest
     */
    subTypeCheckBox: Em.Checkbox.extend({

          elementId: 'subTypeCheckBox',

          classNames: 'subTypeCheckBox',

          checked: function(){
            return SDL.SystemRequest.requestSubTypeInputEnabled;
          }.property('SDL.SystemRequest.requestSubTypeInputEnabled'),

          click: function (evt) {
               var isCheked = SDL.SystemRequest.get('requestSubTypeInputEnabled');
               SDL.SystemRequest.set('requestSubTypeInputEnabled',!isCheked);
           }
        }
      ),

    /**
     * CheckBox for appID parameter in OnSystemRequest
     */
    appIDSelectTitleCheckBox: Em.Checkbox.extend({

          elementId: 'appIDSelectTitleCheckBox',

          classNames: 'appIDSelectTitleCheckBox',

          checked: function(){
            return SDL.SystemRequest.appIDSelectEnabled;
          }.property('SDL.SystemRequest.appIDSelectEnabled'),

          click: function (evt) {
               var isCheked = SDL.SystemRequest.get('appIDSelectEnabled');
               SDL.SystemRequest.set('appIDSelectEnabled',!isCheked);
           }
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
        content: 'subType'
      }
    ),
    /**
     * Input for urls value changes
     */
    urlsInput: Ember.TextField.extend(
      {
        elementId: 'urlsInput',
        classNames: 'urlsInput',
        classNameBindings: [
                            'SDL.SystemRequest.urlsInputEnabled::inactiveTextField'
                           ],
                           value: document.location.pathname.replace(
                                  'index.html', 'IVSU/PROPRIETARY_REQUEST'
                                 )
      }
    ),

    /**
     * Input for request subType value changes
     */
    requestSubTypeInput: Ember.TextField.extend(
      {
        elementId: 'requestSubTypeInput',
        classNames: 'requestSubTypeInput',
        classNameBindings: [
                            'SDL.SystemRequest.requestSubTypeInputEnabled::inactiveTextField'
                           ],
                          value: 'OEM specific request',
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
        valueBinding: 'SDL.SDLVehicleInfoModel.prndlSelectState',
        classNameBindings: [
                            'SDL.SystemRequest.appIDSelectEnabled::inactiveTextField'
                           ],
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
          var offset = SDL.SystemRequest.offsetEnabled ?
                     parseInt(element._parentView.jsonOffsetInput.value):
                       null;
          var length = SDL.SystemRequest.lengthEnabled ?
                     parseInt(element._parentView.jsonLengthInput.value):
                       null;
          var timeout = SDL.SystemRequest.timeoutEnabled ?
                     parseInt(element._parentView.jsonTimeoutInput.value):
                       null;
          var appID = SDL.SystemRequest.appIDSelectEnabled ?
                     element._parentView.appIDSelect.selection:
                       null;
          var urls = SDL.SystemRequest.urlsInputEnabled ?
                     element._parentView.urlsInput.value:
                       null;  
          var subType = SDL.SystemRequest.requestSubTypeInputEnabled ?
                     element._parentView.requestSubTypeInput.value:
                       null;                        

          FFW.BasicCommunication.OnSystemRequest(
            element._parentView.systemRequestViewSelect.selection.name,
            element._parentView.fileNameInput.value,
            urls,
            appID,
            subType,
            offset,
            length,
            timeout
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
