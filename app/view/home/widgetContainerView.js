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
 * @name SDL.WidgetContainerView
 * @desc Container with widgets
 * @category View
 * @filesource app/view/home/widgetContainerView.js
 * @version 1.0
 */

SDL.WidgetContainerView = Em.ContainerView.extend({
  elementId: 'Glider',
  classNames: 'WidgetGlider',
  childViews: ['widgetContainer'],
  classNameBindings: ['parentView.expand:expand'],
  emberWidgetsObj: [],
  widgetContainer: SDL.GliderView.extend({
    gliderName: 'WidgetContainer',
    classNames: 'WidgetsHome',
    dots: false,
    slideToShow: 2,
    slidesToScroll: 1,
    draggable: false,
    slideIsVisibleCallback: SDL.SDLController.widgetVisible,
    slideIsInvisibleCallback: SDL.SDLController.widgetNonVisible,
    prevButtonName: 'prev-home',
    nextButtonName: 'next-home',
   
    childViews: [
      'addWidgetWindow'      
    ],

    addWidgetWindow: Em.ContainerView.create({
      elementId: "add-window",
      childViews: [
        'message',
        'addButton'
      ],
      init: function() {
        this._super();
      },
      
      message: SDL.Label.extend(
        {          
          elementId: 'text1',
          classNames: 'text1',
          content: "Add widget: "
        }
      ),
      addButton: SDL.Button.extend({
        classNames: 'addButton',
        icon: 'images/settings/plus.png',
        target: 'SDL.AddWidgetPopUp',
        onDown: false,
        action: 'toggleActivity'
      }),
    }),
  }),

  /**
   * @function createWidgetContent
   * @param {Object} app 
   * @param {Number} windowID 
   * @description creates widget content
   */
  createWidgetContent: function(app, windowID) {
    var widgetContent = app.getWidgetModel(windowID).content;
    var data = {
      'textField_1': '',
      'textField_2': '',
      'icon': 'images/media/bg.png',
      'template': 'TEXT_WITH_GRAPHIC',
      'title': SDL.SDLController.generateAppWidgetTitle(app.initialColorScheme)
    }
    if(widgetContent) {
      if('showStrings' in widgetContent) {
        widgetContent.showStrings.forEach(function(element, index) {
          data[`textField_${index+1}`] = element.fieldText;
        })
      }

      if('graphic' in widgetContent) {
        data.icon = widgetContent.graphic.value;
      }

      if('templateConfiguration' in widgetContent) {
        data.template = widgetContent.templateConfiguration.template;
        data.title = SDL.SDLController.generateAppWidgetTitle(widgetContent.templateConfiguration);
      }
    }
    return data;
  },
  
  /**
   * @function addWidget
   * @param {Object} params 
   * @description Create widget by the incoming params and push it to widget container
   */
  addWidget: function(params) {
    var app = SDL.SDLController.getApplicationModel(params.appID);
    var content = this.createWidgetContent(app, params.windowID);
    var widget = SDL.WidgetTemplate.create({
      windowID: params.windowID,
      elementId: params.windowID,
      appID: params.appID,
      title: content.title,
      textField1: content.textField_1,
      textField2: content.textField_2,
      widgetIcon: content.icon,
      windowName: ' Win Name: ' + params.windowName + ' Win ID: ' + params.windowID,
      appIcon: app.appIcon
    });
    
    widget.setTemplate(content.template);
    this.addSoftButtons(params.windowID, app, widget);
    widget.createElement();
    this.emberWidgetsObj.push(widget);
    var element = widget.get('element');
    element['appID'] = params.appID;
    element['windowID'] = params.windowID;
    this.pushToContainer(element);
  },

  /**
  *@function getFirstVisibleIndex
  *@returns {Number}
  *@description Returns index of first visible widget
  */
  getFirstVisibleIndex: function() {
    var length = this.widgetContainer.view.slides.length;
    for(var i = 0;i < length; ++i) {
      if(this.widgetContainer.view.slides[i].className.includes('visible')) {
        return i;
      }
    }
    return -1;
  },

  /**
   * @function pushToContainer
   * @param {Object} element 
   * @description push created widget to widget container
   */
  pushToContainer: function(element) {
    var firstVisibleWidgetIndex = this.getFirstVisibleIndex();
    if(firstVisibleWidgetIndex >= 0) {
      this.widgetContainer.view.addByIndex(element, firstVisibleWidgetIndex);
    }
  },

  /**
   * @function removeWidget
   * @param {Number} appID 
   * @param {Number} windowID
   * @description Remove widget from widget container and from the 
   *  container with ember widgets object 
   */
  removeWidget: function(appID, windowID) {
    var slides = this.widgetContainer.view.slides;
    for (var i=0; i < slides.length; ++i) {
      if(slides[i].appID == appID &&
        slides[i].windowID == windowID) {
          this.widgetContainer.view.removeItem(i);
      }
    }
    for(var i=0; i < this.emberWidgetsObj.length; ++i) {
      if(this.emberWidgetsObj[i].appID == appID &&
          this.emberWidgetsObj[i].windowID == windowID) {
        this.emberWidgetsObj.splice(i,1);
        return;
      }
    }
  },

  /**
   * @function updateWidgetContent
   * @param {Number} app 
   * @param {Number} windowID 
   * @description Update widget content after receiving reqeust show for application and windowID
   */
  updateWidgetContent: function(app, windowID) {
    var content = this.createWidgetContent(app, windowID);
    for(var i=0; i < this.emberWidgetsObj.length; ++i) {
      if(this.emberWidgetsObj[i].appID == app.appID &&
          this.emberWidgetsObj[i].windowID == windowID) {
        var widget = this.emberWidgetsObj[i];
        widget.set('textField1', content.textField_1);
        widget.set('textField2', content.textField_2);
        widget.set('widgetIcon', content.icon);
        widget.set('title', content.title);
        widget.setTemplate(content.template);
        this.clearSoftButtons(widget);
        this.addSoftButtons(windowID, app,widget);
        break;
      }
    }
  },

  /**
   * @function addSoftButtons
   * @param {Number} windowID 
   * @param {Object} app 
   * @param {Object} parentToPush
   * @description add softbuttons to the widgets by the windowID 
   */
  addSoftButtons: function(windowID, app, parentToPush) {
    var widgetContent = app.getWidgetModel(windowID).content;
    if(!widgetContent) {
      return;
    }

    if('softButtons' in widgetContent) {
      var length = widgetContent.softButtons.length;
      parentToPush.setTemplate('BUTTONS_WITH_GRAPHIC');
      for(var i = 0; i < length; ++i) {
        var softButton = SDL.Button.create(SDL.PresetEventsCustom,{
          classNames: ['button', 'softButton', 'softButton_' + (i + 1)],
          text: widgetContent.softButtons[i].text,
          icon: widgetContent.softButtons[i].image ? widgetContent.softButtons[i].image.value : '',
          softButtonID: widgetContent.softButtons[i].softButtonID,
          systemAction: widgetContent.softButtons[i].systemAction,
          windowID: "parentView.windowID",
          buttonAction: true,
          onDown: false,
          appID: app.appID,
          groupName: 'WidgetAction'
        });
        parentToPush._childViews.pushObject(softButton);
      }
    }
  },

  /**
   * @function clearSoftButtons
   * @param {Object} object 
   * @description Remove all an existing softbuttons on the widget
   */
  clearSoftButtons: function(object) {
    for(var i = 0; i < object._childViews.length; ++i) {
      if(-1 !== object._childViews[i].classNames.indexOf('softButton')) {
        object._childViews[i].remove(); // for remove content from view as html element
        object._childViews.splice(i,1); // for remove element from array
        i = 0;
      }
    }
  }  
});

