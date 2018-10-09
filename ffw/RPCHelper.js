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

/*
 *  Array of global RPCs
 */ 
FFWGlobalRPCs = [
  'GetInteriorVehicleData',
  'SubscribeWayPoints',
  'SubscribeVehicleData'
];

/*
 *  Array of SubscribeVehicleData parameters
 */ 
FFWSubscribeVehicleDataParams = [
  'speed',
  'rpm',
  'fuelLevel',
  'fuelLevel_State',
  'instantFuelConsumption',
  'externalTemperature',
  'turnSignal',
  'prndl',
  'tirePressure',
  'odometer',
  'beltStatus',
  'bodyInformation',
  'deviceStatus',
  'driverBraking',
  'wiperStatus',
  'headLampStatus',
  'engineTorque',
  'accPedalPosition',
  'steeringWheelAngle',
  'engineOilLife',
  'electronicParkBrakeStatus',
  'eCallInfo',
  'airbagStatus',
  'emergencyEvent',
  'clusterModes',
  'myKey',
  'fuelRange',
  'gps'
];

FFW.RPCHelper = Em.Object.create(
    {
      
    /*
     * Container for handling error of RPC
     */
    appContainer:Em.Object.create({}),

    /*
     * init function. Setup helpers initial values
     */ 
    init: function() {
      self = this;
      SDL.ButtonCapability.forEach(function (capability){
        self.SubscribeButton[capability.name] = '';
      });

      this.generateGlobalRpc();
      for(key in this.rpcStruct){
        this.set('defaultRpcStruct.' + key, 'SUCCESS');
      };
      for(key in this.SubscribeButton){
        this.set('defaultSubscribeButton.' + key, 'SUCCESS');
      };
    },

    /*
     * addApplication function. Push new application into the app 
     * container with initial data
     */
    addApplication: function(appID) {
      if(this.appContainer[appID] === undefined ){
        this.appContainer[appID] = SDL.deepCopy(this.defaultRpcStruct);
        this.appContainer[appID]['SubscribeButton'] = SDL.deepCopy(this.defaultSubscribeButton);
      }
    },

    /*
     * isSuccessResultCode function. Checks if passed result code is 
     * a success result code
     */
    isSuccessResultCode: function(resultCode) {
      return [
        SDL.SDLModel.data.resultCode.SUCCESS, 
        SDL.SDLModel.data.resultCode.WARNINGS].includes(resultCode);
    },

    /*
     * getCustomResultCode function. Claims custom result code for 
     * application for a specified method. It could be overriden 
     * by HMI settings
     */
    getCustomResultCode: function(appID, method, param) {
      var code = null;
      switch (method) {
        case 'createInteractionChoiceSet': {
          method = 'vrAddCommand';
          break;  
        }
        case 'SubscribeWayPoints':
        case 'SubscribeVehicleData': 
        case 'GetInteriorVehicleData': 
          return this.getGlobalRPCResponse(method);
      }
      
      if(appID !== null && this.appContainer[appID] == undefined){
        return null != code ? SDL.SDLModel.data.resultCode[code] : SDL.SDLModel.data.resultCode.SUCCESS;
      }

      if(appID !== null && this.appContainer[appID][method] !== undefined) {
        if(null == param){
          code = this.appContainer[appID][method];
        } else {
          code = this.appContainer[appID][method][param];
        }
      }
      return null != code ? SDL.SDLModel.data.resultCode[code] :  SDL.SDLModel.data.resultCode.SUCCESS;
    },

    /*
     * updateRPC function. Creates list of RPC
     */
    updateRpc: function(appID) {
      for(key in this.appContainer[appID]){
         this.set('rpcStruct.' + key,this.appContainer[appID][key]);
      };
      for(key in this.SubscribeButton){
        this.set('SubscribeButton.' + key, this.appContainer[appID]['SubscribeButton'][key]);
      };
      this.setCurrentAppID(appID);
    },

    /*
     * saveButton function. Saves parameters after pressing save button
     * on the RPCControl view and returns to app list
     */
    saveButton: function(){
      var appName = SDL.RPCControlConfigView.appNameLabel.content;
      app = SDL.SDLModel.data.registeredApps.filterProperty(
        'appName',
         appName
      )[0];
      for(key in this.appContainer[app.appID]){
        this.set('appContainer.'+ app.appID + '.'+key, this.rpcStruct[key]);
      };
      for(key in this.SubscribeButton){
        this.set('appContainer.' + app.appID + '.SubscribeButton.' + key, this.SubscribeButton[key]);
      };
      var event = {goToState: 'rpccontrol'};
      SDL.SettingsController.onState(event);
      this.setCurrentAppID(null);
    },

    /*
     * resetButton function. Reset parameters to default after pressing reset button
     * on the RPCControl view
     */
    resetButton: function() {
       for(key in this.rpcStruct){
         this.set('rpcStruct.'+key, this.defaultRpcStruct[key]);
       };
       for(key in this.SubscribeButton){
        this.set('SubscribeButton.'+key, this.defaultSubscribeButton[key]);
      };
    },

    /*
     * setCurrentAppID function. Sets of currentAppID parameter
     */
    setCurrentAppID: function(appID){
      this.set('currentAppID', appID);
    },

    /*
     * updateGlobalResultCodes function. Update global RPCs queue
     */
    updateGlobalResultCodes: function(rpc) {
      index = this.get(rpc + 'Index');
      this[rpc + 'ResultCodes'][index] = this[rpc];
    },

    /*
     * updateGlobalRPC function. Update current RPC result
     */
    updateGlobalRPC: function(rpc) {
      index = this.get(rpc + 'Index');
      this.set(rpc, this[rpc + 'ResultCodes'][index]);
    },

    /*
     * shiftGlobalRPCIndex function. Shifts the pointer to the current RPC in the queue.
     */
    shiftGlobalRPCIndex: function(rpc, diff){
      this.updateGlobalResultCodes(rpc);
      index = this.get(rpc + 'Index');
      this.set(rpc + 'Index', index + diff);
      this.updateGlobalRPC(rpc);
    },

    /*
     * removeGlobalRPCResponse function. Removes the current RPC from the queue.
     */
    removeGlobalRPCResponse: function(rpc) {
      this.updateGlobalResultCodes(rpc);

      index = this[rpc + 'Index'];
      this[rpc + 'ResultCodes'].splice(index, 1);
      this.updateGlobalRPCIndex(rpc);
      this.updateGlobalRPC(rpc);
    },

    /*
     * newGlobalRPCResponse function. Add new response for RPC in queue.
     */
    newGlobalRPCResponse: function(rpc) {
      this.updateGlobalResultCodes(rpc);

      this[rpc + 'ResultCodes'].push(this.getSuccessRpc(rpc));
      this.shiftGlobalRPCIndex(rpc, 1);

      this.updateGlobalRPC(rpc);
    },

    /*
     * getSuccessRpc function. return successfully RPC.
     */
    getSuccessRpc: function(rps){
      switch(rps){
        case 'SubscribeVehicleData': {
          succsesParams = {};
          for(key of FFWSubscribeVehicleDataParams){
            succsesParams[key] = 'SUCCESS';
          };
         return {
          SubscribeVehicleData: 'SUCCESS',
          SubscribeVehicleDataParams: succsesParams
         } 
        }
        default:
          return 'SUCCESS';
      }
    },

    /*
     * updateGlobalRPCIndex function. update current global RPC index.
     */
    updateGlobalRPCIndex: function(rpc){
      index = this[rpc + 'Index'];
      this.set(rpc + 'Index', -1);
      length = this[rpc + 'ResultCodes'].length;
      this.set(rpc + 'Index', Math.min(index, length - 1));
    },

    /*
     * getGlobalRPCResponse function.returns the response from the queue.
     */
    getGlobalRPCResponse: function(rpc) {
      this.updateGlobalResultCodes(rpc);
      
      length = this[rpc + 'ResultCodes'].length;
      code = this[rpc + 'ResultCodes'][0];

      if(length > 1){
        this[rpc + 'ResultCodes'].shift();

        this.updateGlobalRPCIndex(rpc)
        this.updateGlobalRPC(rpc);
      } else {
        this.set(rpc, this.getSuccessRpc(rpc));
      }
      return code;
    },

    /*
     * Format string with interior vehicle data set to display on label
     */
    GetInteriorVehicleDataResponseStatus: function(){
      return (this['GetInteriorVehicleDataIndex'] + 1) + '/' + 
                    this['GetInteriorVehicleDataResultCodes'].length
    }.property(
      'FFW.RPCHelper.GetInteriorVehicleDataIndex'
    ),

    /*
     * Format string with waypoints set to display on label
     */
    SubscribeWayPointsResponseStatus: function(){
      return (this['SubscribeWayPointsIndex'] + 1) + '/' + 
                    this['SubscribeWayPointsResultCodes'].length
    }.property(
      'FFW.RPCHelper.SubscribeWayPointsIndex'
    ),

    /*
     * Format string with vehicle data set to display on label
     */    
    SubscribeVehicleDataResponseStatus: function(){
      return (this['SubscribeVehicleDataIndex'] + 1) + '/' + 
                    this['SubscribeVehicleDataResultCodes'].length
    }.property(
      'FFW.RPCHelper.SubscribeVehicleDataIndex'
    ),

    /*
     * generate interface for global RPCs
     */
    generateGlobalRpc: function() {
      var self = this;
      FFWGlobalRPCs.forEach(function(rpc){
        self[rpc] = self.getSuccessRpc(rpc);

        resultCodes = rpc + 'ResultCodes';
        self.set(resultCodes, new Array());
        self.get(resultCodes).push(self.get(rpc));

        index = rpc + 'Index';
        self.set(index, 0);

        self.set('new' + rpc, function(){
          self.newGlobalRPCResponse(rpc);
        });

        self.set('previous' + rpc, function(){
          self.shiftGlobalRPCIndex(rpc, -1);
        });

        self.set('next' + rpc, function(){
          self.shiftGlobalRPCIndex(rpc, 1);
        });

        self.set('remove' + rpc, function(){
          self.removeGlobalRPCResponse(rpc);
        });
      });
    },

    defaultRpcStruct: {},
    defaultSubscribeButton: {},
    currentAppID: null,
    
    rpcStruct: {
        vrAddCommand:'',
        uiAddCommand: '',
        AddSubmenu:'',
        uiSetGlobalProperties: '',
        ttsSetGlobalProperties: ''
    },

    SubscribeButton: {

    }
  }
);
