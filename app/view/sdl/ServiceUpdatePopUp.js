/*
 * Copyright (c) 2019, Ford Motor Company All rights reserved.
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
 * @name SDL.ServiceUpdatePopUp
 * @desc Service update pop up module visual representation
 * @category View
 * @filesource app/view/sdl/ServiceUpdatePopUp.js
 * @version 1.0
 */

SDL.ServiceUpdatePopUp = Em.ContainerView.create(
  {
    elementId: 'ServiceUpdatePopUp',
    classNames: 'ServiceUpdatePopUp',
    classNameBindings: [
      'active'
    ],
    childViews: [
      'message',
      'progressIndicatorView',
      'backButton'
    ],

    timer: null,
    active: false,
    content: '',
    progress: false,

    progressIndicatorView: Em.View.extend(
      {
        elementId: 'progress',
        classNameBindings: 'this.parentView.progress:progress'
      }
    ),
    backButton: SDL.Button.extend(
      {
        classNames: 'button backButton',
        text: 'X',
        click: function() {
          this._parentView.deactivate();
        },
        buttonAction: true,
        onDown: false
      }
    ),
    message: SDL.Label.extend(
      {
        elementId: 'text',
        classNames: 'text',
        contentBinding: 'parentView.content'
      }
    ),

    /**
     * @function deactivate
     * @desc Deactivate ServiceUpdatePopUp
     * 
     */
    deactivate: function() {
      this.set('active', false);
      this.set('progress', false);
      this.set('content', '');
    },

    /**
     * @function activate
     * @desc activate ServiceUpdatePopUp
     * @param {string} serviceType 
     * @param {string} serviceEvent 
     * @param {string} serviceReason 
     */
    activate: function(serviceType, serviceEvent, serviceReason) {
      if(serviceType === undefined) {
        return;
      }

      switch (serviceEvent) {
        case 'REQUEST_RECEIVED': {
          this.setContentByServiceType(serviceType);
          this.set('progress', this.get('content') != '');
          this.set('active', this.get('content') != '');
          break;
        }
        case 'REQUEST_ACCEPTED': {
          this.deactivate();
          break;
        }
        case 'REQUEST_REJECTED': {
          this.rejectedRequest(serviceReason);
          var self = this;
          this.timer = setTimeout(
            function() {
              self.deactivate();
            },
            5000
          );
          break;
        }
        default: {
          if(serviceReason !== undefined) {
            this.rejectedRequest(serviceReason);
            var self = this;
            this.timer = setTimeout(
              function() {
                self.deactivate();
              },
              5000
            );
          }
          break;
        }
      }
    },

    /**
     * @function setContentByServiceType
     * @param {string} serviceType
     * @description Check serviceType and set content of popUp 
     */
    setContentByServiceType: function(serviceType) {
      switch(serviceType) {
        case 'VIDEO': {
          this.set('content', 'Starting Video Stream');
          break;
        }
        case 'AUDIO': {
          this.set('content', 'Starting Audio Stream');
          break;
        }
        case 'RPC': {
          this.set('content', 'Starting RPC Service');
          break;
        }
        default: break;
      }
    },

    /**
     * @function rejectedRequest
     * @desc Processing reason of rejected request
     * @param {string} reason 
     */
    rejectedRequest: function(reason) {
      this.set('active', true);
      this.set('progress',false);
      
      switch(reason) {
        case 'PTU_FAILED': {
          this.set('content', 'Unable to update apps.' + 
            'Make sure your device has an internet connection');
          break;
        }
        case 'INVALID_CERT': {
          this.set('content', 'System is unable to authenticate the app');
          break;
        }
        case 'INVALID_TIME': {
          this.set('content', 'Unable to get valid time.' +
            'Make sure your device has access to GPS signal');
          break;
        }
        default: {
          this.set('content', 'Rejected by unknown reason');
          break;
        }
      }
    }
  }
);

