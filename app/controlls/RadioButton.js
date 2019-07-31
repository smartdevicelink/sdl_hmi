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
 * @name SDL.Code
 * @desc Universal code component for SDL application
 * @category Controlls
 * @filesource app/controlls/Code.js
 * @version 1.0
 */

SDL.RadioButton = Em.ContainerView.extend(
  {
    childViews: [
      'radio',
      'label',
      'check'
    ],
    classNames: 'radioButton',
    clickCallback: null,
    text: '',
    name: '',
    value: '',
    selection: '',
    id: '',
    checked: false,
    radio: Em.View.extend(
      {
        tagName: 'input',
        type: 'radio',
        elementIdBinding: 'this.parentView.Id',
        attributeBindings: [
          'this.parentView.name:name', 'type',
          'this.parentView.value:value', 'checked:checked'
        ],
        click: function(event) {
          this.set('parentView.selection', event.target.value);
          if (this._parentView.clickCallback) {
            this._parentView.clickCallback(event);
          }
        },
        checked: function() {
          return this.get('parentView.value') ==
            this.get('parentView.selection');
        }.property('selection')
      }
    ),
    label: SDL.Label.extend(
      {
        tagName: 'label',
        attributeBindings: ['this.parentView.Id:for'],
        classNames: 'label',
        contentBinding: 'this.parentView.text'
      }
    ),
    check: Em.ContainerView.extend(
      {
        classNames: 'check',
        childViews: [
          'inside'
        ],
        inside: Em.View.extend(
          {
            classNames: 'inside'
          }
        )
      }
    )
  }
);
//Em.Handlebars.helper('radio-button', SDL.RadioButton);
