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
 * @name SDL.PrimaryDevice
 * @desc PrimaryDevice selection window
 * @category View
 * @filesource app/view/sdl/PrimaryDevice.js
 * @version 1.0
 */

SDL.PrimaryDevice = Em.ContainerView.create( {

    elementId: 'PrimaryDevice',

    classNames: 'PrimaryDevice',

    classNameBindings:
        [
            'active'
        ],

    childViews:
    [
        'primaryDeviceLabel',
        'chooseLabel',
        'deviceSelect',
        'primaryButton'
    ],

    /**
     * Property indicates the activity state of VehicleInfo PopUp
     */
    active: false,

    /**
     * Title of VehicleInfo PopUp view
     */
    primaryDeviceLabel: SDL.Label.extend( {

        elementId: 'primaryDeviceLabel',

        classNames: 'primaryDeviceLabel',

        content: 'Primary Device Selection Window'
    } ),

    /**
     * Title of prndl group of parameters stored in VehicleInfo model
     */
    chooseLabel: SDL.Label.extend( {

        elementId: 'chooseLabel',

        classNames: 'chooseLabel',

        content: 'Select device to be set as primary'
    } ),

    updatedList: function() {
        var temArray = [];

        for (var key in SDL.SDLModel.data.connectedDevices) {
            if (SDL.SDLModel.data.connectedDevices.hasOwnProperty(key)) {

                temArray.push(SDL.SDLModel.data.connectedDevices[key]);
            }
        }

        return temArray;
    }.property('SDL.SDLModel.data.connectedDevices'),

    /**
     * HMI element Select with parameters of transmission state from VehicleInfo
     * Model
     */
    deviceSelect: Em.Select.extend( {

        elementId: 'deviceSelect',

        classNames: 'deviceSelect',

        contentBinding: 'this.parentView.updatedList',

        optionValuePath: 'content.id',

        optionLabelPath: 'content.name',

        selectUpdate: function() {
            SDL.PrimaryDevice.deviceSelect.selection = SDL.PrimaryDevice.deviceSelect.content[0];
        }.observes('this.content')
    } ),

    /**
     * Button to send OnEmergencyEvent to SDL
     */
    primaryButton: SDL.Button.extend( {
        classNames: 'button primaryButton',
        textBinding: 'this.displayText',
        click: function() {
            SDL.SDLController.primaryDeviceWindowAction(this._parentView.deviceSelect.selection)
        },
        enabled: false,
        onDown: false,
        displayText: function () {
            return this.enabled ? 'Send OnEmergencyEvent On' : 'Send OnEmergencyEvent Off';
        }.property('this.enabled')
    }),

    /**
     * Trigger function that activates and deactivates VehicleInfo PopUp
     */
    toggleActivity: function() {
        this.set( 'active', !this.active );
    },

    /**
     * This event triggered when component is placed to
     * document DOM structure
     */
    didInsertElement: function() {
        this._super();
    }
} );