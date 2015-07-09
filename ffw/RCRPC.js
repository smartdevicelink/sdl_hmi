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
/*
 * Reference implementation of RemoteControl component.
 * 
 * Interface to get or set some essential information sent from SDLCore.
 * RemoteControl is responsible for sending a data about the condition of the
 * vehicle between SDLCore and CAN network. Instead CAN network used
 * RemoteControlModel.
 * 
 */

FFW.RC = FFW.RPCObserver.create( {

    /**
     * If true then RemoteControl is present and ready to communicate with SDL.
     * 
     * @type {Boolean}
     */
    isReady: true,

    /**
     * Contains response codes for request that should be processed but there were some kind of errors
     * Error codes will be injected into response.
     */
    errorResponsePull: {},

    /**
     * access to basic RPC functionality
     */
    client: FFW.RPCClient.create( {
        componentName: "RC"
    }),

    /**
     * connect to RPC bus
     */
    connect: function() {

        this.client.connect(this, 900); // Magic number is unique identifier for
        // component
    },

    /**
     * disconnect from RPC bus
     */
    disconnect: function() {

        this.onRPCUnregistered();
        this.client.disconnect();
    },

    /**
     * Client is registered - we can send request starting from this point of
     * time
     */
    onRPCRegistered: function() {

        Em.Logger.log("FFW.RC.onRPCRegistered");
        this._super();
    },

    /**
     * Client is unregistered - no more requests
     */
    onRPCUnregistered: function() {

        Em.Logger.log("FFW.RC.onRPCUnregistered");
        this._super();
    },

    /**
     * Client disconnected.
     */
    onRPCDisconnected: function() {

    },

    /**
     * when result is received from RPC component this function is called It is
     * the propriate place to check results of reuqest execution Please use
     * previously store reuqestID to determine to which request repsonse belongs
     * to
     */
    onRPCResult: function(response) {

        Em.Logger.log("FFW.RC.onRPCResult");
        this._super();
    },

    /**
     * handle RPC erros here
     */
    onRPCError: function(error) {

        Em.Logger.log("FFW.RC.onRPCError");
        this._super();
    },

    /**
     * handle RPC notifications here
     */
    onRPCNotification: function(notification) {

        Em.Logger.log("FFW.RC.onRPCNotification");
        this._super();
    },

    correctTemp: function(data, type){

        var d = SDL.deepCopy(data);

        if (type === 'get') {
            switch (d.temperatureUnit) {
                case 'KELVIN': {

                    d.currentTemp += 273;
                    d.desiredTemp += 273;

                    return d;
                }
                case 'CELSIUS': {
                    return d;
                }
                case 'FAHRENHEIT': {

                    d.currentTemp = Math.round(d.currentTemp * 9 / 5 + 32);
                    d.desiredTemp = Math.round(d.desiredTemp * 9 / 5 + 32);

                    return d;
                }
            }
        } else {
            switch (d.temperatureUnit) {
                case 'KELVIN': {

                    d.currentTemp -= 273;
                    d.desiredTemp -= 273;

                    return d;
                }
                case 'CELSIUS': {
                    return d;
                }
                case 'FAHRENHEIT': {

                    d.currentTemp = Math.round((d.currentTemp - 32) * 5 / 9);
                    d.desiredTemp = Math.round((d.currentTemp - 32) * 5 / 9);

                    return d;
                }
            }
        }
    },

    unMapInteriorZone: function(moduleZone){

        var zone = {};

        switch (moduleZone){
            case 'driver':{

                zone = {
                    "col": 0,
                    "row": 0,
                    "level": 0,
                    "colspan": 2,
                    "rowspan": 2,
                    "levelspan": 1
                };

                return zone;
                break;
            }
            case 'front_passenger':{

                zone = {
                    "col": 1,
                    "row": 0,
                    "level": 0,
                    "colspan": 2,
                    "rowspan": 2,
                    "levelspan": 1
                };
                return zone;
                break;
            }
            case 'back_left':{

                zone = {
                    "col": 0,
                    "row": 1,
                    "level": 0,
                    "colspan": 2,
                    "rowspan": 2,
                    "levelspan": 1
                };
                return zone;
                break;
            }
            case 'back_right':{

                zone = {
                    "col": 1,
                    "row": 1,
                    "level": 0,
                    "colspan": 2,
                    "rowspan": 2,
                    "levelspan": 1
                };
                return zone;
                break;
            }
        }
    },

    getInteriorZone: function(moduleZone){

        var zone;

        zone = '';

        if (moduleZone.col === 0) {

            if (moduleZone.row === 0) {
                zone = 'driver';
            } else if (moduleZone.row === 1) {
                zone = 'back_left';
            }
        } else if (moduleZone.col === 1) {

            if (moduleZone.row === 0) {
                zone = 'front_passenger';
            } else if (moduleZone.row === 1) {
                zone = 'back_right';
            }
        }

        return zone;
    },

    /**
     * handle RPC requests here
     * 
     * @type {Object} request
     */
    onRPCRequest: function(request) {

        Em.Logger.log("FFW.RC.onRPCRequest");
        if (this.validationCheck(request)) {

            switch (request.method) {

                case "RC.GetInteriorVehicleDataCapabilities": {

                    Em.Logger.log("FFW." + request.method + "Response");

                    if (!SDL.SDLModel.errorResponse) {
                        var interiorVehicleDataCapabilities = [];

                        if (request.params.moduleTypes) {
                            for (var i = 0; i < request.params.moduleTypes.length; i++) {
                                interiorVehicleDataCapabilities.push({
                                    "moduleZone": request.params.zone,
                                    "moduleType": request.params.moduleTypes[i]
                                })
                            }
                        } else {
                            interiorVehicleDataCapabilities.push({
                                "moduleZone": request.params.zone,
                                "moduleType": "CLIMATE"
                            });

                            interiorVehicleDataCapabilities.push({
                                "moduleZone": request.params.zone,
                                "moduleType": "RADIO"
                            })
                        }

                        // send repsonse
                        var JSONMessage = {
                            "jsonrpc": "2.0",
                            "id": request.id,
                            "result": {
                                "code": SDL.SDLModel.data.resultCode["SUCCESS"],
                                "method": request.method,
                                "interiorVehicleDataCapabilities": interiorVehicleDataCapabilities
                            }
                        };
                        this.client.send(JSONMessage);
                    } else {
                        this.sendError(SDL.SDLModel.data.resultCode["DATA_NOT_AVAILABLE"], request.id, request.method, "Error response example.")
                    }

                    break;
                }

                case "RC.GrantAccess": {

                    SDL.SDLModel.giveControl(request);

                    break;
                }

                case "RC.CancelAccess": {

                    SDL.SDLModel.cancelControl(request);

                    break;
                }

                case "RC.SetInteriorVehicleData": {

                    Em.Logger.log("FFW." + request.method + "Response");

                    var zone = this.getInteriorZone(request.params.moduleData.moduleZone);

                    if (request.params.moduleData.climateControlData) {

                        var climateControlData = this.correctTemp(request.params.moduleData.climateControlData, 'set');
                        SDL.ClimateController.model.setClimateData(request.params.moduleData.climateControlData, zone);
                    }

                    if (request.params.moduleData.radioControlData) {
                        SDL.RadioModel.setRadioData(request.params.moduleData.radioControlData);
                    }


                    // send repsonse
                    var JSONMessage = {
                        "jsonrpc": "2.0",
                        "id": request.id,
                        "result": {
                            "code": SDL.SDLModel.data.resultCode["SUCCESS"],
                            "method": request.method,
                            "moduleData": request.params.moduleData
                        }
                    };
                    this.client.send(JSONMessage);

                    break;
                }

                case "RC.GetInteriorVehicleData": {

                    Em.Logger.log("FFW." + request.method + "Response");

                    if (request.params.moduleDescription == undefined) {
                        this.sendError(SDL.SDLModel.data.resultCode["REJECTED"], request.id, request.method, "ModuleDescription parameter missing!");
                        return;
                    }

                    var zone = this.getInteriorZone(request.params.moduleDescription.moduleZone);
                    var radioControlData = null;
                    var climateControlData = null;

                    if (request.params.subscribe === true) {
                        if (request.params.moduleDescription.moduleType === "CLIMATE" && SDL.ClimateController.model.subscribedData.indexOf(zone) === -1) {
                            SDL.ClimateController.model.subscribedData.push(zone);
                        } else if (request.params.moduleDescription.moduleType === "RADIO" && SDL.RadioModel.subscribedData.indexOf(zone) === -1) {
                            SDL.RadioModel.subscribedData.push(zone);
                        }
                    } else if (request.params.subscribe === false) {
                        if (request.params.moduleDescription.moduleType === "CLIMATE" && SDL.ClimateController.model.subscribedData.indexOf(zone) != -1) {
                            SDL.ClimateController.model.subscribedData.pop(zone);
                        } else if (request.params.moduleDescription.moduleType === "RADIO" && SDL.RadioModel.subscribedData.indexOf(zone) != -1) {
                            SDL.RadioModel.subscribedData.pop(zone);
                        }
                    }

                    if (request.params.moduleDescription.moduleType === "CLIMATE") {
                        climateControlData = SDL.ClimateController.model.climateSet[zone].climateControlData;
                    } else if (request.params.moduleDescription.moduleType === "RADIO") {
                        radioControlData = SDL.RadioModel.get('radioControlData');
                    }

                    // send repsonse
                    var JSONMessage = {
                        "jsonrpc": "2.0",
                        "id": request.id,
                        "result": {
                            "code": SDL.SDLModel.data.resultCode["SUCCESS"],
                            "method": request.method,
                            "moduleData": {
                                "moduleType": request.params.moduleDescription.moduleType,
                                "moduleZone": request.params.moduleDescription.moduleZone
                            }
                        }
                    };

                    if (radioControlData) {
                        JSONMessage.result.moduleData.radioControlData = radioControlData;
                    }
                    if (climateControlData) {

                        climateControlData = this.correctTemp(climateControlData, 'get');
                        JSONMessage.result.moduleData.climateControlData = climateControlData;
                    }

                    this.client.send(JSONMessage);

                    break;
                }

                case "RC.GetInteriorVehicleDataConsent": {

                    SDL.SDLController.interiorDataConsent(request);

                    break;
                }

                default: {
                    // statements_def
                    break;
                }
            }
        }
    },

    /**
     * Send error response from onRPCRequest
     *
     * @param {Number}
     *            resultCode
     * @param {Number}
     *            id
     * @param {String}
     *            method
     */
    sendError: function(resultCode, id, method, message) {

        Em.Logger.log("FFW." + method + "Response");

        if (resultCode != SDL.SDLModel.data.resultCode["SUCCESS"]) {

            // send repsonse
            var JSONMessage = {
                "jsonrpc": "2.0",
                "id": id,
                "error": {
                    "code": resultCode, // type (enum) from SDL protocol
                    "message": message,
                    "data": {
                        "method": method
                    }
                }
            };
            this.client.send(JSONMessage);
        }
    },

    /**
     * Send response from onRPCRequest
     *
     * @param {Number}
     *            resultCode
     * @param {Number}
     *            id
     * @param {String}
     *            method
     */
    sendRCResult: function(resultCode, id, method) {

        Em.Logger.log("FFW." + method + "Response");

        if (resultCode === SDL.SDLModel.data.resultCode["SUCCESS"]) {

            // send repsonse
            var JSONMessage = {
                "jsonrpc": "2.0",
                "id": id,
                "result": {
                    "code": resultCode,
                    "method": method
                }
            };
            this.client.send(JSONMessage);
        }
    },

    GetInteriorVehicleDataConsentResponse: function(request, allowed){

        // send repsonse
        var JSONMessage = {
            "jsonrpc": "2.0",
            "id": request.id,
            "result": {
                "code": SDL.SDLModel.data.resultCode['SUCCESS'],
                "method": request.method,
                allowed: allowed
            }
        };
        this.client.send(JSONMessage);
    },

    /**
     * From HMI to RSDL
     * notifies if User selected to disallow RSDL functionality or if he changed his mind and allowed it.
     * @constructor
     */
    OnSetDriversDevice: function(device) {

        if (device) {
            Em.Logger.log("FFW.RC.OnSetDriversDevice Notification");

            // send repsonse
            var JSONMessage = {
                "jsonrpc": "2.0",
                "method": "RC.OnSetDriversDevice",
                "params": {
                    "device": device
                }
            };
            this.client.send(JSONMessage);
        }
    },

    /**
     * From HMI to RSDL
     * notifies if User selected to disallow RSDL functionality or if he changed his mind and allowed it.
     * @constructor
     */
    OnReverseAppsAllowing: function(allowed) {

        Em.Logger.log("FFW.VehicleInfo.OnReverseAppsAllowing Notification");

        // send repsonse
        var JSONMessage = {
            "jsonrpc": "2.0",
            "method": "VehicleInfo.OnReverseAppsAllowing",
            "params": {
                "allowed": allowed
            }
        };
        this.client.send(JSONMessage);

    },

    /**
     * Notification about trigered action by user touchstart
     *
     */
    OnControlChanged: function() {

        SDL.SDLModel.set('givenControlFlag', false);
        Em.Logger.log("FFW.RC.OnControlChanged Notification");

        // send repsonse
        var JSONMessage = {
            "jsonrpc": "2.0",
            "method": "RC.OnControlChanged"
        };
        this.client.send(JSONMessage);

    },

    onInteriorVehicleDataNotification: function(moduleType, moduleZone, radioControlData, climateControlData) {

        if (moduleZone === 'subscribed') {

            for(var i = 0; i < SDL.RadioModel.subscribedData.length; i++){

                // send repsonse
                var JSONMessage = {
                    "jsonrpc": "2.0",
                    "method": "RC.OnInteriorVehicleData",
                    "params": {
                        "moduleData": {
                            "moduleType": moduleType,
                            "moduleZone": this.unMapInteriorZone(SDL.RadioModel.subscribedData[i])
                        }
                    }
                };

                if (radioControlData) {
                    JSONMessage.params.moduleData.radioControlData = radioControlData;
                }
                if (climateControlData) {
                    climateControlData = this.correctTemp(climateControlData, 'get');
                    JSONMessage.params.moduleData.climateControlData = climateControlData;
                }


                Em.Logger.log("FFW.RC.OnInteriorVehicleData Notification");
                this.client.send(JSONMessage);
            }

        } else {

            var zone = this.getInteriorZone(moduleZone);

            // send repsonse
            var JSONMessage = {
                "jsonrpc": "2.0",
                "method": "RC.OnInteriorVehicleData",
                "params": {
                    "moduleData": {
                        "moduleType": moduleType,
                        "moduleZone": moduleZone
                    }
                }
            };

            if (radioControlData) {
                JSONMessage.params.moduleData.radioControlData = radioControlData;

                if (zone in SDL.RadioModel.subscribedData) {

                    Em.Logger.log("FFW.RC.OnInteriorVehicleData Notification");
                    this.client.send(JSONMessage);
                }
            }
            if (climateControlData) {

                climateControlData = this.correctTemp(climateControlData, 'get');

                JSONMessage.params.moduleData.climateControlData = climateControlData;

                for (var i = 0; i < SDL.ClimateController.model.subscribedData.length; i++) {
                    if (SDL.ClimateController.model.subscribedData[i] === zone) {

                        Em.Logger.log("FFW.RC.OnInteriorVehicleData Notification");
                        this.client.send(JSONMessage);
                        return;
                    }
                }
            }
        }
    }
});