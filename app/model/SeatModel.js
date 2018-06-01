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
 * @name SDL.SeatModel
 * @desc Navigation model
 * @category Model
 * @filesource app/model/SeatModel.js
 * @version 1.0
 */

SDL.SeatModel = Em.Object.create({
    driverMemory:new Object(),

    passengerMemory:new Object(),

    enableStruct:[
        'ON',
        'OFF'
    ],

    ID:'',
    heatingEnableData: 'OFF',

    coolingEnabledData: 'OFF',

    massageEnabledData: 'OFF',

    mandatoryField:[
        'id',
        'memory.id',
        'memory.action'
    ],

    /*
    * List possible zones of a multi-contour massage seat
    */
    massageZoneStruct:[
        'LUMBAR',
        'SEAT_CUSHION'
    ],

    /*
    * List possible modes of a massage zone
    */
    massageModeStruct:[
        'OFF',
        'LOW',
        'HIGH'
    ],

    /*
    * Specify the mode of a massage zone
    */
    massageCushionStruct:[
        'TOP_LUMBAR',
        'MIDDLE_LUMBAR',
        'BOTTOM_LUMBAR',
        'BACK_BOLSTERS',
        'SEAT_BOLSTERS'
    ],

    /*
    * List possible cushions of a multi-contour massage seat
    */
    supportedSeatStruct:[
        'DRIVER',
        'FRONT_PASSENGER'
    ],

    seatMemoryActionTypeStruct:[
        'SAVE',
        'RESTORE',
        'NONE'
    ],

    /*
    * Specify the mode of a massage
    */
    massageModeData:{
        massageZone: 'LUMBAR',
        massageMode: 'OFF'
    },

    /*
    * The intensity or firmness of a cushion
    */
    massageCushionFirmness:{
        cushion: 'TOP_LUMBAR',
        firmness: 0
    },

    seatMemoryAction: {
        id: 1,
        label: 'Label value',
        action: 'NONE'
    },

    seatControlData: Em.Object.create({
        id: null,
        heatingEnabled: false,
        coolingEnabled: false,
        heatingLevel: 0,
        coolingLevel: 0,
        horizontalPosition: 0,
        verticalPosition: 0,
        frontVerticalPosition: 0,
        backVerticalPosition: 0,
        backTiltAngle: 0,
        headSupportHorizontalPosition: 0,
        headSupportVerticalPosition: 0,
        massageEnabled: false,
        massageMode: [],
        massageCushionFirmness: [],
        memory: null
    }),

    tempSeatControlData: Em.Object.create({
        id: null,
        heatingEnabled: false,
        coolingEnabled: false,
        heatingLevel: 0,
        coolingLevel: 0,
        horizontalPosition: 0,
        verticalPosition: 0,
        frontVerticalPosition: 0,
        backVerticalPosition: 0,
        backTiltAngle: 0,
        headSupportHorizontalPosition: 0,
        headSupportVerticalPosition: 0,
        massageEnabled: false,
        massageMode: [],
        massageCushionFirmness: [],
        memory: null
    }),

    massageCushionFirmness0: true,
    massageCushionFirmness1: false,
    massageCushionFirmness2: false,
    massageCushionFirmness3: false,
    massageCushionFirmness4: false,
    massageMode0: true,
    massageMode1: false,
    temp:[],

    update: function() {
        this.set('heatingEnableData',
            this.tempSeatControlData.heatingEnabled ? 'ON': 'OFF');
        this.set('coolingEnabledData',
            this.tempSeatControlData.coolingEnabled ? 'ON': 'OFF');
        this.set('massageEnabledData',
            this.tempSeatControlData.massageEnabled ? 'ON': 'OFF');

        this.set('massageCushionFirmness0',
            this.tempSeatControlData.massageCushionFirmness[0] != null);
        this.set('massageCushionFirmness1',
            this.tempSeatControlData.massageCushionFirmness[1] != null);
        this.set('massageCushionFirmness2',
            this.tempSeatControlData.massageCushionFirmness[2] != null);
        this.set('massageCushionFirmness3',
            this.tempSeatControlData.massageCushionFirmness[3] != null);
        this.set('massageCushionFirmness4',
            this.tempSeatControlData.massageCushionFirmness[4] != null);

        this.set('massageMode0',
            this.tempSeatControlData.massageMode[0] != null);
        this.set('massageMode1',
            this.tempSeatControlData.massageMode[1] != null);

        var length = this.tempSeatControlData.massageCushionFirmness.length;
        for(var i = 0; i < length; ++i) {
            this.tempSeatControlData.massageCushionFirmness[i].firmness =
                parseInt(this.tempSeatControlData.massageCushionFirmness[i].firmness);
        }
        this.set('ID',this.tempSeatControlData.id);
        this.tempSeatControlData.heatingLevel =
            parseInt(this.tempSeatControlData.heatingLevel);
        this.tempSeatControlData.coolingLevel =
            parseInt(this.tempSeatControlData.coolingLevel);
        this.tempSeatControlData.horizontalPosition =
            parseInt(this.tempSeatControlData.horizontalPosition);
        this.tempSeatControlData.verticalPosition =
            parseInt(this.tempSeatControlData.verticalPosition);
        this.tempSeatControlData.frontVerticalPosition =
            parseInt(this.tempSeatControlData.frontVerticalPosition);
        this.tempSeatControlData.backVerticalPosition =
            parseInt(this.tempSeatControlData.backVerticalPosition);
        this.tempSeatControlData.backTiltAngle =
            parseInt(this.tempSeatControlData.backTiltAngle);
        this.tempSeatControlData.headSupportHorizontalPosition =
            parseInt(this.tempSeatControlData.headSupportHorizontalPosition);
        this.tempSeatControlData.headSupportVerticalPosition =
            parseInt(this.tempSeatControlData.headSupportVerticalPosition);
        this.tempSeatControlData.memory.id =
            parseInt(this.tempSeatControlData.memory.id);

        SDL.SeatModel.set('tempSeatControlData',
            SDL.deepCopy(SDL.SeatModel.tempSeatControlData));
    },

    goToStates: function() {
        SDL.SeatModel.set('tempSeatControlData',
            SDL.deepCopy(SDL.SeatModel.temp[1]));
        SDL.SeatModel.update();
    },

    init: function() {
        this.temp.push(SDL.deepCopy(this.seatControlData));
        this.temp.push(SDL.deepCopy(this.seatControlData));
        this.temp[0].id=this.supportedSeatStruct[0];
        this.temp[1].id=this.supportedSeatStruct[1];

        var length = this.massageZoneStruct.length;
        for (var i = 0; i < length; ++i) {
            this.temp[0].massageMode.push(SDL.deepCopy(this.massageModeData));
            this.temp[0].massageMode[i].massageZone =
               this.massageZoneStruct[i];
               this.temp[1].massageMode.push(SDL.deepCopy(this.massageModeData));
            this.temp[1].massageMode[i].massageZone =
               this.massageZoneStruct[i];
        }

        for (var i=0;i<this.massageCushionStruct.length;i++) {
            tempMessageCussion={};
            tempMessageCussion.firmness=SDL.deepCopy(i+1);
            tempMessageCussion.cushion=SDL.deepCopy(this.massageCushionStruct[i]);
            this.temp[0].massageCushionFirmness.push(
                tempMessageCussion);
                this.temp[1].massageCushionFirmness.push(
                    tempMessageCussion);
                tempMessageCussion=null;
        }

        this.temp[0].memory = this.seatMemoryAction;
        this.temp[1].memory = this.seatMemoryAction;
        this.tempSeatControlData = SDL.deepCopy(this.temp[1]);
    },

    getSeatCapabilities: function() {
        var result = [{
            moduleName: 'Seat',
            coolingLevelAvailable: true,
            heatingLevelAvailable: true,
            memoryAvailable: true,
            heatingEnabledAvailable: true,
            verticalPositionAvailable: true,
            headSupportVerticalPositionAvailable: true,
            backVerticalPositionAvailable: true,
            massageModeAvailable: true,
            backTiltAngleAvailable: true,
            coolingEnabledAvailable: true,
            horizontalPositionAvailable: true,
            massageCushionFirmnessAvailable: true,
            massageEnabledAvailable: true,
            frontVerticalPositionAvailable: true,
            headSupportHorizontalPositionAvailable: true
          }];
       return result;
    },

    setSeatControlData: function(data) {
       result = Em.Object.create({});
       if (data.id=='DRIVER') {
            for (var key in data) {
                this.set('temp.0.' + key, data[key]);
                result.set(key,SDL.deepCopy(data[key]));
            }
            if (data.memory) {
                switch(data.memory.action){
                    case 'SAVE':
                        this.driverMemory[data.memory.id]=SDL.deepCopy(this.temp[0]);
                        if(this.tempSeatControlData.id=='DRIVER') {
                            this.set('tempSeatControlData',this.temp[0]);
                            return this.temp[0];
                        }
                        break;

                    case 'RESTORE':
                        if (this.driverMemory[data.memory.id]) {
                            this.temp[0]=SDL.deepCopy(this.driverMemory[data.memory.id]);
                            if (this.tempSeatControlData.id=='DRIVER') {
                                this.set('tempSeatControlData',this.temp[0]);
                                this.update();
                                return this.temp[0];
                            }
                        }
                        break;

                    case 'NONE':
                        break;
                }
            }
        }

        if (data.id=='FRONT_PASSENGER') {
            for (var key in data) {
                this.set('temp.1.' + key, data[key]);
                result.set(key,SDL.deepCopy(data[key]));
            }

           if (data.memory) {
                switch (data.memory.action) {
                    case 'SAVE':
                        this.passengerMemory[data.memory.id]=SDL.deepCopy(this.temp[1]);
                        if (this.tempSeatControlData.id=='FRONT_PASSENGER') {
                            this.set('tempSeatControlData',this.temp[1]);
                            return this.temp[1];
                        }
                        break;
                    case 'RESTORE':
                        if (this.passengerMemory[data.memory.id]) {
                            this.temp[1]=SDL.deepCopy(this.passengerMemory[data.memory.id]);
                            if (this.tempSeatControlData.id=='FRONT_PASSENGER') {
                                this.set('tempSeatControlData',this.temp[1]);
                                this.update();
                                return this.temp[1];
                            }
                        }
                        break;
                    case 'NONE':
                        break;
                }
            }
        }

       this.update();
       return  result;
    },

    getSeatControlData: function() {
        this.update();
        return this.tempSeatControlData;
    },

    applySettings: function () {
        SDL.SeatModel.tempSeatControlData.coolingEnabled =
            (SDL.SeatModel.coolingEnabledData == 'ON');
        SDL.SeatModel.tempSeatControlData.heatingEnabled =
            (SDL.SeatModel.heatingEnableData == 'ON');
        SDL.SeatModel.tempSeatControlData.massageEnabled =
            (SDL.SeatModel.massageEnabledData == 'ON');
        SDL.SeatModel.update();

        var temp = Em.Object.create(this.dfs(SDL.deepCopy(this.tempSeatControlData),
             SDL.deepCopy(this.seatControlData)));

        var length = this.mandatoryField.length;
        for (var i  = 0; i < length; ++i) {
            var value = this.mandatoryField[i];
            if (value.indexOf('.') >= 0) {
                var parentValue = value.substring(0, value.indexOf('.'));
                if (temp.hasOwnProperty(parentValue)) {
                    temp.set(value,Em.Object.create(
                        SDL.SeatModel.tempSeatControlData).get(value));
                }
            } else {
                temp[value] = this.tempSeatControlData[value];
            }
        }

        FFW.RC.onInteriorVehicleDataNotification({moduleType:'SEAT',
            seatControlData: temp});
        SDL.SeatModel.set('seatControlData',
            Em.Object.create(SDL.deepCopy(SDL.SeatModel.tempSeatControlData)));
    },

    isEmptyObject: function(object) {
       var l = 0;
       for (var key in object) {
            if(object.hasOwnProperty(key)) {
                ++l;
            }
       }
       return l == 0;
    },

    dfs:function(from, to) {
        var result = SDL.deepCopy(from);
        for (var key in from) {
            if (from.hasOwnProperty(key)) {
                if (typeof from[key] == 'object') {
                    if (Array.isArray(from[key])) {
                        var lengthFrom = from[key].length;
                        var lengthTo = to[key].length;

                        if ((lengthFrom != lengthTo)) {
                            result[key] = from[key];
                            continue;
                        }

                        var temp = this.dfs(from[key],to[key]);
                        if (!this.isEmptyObject(temp)) {
                            result[key] = from[key];
                            continue;
                        }
                    }
                    var temp = this.dfs(from[key], to[key]);
                    if (!this.isEmptyObject(temp)) {
                        result[key] = temp;
                    } else {
                        delete result[key];
                    }
                } else {
                    if (from[key] === to[key]) {
                        delete result[key];
                    }
                }
            }
        }
        return result;
    }
});
