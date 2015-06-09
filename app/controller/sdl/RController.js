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
 * @name SDL.RController
 * @desc SDL abstract application controller
 * @category Controller
 * @filesource app/controller/sdl/RController.js
 * @version 1.0
 */

SDL.RController = SDL.ABSController.extend({

    /**
     * Button action to sent response for RC.GrantAccess request
     *
     * @type {Object}
     */
    ControlAccessAction: function (appID, value) {
            if (value) {
                FFW.RC.sendRCResult(
                    SDL.SDLModel.data.resultCode['SUCCESS'],
                    SDL.SDLModel.controlRequestID,
                    "RC.GrantAccess"
                );
                SDL.SDLModel.set('givenControl', appID);
                SDL.SDLModel.set('givenControlFlag', true);
                //FFW.CAN.OnRadioDetails({"radioStation": SDL.RadioModel.radioDetails.radioStation});

                FFW.RC.onInteriorVehicleDataNotification("RADIO", 'subscribed', SDL.RadioModel.get('radioControlData'));
            } else {
                FFW.RC.sendError(
                    SDL.SDLModel.data.resultCode['REJECTED'],
                    SDL.SDLModel.controlRequestID,
                    "RC.GrantAccess",
                    "Request cancelled."
                );
            }
            SDL.SDLModel.set('controlRequestID', null);
    },

    /**
     * Send notification to SDL about changes of SDL functionality
     * @param element
     * @constructor
     */
    OnReverseAppsAllowing: function (element) {
        element.toggleProperty('allowed');

        FFW.VehicleInfo.OnReverseAppsAllowing(element.allowed);
    },

    openPrimaryDeviceWindow: function(element) {
        SDL.PrimaryDevice.toggleProperty('active');
    },

    primaryDeviceWindowAction: function(device) {

        this.openPrimaryDeviceWindow();

        FFW.VehicleInfo.OnPrimaryDevice(device);
    }
});