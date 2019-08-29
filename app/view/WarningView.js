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
 * @name SDL.WarningView
 * @desc Warning representation
 * @category View
 * @filesource app/view/WarningView.js
 * @version 1.0
 */

SDL.warningView = Em.ContainerView
  .extend(
    {
      AfterRender: function() {
      },
      classNameBindings: [
        'fade:fadeAnimation:fadeWarning', 'hide:inactive_state',
      ],
      elementId: 'warning_view',
      childViews: [
        'content',
        'button',
        'openSDL',
        'pluginRC',
        'otherSDL'
      ],
      openSDL: SDL.RadioButton.extend(
        {
          Id: 'openSDL',
          name: 'radio',
          value: 0,
          selectionBinding: 'FLAGS.SimpleFunctionality',
          text: 'Open SDL'
        }
      ),
      pluginRC: SDL.RadioButton.extend(
        {
          Id: 'pluginRC',
          name: 'radio',
          value: 1,
          selectionBinding: 'FLAGS.SimpleFunctionality',
          text: 'plugin RC'
        }
      ),
      otherSDL: SDL.RadioButton.extend(
        {
          Id: 'otherSDL',
          name: 'radio',
          value: 2,
          selectionBinding: 'FLAGS.SimpleFunctionality',
          text: 'Other'
        }
      ),
      content: Em.View
        .extend(
          {
            classNames: 'message',
            template: Ember.Handlebars
              .compile(
                '<div class="warning_text"> ' +
                '{{SDL.locale.label.view_warning}}</div>' +
                '<div class="text">' +
                '<br>' +
                '<p>{{SDL.locale.label.view_warning_paragraph1}} </p><br>' +
                '<p> {{SDL.locale.label.view_warning_paragraph2}} </p><br>' +
                '</div>'
              )
          }
        ),
      button: Em.View.create(
        {
          elementId: 'warning_ok_button',
          classNameBindings: [
            'isReady: visible_display', 'pressed:pressed'
          ],
          classNames: [
            'okbut',
            'ffw-button'
          ],
          /**
           * Check for webkit fillmode animation support Android < 4 version
           * doesnt support webkit animation fillmode
           */
          checkForCCS3AnimationSupport: function() {
            if (FFW.isAndroid) {
              return $('body')[0].style.webkitAnimationFillMode === '';
            } else {
              return false;
            }
          },
          template: Ember.Handlebars.compile('<span>OK</span>'),
          /* this method is called when the web part is fully loaded */
          appLoaded: function() {
            var self = this;
            /** Show OK Button after 2 second delay */
            setTimeout(
              function() {
                self.set('isReady', true);
              }, 2000
            );
            var timer = setInterval(
              function() {
                if (FLAGS.Buttons === null) {
                  FLAGS.set('Buttons', true);
                  return;
                }
                if (FLAGS.TTS === null) {
                  FLAGS.set('TTS', true);
                  return;
                }
                if (FLAGS.VehicleInfo === null) {
                  FLAGS.set('VehicleInfo', true);
                  return;
                }
                if (FLAGS.RC === null) {
                  FLAGS.set('RC', true);
                  return;
                }
                if (FLAGS.BasicCommunication === null) {
                  FLAGS.set('BasicCommunication', true);
                  return;
                }
                if (FLAGS.Navigation === null) {
                  FLAGS.set('Navigation', true);
                  return;
                }
                if (FLAGS.UI === null) {
                  FLAGS.set('UI', true);
                  return;
                }
                if (FLAGS.VR === null) {
                  FLAGS.set('VR', true);
                  return;
                }
                if (FLAGS.ExternalPolicies === null) {
                  FLAGS.set('ExternalPolicies', false);
                  return;                  
                }
                clearInterval(timer);
              }, 200
            );
            var components = Em.ContainerView.create(
              {
                classNames: 'components',
                childViews: [
                  'BasicCommunication',
                  'Buttons',
                  'Navigation',
                  'TTS',
                  'UI',
                  'VI',
                  'VR',
                  //'CAN',
                  'RC',
                  'ExternalPolicies'
                ],
                BasicCommunication: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'basicCommunicationCheckBox',
                        classNames: 'basicCommunicationCheckBox item',
                        checkedBinding: 'FLAGS.BasicCommunication'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'basicCommunicationText item',
                        content: 'BasicCommunication'
                      }
                    )
                  }
                ),
                Buttons: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'buttonsCheckBox',
                        classNames: 'buttonsCheckBox item',
                        checkedBinding: 'FLAGS.Buttons'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'buttonsText item',
                        content: 'Buttons'
                      }
                    )
                  }
                ),
                Navigation: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'navigationCheckBox',
                        classNames: 'navigationCheckBox item',
                        checkedBinding: 'FLAGS.Navigation'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'navigationText item',
                        content: 'Navigation'
                      }
                    )
                  }
                ),
                TTS: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'ttsCheckBox',
                        classNames: 'ttsCheckBox item',
                        checkedBinding: 'FLAGS.TTS'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'ttsText item',
                        content: 'TTS'
                      }
                    )
                  }
                ),
                UI: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'uiCheckBox',
                        classNames: 'uiCheckBox item',
                        checkedBinding: 'FLAGS.UI'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'uiText item',
                        content: 'UI'
                      }
                    )
                  }
                ),
                VI: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'viCheckBox',
                        classNames: 'viCheckBox item',
                        checkedBinding: 'FLAGS.VehicleInfo'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'viText item',
                        content: 'VI'
                      }
                    )
                  }
                ),
                VR: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'vrCheckBox',
                        classNames: 'vrCheckBox item',
                        checkedBinding: 'FLAGS.VR'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'vrText item',
                        content: 'VR'
                      }
                    )
                  }
                ),
                CAN: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    classNameBindings: [
                      'SDL.FuncSwitcher.rev::not-visible'
                    ],
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'canCheckBox',
                        classNames: 'canCheckBox item',
                        checkedBinding: 'FLAGS.CAN'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'canText item',
                        content: 'CAN'
                      }
                    )
                  }
                ),
                RC: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    classNameBindings: [
                      'SDL.FuncSwitcher.rev::not-visible'
                    ],
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'rcCheckBox',
                        classNames: 'rcCheckBox item',
                        checkedBinding: 'FLAGS.RC'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'canText item',
                        content: 'RC'
                      }
                    )
                  }
                ),
                ExternalPolicies: Em.ContainerView.extend(
                  {
                    classNames: 'component',
                    classNameBindings: [
                      'SDL.FuncSwitcher.rev::not-visible'
                    ],
                    childViews: [
                      'checkBox',
                      'text'
                    ],
                    checkBox: Em.Checkbox.extend(
                      {
                        elementId: 'externalPoliciesCheckBox',
                        classNames: 'externalPoliciesCheckBox item',
                        checkedBinding: 'FLAGS.ExternalPolicies'
                      }
                    ),
                    text: SDL.Label.extend(
                      {
                        tagName: 'label',
                        attributeBindings: [
                          'this.parentView.checkBox.elementId:for'
                        ],
                        classNames: 'externalPoliciesText item',
                        content: 'External Policies'
                      }
                    )
                  }
                )
              }
            );
            components.appendTo('#warning_view');
          }.observes('SDL.appReady'),
          actionDown: function(event) {
            this.set('pressed', true);
          },
          actionUp: function(event) {
            this.set('pressed', false);
            SDL.RightSideView.set('hmi_not_run', false);
            var self = this;
            this._parentView.set(
              'fade', this
                .checkForCCS3AnimationSupport()
            );
            setTimeout(
              function() {
                self._parentView.set('hide', true);
              }, 1000
            );
            SDL.RCModulesController.populateModels();
            SDL.RPCController.ConnectToSDL();
          }
        }
      ),
    }
  );
