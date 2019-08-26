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
 * @name SDL.GliderView
 * @desc Universal glider component for SDL application
 * @category Controlls
 * @filesource app/controlls/GliderView.js
 * @version 1.0
 */
SDL.GliderView = Em.View.extend({
    /**
     * @name elementId
     * @type {String}
     * @description id of current element
     */
    elementId: '',

    /**
     * @name classNames
     * @type {Array}
     * @description class name of current element
     */
    classNames: '',

    /**
     * @name gliderName
     * @type {String}
     * @description Name of glider element
     */
    gliderName: '',

    /**
     * @name view
     * @type {Object}
     * @description Glider element. Sets in @didInsertElement method of current object
     */
    view: null,

    /**
     * @name dots
     * @type {Boolean}
     * @description dots of glider for shows which slide is currently visible
     * @default false
     */
    dots: false,

    /**
     * @name slideToShow
     * @type {Number}
     * @description Max count of slides to display on glider view 
     * @default 1
     */
    slideToShow: 1,

    /**
     * @name slidesToScroll
     * @type {Number}
     * @description Count of slides to scroll on scrolling action
     * @default 1
     */
    slidesToScroll: 1,

    /**
     * @name slideIsVisibleCallback
     * @type {function}
     * @description Called after the element gets visible state. Could be not set
     * @default null
     */
    slideIsVisibleCallback: null,

    /**
     * @name slideIsInvisibleCallback
     * @type {function}
     * @description Called after the element gets hidden state. Could be not set
     * @default null
     */
    slideIsInvisibleCallback: null,

    /**
     * @name draggable
     * @type {Boolean}
     * @description If true, create draggable container
     */
    draggable: false,

    /**
     * @name prevButtonName
     * @type {String}
     * @description class name of previous button
     */
    prevButtonName: '',

    /**
     * @name nextButtonName
     * @type {String}
     * @description class name of next button
     */
    nextButtonName: '',

    /**
     * @callback function didInsertElement
     * @description Called after the current object was inserted into the page as a html element
     */
    didInsertElement: function() {
      this.view = new Glider(document.querySelector('.' + this.gliderName), {
          slidesToScroll: this.slidesToScroll,
          slidesToShow: this.slideToShow,
          dots: this.dots ? '#dots' : '',
          draggable: this.draggable,
          arrows: {
              prev: '.' + this.prevButtonName,
              next: '.' + this.nextButtonName,
          },
      });

      self = this;
      if(null !== self.slideIsInvisibleCallback){
        document.querySelector('.' + this.gliderName).addEventListener('glider-slide-hidden', function(event){
          self.slideIsInvisibleCallback(event,self);
        },)
      }
      
      if(null !== self.slideIsVisibleCallback) {
        document.querySelector('.' + this.gliderName).addEventListener('glider-slide-visible', function(event){
          self.slideIsVisibleCallback(event, self);
        },)
      }
      if(0 < this.childViews.length) {
        this.childViews.forEach(element => {
          var childView = this[element];
          childView.createElement();
          this.view.addItem(childView.get('element'));
        });
      }
    },

    template: Em.Handlebars.compile(
      '<button role="button" {{bindAttr class="view.prevButtonName"}}>' +
        '<img class="ico" src="images/home/left-right.png" {{bindAttr id="view.gliderName"}}>'+
        '<i class="fa fa-chevron-left"></i>' +
      '</button>' +
      '<div {{bindAttr class="view.gliderName"}}>' +
      '</div>' +
      '<button role="button" {{bindAttr class="view.nextButtonName"}}>' +
          '<img class="ico" src="images/home/left-right.png" {{bindAttr id="view.gliderName"}}>'+
          '<i class="fa fa-chevron-right"></i>' +
      '</button>' +
      '<div id="dots" class="glider-dots"></div>'
    )

});
