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
 * @name SDL.SDLModelData
 * @desc General model for SDL applications
 * @category Model
 * @filesource app/model/sdl/Abstract/data.js
 * @version 1.0
 */

SDL.SDLModelData = Em.Object.create(
  {
    /**
    *  List of default app permissions entityes for AppPermissionsView
    */
    externalConsentStatus: [{entityType: 1, entityID: 1, status: "Undefined"},
                            {entityType: 1, entityID: 2, status: "Undefined"}],
    /**
     * Selected appID from AppPermissionsView
     */
    appPermChangeAppID: null,

    /**
     * Data came from UI.PerformInteractionRequest for ShowVRHelpItems popup
     *
     * @type {Object}
     */
    interactionData: {
      'vrHelpTitle': null,
      'vrHelp': null
    },
    /**
     * Enum for media Player Indicator
     */
    mediaPlayerIndicatorEnum: {
      'PLAY_PAUSE': 0,
      'PLAY': 1,
      'PAUSE': 2,
      'BUFFERING': 3
    },
    /**
     * Structure specified for PoliceUpdate retry sequence
     * contains timeout seconds param, array of retry seconds and counter of
     * number of retries
     *
     * @type {Objetc}
     */
    policyUpdateRetry: {
      timeout: null,
      retry: [],
      try: null,
      timer: null,
      oldTimer: 0
    },
    /**
     * Application's container for current processed requests on VR component
     * of HMI
     *
     * @type {Object}
     */
    vrActiveRequests: {
      vrPerformInteraction: null
    },
    /**
     * List of callback functions for request SDL.GetUserFriendlyMessage
     * where key is requestId
     * and parameter is a function that will handle data came in respone from
     * SDL
     *
     * @type {Object}
     */
    userFriendlyMessagePull: {},
    /**
     * List of appID functions for request SDL.GetListOfPermissions
     * where key is requestId
     * and parameter is a appID that will handle data came in respone from SDL
     *
     * @type {Object}
     */
    getListOfPermissionsPull: {},
    /**
     * List of application id's for request SDL.ActivateApp
     * where key is requestId
     * and parameter is a id of application to be activated
     *
     * @type {Object}
     */
    activateAppRequestsList: {},
    /**
     * ID of app in LIMITED HMI state
     */
    stateLimited: null,
    /**
     * Active state of media player on HMI for Deactivate app to handle event
     */
    mediaPlayerActive: false,
    /**
     * Active state of phone call on HMI for Deactivate app to handle event
     */
    phoneCallActive: false,
    /**
     * FLAG of any app in limited level exists
     */
    limitedExist: false,
    /**
     * IScroll object to manage scroll on PerformInteraction view
     *
     * @type {Object}
     */
    interactionListWrapper: null,
    /**
     * TimeStamp of current started HMI session
     *
     * @type {Number}
     */
    timeStamp: null,
    /**
     * List of VR commands
     */
    VRCommands: [],
    /**
     * Video player object for navigationApp
     *
     * @type {Object}
     */
    naviVideo: {},
    /**
     * Array of strings came in SDL.GetURLS response
     *
     * @type {Object}
     */
    policyURLs: [],
    /**
     * Policy Settings Info state value
     *
     * @type {String}
     */
    settingsInfoListState: 'iAPP_BUFFER_FULL',
    /**
     * Policy Settings Info list
     *
     * @type {Object}
     */
    settingsInfoList: [
      'iAPP_BUFFER_FULL',
      'blah'
    ],
    /**
     * Policy Settings Info state value
     *
     * @type {String}
     */
    systemErrorListState: 'SYNC_REBOOTED',
    /**
     * Policy Settings Info list
     *
     * @type {Object}
     */
    systemErrorList: [
      'SYNC_REBOOTED',
      'SYNC_OUT_OF_MEMMORY'
    ],
    /**
     * Flag to indicate AudioPassThruPopUp activity
     *
     * @type {Boolean}
     */
    AudioPassThruState: false,
    /**
     * Current device information
     *
     * @type {Object}
     */
    CurrDeviceInfo: {
      'name': null,
      'id': null
    },
    /**
     * Driver Distraction State
     *
     * @type bool
     */
    driverDistractionState: false,
    /**
     * Flag to sent Send Data extended params
     *
     * @type {Boolean}
     */
    sendDataExtend: false,
    /**
     * VR active status
     *
     * @type {Boolean}
     */
    VRActive: false,
    /**
     * Flag to be set true when phone call is initialised
     *
     * @type {Boolean}
     */
    phoneCall: false,
    /**
     * Device list search progress flag
     *
     * @param {Boolean}
     */
    deviceSearchProgress: false,
    /**
     * Flag to be set true when VRHelpList are activated
     *
     * @param {Boolean}
     */
    VRHelpListActivated: false,
    /**
     * Flag to be set true when VRHelpList are activated
     *
     * @type {String}
     */
    keyboardInputValue: '',
    /**
     * List of states for OnTBTClientState notification
     */
    tbtClientStates: [
      {
        name: 'ROUTE_UPDATE_REQUEST',
        id: 0
      }, {
        name: 'ROUTE_ACCEPTED',
        id: 1
      }, {
        name: 'ROUTE_REFUSED',
        id: 2
      }, {
        name: 'ROUTE_CANCELLED',
        id: 3
      }, {
        name: 'ETA_REQUEST',
        id: 4
      }, {
        name: 'NEXT_TURN_REQUEST',
        id: 5
      }, {
        name: 'ROUTE_STATUS_REQUEST',
        id: 6
      }, {
        name: 'ROUTE_SUMMARY_REQUEST',
        id: 7
      }, {
        name: 'TRIP_STATUS_REQUEST',
        id: 8
      }, {
        name: 'ROUTE_UPDATE_REQUEST_TIMEOUT',
        id: 9
      }
    ],
    /**
     * List of states for ExitApplication notification
     */
    exitAppState: [
      {
        name: 'IGNITION_OFF',
        id: 0
      },
      {
        name: 'MASTER_RESET',
        id: 1
      },
      {
        name: 'FACTORY_DEFAULTS',
        id: 2
      },
      {
        name: 'SUSPEND',
        id: 3
      }
    ],
    /**
     * List of states for OnSystemRequest notification
     */
    systemRequestState: [
      {
        name: 'HTTP',
        id: 0
      },
      {
        name: 'FILE_RESUME',
        id: 1
      },
      {
        name: 'AUTH_REQUEST',
        id: 2
      },
      {
        name: 'AUTH_CHALLENGE',
        id: 3
      },
      {
        name: 'AUTH_ACK',
        id: 4
      },
      {
        name: 'PROPRIETARY',
        id: 5
      },
      {
        name: 'QUERY_APPS',
        id: 6
      },
      {
        name: 'LAUNCH_APP',
        id: 7
      },
      {
        name: 'LOCK_SCREEN_ICON_URL',
        id: 8
      },
      {
        name: 'TRAFFIC_MESSAGE_CHANNEL',
        id: 9
      },
      {
        name: 'DRIVER_PROFILE',
        id: 10
      },
      {
        name: 'VOICE_SEARCH',
        id: 11
      },
      {
        name: 'NAVIGATION',
        id: 12
      },
      {
        name: 'PHONE',
        id: 13
      },
      {
        name: 'CLIMATE',
        id: 14
      },
      {
        name: 'SETTINGS',
        id: 15
      },
      {
        name: 'VEHICLE_DIAGNOSTICS',
        id: 16
      },
      {
        name: 'EMERGENCY',
        id: 17
      },
      {
        name: 'MEDIA',
        id: 18
      },
      {
        name: 'FOTA',
        id: 19
      }
    ],
    /**
     * Data for AudioPassThruPopUp that contains params for visualisation
     *
     * @type {Object}
     */
    AudioPassThruData: {},
    /**
     * Enum to unmap state manager names into HMI API EventTypes enum
     */
    onEventChangedEnum: {
      'player': 'AUDIO_SOURCE',
      'navigation': 'EMBEDDED_NAVI',
      'phoneCall': 'PHONE_CALL',
      'emergencyEvent': 'EMERGENCY_EVENT',
      'onDeactivateHMI': 'DEACTIVATE_HMI'
    },
    /**
     * Enum with result codes for RPC
     */
    resultCode: {
      'SUCCESS': 0,
      'UNSUPPORTED_REQUEST': 1,
      'UNSUPPORTED_RESOURCE': 2,
      'DISALLOWED': 3,
      'REJECTED': 4,
      'ABORTED': 5,
      'IGNORED': 6,
      'RETRY': 7,
      'IN_USE': 8,
      'DATA_NOT_AVAILABLE': 9,
      'TIMED_OUT': 10,
      'INVALID_DATA': 11,
      'CHAR_LIMIT_EXCEEDED': 12,
      'INVALID_ID': 13,
      'DUPLICATE_NAME': 14,
      'APPLICATION_NOT_REGISTERED': 15,
      'WRONG_LANGUAGE': 16,
      'OUT_OF_MEMORY': 17,
      'TOO_MANY_PENDING_REQUESTS': 18,
      'NO_APPS_REGISTERED': 19,
      'NO_DEVICES_CONNECTED': 20,
      'WARNINGS': 21,
      'GENERIC_ERROR': 22,
      'USER_DISALLOWED': 23
    },
    /**
     * Info navigationApp data for ShowConstantTBT request
     *
     * @type: {Object}
     */
    constantTBTParams: {
      'navigationTexts': [
        {
          'fieldName': 'navigationText1',
          'fieldText': 'mainField1'
        },
        {
          'fieldName': 'navigationText2',
          'fieldText': 'mainField2'
        },
        {
          'fieldName': 'ETA',
          'fieldText': 'mainField3'
        },
        {
          'fieldName': 'totalDistance',
          'fieldText': 'mainField4'
        },
        {
          'fieldName': 'navigationText',
          'fieldText': 'mainField5'
        },
        {
          'fieldName': 'timeToDestination',
          'fieldText': 'mainField6'
        }
      ],
      'softButtons': [
        {
          'text': 'Menu',
          'isHighlighted': true,
          'softButtonID': 1
        },
        {
          'text': 'Custom button',
          'isHighlighted': false,
          'softButtonID': 2
        },
        {
          'text': '+',
          'isHighlighted': true,
          'softButtonID': 3
        },
        {
          'text': '-',
          'isHighlighted': false,
          'softButtonID': 4
        }
      ]
    },
    /**
     * List of registered applications, To prevent errors without registered
     * application "-1" used as test appID
     *
     * @type object
     */
    registeredApps: [],
    /**
     * List of unregistered applications, to verify which app is reestablished
     * connection
     *
     * @type object
     */
    unRegisteredApps: [],
    /**
     * List of objects with params for connected devices
     *
     * @type object
     */
    connectedDevices: {},
    connectedDevicesArray: function() {
      var temArray = [];
      for (var key in SDL.SDLModel.data.connectedDevices) {
        if (SDL.SDLModel.data.connectedDevices.hasOwnProperty(key)) {
          temArray.push(SDL.SDLModel.data.connectedDevices[key]);
        }
      }
      return temArray;
    }.property('SDL.SDLModel.data.connectedDevices'),
    /**
     * List of registered components
     *
     * @type object
     */
    registeredComponents: [
      {
        type: 'UI',
        state: false
      }, {
        type: 'TTS',
        state: false
      }, {
        type: 'VR',
        state: false
      }, {
        type: 'BasicCommunication',
        state: false
      }, {
        type: 'VehicleInfo',
        state: false
      }, {
        type: 'Buttons',
        state: false
      }, {
        type: 'Navigation',
        state: false
      }
    ],
    /**
     * List of icons
     *
     * @type {Object}
     */
    defaultListOfIcons: {
      // appID: syncFileName
      //0: "images/media/ico_li.png"
      'app': 'images/info/info_leftMenu_apps_ico.png',
      'command': 'images/common/defaultButtonImage.png',
      'trackIcon': 'images/sdl/audio_icon.jpg'
    },
    /**
     * Array of active applications
     *
     * @type {Array}
     */
    applicationsList: [],
    /**
     * Array of connected devices
     *
     * @type {Array}
     */
    devicesList: [],
    /**
     * TTS + VR language
     *
     * @type {String}
     */
    hmiTTSVRLanguage: 'EN-US',
    /**
     * UI language
     *
     * @type {String}
     */
    hmiUILanguage: 'EN-US',
    /**
     * Parameter describes if performInteraction session was started on HMI
     * this flag set to true when UI.PerformInteraction request came on HMI
     * and set to false when HMI send response to SDL Core on
     * UI.PerformInteraction request
     *
     * @type {Boolean}
     */
    performInteractionSession: [],
    /**
     * Array with app permissions
     * used for policies
     *
     * @type {Object}
     */
    appPermissions: [],
    /**
     * List of supported languages
     *
     * @type {Array}
     */
    sdlLanguagesList: [
      'EN-US',
      'ES-MX',
      'FR-CA',
      'DE-DE',
      'ES-ES',
      'EN-GB',
      'RU-RU',
      'TR-TR',
      'PL-PL',
      'FR-FR',
      'IT-IT',
      'SV-SE',
      'PT-PT',
      'NL-NL',
      'ZH-TW',
      'JA-JP',
      'AR-SA',
      'KO-KR',
      'PT-BR',
      'CS-CZ',
      'DA-DK',
      'NO-NO',
      'NL-BE',
      'EL-GR',
      'HU-HU',
      'FI-FI',
      'SK-SK'
    ],
    imageModeList:[
      'Day mode',
      'Night mode',
      'Highlighted mode'
    ]
  }
);
