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

SDL.RPCVehicleDataControlConfigView = Em.ContainerView.create({
    elementId: 'rpc_vehicle_data_Config',
    classNames: 'rpc_settings_separate_view',
    classNameBindings: [
        'SDL.States.settings.rpccontrol.rpcvehicledataconfig.active:active_state:inactive_state'
    ],
    
    childViews: [
      'backButton',
      'newButton',
      'removeButton',
      'previousButton',
      'nextButton',
      'counterLabel',
      'subscribevehicleData',
      'subscribevehicleDataParams'
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
        action: 'newVehicleDataResponse',
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
          return FFW.RPCHelper.VehicleDataResultCodes.length == 1;
        }.property(
          'FFW.RPCHelper.VehicleDataRequestNumber'
          
        ),
        disabledBinding: 'isDisabled',
        action: 'removeVehicleDataResponse',
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
            return FFW.RPCHelper.VehicleDataRequestNumber == 1;
          }.property(
            'FFW.RPCHelper.VehicleDataRequestNumber'
          ),
          disabledBinding: 'isDisabled',
          action: 'previousVehicleDataResultCode',
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
          return FFW.RPCHelper.VehicleDataRequestNumber == 
                                      FFW.RPCHelper.VehicleDataResultCodes.length;
        }.property(
          'FFW.RPCHelper.VehicleDataRequestNumber'
        ),
        disabledBinding: 'isDisabled',
        action: 'nextVehicleDataResultCode',
        target: 'FFW.RPCHelper',
        text: 'Next',
        onDown: false
      }),  
    counterLabel: SDL.Label.extend(
        {
          elementId: 'counterLabel',
          classNames: 'counterLabel',
          contentBinding: 'FFW.RPCHelper.getVehicleDataStatus'
        }),  
    subscribevehicleData: Em.ContainerView.create(
      {
        elementId: 'subscribevehicleData',
        classNames: 'subscribevehicleData',
        childViews: [
          'label',
          'select'
        ],
        label: SDL.Label.extend(
          {
            elementId: 'label',
            classNames: 'label',
            content: 'SubscribeVehicleData'
          }),
          select: Em.Select.extend(
          {
            elementId: 'SubscribevehicleDataSelect',
            classNames: 'select',
            contentBinding: 'SDL.SDLModel.data.resultCodes',
            valueBinding: 'FFW.RPCHelper.SubscribeVehicleData'
          }),   
      }),
    subscribevehicleDataParams: Em.ContainerView.create(
      {
        elementId: 'subscribevehicleDataParams',
        classNames: 'subscribevehicleDataParams',
        childViews: []
      }),
    isFirstInitialization: true,
    initSubscribevehicleDataParams: function(){
        if(!this.isFirstInitialization){
          return;
        }
        this.isFirstInitialization = false;

        for(var viewsName in FFW.RPCHelper.vehicleDataStruct){
          selectValueBinding = 'FFW.RPCHelper.vehicleDataStruct.' + viewsName;
          this.get('subscribevehicleDataParams.childViews').pushObject(Em.ContainerView.create({
            elementId: viewsName,
            classNames: 'params',
            childViews: [
              'label',
              'select'
            ],

            label: SDL.Label.extend(
              {
                elementId: 'label',
                classNames: 'label',
                content: viewsName
              }),
            select:  Em.Select.extend(
              {
                elementId: viewsName + 'Select',
                classNames: 'select',
                contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                valueBinding: selectValueBinding
              }),   
          }));
  
        }
    }          
});
