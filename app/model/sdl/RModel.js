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
/**
 * @name SDL.RModel
 * @desc General model for SDL applications
 * @category Model
 * @filesource app/model/sdl/RModel.js
 * @version 1.0
 */

SDL.RModel = SDL.SDLModel.extend({

  /**
   * Id of current processed RC.GrantAccess request
   *
   * @param {Number}
   */
  controlRequestID: null,

  /**
   * Current drivers device flag
   *
   * @param {Object}
   */
  driverDevice: true,

  /**
   * Current drivers device flag
   *
   * @param {Object}
   */
  driverDeviceInfo: null,

  /**
   * Flag to set ability to send error responses for GetInteriorVehicleDataCapabilities
   *
   * @param {Object}
   */
  errorResponse: false,

  /**
   * Map for OnDeviceRankChanged notification param 'deviceRank'
   */
  deviceRank: {
      0: 'DRIVER',
      1: 'PASSENGER'
    },

  /**
   * RC functionality flag
   * HMI must disallow RC functions when this functionality disabled
   */
  reverseFunctionalityEnabled: true,

  /**
   * Array of allowed values for access mode param of OnRemoteControlSettings
   */
  reverseAccessModesStruct: [
    'AUTO_ALLOW',
    'AUTO_DENY',
    'ASK_DRIVER'
  ],

  /**
   * RC access mode indicator
   * Used for OnRemoteControlSettings notification
   */
  reverseAccessMode: 'AUTO_ALLOW',


  appRCStatus: 
  {
   
  },

  /**
   * Method to add activation button to VR commands and set device
   * parameters to model
   *
   * @param {Object}
   */
  onAppRegistered: function(params, vrSynonyms) {

    if (!params.appType) {              // According to APPLINK-19979 if appType parameter is empty
      params.appType = [];            // HMI should use "DEFAULT" value from AppHMIType enum of
      params.appType.push('DEFAULT'); // HMI_API documentation
    }

    var message = {};

    var applicationType = null,//Default value - NonMediaModel see SDL.SDLController.applicationModels
      app = SDL.SDLController.getApplicationModel(params.appID);

    if (app != undefined && app.initialized == false) {

      if (app.isMedia != params.isMediaApplication) { // If current not initialized model doe not matches the registered application type
        this.convertModel(params);                   // then model should be changed
      } else {
        app.disabledToActivate = params.greyOut;
      }
      return;
    } else if (app != undefined && app.initialized == true) {
      console.log(
        'Application with appID ' + params.appID + ' already registered!'
      );
      return; // if application already registered and correctly initialized and BC.UpdateAppList came from SDL than nothing shoul happend
    }

    if (params.isMediaApplication === true) {
      //Magic number 0 - Default media model
      applicationType = 0;
    } else if (params.isMediaApplication === false) {
      //Magic number 1 - Default non-media model
      applicationType = 1;
    }

    if (params.appType === -1) {
      //Magic number 2 - Default RC application with non-media model
      applicationType = 2;
    }

    if (this.driverDevice && this.driverDeviceInfo == null) {
      if (params.deviceInfo) {
        this.set('driverDeviceInfo', params.deviceInfo);
      }
    }

    SDL.SDLController.registerApplication(params, applicationType);

    if (SDL.SDLModel.data.unRegisteredApps.indexOf(params.appID) >= 0) {
      setTimeout(function() {
            SDL.PopUp.create().appendTo('body').popupActivate(
              'Connection with ' + params.appName + '  is re-established.'
            );
          }, 1000
        );
      this.data.unRegisteredApps.pop(params.appID);
    }

    //Magic number if predefined VR command USER_EXIT
    message = {
        'cmdID': -2,
        'vrCommands': ['USER_EXIT ' + params.appName],
        'appID': params.appID,
        'type': 'Command'
      };
    this.addCommandVR(message);

    if (vrSynonyms) {

      message = {
          'cmdID': 0,
          'vrCommands': vrSynonyms,
          'appID': params.appID,
          'type': 'Application'
        };
      this.addCommandVR(message);
    }
  },

  /**
   * Method to delete activation button from VR commands and delete device
   * parameters from model
   *
   * @param {Object}
   */
  onAppUnregistered: function(params) {

    if (SDL.SDLController.getApplicationModel(params.appID)) {

      this._super(params);
      var map = SDL.deepCopy(this.appRCStatus);
      delete map[params.appID];
      this.set('appRCStatus', map);
    }
  }

  }
);
