/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
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

SDL.RPCGetIVDControlConfigView = Em.ContainerView.create({
    elementId: 'rpc_get_ivd_config',
    classNames: 'rpc_settings_separate_view',
    classNameBindings: [
        'SDL.States.settings.rpccontrol.rpcgetivdconfig.active:active_state:inactive_state'
    ],

    childViews: [
      'backButton',
      'newButton',
      'removeButton',
      'previousButton',
      'nextButton',
      'counterLabel',
      'customResultCodeLabel',
      'getIVDSelect',
      'subscribedLabel',
      'getIVDSubscribed'
    ],

    backButton: SDL.Button.extend(
        {
          classNames: [
            'backControl'
          ],
          action: 'onState',
          target: 'SDL.SettingsController',
          goToState: 'rpccontrol',
          icon: 'images/media/ico_back.png',
          style: 'top: 100px',
          onDown: false
        }
      ),

    newButton: SDL.Button.extend(
        {
          classNames: [
            'newButton'
          ],
          action: 'newGetIVDResponse',
          target: 'FFW.RPCHelper',
          text: 'New',
          onDown: false
        }
    ),

    removeButton: SDL.Button.extend(
      {
        classNames: [
          'removeButton'
        ],
        isDisabled: function() {
          return FFW.RPCHelper.getIVDResultStruct.length == 1;
        }.property(
          'FFW.RPCHelper.getIVDRequestNumber'
        ),
        disabledBinding: 'isDisabled',
        action: 'removeGetIVDResponse',
        target: 'FFW.RPCHelper',
        text: 'Remove',
        onDown: false
      }
    ),

    previousButton: SDL.Button.extend(
        {
          classNames: [
            'previousButton'
          ],
          isDisabled: function() {
            return FFW.RPCHelper.getIVDRequestNumber == 1;
          }.property(
            'FFW.RPCHelper.getIVDRequestNumber'
          ),
          disabledBinding: 'isDisabled',
          action: 'previousGetIVDResultCode',
          target: 'FFW.RPCHelper',
          text: 'Previous',
          onDown: false
        }
      ),

    nextButton: SDL.Button.extend(
      {
        classNames: [
          'nextButton'
        ],
        isDisabled: function() {
          return FFW.RPCHelper.getIVDRequestNumber ==
                                      FFW.RPCHelper.getIVDResultStruct.length;
        }.property(
          'FFW.RPCHelper.getIVDRequestNumber'
        ),
        disabledBinding: 'isDisabled',
        action: 'nextGetIVDResultCode',
        target: 'FFW.RPCHelper',
        text: 'Next',
        onDown: false
      }
    ),

    counterLabel: SDL.Label.extend(
        {
          elementId: 'counterLabel',
          classNames: 'counterLabel',
          contentBinding: 'FFW.RPCHelper.getIVDResponseStatus'
        }
    ),

    customResultCodeLabel: SDL.Label.extend(
      {
        elementId: 'customResultCodeLabel',
        classNames: 'customResultCodeLabel',
        content: 'Custom result code:'
      }
    ), 

    getIVDSelect: Em.Select.extend(
        {
          elementId: 'getIVDSelect',
          classNames: 'getIVDSelect',
          contentBinding: 'FFW.RPCHelper.customResultCodesList',
          valueBinding: 'FFW.RPCHelper.getIVDResult'
        }
    ),

    subscribedLabel: SDL.Label.extend(
      {
        elementId: 'subscribedLabel',
        classNames: 'subscribedLabel',
        content: 'isSubscribed emulation:'
      }
    ),

    getIVDSubscribed: Em.Select.extend(
      {
        elementId: 'getIVDSubscribed',
        classNames: 'getIVDSubscribed',
        contentBinding: 'FFW.RPCHelper.subscribeDataValues',
        valueBinding: 'FFW.RPCHelper.getIVDSubscribed'
      }
    )
});
