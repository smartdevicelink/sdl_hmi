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

SDL.remoteControlCapability = 
{
    buttonCapabilities: [{
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
    }],
    climateControlCapabilities: [{
        acEnableAvailable: true,
        acMaxEnableAvailable: true,
        autoModeEnableAvailable: true,
        circulateAirEnableAvailable: true,
        currentTemperatureAvailable: true,
        defrostZone: ['FRONT', 'REAR', 'ALL', 'NONE'],
        defrostZoneAvailable: true,
        desiredTemperatureAvailable: true,
        dualModeEnableAvailable: true,
        heatedMirrorsAvailable: true,
        heatedRearWindowAvailable: true,
        heatedSteeringWheelAvailable: true,
        heatedWindshieldAvailable: true,
        fanSpeedAvailable: true,
        moduleName: 'primary_climate',
        ventilationMode: ['UPPER', 'LOWER', 'BOTH', 'NONE'],
        ventilationModeAvailable: true,
        climateEnableAvailable: true
    }],
    radioControlCapabilities: [{
        availableHdChannelsAvailable: true,
        hdChannelAvailable: true,
        hdRadioEnableAvailable: true,
        moduleName: 'radio',
        radioBandAvailable: true,
        radioEnableAvailable: true,
        radioFrequencyAvailable: true,
        rdsDataAvailable: true,
        signalChangeThresholdAvailable: true,
        signalStrengthAvailable: true,
        siriusxmRadioAvailable: true,
        sisDataAvailable: true,
        stateAvailable: true
    }],
    audioControlCapabilities: [{
        moduleName: 'audio',
        sourceAvailable: true,
        volumeAvailable: true,
        equalizerAvailable: true,
        keepContextAvailable: true,
        equalizerMaxChannelId: 10
    }],
    seatControlCapabilities: [{
      moduleName: "Seat",
      heatingEnabledAvailable: true,
      coolingEnabledAvailable: true,
      heatingLevelAvailable: true,
      coolingLevelAvailable: true,
      horizontalPositionAvailable: true,
      verticalPositionAvailable: true,
      frontVerticalPositionAvailable: true,
      backVerticalPositionAvailable: true,
      backTiltAngleAvailable: true,
      headSupportHorizontalPositionAvailable: true,
      headSupportVerticalPositionAvailable: true,
      massageEnabledAvailable: true,
      massageModeAvailable: true,
      massageCushionFirmnessAvailable: true,
      memoryAvailable: true
   }],
    lightControlCapabilities: {
        moduleName: 'light',
        supportedLights: [{
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_LEFT_HIGH_BEAM',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_RIGHT_HIGH_BEAM',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_LEFT_LOW_BEAM',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_RIGHT_LOW_BEAM',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_LEFT_PARKING_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_RIGHT_PARKING_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_LEFT_FOG_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_RIGHT_FOG_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_LEFT_DAYTIME_RUNNING_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_RIGHT_DAYTIME_RUNNING_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_LEFT_TURN_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FRONT_RIGHT_TURN_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_LEFT_FOG_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_RIGHT_FOG_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_LEFT_TAIL_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_RIGHT_TAIL_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_LEFT_BRAKE_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_RIGHT_BRAKE_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_LEFT_TURN_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_RIGHT_TURN_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_REGISTRATION_PLATE_LIGHT',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'HIGH_BEAMS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'LOW_BEAMS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'FOG_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'RUNNING_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'PARKING_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'BRAKE_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'REAR_REVERSING_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'SIDE_MARKER_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'LEFT_TURN_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'RIGHT_TURN_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'HAZARD_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'AMBIENT_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'OVERHEAD_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'READING_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'TRUNK_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'EXTERIOR_FRONT_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'EXTERIOR_REAR_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'EXTERIOR_LEFT_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: true,
            densityAvailable: true,
            name: 'EXTERIOR_RIGHT_LIGHTS',
            rgbColorSpaceAvailable: true
        }, {
            statusAvailable: false,
            densityAvailable: false,
            name: 'REAR_CARGO_LIGHTS',
            rgbColorSpaceAvailable: false
        }, {
            statusAvailable: false,
            densityAvailable: false,
            name: 'REAR_TRUCK_BED_LIGHTS',
            rgbColorSpaceAvailable: false
        }, {
            statusAvailable: false,
            densityAvailable: false,
            name: 'REAR_TRAILER_LIGHTS',
            rgbColorSpaceAvailable: false
        }, {
            statusAvailable: false,
            densityAvailable: false,
            name: 'LEFT_SPOT_LIGHTS',
            rgbColorSpaceAvailable: false
        }, {
            statusAvailable: false,
            densityAvailable: false,
            name: 'RIGHT_SPOT_LIGHTS',
            rgbColorSpaceAvailable: false
        }, {
            statusAvailable: false,
            densityAvailable: false,
            name: 'LEFT_PUDDLE_LIGHTS',
            rgbColorSpaceAvailable: false
        }, {
            statusAvailable: false,
            densityAvailable: false,
            name: 'RIGHT_PUDDLE_LIGHTS',
            rgbColorSpaceAvailable: false
        }, {
            statusAvailable: true,
            densityAvailable: false,
            name: 'EXTERIOR_ALL_LIGHTS',
            rgbColorSpaceAvailable: false
        }]
    },
    hmiSettingsControlCapabilities: {
        moduleName: 'hmiSettings',
        distanceUnitAvailable: true,
        temperatureUnitAvailable: true,
        displayModeUnitAvailable: true
    }
}
