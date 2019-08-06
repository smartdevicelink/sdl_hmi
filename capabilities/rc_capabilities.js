/*
 * Copyright (c) 2019, Ford Motor Company All rights reserved.
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
 * @name SDL.remoteControlCapability
 * @desc Remote control capabilities
 * @category Capabilities
 * @filesource app/capabilities/rc_capabilities.js
 * @version 1.0
 */

SDL.initialRemoteControlCapabilities =
{
    remoteControlCapability: {
        buttonCapabilities: [],
        climateControlCapabilities: [],
        radioControlCapabilities: [],
        audioControlCapabilities: [],
        seatControlCapabilities: [],
        lightControlCapabilities: {},
        hmiSettingsControlCapabilities: {}
    },
    seatLocationCapability: {
        columns: 0,
        rows: 0,
        levels: 0,
        seats: []
    }
}

SDL.remoteControlCapabilities = {}

SDL.defaultButtonCapabilities = [{
    longPressAvailable: true,
    name: 'AC_MAX',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'AC',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'RECIRCULATE',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'FAN_UP',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'FAN_DOWN',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'TEMP_UP',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'TEMP_DOWN',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'DEFROST_MAX',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'DEFROST',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'DEFROST_REAR',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'UPPER_VENT',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'LOWER_VENT',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'VOLUME_UP',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'VOLUME_DOWN',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'EJECT',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'SOURCE',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'SHUFFLE',
    shortPressAvailable: true,
    upDownAvailable: false
}, {
    longPressAvailable: true,
    name: 'REPEAT',
    shortPressAvailable: true,
    upDownAvailable: false
}]
