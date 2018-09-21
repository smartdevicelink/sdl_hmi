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
      for(key in this.rpcStruct){
        this.set('defaultRpcStruct.'+key, 'SUCCESS');
      };
      for(key in this.SubscribeVehicleDataParams){
        this.set('SubscribeVehicleDataParams.'+key, 'SUCCESS');
      };
      this.set('SubscribeWayPoints', 'SUCCESS');
      this.set('SubscribeVehicleData', 'SUCCESS');
      this.SubscribeVehicleDataResultCodes.push({
        SubscribeVehicleData: 'SUCCESS',
        SubscribeVehicleDataParams: this.getSuccessVehicleDataStruct()
      });
    },

    /*
     * addApplication function. Push new application into the app 
     * container with initial data
     */
    addApplication: function(appID) {
      if(this.appContainer[appID] === undefined ){
        this.appContainer[appID] = SDL.deepCopy(this.defaultRpcStruct);
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
    getCustomResultCode: function(appID, method) {
      switch (method) {
        case 'createInteractionChoiceSet': {
          method = 'vrAddCommand';
          break;  
        }
        case 'SubscribeWayPoints': {
          return this.getNextWayPointResultCode();
        }
        case 'SubscribeVehicleData': {
          return this.getNextVehicleDataResultCode();
        }
        case 'getNextInteriorVehicleData': {
          return this.getNextInteriorVehicleData();
        }
      }

      var code = null;
      if(appID !== null && this.appContainer[appID][method] !== undefined) {
        code = this.appContainer[appID][method];
      } else if(this.SubscribeVehicleDataParams[method] !== undefined) {
        code = this.SubscribeVehicleDataParams[method];
      }

      return null != code ? SDL.SDLModel.data.resultCode[code] : 'SUCCESS';
    },

    /*
     * updateRPC function. Creates list of RPC
     */
    updateRpc: function(appID) {
      for(key in this.appContainer[appID]){
         this.set('rpcStruct.' + key,this.appContainer[appID][key]);
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
    },

    /*
     * setCurrentAppID function. Sets of currentAppID parameter
     */
    setCurrentAppID: function(appID){
      this.set('currentAppID', appID);
    },

    updateInteriorVehicleDataResultCodes:function(){
      index = this.interiorVehicleDataNumber - 1;
      this.GetInteriorVehicleDataResultCodes[index] = this.GetInteriorVehicleData;
    },

    /*
     * updateWayPointResultCodes function. Update SubscribeWayPoints array
     */
    updateWayPointResultCodes: function(){
      index = this.SubscribeWayPointsRequestNumber - 1;
      this.SubscribeWayPointsResultCodes[index] = this.SubscribeWayPoints;
    },
    
    /*
     * updateVehicleDataResultCodes function. Update SubscribeVehicleData array
     */
    updateVehicleDataResultCodes: function(){
      index = this.VehicleDataRequestNumber - 1;
      this.SubscribeVehicleDataResultCodes[index].SubscribeVehicleData = this.SubscribeVehicleData;
      this.SubscribeVehicleDataResultCodes[index].SubscribeVehicleDataParams = this.SubscribeVehicleDataParams;
    },

    updateInteriorVehicleData: function(){
      index = this.interiorVehicleDataNumber - 1;
      this.set('GetInteriorVehicleData', this.GetInteriorVehicleDataResultCodes[index]);
    },

    /*
     * updateSubscribeWayPoints function. Update SubscribeWayPoints parameter
     */
    updateSubscribeWayPoints: function(){
      index = this.SubscribeWayPointsRequestNumber - 1;
      this.set('SubscribeWayPoints', this.SubscribeWayPointsResultCodes[index]);
    },

    /*
     * updateSubscribeVehicleData function. Update SubscribeVehicleData parameter
     */
    updateSubscribeVehicleData: function(){
      index = this.VehicleDataRequestNumber - 1;
      this.set('SubscribeVehicleData', this.SubscribeVehicleDataResultCodes[index].SubscribeVehicleData);
      this.set('SubscribeVehicleDataParams', this.SubscribeVehicleDataResultCodes[index].SubscribeVehicleDataParams);
    },

    previousInteriorVehicleData: function(){
      this.updateInteriorVehicleDataResultCodes();
      this.set('interiorVehicleDataNumber', this.interiorVehicleDataNumber - 1);
      this.updateInteriorVehicleData();
    },

    /*
     * previousWayPointResultCode function. Go to previous WayPoint ResultCode
     */
    previousWayPointResultCode: function(){
      this.updateWayPointResultCodes();
      this.set('SubscribeWayPointsRequestNumber', this.SubscribeWayPointsRequestNumber - 1);
      this.updateSubscribeWayPoints();
    },

    /*
     * previousVehicleDataResultCode function. Go to previous VehicleData ResultCode
     */
    previousVehicleDataResultCode: function(){
      this.updateVehicleDataResultCodes();
      this.set('VehicleDataRequestNumber', this.VehicleDataRequestNumber - 1);
      this.updateSubscribeVehicleData();
    },

    nextInteriorVehicleData: function(){
      this.updateInteriorVehicleDataResultCodes();
      this.set('interiorVehicleDataNumber', this.interiorVehicleDataNumber + 1);
      this.updateInteriorVehicleData();
    },

    /*
     * nextWayPointResultCode function. Go to next WayPoint ResultCode
     */
    nextWayPointResultCode: function(){
      this.updateWayPointResultCodes();
      this.set('SubscribeWayPointsRequestNumber', this.SubscribeWayPointsRequestNumber + 1);
      this.updateSubscribeWayPoints();
    },

    /*
     * nextVehicleDataResultCode function. Go to next WayPoint VehicleData
     */
    nextVehicleDataResultCode: function(){
      this.updateVehicleDataResultCodes();
      this.set('VehicleDataRequestNumber', this.VehicleDataRequestNumber + 1);
      this.updateSubscribeVehicleData();
    },

    /*
     * Add new response for SubscribeWayPoint RPC in queue
     */
    newInteriorVehicleDataResponse: function(){
      this.updateInteriorVehicleDataResultCodes();

      this.GetInteriorVehicleDataResultCodes.push('SUCCESS');
      this.set('GetInteriorVehicleData', 'SUCCESS');
      this.set('interiorVehicleDataNumber', this.interiorVehicleDataNumber + 1);
    },

    /*
     * Add new response for SubscribeWayPoint RPC in queue
     */
    newWayPointResponse: function(){
      this.updateWayPointResultCodes();

      this.SubscribeWayPointsResultCodes.push('SUCCESS');
      this.set('SubscribeWayPoints', 'SUCCESS');
      this.set('SubscribeWayPointsRequestNumber', this.SubscribeWayPointsRequestNumber + 1);
    },

    removeInteriorVehicleData: function(){
      this.updateInteriorVehicleDataResultCodes();

      index = this.interiorVehicleDataNumber - 1;
      length = this.GetInteriorVehicleDataResultCodes.length;
      
      this.GetInteriorVehicleDataResultCodes.splice(index, 1);

      currentNumber = this.interiorVehicleDataNumber;
      this.set('interiorVehicleDataNumber',0);
      this.set('interiorVehicleDataNumber', Math.min(currentNumber, 
                                      this.GetInteriorVehicleDataResultCodes.length));

      this.updateInteriorVehicleData();  
    },

    /*
     * removeWayPointResponse function. remove current WayPoint ResultCode
     * from array
     */
    removeWayPointResponse: function(){
      this.updateWayPointResultCodes();

      index = this.SubscribeWayPointsRequestNumber - 1;
      length = this.SubscribeWayPointsResultCodes.length;
      
      this.SubscribeWayPointsResultCodes.splice(index, 1);

      currentNumber = this.SubscribeWayPointsRequestNumber;
      this.set('SubscribeWayPointsRequestNumber',0);
      this.set('SubscribeWayPointsRequestNumber', Math.min(currentNumber, 
                                      this.SubscribeWayPointsResultCodes.length));

      this.updateSubscribeWayPoints();  
    },

    /*
     * removeVehicleDataResponse function. remove current VehicleData ResultCode
     * from array
     */
    removeVehicleDataResponse: function(){
      this.updateVehicleDataResultCodes();

      index = this.VehicleDataRequestNumber - 1;
      length = this.SubscribeVehicleDataResultCodes.length;

      this.SubscribeVehicleDataResultCodes.splice(index, 1);

      currentNumber = this.VehicleDataRequestNumber;
      this.set('VehicleDataRequestNumber',0);
      this.set('VehicleDataRequestNumber', Math.min(currentNumber, 
                                      this.SubscribeVehicleDataResultCodes.length));

      this.updateSubscribeVehicleData();
    },

    /*
     * Claims vehicle data structure filled with SUCCESS result codes
     */
    getSuccessVehicleDataStruct:function(){
      SuccessVehicleDataStruct = {}
      for(var paramName in this.SubscribeVehicleDataParams){
        SuccessVehicleDataStruct[paramName] = 'SUCCESS';
      }
      return SuccessVehicleDataStruct;
    },

    /*
     * Add new response for SubscribeVehicleData RPC in queue 
     */
    newVehicleDataResponse: function(){
      this.updateVehicleDataResultCodes();

      successVehicleDataStruct = this.getSuccessVehicleDataStruct();

      this.SubscribeVehicleDataResultCodes.push({
        SubscribeVehicleData: 'SUCCESS',
        SubscribeVehicleDataParams: successVehicleDataStruct
      });
      this.set('SubscribeVehicleData', 'SUCCESS');
      this.set('SubscribeVehicleDataParams', successVehicleDataStruct);
      this.set('VehicleDataRequestNumber', this.VehicleDataRequestNumber + 1);
    },
    
    getInteriorVehicleDataResponseStatus: function() {
      return this.interiorVehicleDataNumber + '/' + this.GetInteriorVehicleDataResultCodes.length;
    }.property(
      'FFW.RPCHelper.interiorVehicleDataNumber'
    ),

    /*
     * Format string with waypoints set to display on label
     */
    getWayPointResponseStatus: function() {
      return this.SubscribeWayPointsRequestNumber + '/' + this.SubscribeWayPointsResultCodes.length;
    }.property(
      'FFW.RPCHelper.SubscribeWayPointsRequestNumber'
    ),

    /*
     * Format string with vehicle data set to display on label
     */
    getVehicleDataStatus: function() {
      return this.VehicleDataRequestNumber + '/' + this.SubscribeVehicleDataResultCodes.length;
    }.property(
      'FFW.RPCHelper.VehicleDataRequestNumber'
    ),

    getNextInteriorVehicleData: function(){
      this.updateInteriorVehicleDataResultCodes();

      length = this.GetInteriorVehicleDataResultCodes.length;

      code = this.GetInteriorVehicleDataResultCodes[0];
      if(length > 1){
        this.GetInteriorVehicleDataResultCodes.shift(); //remove the first element of the array
        
        currentNumber = this.interiorVehicleDataNumber;
        this.set('interiorVehicleDataNumber',0);
        this.set('interiorVehicleDataNumber', 
                              Math.min(currentNumber, 
                                        this.GetInteriorVehicleDataResultCodes.length));
        this.updateInteriorVehicleData();
      } else if(length == 1){
        this.set('GetInteriorVehicleData', 'SUCCESS');
      }
      return SDL.SDLModel.data.resultCode[code]
    },

    /*
     * Claims next result code for SubscribeWayPoints RPC
     */
    getNextWayPointResultCode: function(){
      this.updateWayPointResultCodes();

      length = this.SubscribeWayPointsResultCodes.length;

      code = this.SubscribeWayPointsResultCodes[0];
      if(length > 1){
        this.SubscribeWayPointsResultCodes.shift(); //remove the first element of the array
        
        currentNumber = this.SubscribeWayPointsRequestNumber;
        this.set('SubscribeWayPointsRequestNumber',0);
        this.set('SubscribeWayPointsRequestNumber', 
                              Math.min(currentNumber, 
                                        this.SubscribeWayPointsResultCodes.length));
        this.updateSubscribeWayPoints();
      } else if(length == 1){
        this.set('SubscribeWayPoints', 'SUCCESS');
      }
      return SDL.SDLModel.data.resultCode[code]
    },

    /*
     * Claims next result code for SubscribeVehicleData RPC
     */
    getNextVehicleDataResultCode: function(){
      this.updateVehicleDataResultCodes();

      nextVehicleDataResultCode = this.SubscribeVehicleDataResultCodes[0].SubscribeVehicleData;
      code = {
        SubscribeVehicleData: SDL.SDLModel.data.resultCode[nextVehicleDataResultCode],
        SubscribeVehicleDataParams:{}
      };

      for(var paramName in this.SubscribeVehicleDataParams){
        nextParamResultCode = this.SubscribeVehicleDataResultCodes[0].SubscribeVehicleDataParams[paramName]
        code.SubscribeVehicleDataParams[paramName] = nextParamResultCode;
      }
    
      length = this.SubscribeVehicleDataResultCodes.length;	
      if(length > 1){
        this.SubscribeVehicleDataResultCodes.shift(); //remove the first element of the array
        currentNumber = this.VehicleDataRequestNumber;
        this.set('VehicleDataRequestNumber',0);
        this.set('VehicleDataRequestNumber', Math.min(currentNumber, 
                                        this.SubscribeVehicleDataResultCodes.length));

        this.updateSubscribeVehicleData();
      } else if(length == 1){
        this.set('SubscribeVehicleData', 'SUCCESS');
        this.set('SubscribeVehicleDataParams', this.getSuccessVehicleDataStruct());
      }
      
      return code;
    },
    
    GetInteriorVehicleDataResultCodes: ['SUCCESS'],
    SubscribeWayPointsResultCodes: ['SUCCESS'],
    SubscribeVehicleDataResultCodes: [],

    GetInteriorVehicleData:'',
    SubscribeWayPoints: '',
    SubscribeVehicleData: '',
    SubscribeVehicleDataParams: {
      speed:'',
      rpm: '',
      fuelLevel: '',
      fuelLevel_State: '',
      instantFuelConsumption: '',
      externalTemperature: '',
      turnSignal: '',
      prndl: '',
      tirePressure: '',
      odometer: '',
      beltStatus: '',
      bodyInformation: '',
      deviceStatus: '',
      driverBraking: '',
      wiperStatus: '',
      headLampStatus: '',
      engineTorque: '',
      accPedalPosition: '',
      steeringWheelAngle: '',
      engineOilLife: '',
      electronicParkBrakeStatus: '',
      eCallInfo: '',
      airbagStatus: '',
      emergencyEvent: '',
      clusterModes: '',
      myKey: '',
      fuelRange: '',
      gps: ''
    },

    GetInteriorVehicleDataIndex: 0,
    SubscribeWayPointsIndex: 0,
    SubscribeVehicleDataIndex: 0,

    interiorVehicleDataNumber: 1,
    SubscribeWayPointsRequestNumber: 1,
    VehicleDataRequestNumber: 1,

    defaultRpcStruct: {},
    currentAppID: null,
    
    rpcStruct: {
        vrAddCommand:'',
        uiAddCommand: '',
        AddSubmenu:'',
        uiSetGlobalProperties: '',
        ttsSetGlobalProperties: ''        
    },
  }
);
