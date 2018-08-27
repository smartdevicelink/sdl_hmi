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
      for(key in this.vehicleDataStruct){
        this.set('vehicleDataStruct.'+key, 'SUCCESS');
      };
      this.set('SubscribeWayPoints', 'SUCCESS');
      this.set('SubscribeVehicleData', 'SUCCESS');
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
          return SDL.SDLModel.data.resultCode[this.SubscribeWayPoints];
        }
        case 'SubscribeVehicleData': {
          return SDL.SDLModel.data.resultCode[this.SubscribeVehicleData]; 
        }
      }

      var code = null;
      if(appID !== null && this.appContainer[appID][method] !== undefined) {
        code = this.appContainer[appID][method];
      } else if(this.vehicleDataStruct[method] !== undefined) {
        code = this.vehicleDataStruct[method];
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
      for(key in this.vehicleDataStruct) {
        value = this.vehicleDataStruct[key];
        this.set('currentVehicleDataStruct.' + key, value);
      };
      this.set('currentSubscribeWayPoints', this.SubscribeWayPoints);
      this.set('currentSubscribeVehicleData', this.SubscribeVehicleData);
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
      for(key in this.vehicleDataStruct) {
        this.set('vehicleDataStruct.'+ key, this.currentVehicleDataStruct[key]);
      };
      this.set('SubscribeWayPoints', this.currentSubscribeWayPoints);
      this.set('SubscribeVehicleData', this.currentSubscribeVehicleData);
      var event = {goToState: 'rpccontrol'};
      SDL.SettingsController.onState(event);
      this.setCurrentAppID(null);
    },

    /*
     * resetButton function. Reset parameters to default after pressing reset button
     * on the RPCControl view
     */
    resetButton: function() {
       this.set('currentSubscribeWayPoints', 'SUCCESS');
       this.set('currentSubscribeVehicleData', 'SUCCESS');
       for(key in this.rpcStruct){
         this.set('rpcStruct.'+key, this.defaultRpcStruct[key]);
       };
       for(key in this.currentVehicleDataStruct) {
         this.set('currentVehicleDataStruct.' + key, 'SUCCESS');
      };
    },

    /*
     * setCurrentAppID function. Sets of currentAppID parameter
     */
    setCurrentAppID: function(appID){
      this.set('currentAppID', appID);
    },

    defaultRpcStruct: {},
    currentAppID: null,
    currentVehicleDataStruct: {},
    currentSubscribeWayPoints: '',
    currentSubscribeVehicleData: '',
    SubscribeWayPoints: '',
    SubscribeVehicleData: '',
    rpcStruct: {
        vrAddCommand:'',
        uiAddCommand: '',
        AddSubmenu:'',
        uiSetGlobalProperties: '',
        ttsSetGlobalProperties: ''
    },
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
    }
  }
);
