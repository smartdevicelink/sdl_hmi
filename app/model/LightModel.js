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
/**
 * @name SDL.LightModel
 * @desc Navigation model
 * @category Model
 * @filesource app/model/LightModel.js
 * @version 1.0
 */

SDL.LightModel = Em.Object.create({
   
    /*
    * Common Single Light
    */    
    singleLightNameStruct: [
        'FRONT_LEFT_HIGH_BEAM',
        'FRONT_RIGHT_HIGH_BEAM',
        'FRONT_LEFT_LOW_BEAM',
        'FRONT_RIGHT_LOW_BEAM',
        'FRONT_LEFT_PARKING_LIGHT',
        'FRONT_RIGHT_PARKING_LIGHT',
        'FRONT_LEFT_FOG_LIGHT',
        'FRONT_RIGHT_FOG_LIGHT',
        'FRONT_LEFT_DAYTIME_RUNNING_LIGHT',
        'FRONT_RIGHT_DAYTIME_RUNNING_LIGHT',
        'FRONT_LEFT_TURN_LIGHT',
        'FRONT_RIGHT_TURN_LIGHT',
        'REAR_LEFT_FOG_LIGHT',
        'REAR_RIGHT_FOG_LIGHT',
        'REAR_LEFT_TAIL_LIGHT',
        'REAR_RIGHT_TAIL_LIGHT',
        'REAR_LEFT_BREAK_LIGHT',
        'REAR_RIGHT_BREAK_LIGHT',
        'REAR_LEFT_TURN_LIGHT',
        'REAR_RIGHT_TURN_LIGHT',
        'REAR_REGISTRATION_PLATE_LIGHT'
    ],

    /*
    * Exterior Lights by common function groups
    */
    exteriorLightNameStruct: [
        'HIGH_BEAMS',
        'LOW_BEAMS',
        'FOG_LIGHTS',
        'RUNNING_LIGHTS',
        'PARKING_LIGHTS',
        'BRAKE_LIGHTS',
        'REAR_REVERSING_LIGHTS',
        'SIDE_MARKER_LIGHTS',
        'LEFT_TURN_LIGHTS',
        'RIGHT_TURN_LIGHTS',
        'HAZARD_LIGHTS',
    ],

    /*
    * Interior Lights by common function groups
    */
    interiorLightNameStruct: [
        'AMBIENT_LIGHTS',
        'OVERHEAD_LIGHTS',
        'READING_LIGHTS',
        'TRUNK_LIGHTS'
    ],

    /*
    * Lights by location
    */
    locationLightNameStruct: [
        'EXTERIOR_FRONT_LIGHTS',
        'EXTERIOR_REAR_LIGHTS',
        'EXTERIOR_LEFT_LIGHTS',
        'EXTERIOR_RIGHT_LIGHTS'
    ],

    /*
    * turn on/off a single light or all lights in a group
    */
    lightStatusStruct:[
        'ON',
        'OFF'
    ],

    lightSettings: {
        id: 'FRONT_LEFT_HIGH_BEAM',
        status: 'OFF',
        density: 0.1,
        sRGBColor:{
            red: 0,
            green: 100,
            blue: 255
        }
    },

    lightState:[],
    init: function(){
        function initialization(struct, state){
            var length = struct.length;
            for(var i = 0; i < length; ++i){
                var tempState = {
                    id: struct[i],
                    status: 'OFF',
                    density: 1,
                    sRGBColor:{
                        red: 255,
                        green: 255,
                        blue: 255
                    }
                }
                state.push(tempState);
            }
        }
        initialization(this.singleLightNameStruct, this.lightState);
        initialization(this.exteriorLightNameStruct, this.lightState);
        initialization(this.interiorLightNameStruct, this.lightState);
        initialization(this.locationLightNameStruct, this.lightState);
    },

    getLightCapabilities: function() {
         function getCapabilities(struct, capabilities){
            var result = capabilities;
            var length = struct.length;
            for(var i = 0; i < length; i++){
                result.push({
                    name: struct[i],
                    densityAvailable: true,
                    sRGBColorSpaceAvailable: true,
                });
            }
            return capabilities;
        };
        
        var result = {
          moduleName: 'Light',
           supportedLights: []
        };
        getCapabilities(this.singleLightNameStruct, result.supportedLights);
        getCapabilities(this.exteriorLightNameStruct, result.supportedLights);
        getCapabilities(this.interiorLightNameStruct, result.supportedLights);
        getCapabilities(this.locationLightNameStruct, result.supportedLights);

        return result;
    },

    setLightControlData: function(data){
        var tempState = this.lightState;
        var dataLength = data.lightState.length;
        var lightStateLength = this.lightState.length;

        for(var i = 0; i < dataLength; ++i){
            for(var j = 0; j < lightStateLength; ++j){
                if(data.lightState[i].id == this.lightState[j].id){
                    if(null != data.lightState[i].status){
                        this.set('lightState.'+j+'.status', data.lightState[i].status);
                    }
                    if(null != data.lightState[i].density){
                        this.set('lightState.'+j+'.density', data.lightState[i].density);
                    }
                    if(null != data.lightState[i].sRGBColor){
                        this.set('lightState.'+j+'.sRGBColor', 
                            data.lightState[i].sRGBColor);
                    } 
                    if(data.lightState[i].id == SDL.LightModel.lightSettings.id){
                        SDL.LightModel.set('lightSettings',this.lightState[j])
                    }
                }
            }
        }
        this.set('lightState',tempState);
        
        return {'lightState' : data.lightState};
    },
    
    getLightControlData: function(){
        var result = {
            lightState: this.lightState
        };
        return result;
    }
});
