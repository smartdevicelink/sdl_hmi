/*
 * Copyright (c) 2017, Ford Motor Company All rights reserved.
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
 * @name SDL.CheckableButton
 * @desc General CheckableButton component
 * @category Controlls
 * @filesource app/controlls/checkableButton.js
 * @version 1.0
 */

SDL.CheckableButton = Em.ContainerView.extend({

  /**
   * Initial class names
   */
  classNames: 'checkableButton',

  /**
   * Conditional class names
   */
  classNameBindings: [
    'checkboxVisible:checkboxVisible:checkboxInvisible',
    'checkboxChecked:checkboxChecked'
  ],

  /**
   * Text to be displayed on the button (used for binding)
   */
  buttonText: '',

  /**
   * Template name to be applied to the button (used for binding)
   */
  buttonTemplateName: 'text',

  /**
   * Action to be done on button click (used for binding)
   */
  buttonAction: null,

  /**
   * Taget of action to be done on button click (used for binding)
   */
  buttonTarget: null,

  /**
   * Disabled flag of whole control
   */
  disabled: false,

  /**
   * Visibility flag for checkbox subcomponent (used for binding)
   */
  checkboxVisible: true,

  /**
   * Checked flag for checkbox subcomponent (used for binding)
   */
  checkboxChecked: false,

  /**
   * List of components in this view
   */
  childViews: [
    'checkBox',
    'button'
  ],

  /**
   * Checkbox subcomponent definition
   */
  checkBox: Em.Checkbox.extend(
    {
      classNames: 'checkbox',
      classNameBindings: [
        'disabled', 'parentView.checkboxVisible:active_state:inactive_state',
      ],
      checkedBinding: 'parentView.checkboxChecked',
      disabledBinding: 'parentView.isCheckboxDisabled'
    }
  ),

  /**
   * Button subcomponent definition
   */
  button: SDL.Button.extend({
      classNames: 'button',
      onDown: false,
      actionBinding: 'parentView.buttonAction',
      targetBinding: 'parentView.buttonTarget',
      disabledBinding: 'parentView.isButtonDisabled',
      templateNameBinding: 'parentView.buttonTemplateName',
      textBinding: 'parentView.buttonText'
    }
  ),

  /**
   * Function for checking button subcomponent disabled property value
   */
  isButtonDisabled: function() {
    if (this.disabled) return true;
    return !this.checkBox.checked;
  }.property('this.checkBox.checked', 'this.disabled'),

  /**
   * Function for checking checkbox subcomponent disabled property value
   */
  isCheckboxDisabled: function() {
    return this.disabled;
  }.property('this.disabled')

});