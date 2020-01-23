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
 * @name SDL
 * @desc flags for application flags used for diffeerent configurations of
 *       application As the same code base is used fro Production and RnD work
 *       pakackages, it is necessary to configare application for different
 *       needs/releases It is NOT recommended to extend this object with new
 *       flags. Each modification should be discussed with PM in advance
 * @category Application
 * @filesource app/AppFlags.js
 * @version 1.0
 */

FLAGS = Em.Object.create(
  {
    /**
     * Set language for localization
     */
    SET_LOCALIZATION: 'eng',
    WEBSOCKET_URL: 'ws://127.0.0.1:8087',
    PYTHON_SERVER_URL: 'ws://127.0.0.1:8081',
    CAN_WEBSOCKET_URL: 'ws://127.0.0.1:2468',
    TOUCH_EVENT_STARTED: false,
    BasicCommunication: null,
    UI: null,
    VehicleInfo: null,
    VR: null,
    Buttons: null,
    TTS: null,
    Navigation: null,
    CAN: null,
    RC: null,
    steeringWheelLocation: 'LEFT',
    /**
     * 0 - G
     * 1 - R
     * 2 - P
     */
    SimpleFunctionality: 1,
    ExternalPolicies: false,
    /**
     * Vehicle zones emulation:
     * 'no_emulation' - emulation disabled
     * 'vehicle_2x3' - emulate 2x3 one level vehicle
     * 'vehicle_3x3' - emulate 3x3 one level vehicle
     */
    VehicleEmulationType: 'vehicle_2x3',

    /**
     * Flag for storing last applied vehicle emulation type
     */
    lastVehicleEmulationtype: 'vehicle_2x3',

    /**
     * Flag to enable PTU flow over in-vehicle modem
     */
    PTUWithModemEnabled: false
  }
);
