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

    /*
    *  init function. object initialization
    */
    init: function() {
        self = this;
        self.supportedSeatStruct.forEach(function(Seat){
            self.seatControlData[Seat] = SDL.deepCopy(self.getDefaultParams());
        });
        self.tempSeatControlData = SDL.deepCopy(self.getDefaultParams());
        this.update();
    },

    /*
    *  getDefaultParams function. return default seatmodel structure
    */

    getDefaultParams: function() {
        self = this;
        return Em.Object.create({
            heatingEnabled: true,
            coolingEnabled: true,
            heatingLevel: 0,
            coolingLevel: 0,
            horizontalPosition: 0,
            verticalPosition: 0,
            frontVerticalPosition: 0,
            backVerticalPosition: 0,
            backTiltAngle: 0,
            headSupportHorizontalPosition: 0,
            headSupportVerticalPosition: 0,
            massageEnabled: true,
            massageMode: [self.massageModeData],
            massageCushionFirmness: [self.massageCushionFirmness],
            memory: self.seatMemoryAction
        });
    },

    /*
    *  getSeatControlData function. return seatmodel structure
    */
    getSeatControlData: function() {
        self = this;
        moduleData = {
            id: self.ID
        };
        for(var key in self.seatControlData[self.ID]){
            moduleData[key] = SDL.deepCopy(self.seatControlData[self.ID][key]);
        }
        return moduleData;
    },

    /*
    *  assign function. assigns the second object to the first and returns the 
    *  difference between them
    */
    assign: function(first, second){
        var result = {};
        for(var key in second) {
            if(second.hasOwnProperty(key)){
                if(typeof second[key] == 'object'){
                    if (Array.isArray(second[key])) {
                        var lengthFirst = first[key].length;
                        var lengthSecond = second[key].length;

                        if (lengthFirst != lengthSecond) {
                            result[key] = SDL.deepCopy(second[key]);
                            first[key] = SDL.deepCopy(second[key]);
                            continue;
                        }
                        
                        var temp = this.assign(first[key],second[key]);
                        if (!this.isEmptyObject(temp)) {
                            result[key] = SDL.deepCopy(second[key]);
                            first[key] = SDL.deepCopy(second[key]);
                            continue;
                        }
                    } else {
                        temp = this.assign(first[key], second[key]);
                        if(!this.isEmptyObject(temp)) {
                            result[key] = SDL.deepCopy(second[key]);
                            first[key] = SDL.deepCopy(second[key]);
                        }
                    }
                } else {
                    if(first[key] != second[key]){
                        result[key] = SDL.deepCopy(second[key]);
                        first[key] = SDL.deepCopy(second[key]);
                    }
                }
            }
        }
        return result;
    },

    /*
    *  setSeatControlData function. set seatmodel structure
    */
    setSeatControlData: function(data) {
        id = data.id;
        delete data.id;
        
        result = this.assign(this.seatControlData[id], data);

        if(!this.isEmptyObject(result)){
            result.id = id;
            if(result.massageMode){
                result.massageMode = this.seatControlData[id].massageMode;
            }
            if(result.massageCushionFirmness){
                result.massageCushionFirmness = this.seatControlData[id].massageCushionFirmness;
            }
            if(result.memory){
                result.memory.id = this.seatControlData[id].memory.id;
                result.memory.action = this.seatControlData[id].memory.action;
            }
        }

        this.set('ID',id);
        this.update();
        return  result;
     },
     
    /*
    *  applySettings function. Apply current seatmodel settings 
    */
    applySettings: function () {
        self = this;
        tmp = {};
        tmp['id'] = self.ID;

        integerData = [
            'heatingLevel',
            'coolingLevel',
            'horizontalPosition',
            'verticalPosition',
            'frontVerticalPosition',
            'backVerticalPosition',
            'backTiltAngle',
            'headSupportHorizontalPosition',
            'headSupportVerticalPosition'],
        self = this;    
        integerData.forEach(function(data){
            self.tempSeatControlData[data] = 
                                parseInt(self.tempSeatControlData[data]);
        });
        this.tempSeatControlData.memory.id = 
                                parseInt(this.tempSeatControlData.memory.id);
        var length = this.tempSeatControlData.massageCushionFirmness.length;
        for(var i = 0; i < length; ++i) {
            this.tempSeatControlData.massageCushionFirmness[i].firmness =
                parseInt(this.tempSeatControlData.massageCushionFirmness[i].firmness);
        }

        for(var key in self.tempSeatControlData){
            if(self.tempSeatControlData.hasOwnProperty(key)){
                tmp[key] = self.tempSeatControlData[key];
            }
        }

        result = self.setSeatControlData(tmp);
        if(!self.isEmptyObject(result)){
            FFW.RC.onInteriorVehicleDataNotification({moduleType:'SEAT',
                    seatControlData: result});
        }

        self.update();
    },

    /*
    *  update function. update current seatmodel settings 
    */
    update: function() {
        this.set('tempSeatControlData', SDL.deepCopy(this.seatControlData[this.ID]));
        this.onMassageModeChange();
        this.onMassageCushionFirmnessChange();
    },


    /*
    *  onIdChange function. update current seat model settings when changing ID 
    */
    onIdChange: function(){
        this.update();
        return this.ID;
    }.property('SDL.SeatModel.ID'),

    /*
    *  onIdChange function. update current seat model settings when changing 
    *  MassageMode 
    */
    onMassageModeChange: function(){
        this.set('massageMode0',
                this.tempSeatControlData.massageMode[0] != null);
        this.set('massageMode1',
                this.tempSeatControlData.massageMode[1] != null);
        this.set('tempSeatControlData',
            SDL.deepCopy(this.tempSeatControlData));
    
    },


    /*
    *  onIdChange function. update current seat model settings when changing 
    *  MassageCushionFirmness 
    */
    onMassageCushionFirmnessChange:function(){
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

        this.set('tempSeatControlData',
            SDL.deepCopy(this.tempSeatControlData));
    },
    
    massageMode0: true,
    massageMode1: false,
    
    massageCushionFirmness0: true,
    massageCushionFirmness1: false,
    massageCushionFirmness2: false,
    massageCushionFirmness3: false,
    massageCushionFirmness4: false,

    /*
    * List possible cushions of a multi-contour massage seat
    */
    supportedSeatStruct: [
        'DRIVER',
        'FRONT_PASSENGER'
    ],

    enableStruct: [
        true, 
        false
    ],

    /*
    * List possible zones of a multi-contour massage seat
    */
    massageZoneStruct: [
        'LUMBAR',
        'SEAT_CUSHION'
    ],

    /*
    * List possible modes of a massage zone
    */
    massageModeStruct: [
        'OFF',
        'LOW',
        'HIGH'
    ],

    /*
    * Specify the mode of a massage zone
    */
    massageCushionStruct: [
        'TOP_LUMBAR',
        'MIDDLE_LUMBAR',
        'BOTTOM_LUMBAR',
        'BACK_BOLSTERS',
        'SEAT_BOLSTERS'
    ],

    seatMemoryActionTypeStruct: [
        'SAVE',
        'RESTORE',
        'NONE'
    ],

    /*
    * Specify the mode of a massage
    */
    massageModeData: {
        massageZone: 'LUMBAR',
        massageMode: 'OFF'
    },

    /*
    * The intensity or firmness of a cushion
    */
    massageCushionFirmness: {
        cushion: 'TOP_LUMBAR',
        firmness: 0
    },


    seatMemoryAction: {
        id: 1,
        label: 'Label value',
        action: 'SAVE'
    },

    ID: 'DRIVER',

    seatControlData: Em.Object.create({}),
    tempSeatControlData: Em.Object.create({}),
   
    goToStates: function() {
        SDL.SeatModel.update();
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

    isEmptyObject: function(object) {
       var l = 0;
       for (var key in object) {
            if(object.hasOwnProperty(key)) {
                ++l;
            }
       }
       return l == 0;
    },
});
