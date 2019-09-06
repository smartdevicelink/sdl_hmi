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
 * @name SDL.PopUp
 * @desc PopUp module visual representation
 * @category View
 * @filesource app/view/sdl/PopUp.js
 * @version 1.0
 */

SDL.CodeEditor = Em.ContainerView.extend(
  {
    classNames: 'codeEditor PopUp',
    childViews: [
      'editor',
      'buttonOk',
      'buttonReset',
      'buttonDelete',
      'backButton'
    ],
    classNameBindings: [
      'this.active:active_state:inactive_state'
    ],
    codeEditorId: 0,
    /**
     * Callback function to return result of made action by user
     */
    callback: null,
    content: 'Title',
    active: false,
    
    /**
     * Callback function in case JSON was invalidated 
     */
    invalidJsonCallback: function() {
      SDL.PopUp.create().appendTo('body').popupActivate(
        'Incorrect JSON format'
      );
    },

    backButton: SDL.Button.extend(
      {
        classNames: 'button backButton',
        text: 'Close',
        click: function() {
          this._parentView.deactivate();
        },
        buttonAction: true,
        onDown: false
      }
    ),
    buttons: true,
    buttonOk: SDL.Button.extend(
      {
        classNames: 'button',
        text: 'Save',
        action: 'save',
        target: 'parentView',
        onDown: false
      }
    ),
    buttonReset: SDL.Button.extend(
      {
        classNames: 'button ResetButton',
        text: 'Reset',
        action: 'reset',
        target: 'parentView',
        onDown: false
      }
    ),
    buttonDelete: SDL.Button.extend(
      {
        classNames: 'button DeleteButton',
        text: 'Delete',
        action: 'delete',
        target: 'parentView',
        onDown: false
      }
    ),
    editor: SDL.Code.extend(
      {
        elementIdBinding: 'this.parentView.codeEditorId',
        codeBinding: 'parentView.content'
      }
    ),
    /**
     * Method to reset users changes in current opened editor
     */
    reset: function() {
      this.editor.editor.getSession().setValue(this.content);
    },
    /**
     * Method to save users changes in current opened editor
     */
    save: function() {
      if (this.callback) {
        try {
          JSON.parse(this.editor.editor.getSession().getValue());
        } catch (e) {
          if (this.invalidJsonCallback) {
            this.invalidJsonCallback();
          }          
          return;
        }
        this.callback(
          this.editor.editor.getSession().getValue()
        );
      }
      this.deactivate();
    },
    /**
     * Method to delete current opened editor data
     */
    delete: function() {
      this.callback(
        null,
        true
      );
      this.deactivate();
    },
    /**
     * Deactivate CodeEditor
     */
    deactivate: function(event) {
      this.set('active', false);
      this.set('callback', null);
      this.set('content', '');
    },
    /**
     * Code editor activation method
     *
     * @param {Object} callback
     * @returns {SDL.CodeEditor}
     */
    activate: function(callback) {
      if (!this.editor.editor) {
        this.editor.activate();
      }
      this.set('active', true);
      this.set('callback', callback);
      return this;
    }
  }
);
