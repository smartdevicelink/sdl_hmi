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

SDL.SeatModel = Em.Object.extend({

    memory: {},

    createdMemory: '',

    enableStruct:[
        'ON',
        'OFF'
    ],

    ID:'',
    heatingEnableData: 'OFF',

    coolingEnabledData: 'OFF',

    massageEnabledData: 'OFF',

    mandatoryField:[
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

        this.set('tempSeatControlData',
            SDL.deepCopy(this.tempSeatControlData));
    },

    goToStates: function() {
        this.update();
    },

    init: function() {
        this._super();
        this.tempSeatControlData.massageMode = [];
        this.tempSeatControlData.massageCushionFirmness = [];
        var length = this.massageZoneStruct.length;
        for (var i = 0; i < length; ++i) {
            this.tempSeatControlData.massageMode.push(SDL.deepCopy(this.massageModeData));
            this.tempSeatControlData.massageMode[i].massageZone =
               this.massageZoneStruct[i];
        }

        for (var i=0;i<this.massageCushionStruct.length;i++) {
            tempMessageCussion={};
            tempMessageCussion.firmness=SDL.deepCopy(i+1);
            tempMessageCussion.cushion=SDL.deepCopy(this.massageCushionStruct[i]);
            this.tempSeatControlData.massageCushionFirmness.push(tempMessageCussion);
        }

        this.tempSeatControlData.memory = this.seatMemoryAction;
        this.set('seatControlData', this.tempSeatControlData);
        var memorySlot = "1";
        this.memory[memorySlot] = SDL.deepCopy(this.tempSeatControlData);
        this.createdMemory = memorySlot;
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
        
        for (var key in data) {
            this.set('tempSeatControlData.' + key, data[key]);
            this.set('seatControlData.' + key, data[key]);
            result.set(key,SDL.deepCopy(data[key]));
        }
        if (data.memory) {
            switch(data.memory.action){
                case 'SAVE':
                    this.memory[data.memory.id]=SDL.deepCopy(this.seatControlData);
                    this.resetCreatedMemory();
                    return this.seatControlData;
                    break;

                case 'RESTORE':
                    if (this.memory[data.memory.id]) {
                        this.set('tempSeatControlData', SDL.deepCopy(this.memory[data.memory.id]));
                        this.update();
                        this.resetCreatedMemory();
                        return this.seatControlData;
                    }
                    break;

                case 'NONE':
                    this.set('tempSeatControlData',this.seatControlData);
                    break;
            }
        }

       this.update();
       return  result;
    },

    getSeatControlData: function() {
        this.update();
        return this.seatControlData;
    },

    applySettings: function () {
        this.tempSeatControlData.coolingEnabled =
            (this.coolingEnabledData == 'ON');
        this.tempSeatControlData.heatingEnabled =
            (this.heatingEnableData == 'ON');
        this.tempSeatControlData.massageEnabled =
            (this.massageEnabledData == 'ON');
        this.update();

        var temp = Em.Object.create(this.dfs(SDL.deepCopy(this.tempSeatControlData),
             SDL.deepCopy(this.seatControlData)));
        if(this.isEmptyObject(temp)) {
            return
        }

        var length = this.mandatoryField.length;
        for (var i  = 0; i < length; ++i) {
            var value = this.mandatoryField[i];
            if (value.indexOf('.') >= 0) {
                var parentValue = value.substring(0, value.indexOf('.'));
                if (temp.hasOwnProperty(parentValue)) {
                    temp.set(value,Em.Object.create(
                        this.tempSeatControlData).get(value));
                }
            } else {
                temp[value] = this.tempSeatControlData[value];
            }
        }

        FFW.RC.onInteriorVehicleDataNotification({moduleType:'SEAT', moduleId: this.UUID,
            seatControlData: temp});
        this.set('seatControlData',
            Em.Object.create(SDL.deepCopy(this.tempSeatControlData)));
    },

    /**
     * @function applyMemory
     * @description callback to apply memory action on the SeatView by user
     */
    applyMemory: function() {
        var action = this.tempSeatControlData.memory.action;

        switch(action){
            case 'SAVE':
                if(this.tempSeatControlData.memory.id>0 &
                    this.tempSeatControlData.memory.id<=10){
                        
                        var id = this.tempSeatControlData.memory.id;
                        this.memory[id] =
                            SDL.deepCopy(this.tempSeatControlData);
                            this.set('seatControlData',
                            this.memory[this.tempSeatControlData.memory.id]
                        );
                        this.set('seatControlData',
                            SDL.deepCopy(this.tempSeatControlData)
                        );
                        this.resetCreatedMemory();
                        return;
                    }
                    SDL.SeatView.memory.memoryId.inputId.set('value',
                        this.seatControlData.memory.id);
                    SDL.PopUp.create().appendTo('body').popupActivate(
                        'Invalid id. Memory slot Id can be from 1 to 10', function() {
                            this.deactivate();
                        }
                      );
            break;
            case 'RESTORE':
                if(this.memory[this.tempSeatControlData.memory.id]){
                    this.set('seatControlData',
                        SDL.deepCopy(this.tempSeatControlData)
                    );
                    this.set('tempSeatControlData',
                    this.memory[this.tempSeatControlData.memory.id]
                    );
                    this.resetCreatedMemory();
                    return;
                }
                SDL.SeatView.memory.memoryId.inputId.set('value',
                        this.seatControlData.memory.id);
                SDL.PopUp.create().appendTo('body').popupActivate(
                    'Invalid id. Slot with id ' + this.tempSeatControlData.memory.id +
                    ' wasn\'t\ created.', function() {
                        this.deactivate();
                    }
                  );
            break;
            case 'NONE':
                SDL.SeatView.memory.memoryId.inputId.set('value',
                        this.seatControlData.memory.id);
                SDL.PopUp.create().appendTo('body').popupActivate(
                    'Choose SAVE or RESTORE action', function() {
                        this.deactivate();
                    }
                );
            break;
        }
    },

    /**
     * @function resetCreatedMemory
     * @description function to reset string with created memory.
     */
    resetCreatedMemory: function() {
        this.createdMemory = '';
        var currentIndex = '*'
        for(key in this.memory) {
            var index = key == this.seatControlData.memory.id ? 
                key + currentIndex : 
                key;
            
            this.set('createdMemory', this.createdMemory == '' ?
            index : this.createdMemory + ', ' + index);
        }
        this.applySettings();
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
                        if (!SDL.SDLController.isEmptyObject(temp)) {
                            result[key] = from[key];
                            continue;
                        }
                    }
                    var temp = this.dfs(from[key], to[key]);
                    if (!SDL.SDLController.isEmptyObject(temp)) {
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
    },

    /**
     * @description Function to generate seat capabilities
     * @param {Object} element 
     */
    generateSeatCapabilities: function(element) {
        var capabilities = this.getSeatCapabilities()[0];
        if(element) {
            var moduleInfo = {
            'allowMultipleAccess': false,
            'moduleId': this.UUID,
            'serviceArea': SDL.deepCopy(element),
            'location': SDL.deepCopy(element)
            };
        
            moduleInfo.location['colspan'] = 1;
            moduleInfo.location['rowspan'] = 1;
            moduleInfo.location['levelspan'] = 1;
            capabilities['moduleInfo'] = moduleInfo;
        }
        SDL.remoteControlCapabilities.remoteControlCapability['seatControlCapabilities'].push(capabilities);
    }
});
