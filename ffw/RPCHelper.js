/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
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
     * List of result codes to customize
     */
    customResultCodesList: [
      'SUCCESS'
    ],

    /*
     * List of data subscription values
     */
    subscribeDataValues: [
      'USE_EXISTING',
      'FALSE',
      'TRUE'
    ],

    /*
     * init function. Setup helpers initial values
     */ 
    init: function() {
      SDL.ButtonCapability.forEach((capability) => {
        this.SubscribeButton[capability.name] = '';
      });
      for(key in this.rpcStruct){
        this.set('defaultRpcStruct.'+key, 'SUCCESS');
      };
      for(key in this.vehicleDataStruct){
        this.set('vehicleDataStruct.'+key, 'SUCCESS');
      };
      for(key in this.SubscribeButton){
        this.set('defaultSubscribeButton.' + key, 'SUCCESS');
      };
      this.set('SubscribeWayPoints', 'SUCCESS');
      this.set('SubscribeVehicleData', 'SUCCESS');

      this.VehicleDataResultCodes.push({
        SubscribeVehicleData: 'SUCCESS',
        vehicleDataStruct: this.getSuccessVehicleDataStruct()
      });
    },

    /*
     * addApplication function. Push new application into the app 
     * container with initial data
     */
    addApplication: function(appID) {
      if (this.customResultCodesList.length <= 1) {
        let codes = SDL.deepCopy(SDL.SDLModel.data.resultCodes);
        codes.push('DO_NOT_RESPOND');
        this.set('customResultCodesList', codes);
      }
      if(!(appID in this.appContainer)) {
        this.appContainer[appID] = SDL.deepCopy(this.defaultRpcStruct);
        this.appContainer[appID]['SubscribeButton'] = SDL.deepCopy(this.defaultSubscribeButton);
      }

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
        SDL.SDLModel.data.resultCode.WARNINGS,
        SDL.SDLModel.data.resultCode.WRONG_LANGUAGE,
        SDL.SDLModel.data.resultCode.RETRY,
        SDL.SDLModel.data.resultCode.SAVED,
        SDL.SDLModel.data.resultCode.TRUNCATED_DATA
      ].includes(resultCode);
    },

    /*
     * getCustomResultCode function. Claims custom result code for 
     * application for a specified method. It could be overriden 
     * by HMI settings
     */
    getCustomResultCode: function(appID, method) {
      switch (method) {
        case 'SubscribeWayPoints': {
          return this.getNextWayPointResultCode();
        }
        case 'SubscribeVehicleData': {
          return this.getNextVehicleDataResultCode();
        }
        case 'GetInteriorVehicleData': {
          return this.getNextGetIVDResultCode();
        }
      }

      var code = null;
      if(appID && this.appContainer.hasOwnProperty(appID) && this.appContainer[appID][method]) {
        code = this.appContainer[appID][method];
      } else if(this.vehicleDataStruct[method]) {
        code = this.vehicleDataStruct[method];
      }

      if (null === code) {
        return SDL.SDLModel.data.resultCode.SUCCESS;
      }

      if ('DO_NOT_RESPOND' == code) {
        return code;
      }

      return SDL.SDLModel.data.resultCode[code];
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
     * updateWayPointResultCodes function. Update SubscribeWayPoints array
     */
    updateWayPointResultCodes: function(){
      index = this.SubscribeWayPointsRequestNumber - 1;
      this.wayPointResultCodes[index] = this.SubscribeWayPoints;
    },
    
    /*
     * updateVehicleDataResultCodes function. Update SubscribeVehicleData array
     */
    updateVehicleDataResultCodes: function(){
      index = this.VehicleDataRequestNumber - 1;
      this.VehicleDataResultCodes[index].SubscribeVehicleData = this.SubscribeVehicleData;
      this.VehicleDataResultCodes[index].vehicleDataStruct = this.vehicleDataStruct;
    },

    /*
     * updategetIVDResultCodes function. Update GetIVD array
     */
    updategetIVDResultCodes: function(){
      index = this.getIVDRequestNumber - 1;
      this.getIVDResultStruct[index].code = this.getIVDResult;
      this.getIVDResultStruct[index].subscribed = this.getIVDSubscribed;
    },

    /*
     * updateSubscribeWayPoints function. Update SubscribeWayPoints parameter
     */
    updateSubscribeWayPoints: function(){
      index = this.SubscribeWayPointsRequestNumber - 1;
      this.set('SubscribeWayPoints', this.wayPointResultCodes[index]);
    },

    /*
     * updateGetIVDData function. Update getIVDResult parameter
     */
    updateGetIVDData: function(){
      index = this.getIVDRequestNumber - 1;
      this.set('getIVDResult', this.getIVDResultStruct[index].code);
      this.set('getIVDSubscribed', this.getIVDResultStruct[index].subscribed);
    },

    /*
     * updateSubscribeVehicleData function. Update SubscribeVehicleData parameter
     */
    updateSubscribeVehicleData: function(){
      index = this.VehicleDataRequestNumber - 1;
      this.set('SubscribeVehicleData', this.VehicleDataResultCodes[index].SubscribeVehicleData);
      this.set('vehicleDataStruct', this.VehicleDataResultCodes[index].vehicleDataStruct);
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

    /*
     * previousGetIVDResultCode function. Go to previous GetIVD ResultCode
     */
    previousGetIVDResultCode: function(){
      this.updategetIVDResultCodes();
      this.set('getIVDRequestNumber', this.getIVDRequestNumber - 1);
      this.updateGetIVDData();
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
     * nextGetIVDResultCode function. Go to next WayPoint ResultCode
     */
    nextGetIVDResultCode: function(){
      this.updategetIVDResultCodes();
      this.set('getIVDRequestNumber', this.getIVDRequestNumber + 1);
      this.updateGetIVDData();
    },

    /*
     * Add new response for SubscribeWayPoint RPC in queue
     */
    newWayPointResponse: function(){
      this.updateWayPointResultCodes();

      this.wayPointResultCodes.push('SUCCESS');
      this.set('SubscribeWayPoints', 'SUCCESS');
      this.set('SubscribeWayPointsRequestNumber', this.SubscribeWayPointsRequestNumber + 1);
    },

    /*
     * Add new response for GetIVD RPC in queue
     */
    newGetIVDResponse: function(){
      this.updategetIVDResultCodes();

      this.getIVDResultStruct.push({
          code: 'SUCCESS',
          subscribed: FFW.RPCHelper.subscribeDataValues[0]
        }
      );

      this.set('getIVDRequestNumber', this.getIVDRequestNumber + 1);
      this.updateGetIVDData();
    },

    /*
     * removeWayPointResponse function. remove current WayPoint ResultCode
     * from array
     */
    removeWayPointResponse: function(){
      this.updateWayPointResultCodes();

      index = this.SubscribeWayPointsRequestNumber - 1;
      length = this.wayPointResultCodes.length;
      
      this.wayPointResultCodes.splice(index, 1);

      currentNumber = this.SubscribeWayPointsRequestNumber;
      this.set('SubscribeWayPointsRequestNumber',0);
      this.set('SubscribeWayPointsRequestNumber', Math.min(currentNumber, 
                                      this.wayPointResultCodes.length));

      this.updateSubscribeWayPoints();  
    },

    /*
     * removeVehicleDataResponse function. remove current VehicleData ResultCode
     * from array
     */
    removeVehicleDataResponse: function(){
      this.updateVehicleDataResultCodes();

      index = this.VehicleDataRequestNumber - 1;
      length = this.VehicleDataResultCodes.length;

      this.VehicleDataResultCodes.splice(index, 1);

      currentNumber = this.VehicleDataRequestNumber;
      this.set('VehicleDataRequestNumber',0);
      this.set('VehicleDataRequestNumber', Math.min(currentNumber, 
                                      this.VehicleDataResultCodes.length));

      this.updateSubscribeVehicleData();
    },

    /*
     * removeGetIVDResponse function. remove current VehicleData ResultCode
     * from array
     */
    removeGetIVDResponse: function(){
      this.updategetIVDResultCodes();

      index = this.getIVDRequestNumber - 1;
      length = this.getIVDResultStruct.length;

      this.getIVDResultStruct.splice(index, 1);

      currentNumber = this.getIVDRequestNumber;

      // Should be set to 0 first in order to trigger refresh event binding
      // on the next set
      this.set('getIVDRequestNumber', 0);
      this.set('getIVDRequestNumber', Math.min(currentNumber,
                                      this.getIVDResultStruct.length));

      this.updateGetIVDData();
    },

    /*
     * Claims vehicle data structure filled with SUCCESS result codes
     */
    getSuccessVehicleDataStruct:function(){
      SuccessVehicleDataStruct = {}
      for(var paramName in this.vehicleDataStruct){
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

      this.VehicleDataResultCodes.push({
        SubscribeVehicleData: 'SUCCESS',
        vehicleDataStruct: successVehicleDataStruct
      });
      this.set('SubscribeVehicleData', 'SUCCESS');
      this.set('vehicleDataStruct', successVehicleDataStruct);
      this.set('VehicleDataRequestNumber', this.VehicleDataRequestNumber + 1);
    },
    
    /*
     * Format string with waypoints set to display on label
     */
    getWayPointResponseStatus: function() {
      return this.SubscribeWayPointsRequestNumber + '/' + this.wayPointResultCodes.length;
    }.property(
      'FFW.RPCHelper.SubscribeWayPointsRequestNumber'
    ),

    /*
     * Format string with vehicle data set to display on label
     */
    getVehicleDataStatus: function() {
      return this.VehicleDataRequestNumber + '/' + this.VehicleDataResultCodes.length;
    }.property(
      'FFW.RPCHelper.VehicleDataRequestNumber'
    ),

    /*
     * Format string with IVD set to display on label
     */
    getIVDResponseStatus: function() {
      return this.getIVDRequestNumber + '/' + this.getIVDResultStruct.length;
    }.property(
      'FFW.RPCHelper.getIVDRequestNumber'
    ),

    /*
     * Claims next result code for SubscribeWayPoints RPC
     */
    getNextWayPointResultCode: function(){
      this.updateWayPointResultCodes();

      length = this.wayPointResultCodes.length;

      code = this.wayPointResultCodes[0];
      if(length > 1){
        this.wayPointResultCodes.shift(); //remove the first element of the array
        
        currentNumber = this.SubscribeWayPointsRequestNumber;
        this.set('SubscribeWayPointsRequestNumber', 
                              Math.min(currentNumber, 
                                        this.wayPointResultCodes.length));
        this.updateSubscribeWayPoints();
      } else if(length == 1){
        this.set('SubscribeWayPoints', 'SUCCESS');
      }

      if ('DO_NOT_RESPOND' == code) {
        return code;
      }

      return SDL.SDLModel.data.resultCode[code]
    },

    /*
     * Claims next result code for SubscribeVehicleData RPC
     */
    getNextVehicleDataResultCode: function(){
      this.updateVehicleDataResultCodes();

      nextVehicleDataResultCode = this.VehicleDataResultCodes[0].SubscribeVehicleData;
      const next_code = 'DO_NOT_RESPOND' == nextVehicleDataResultCode ? 
        nextVehicleDataResultCode : SDL.SDLModel.data.resultCode[nextVehicleDataResultCode];

      code = {
        SubscribeVehicleData: next_code,
        vehicleDataStruct:{}
      };

      for(var paramName in this.vehicleDataStruct){
        nextParamResultCode = this.VehicleDataResultCodes[0].vehicleDataStruct[paramName]
        code.vehicleDataStruct[paramName] = nextParamResultCode;
      }
    
      length = this.VehicleDataResultCodes.length;	
      if(length > 1){
        this.VehicleDataResultCodes.shift(); //remove the first element of the array
        currentNumber = this.VehicleDataRequestNumber;
        this.set('VehicleDataRequestNumber',0);
        this.set('VehicleDataRequestNumber', Math.min(currentNumber, 
                                        this.VehicleDataResultCodes.length));

        this.updateSubscribeVehicleData();
      } else if(length == 1){
        this.set('SubscribeVehicleData', 'SUCCESS');
        this.set('vehicleDataStruct', this.getSuccessVehicleDataStruct());
      }
      
      return code;
    },
    
    /*
     * Claims next result code for GetIVD RPC
     */
    getNextGetIVDResultCode: function(){
      this.updategetIVDResultCodes();

      length = this.getIVDResultStruct.length;

      result = this.getIVDResultStruct[0];
      if(length > 1){
        this.getIVDResultStruct.shift(); //remove the first element of the array

        currentNumber = this.getIVDRequestNumber;
        length = this.getIVDResultStruct.length;
        this.set('getIVDRequestNumber', Math.min(currentNumber, length));
        this.updateGetIVDData();

        // Manually update counterLabel and nextButton if currentNumber == length
        if(currentNumber == length) {
          SDL.RPCGetIVDControlConfigView.nextButton.set('disabled', true);
          SDL.RPCGetIVDControlConfigView.counterLabel.set('content', currentNumber + '/' + length); 
        }
      } else if (length == 1){
        this.set('getIVDResult', 'SUCCESS');
        this.set('getIVDSubscribed', FFW.RPCHelper.subscribeDataValues[0]);
      }

      if ('DO_NOT_RESPOND' == result.code) {
        return result;
      }

      result.code = SDL.SDLModel.data.resultCode[result.code];
      return result;
    },

    wayPointResultCodes: ['SUCCESS'],
    SubscribeWayPoints: '',
    SubscribeWayPointsRequestNumber: 1,

    getIVDResultStruct: [
      {
        code: 'SUCCESS',
        subscribed: 'USE_EXISTING'
      }
    ],
    getIVDResult: '',
    getIVDSubscribed: '',
    getIVDRequestNumber: 1,

    defaultRpcStruct: {},
    defaultSubscribeButton: {},
    currentAppID: null,
    
    rpcStruct: {
        vrAddCommand:'',
        uiAddCommand: '',
        createInteractionChoiceSet: '',
        AddSubmenu:'',
        uiSetGlobalProperties: '',
        ttsSetGlobalProperties: '',
        rcSetGlobalProperties: '',
        uiCreateWindow: ''
    },

    VehicleDataResultCodes: [],
    VehicleDataRequestNumber: 1,
    SubscribeVehicleData: '',
    vehicleDataStruct: {
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
    SubscribeButton: {}
  }
);
