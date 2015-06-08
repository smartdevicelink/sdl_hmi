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
 * @name SDL.PlayerControllsView
 * @desc Video player visual representation
 * @category View
 * @filesource app/view/player/PlayerView.js
 * @version 1.0
 */
SDL.ClimateView = Em.ContainerView.create( {
    /** View Id */
    elementId: 'climateView',

    classNameBindings:
        [
            'SDL.States.climate.active:active_state:inactive_state'
        ],

    childViews:
        [
            'windowText',
            'climateView'
        ],

    windowText: SDL.Label.extend( {

        classNames: 'windowText',

        content: 'Climate'
    } ),

    climateView: Em.ContainerView.extend({

        elementId: 'climate_control',

        classNameBindings: 'SDL.FuncSwitcher.rev::is-disabled',

        childViews: [
            'desiredTemp',
            'fanSpeed',
            'currentTemp',
            'defrostZone',
            'temperatureUnit',
            'acEnable',
            'autoModeEnable',
            'dualModeEnable',
            'recirculateAirEnable',
            'zoneSelection'
        ],

        disabled: function(){
            if (SDL.ClimateController.model.zoneSelect === 'Driver'){
                return false;
            } else {
                return true;
            }
        }.property('SDL.ClimateController.model.zoneSelect'),

        desiredTemp: Em.ContainerView.extend({

            elementId: 'desiredTemp_container',

            classNames: 'calc_container',

            childViews: [
                'desiredTemp_label',
                'desiredTemp_minus',
                'desiredTemp_plus'
            ],

            desiredTemp_minus: SDL.Button.extend({
                elementId: 'desiredTemp_minus',

                classNames: 'minus',

                templateName: 'icon',

                icon: 'images/climate/minus_ico.png',

                onDown: false,

                action: 'desiredTempDown',

                target: 'SDL.ClimateController.model'
            }),

            desiredTemp_label: SDL.Label.extend({

                elementId:'desiredTemp_label',

                contentBinding: 'SDL.ClimateController.model.currentSet.climateControlData.desiredTemp'
            }),

            desiredTemp_plus: SDL.Button.extend({

                elementId: 'desiredTemp_plus',

                classNames: 'plus',

                templateName: 'icon',

                icon: 'images/climate/plus_ico.png',

                onDown: false,

                action: 'desiredTempUp',

                target: 'SDL.ClimateController.model'
            })

        }),

        fanSpeed: Em.ContainerView.extend({

            elementId: 'fanSpeed_container',

            classNames: 'calc_container',

            childViews: [
                'fanSpeed_label',
                'fanSpeed_minus',
                'fanSpeed_plus'
            ],

            fanSpeed_minus: SDL.Button.extend({
                elementId: 'fanSpeed_minus',

                classNames: 'minus',

                templateName: 'icon',

                icon: 'images/climate/minus_ico.png',

                onDown: false,

                action: 'fanSpeedDown',

                target: 'SDL.ClimateController.model'
            }),

            fanSpeed_label: SDL.Label.extend({

                elementId:'fanSpeed_label',

                contentBinding: 'SDL.ClimateController.model.currentSet.climateControlData.fanSpeed'
            }),

            fanSpeed_plus: SDL.Button.extend({

                elementId: 'fanSpeed_plus',

                classNames: 'plus',

                templateName: 'icon',

                icon: 'images/climate/plus_ico.png',

                onDown: false,

                action: 'fanSpeedUp',

                target: 'SDL.ClimateController.model'
            })

        }),

        currentTemp: Em.ContainerView.extend({

            elementId: 'currentTemp_container',

            classNames: 'calc_container',

            childViews: [
                'currentTemp_label',
                'currentTemp_minus',
                'currentTemp_plus'
            ],

            currentTemp_minus: SDL.Button.extend({
                elementId: 'currentTemp_minus',

                classNames: 'minus',

                templateName: 'icon',

                icon: 'images/climate/minus_ico.png',

                onDown: false,

                action: 'currentTempDown',

                target: 'SDL.ClimateController.model'
            }),

            currentTemp_label: SDL.Label.extend({

                elementId:'currentTemp_label',

                contentBinding: 'SDL.ClimateController.model.currentSet.climateControlData.currentTemp'
            }),

            currentTemp_plus: SDL.Button.extend({

                elementId: 'currentTemp_plus',

                classNames: 'plus',

                templateName: 'icon',

                icon: 'images/climate/plus_ico.png',

                onDown: false,

                action: 'currentTempUp',

                target: 'SDL.ClimateController.model'
            })

        }),

        defrostZone: Em.ContainerView.extend({

            elementId: 'defrostZone',

            classNames: 'quattro_container',

            childViews: [
                'defrostZone_Rear',
                'defrostZone_Front',
                'defrostZone_All'
            ],

            selectedBinding: 'SDL.ClimateController.model.currentSet.climateControlData.defrostZone',

            defrostZone_Rear: SDL.Button.extend({
                elementId: 'defrostZoneRear',

                classNames: 'defrostZoneRear topRight',

                classNameBindings: 'highlighted',

                highlighted: function(){
                    return this._parentView.selected === 'REAR';
                }.property('parentView.selected'),


                templateName: 'icon',

                icon: 'images/climate/defrost_ico.png',

                onDown: false,

                disabledBinding: 'parentView.parentView.disabled',

                action: 'defrostRearEnable',

                target: 'SDL.ClimateController.model'
            }),

            defrostZone_Front: SDL.Button.extend({
                elementId: 'defrostZoneFront',

                classNames: 'defrostZoneFront bottomLeft',

                classNameBindings: 'highlighted',

                highlighted: function(){
                    return this._parentView.selected === 'FRONT';
                }.property('parentView.selected'),

                templateName: 'icon',

                icon: 'images/climate/windsheald_ico.png',

                onDown: false,

                disabledBinding: 'parentView.parentView.disabled',

                action: 'defrostFrontEnable',

                target: 'SDL.ClimateController.model'
            }),

            defrostZone_All: SDL.Button.extend({
                elementId: 'defrostZoneAll',

                classNames: 'defrostZoneAll bottomRight',

                classNameBindings: 'highlighted',

                highlighted: function(){
                    return this._parentView.selected === 'ALL';
                }.property('parentView.selected'),

                text: 'BOTH',

                onDown: false,

                disabledBinding: 'parentView.parentView.disabled',

                action: 'defrostAllEnable',

                target: 'SDL.ClimateController.model'
            })
        }),

        temperatureUnit: Em.ContainerView.extend({

            elementId: 'temperatureUnit',

            classNames: 'quattro_container',

            childViews: [
                'kelvin',
                'fahrenheit',
                'celsius'
            ],

            selectedBinding: 'SDL.ClimateController.model.currentSet.climateControlData.temperatureUnit',

            kelvin: SDL.Button.extend({
                elementId: 'kelvin',

                classNames: 'kelvin topRight',

                classNameBindings: 'highlighted',

                highlighted: function(){
                    return this._parentView.selected === 'KELVIN';
                }.property('parentView.selected'),

                text: 'K',

                onDown: false,

                disabledBinding: 'parentView.parentView.disabled',

                action: 'temperatureUnitKelvinEnable',

                target: 'SDL.ClimateController.model'
            }),

            fahrenheit: SDL.Button.extend({
                elementId: 'fahrenheit',

                classNames: 'fahrenheit bottomLeft',

                classNameBindings: 'highlighted',

                highlighted: function(){
                    return this._parentView.selected === 'FAHRENHEIT';
                }.property('parentView.selected'),

                text: 'F',

                onDown: false,

                disabledBinding: 'parentView.parentView.disabled',

                action: 'temperatureUnitFahrenheitEnable',

                target: 'SDL.ClimateController.model'
            }),

            celsius: SDL.Button.extend({
                elementId: 'celsius',

                classNames: 'celsius bottomRight',

                classNameBindings: 'highlighted',

                highlighted: function(){
                    return this._parentView.selected === 'CELSIUS';
                }.property('parentView.selected'),

                text: 'C',

                onDown: false,

                disabledBinding: 'parentView.parentView.disabled',

                action: 'temperatureUnitCelsiusEnable',

                target: 'SDL.ClimateController.model'
            })
        }),

        acEnable:  SDL.Button.extend({
            elementId:		'acEnable',
            classNames:		'acEnable switcher',
            iconBinding:	'onIconChange',
            disabledBinding: 'parentView.disabled',
            // Change Icon for Frequency Scan
            onIconChange: function(){
                if(SDL.ClimateController.model.currentSet.climateControlData.acEnable){
                    return 'images/media/active_horiz_led.png';
                }else{
                    return 'images/media/passiv_horiz_led.png';
                }
            }.property('SDL.ClimateController.model.currentSet.climateControlData.acEnable'),
            action: 'toggleAcEnable',
            target: 'SDL.ClimateController.model',
            onDown: false,
            text: 	'AC'
        }),

        autoModeEnable:  SDL.Button.extend({
            elementId:		'autoModeEnable',
            classNames:		'autoModeEnable switcher',
            iconBinding:	'onIconChange',
            disabledBinding: 'parentView.disabled',
            // Change Icon for Frequency Scan
            onIconChange: function(){
                if(SDL.ClimateController.model.currentSet.climateControlData.autoModeEnable){
                    return 'images/media/active_horiz_led.png';
                }else{
                    return 'images/media/passiv_horiz_led.png';
                }
            }.property('SDL.ClimateController.model.currentSet.climateControlData.autoModeEnable'),
            action: 'toggleAutoModeEnable',
            target: 'SDL.ClimateController.model',
            onDown: false,
            text: 	'Auto'
        }),

        dualModeEnable:  SDL.Button.extend({
            elementId:		'dualModeEnable',
            classNames:		'dualModeEnable switcher',
            iconBinding:	'onIconChange',
            disabledBinding: 'parentView.disabled',
            // Change Icon for Frequency Scan
            onIconChange: function(){
                if(SDL.ClimateController.model.currentSet.climateControlData.dualModeEnable){
                    return 'images/media/active_horiz_led.png';
                }else{
                    return 'images/media/passiv_horiz_led.png';
                }
            }.property('SDL.ClimateController.model.currentSet.climateControlData.dualModeEnable'),
            action: 'toggleDualMode',
            target: 'SDL.ClimateController.model',
            onDown: false,
            text: 	'Dual'
        }),

        recirculateAirEnable:  SDL.Button.extend({
            elementId:		'recirculateAirEnable',
            classNames:		'recirculateAirEnable switcher',
            iconBinding:	'onIconChange',
            disabledBinding: 'parentView.disabled',
            // Change Icon for Frequency Scan
            onIconChange: function(){
                if(SDL.ClimateController.model.currentSet.climateControlData.circulateAirEnable){
                    return 'images/media/active_horiz_led.png';
                }else{
                    return 'images/media/passiv_horiz_led.png';
                }
            }.property('SDL.ClimateController.model.currentSet.climateControlData.circulateAirEnable'),
            righticon: 'images/climate/recycle_ico.png',
            action: 'toggleRecirculateAir',
            target: 'SDL.ClimateController.model',
            templateName: 'rightIcon',
            onDown: false
        }),

        zoneSelection: Em.Select.extend( {

            elementId: 'zoneSelection',

            classNames: 'zoneSelection',

            contentBinding: 'SDL.ClimateController.model.zoneSet',

            valueBinding: 'SDL.ClimateController.model.zoneSelect'
        } )
    })

} );