/*
 * Copyright (c) 2018, Ford Motor Company All rights reserved.
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

SDL.RPCInteriorVehicleDataControlConfigView = Em.ContainerView.create(
    {
    elementId: 'rpc_interior_vehicle_data_Config',
    classNames: 'rpc_settings_separate_view',
    classNameBindings: [
        'SDL.States.settings.rpccontrol.rpcinteriorvehicledataconfig.active:active_state:inactive_state'
    ],
    childViews: [
    'backButton',
    'newButton',
    'removeButton',
    'previousButton',
    'nextButton',
    'counterLabel',
    'interiorVehicleDataSelect'
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
    }),
    newButton: SDL.Button.extend(
    {
        classNames: [
        'newButton'
        ],
        action: 'newInteriorVehicleDataResponse',
        target: 'FFW.RPCHelper',
        text: 'New',
        onDown: false
    }),
    removeButton: SDL.Button.extend(
    {
        classNames: [
        'removeButton'
        ],
        isDisabled: function() {
        return FFW.RPCHelper.GetInteriorVehicleDataResultCodes.length == 1;
        }.property(
        'FFW.RPCHelper.interiorVehicleDataNumber'
        
        ),
        disabledBinding: 'isDisabled',
        action: 'removeInteriorVehicleData',
        target: 'FFW.RPCHelper',
        text: 'Remove',
        onDown: false
    }),
    previousButton: SDL.Button.extend(
        {
        classNames: [
            'previousButton'
        ],
        isDisabled: function() {
            return FFW.RPCHelper.interiorVehicleDataNumber == 1;
        }.property(
            'FFW.RPCHelper.interiorVehicleDataNumber'
        ),
        disabledBinding: 'isDisabled',
        action: 'previousInteriorVehicleData',
        target: 'FFW.RPCHelper',
        text: 'Previous',
        onDown: false
    }),
    nextButton: SDL.Button.extend(
    {
        classNames: [
        'nextButton'
        ],
        isDisabled: function() {
        return FFW.RPCHelper.interiorVehicleDataNumber == 
                                    FFW.RPCHelper.GetInteriorVehicleDataResultCodes.length;
        }.property(
        'FFW.RPCHelper.interiorVehicleDataNumber'
        ),
        disabledBinding: 'isDisabled',
        action: 'nextInteriorVehicleData',
        target: 'FFW.RPCHelper',
        text: 'Next',
        onDown: false
    }),  
    counterLabel: SDL.Label.extend(
        {
        elementId: 'counterLabel',
        classNames: 'counterLabel',
        contentBinding: 'FFW.RPCHelper.getInteriorVehicleDataResponseStatus'
    }),  
    interiorVehicleDataSelect: Em.Select.extend(
        {
          elementId: 'interiorVehicleDataSelect',
          classNames: 'interiorVehicleDataSelect',
          contentBinding: 'SDL.SDLModel.data.resultCodes',
          valueBinding: 'FFW.RPCHelper.GetInteriorVehicleData'
    }),   
});
