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

SDL.RPCControlConfigView = Em.ContainerView.create({
    elementId: 'rpc_settings_deviceConfig',
    classNames: 'rpc_settings_separate_view',
    classNameBindings: [
        'SDL.States.settings.rpccontrol.rpcconfig.active:active_state:inactive_state'
    ],
    childViews: [
        'backButton',
        'rpcList',
        'resultCodeTracker',
        'saveButton',
        'resetButton',
        'appNameLabel',
        'SubscribeButton'
    ],
    appNameLabel: SDL.Label.extend({
        elementId: 'appNameLabel',
        classNames: 'appNameLabel'
    }),
    resetButton: SDL.Button.extend({
        classNames: [
            'resetButton'
        ],
        action: 'resetButton',
        target: 'FFW.RPCHelper',
        goToState: 'rpccontrol',
        text: 'Reset to default',
        onDown: false
    }),
    saveButton: SDL.Button.extend({
        classNames: [
            'saveButton'
        ],
        action: 'saveButton',
        target: 'FFW.RPCHelper',
        goToState: 'rpccontrol',
        text: 'Save',
        onDown: false
    }),
    backButton: SDL.Button.extend({
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
    rpcList: Em.ContainerView.extend({
        elementId: 'rpcList',
        classNames: 'rpcList',
        childViews: [
            'vrAddComandlabel',
            'uiAddComandlabel',
            'addSubMenulabel',
            'createInteractionChoiceSetlabel',
            'uisetGlobalPropertieslabel',
            'ttssetGlobalPropertieslabel',
            'rcsetGlobalPropertieslabel',
            'uiCreateWindowLabel'
        ],
        vrAddComandlabel: SDL.Label.extend({
            elementId: 'addComandlabel',
            classNames: 'vrAddComandlabel',
            content: 'VR.AddCommand'
        }),
        uiAddComandlabel: SDL.Label.extend({
            elementId: 'addComandlabel',
            classNames: 'uiAddComandlabel',
            content: 'UI.AddCommand'
        }),
        addSubMenulabel: SDL.Label.extend({
            elementId: 'addSubMenulabel',
            classNames: 'addSubMenulabel',
            content: 'AddSubMenu'
        }),
        createInteractionChoiceSetlabel: SDL.Label.extend({
            elementId: 'createInteractionChoiceSetlabel',
            classNames: 'createInteractionChoiceSetlabel',
            content: 'CreateInteractionChoiceSet'
        }),
        uisetGlobalPropertieslabel: SDL.Label.extend({
            elementId: 'uisetGlobalProperties',
            classNames: 'uisetGlobalProperties',
            content: 'UI.SetGlobalProperties'
        }),
        ttssetGlobalPropertieslabel: SDL.Label.extend({
            elementId: 'ttssetGlobalPropertieslabel',
            classNames: 'ttssetGlobalPropertieslabel',
            content: 'TTS.SetGlobalProperties'
        }),
        rcsetGlobalPropertieslabel: SDL.Label.extend({
            elementId: 'rcsetGlobalPropertieslabel',
            classNames: 'rcsetGlobalPropertieslabel',
            content: 'RC.SetGlobalProperties'
        }),
        uiCreateWindowLabel: SDL.Label.extend({
            elementId: 'uiCreateWindowLabel',
            classNames: 'uiCreateWindowLabel',
            content: 'UI.CreateWindow'
        })
    }),
    resultCodeTracker: Em.ContainerView.extend({
        elementId: 'resultCodeTracker',
        classNames: 'resultCodeTracker',
        childViews: [
            'vrAddComandSelect',
            'uiAddComandSelect',
            'addSubMenuSelect',
            'createInteractionChoiceSetSelect',
            'uisetGlobalPropertiesSelect',
            'ttssetGlobalPropertiesSelect',
            'rcsetGlobalPropertiesSelect',
            'uiCreateWindowSelect'
        ],
        vrAddComandSelect: Em.Select.extend({
            elementId: 'vrAddComandSelect',
            classNames: 'vrAddComandSelect',
            contentBinding: 'FFW.RPCHelper.customResultCodesList',
            valueBinding: 'FFW.RPCHelper.rpcStruct.vrAddCommand'
        }),
        uiAddComandSelect: Em.Select.extend({
            elementId: 'uiAddComandSelect',
            classNames: 'uiAddComandSelect',
            contentBinding: 'FFW.RPCHelper.customResultCodesList',
            valueBinding: 'FFW.RPCHelper.rpcStruct.uiAddCommand'
        }),
        addSubMenuSelect: Em.Select.extend({
            elementId: 'addSubMenuSelect',
            classNames: 'addSubMenuSelect',
            contentBinding: 'FFW.RPCHelper.customResultCodesList',
            valueBinding: 'FFW.RPCHelper.rpcStruct.AddSubmenu'
        }),
        createInteractionChoiceSetSelect: Em.Select.extend({
            elementId: 'createInteractionChoiceSetSelect',
            classNames: 'createInteractionChoiceSetSelect',
            contentBinding: 'FFW.RPCHelper.customResultCodesList',
            valueBinding: 'FFW.RPCHelper.rpcStruct.createInteractionChoiceSet'
        }),
        uisetGlobalPropertiesSelect: Em.Select.extend({
            elementId: 'uisetGlobalPropertiesSelect',
            classNames: 'uisetGlobalPropertiesSelect',
            contentBinding: 'FFW.RPCHelper.customResultCodesList',
            valueBinding: 'FFW.RPCHelper.rpcStruct.uiSetGlobalProperties'
        }),
        ttssetGlobalPropertiesSelect: Em.Select.extend({
            elementId: 'ttssetGlobalPropertiesSelect',
            classNames: 'ttssetGlobalPropertiesSelect',
            contentBinding: 'FFW.RPCHelper.customResultCodesList',
            valueBinding: 'FFW.RPCHelper.rpcStruct.ttsSetGlobalProperties'
        }),
        rcsetGlobalPropertiesSelect: Em.Select.extend({
            elementId: 'rcsetGlobalPropertiesSelect',
            classNames: 'rcsetGlobalPropertiesSelect',
            contentBinding: 'FFW.RPCHelper.customResultCodesList',
            valueBinding: 'FFW.RPCHelper.rpcStruct.rcSetGlobalProperties'
        }),
        uiCreateWindowSelect: Em.Select.extend({
            elementId: 'uiCreateWindowSelect',
            classNames: 'uiCreateWindowSelect',
            contentBinding: 'FFW.RPCHelper.customResultCodesList',
            valueBinding: 'FFW.RPCHelper.rpcStruct.uiCreateWindow'
        }),
    }),
    SubscribeButton: Em.ContainerView.create({
        elementId: 'SubscribeButton',
        classNames: 'SubscribeButton',
        childViews: [
            'header'
        ],
        header: SDL.Label.extend({
            elementId: 'header',
            classNames: 'header',
            content: 'Subscribe Button Result Codes:'
        }),
        isFirstInit: true,
        initSubscribeButtonView: function() {
            if (!this.isFirstInit) {
                return;
            }
            this.isFirstInit = false;

            for (param in FFW.RPCHelper.SubscribeButton) {
                this.get('childViews').pushObject(Em.ContainerView.create({
                    elementId: `SubscribeButton${param}`,
                    classNames: 'SubscribeButtonParam',
                    childViews: [
                        'label',
                        'select'
                    ],
                    label: SDL.Label.extend({
                        elementId: param + 'Label',
                        classNames: 'label',
                        content: param
                    }),
                    select: Em.Select.extend({
                        elementId: `${param}Select`,
                        classNames: 'select',
                        contentBinding: 'SDL.SDLModel.data.resultCodes',
                        valueBinding: `FFW.RPCHelper.SubscribeButton.${param}`
                    })
                }));
            }
        }
    })
});