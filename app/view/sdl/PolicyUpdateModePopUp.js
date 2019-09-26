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
 * @name SDL.PolicyUpdateModePopUp
 * @desc Policy update can be performed using app modem or mobile device.
 * @category View
 * @filesource app/view/sdl/PolicyUpdateModePopUp.js
 * @version 1.0
 */

SDL.PolicyUpdateModePopUp = Em.ContainerView.create({
    elementId: 'policyUpdateModePopUp',
    classNames: 'policyUpdateModePopUp',
    classNameBindings: ['active'],
    childViews: [
        'modemPolicyUpdate',
        'mobilePolicyUpdate',
        'PTUFilePathLabel',
        'PTUFilePathInput'
    ],
    active: false,
    toggleActivity: function() {
        this.toggleProperty('active');
    },
    onModemPTUClicked: function (event) {
      SDL.PolicyUpdateModePopUp.set('PTUFilePathInput.active', true);
      SDL.PolicyUpdateModePopUp.set('PTUFilePathInput.disabled', false);
    },
    onMobilePTUClicked: function (event) {
      SDL.PolicyUpdateModePopUp.set('PTUFilePathInput.disabled', true);
    },
    modemPolicyUpdate: SDL.RadioButton.extend({
        Id: 'modemPolicyUpdateModeRadiobtn',
        name: 'radio',
        value: 'PTUWithVehicleModem',
        selectionBinding: 'FLAGS.PolicyUpdateMode',
        text: 'Policy table udpdate using in-vehicle modem',
        clickCallbackBinding: 'this.parentView.onModemPTUClicked'
    }),
    mobilePolicyUpdate: SDL.RadioButton.extend({
        Id: 'mobilePolicyUpdateModeRadiobtn',
        name: 'radio',
        value: 'PTUWithMobile',
        selectionBinding: 'FLAGS.PolicyUpdateMode',
        text: 'Policy table udpdate using mobile device',
        clickCallbackBinding: 'this.parentView.onMobilePTUClicked'
    }),
    PTUFilePathLabel: SDL.Label.extend(
        {
          elementId: 'PTUFilePathLabel',
          classNames: 'PTUFilePathLabel',
          content: 'PTU file path',
          active: false
        }
      ),
      PTUFilePathInput: Ember.TextField.extend(
        {
          elementId: 'PTUFilePathInput',
          classNames: 'PTUFilePathInput',
          disabled: true,
          value: document.location.pathname.replace(
            'sdl_hmi/index.html', 'sdl_core_build/bin/sdl_preloaded_pt.json'),
        }
      )
});