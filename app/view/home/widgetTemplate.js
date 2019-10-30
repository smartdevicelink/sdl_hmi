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
 * @name SDL.WidgetTemplate
 * @desc Template object for widgets
 * @category View
 * @filesource app/view/home/widgetTemplate.js
 * @version 1.0
 */

SDL.WidgetTemplate = Em.ContainerView.extend({
    classNames: 'widgetTemplate',
    windowID: null,
    appID: null,
    appIcon: null,
    windowName: null,
    classNameBindings: [
      'this.btn_with_grp:btn_with_grp',
      'this.txt_with_grp:txt_with_grp',
      'this.grp_with_text:grp_with_text'
    ],
    btn_with_grp: false,
    txt_with_grp: true,
    grp_with_text: false,
    textField1: "",
    textField2: "",
    title: '',
    widgetIcon: '',
    childViews: [
      'windowNameLabel',
      'deactivate',
      'toolTip',
      'info'
    ],
    
    deactivate: SDL.Button.extend({
      classNames: 'button backButton',
      text: 'X',
      windowID: "parentView.windowID",
      target: 'SDL.SDLController',
      action: 'closeWidget',
      buttonAction: true,
      onDown: false,
    }),

    toolTip: SDL.Button.extend({
      classNames: 'toolTip',
      text: '?',
      windowID: "parentView.windowID",
      attributeBindings: ['parentView.title:title'],
      disabled: true,
      buttonAction: true,
      onDown: false,
    }),
    
    windowNameLabel: SDL.Label.extend(
      {        
        elementId: 'windowName',
        classNames: 'windowName',
        contentBinding: "parentView.windowName"
      }
    ),
    
    info: Em.View.extend(
        {
          classNames: 'widget_info',
          defaultTemplate: Em.Handlebars
            .compile(
              '{{#with view}}' +
              '<div class="textField_1">{{view.parentView.textField1}}</div>' +
              '<div class="textField_2">{{view.parentView.textField2}}</div>' +
              '<img class="app_icon" {{bindAttr src="view.parentView.appIcon"}}/>' +
              '<img class="widget_icon" {{bindAttr src="view.parentView.widgetIcon"}}/>' +
              '{{/with}}'
            )
        }
      ),

      /**
       * @name definedTemplates
       * @type {Array}
       * @description Available templates for widgets
       */
      definedTemplates: [
        'TEXT_WITH_GRAPHIC',
        'BUTTONS_WITH_GRAPHIC',        
        'GRAPHIC_WITH_TEXT'
      ],

      /**
       * @function setTemplate
       * @param {String} templateName
       * @description setter of template for widget 
       */
      setTemplate: function(templateName) {
        if(-1 == this.definedTemplates.indexOf(templateName)) {
          templateName = this.definedTemplates[0];
        }
        this.set('txt_with_grp', templateName == this.definedTemplates[0]);
        this.set('btn_with_grp', templateName == this.definedTemplates[1]);
        this.set('grp_with_text', templateName == this.definedTemplates[2]);
      },
  });
  