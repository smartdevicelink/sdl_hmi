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
 * @name SDL.RadioModel
 * @desc Radio Media data model
 * @category Model
 * @filesource app/model/media/RadioModel.js
 * @version 1.0
 */

SDL.RadioModel = Em.Object.create({

  init: function() {

    var i;
    this._super();

    for (i = 879; i <= 1079; i+=2) {
      this.directTuneItems.FM.push(i.toString().split(''));
    }

    for (i = 525; i <= 1705; i+=5) {
      this.directTuneItems.AM.push(i.toString().split(''));
    }

    this.updateRadioFrequency();
  },

  optionsEnabled: false,

  lastOptionParams: {},

  tuneUpTimer: null,

  active: false,

  station: '87.9',

  activeBand: 'fm',

  activePreset: 0,

  temp: null,

  scanState: false,

  tuneRadio: false,

  bandStruct: [
    'FM',
    'AM',
    'XM'
  ],

  band: 'FM',


  availableHDs: 3,

  hdChannelsStruct: [
    0,
    1,
    2,
    3
  ],

  stateStruct: [
    'ACQUIRING',
    'ACQUIRED',
    'MULTICAST',
    'NOT_FOUND'
  ],

  boolStruct: [
    true,
    false
  ],

  preset: {
    'FM': [
      '87.9',
      '90.9',
      '105.1',
      '98.5',
      '106.3',
      '107.9'
    ],
    'AM': [
      '650',
      '740',
      '1190',
      '1270',
      '1440',
      '1530'
    ],
    'XM': [
      'SiriusXM Hits',
      'The Pulse',
      'The Highway',
      'The Joint',
      'Y2Kountry',
      'Laugh USA'
    ]
  },

  xmStations: {2: "SiriusXM Hits", 3: "Venus", 4: "SiriusXM Spotlight",
   5: "50s on 5", 6: "60s on 6", 7: "70s on 7", 8: "80s on 8", 9: "90s on 9",
   10: "Pop2K", 11: "KIIS-Los Angeles", 12: "Z100/NY", 13: "Pitbull", 14: "The Coffee House",
   15: "The Pulse", 16: "The Blend", 17: "PopRocks", 18: "The Beatles Channel",
   19: "Elvis Radio", 20: "E Street Radio", 21: "Underground Garage", 22: "Pearl Jam Radio",
   23: "Grateful Dead Channel", 24: "Radio Margaritaville", 25: "Classic Rewind",
   26: "Classic Vinyl", 27: "Deep Tracks", 28: "The Spectrum", 29: "Jam_ON", 30: "The Loft",
   31: "Tom Petty Radio", 32: "The Bridge", 33: "1st Wave", 34: "Lithium", 35: "SiriusXMU",
   36: "Alt Nation", 37: "Octane", 38: "Ozzys Boneyard", 39: "Hair Nation", 40: "Liquid Metal",
   41: "SiriusXM Turbo", 42: "The Joint", 43: "Backspin", 44: "Hip-Hop Nation", 45: "Shade 45",
   46: "The Heat", 47: "SiriusXM FLY", 48: "Heart & Soul", 49: "Soul Town", 50: "The Groove",
   51: "BPM", 52: "Electric Area", 53: "SiriusXM Chill", 54: "Studio 54 Radio",
   55: "The Garth Channel", 56: "The Highway", 57: "No Shoes Radio", 58: "Prime Country",
   59: "Willies Roadhouse", 60: "Outlaw Country", 61: "Y2Kountry", 62: "Bluegrass Junction",
   63: "The Message", 64: "Kirk Praise", 65: "enLighten", 66: "Watercolors", 67: "Real Jazz",
   68: "Spa", 69: "Escape", 70: "SiriusXM Love", 71: "Siriusly Sinatra", 72: "On Broadway",
   73: "40s Junction", 74: "BB King", 75: "Met Opera Radio", 76: "Symphony Hall",
   77: "KIDZ BOP Radio", 78: "Kids Place Live", 79: "Radio Disney", 80: "ESPN Radio",
   81: "ESPN Xtra", 82: "Mad Dog Sports Radio", 83: "FOX Sports on SiriusXM",
   84: "SiriusXM College Sports Nation", 85: "SiriusXM FC", 88: "SiriusXM NFL Radio",
   90: "SiriusXM NASCAR Radio", 91: "SiriusXM NHL Network Radio™", 93: "SiriusXM Rush",
   94: "SiriusXM Comedy Greats", 95: "Comedy Central Radio", 96: "The Foxxhole",
   97: "Jeff & Larrys Comedy Roundup", 98: "Laugh USA", 99: "Raw Dog Comedy Hits", 100: "Howard 100"},

  directTuneItems: {
    'FM': [],
    'AM': [],
    'XM': []
  },

  directTuneKeyItems: [],

  directTuneFinished: false,

  directTuneKeypressed: false,

  radioControlStruct: {
    frequencyInteger: 87,
    frequencyFraction: 9,
    band: 'FM',
    rdsData: {
      PS: 'name',
      RT: 'radio',
      CT: 'YYYY-MM-DDThh:mm:ss.sTZD',
      PI: 'Sign',
      PTY: 1,
      TP: true,
      TA: true,
      REG: 'Murica'
    },
    sisData:{
      stationShortName:'Name1',
      stationIDNumber:{
        countryCode:101,
        fccFacilityId:100
      },
      stationLongName:'Name2',
      stationLocation:{
        longitudeDegrees:0.1,
        latitudeDegrees:0.1,
        altitudeMeters:0.1
      },
      stationMessage:'station message'
    },
    availableHDs: 3,
    hdChannel: 1,
    signalStrength: 50,
    signalChangeThreshold: 60,
    radioEnable: false,
    state: 'ACQUIRING'
  },

  radioControlCheckboxes: {
    band: true,
    rdsData: {
      PS: true,
      RT: true,
      CT: true,
      PI: true,
      PTY: true,
      TP: true,
      TA: true,
      REG: true
    },
    sisData:{
      stationShortName:true,
      stationIDNumber:{
        countryCode:true,
        fccFacilityId:true
      },
      stationLongName:true,
      stationLocation:{
        gpsLocation:true,
        altitudeMeters:true
      },
      stationMessage:true
    },
    availableHDs: true,
    hdChannel: true,
    signalStrength: true,
    signalChangeThreshold: true,
    state: true
  },

  stationsData: {
    'FM': {
      '879': {
        'radioStation': {
          'frequency': 89,
          'fraction': 5,
          'availableHDs': 3,
          'currentHD': 1
        },
        'songInfo': {
          'name': 'Song1',
          'artist': 'Artist1',
          'genre': 'Genre1',
          'album': 'Album1',
          'year': 2001,
          'duration': 10
        }
      },
      '953': {
        'radioStation': {
          'frequency': 95,
          'fraction': 3,
          'availableHDs': 2,
          'currentHD': 1
        },
        'songInfo': {
          'name': 'Song2',
          'artist': 'Artist2',
          'genre': 'Genre2',
          'album': 'Album2',
          'year': 2002,
          'duration': 20
        }
      },
      '1001': {
        'radioStation': {
          'frequency': 100,
          'fraction': 1,
          'availableHDs': 1,
          'currentHD': 1
        },
        'songInfo': {
          'name': 'Song3',
          'artist': 'Artist3',
          'genre': 'Genre3',
          'album': 'Album3',
          'year': 2003,
          'duration': 30
        }
      },
      '1035': {
        'radioStation': {
          'frequency': 103,
          'fraction': 5,
          'availableHDs': 0,
          'currentHD': 0
        },
        'songInfo': {
          'name': 'Song4',
          'artist': 'Artist4',
          'genre': 'Genre4',
          'album': 'Album4',
          'year': 2004,
          'duration': 40
        }
      },
      '1053': {
        'radioStation': {
          'frequency': 105,
          'fraction': 3,
          'availableHDs': 3,
          'currentHD': 1
        },
        'songInfo': {
          'name': 'Song5',
          'artist': 'Artist5',
          'genre': 'Genre5',
          'album': 'Album5',
          'year': 2005,
          'duration': 50
        }
      }
    },
    'AM': {
      '550': {
        'radioStation': {
          'frequency': 89,
          'fraction': 5,
          'availableHDs': 3,
          'currentHD': 1
        },
        'songInfo': {
          'name': 'Song1',
          'artist': 'Artist1',
          'genre': 'Genre1',
          'album': 'Album1',
          'year': 2001,
          'duration': 10
        }
      },
      '650': {
        'radioStation': {
          'frequency': 65,
          'fraction': 0,
          'availableHDs': 2,
          'currentHD': 1
        },
        'songInfo': {
          'name': 'Song2',
          'artist': 'Artist2',
          'genre': 'Genre2',
          'album': 'Album2',
          'year': 2002,
          'duration': 20
        }
      },
      '800': {
        'radioStation': {
          'frequency': 800,
          'fraction': 0,
          'availableHDs': 1,
          'currentHD': 1
        },
        'songInfo': {
          'name': 'Song3',
          'artist': 'Artist3',
          'genre': 'Genre3',
          'album': 'Album3',
          'year': 2003,
          'duration': 30
        }
      },
      '1095': {
        'radioStation': {
          'frequency': 1095,
          'fraction': 0,
          'availableHDs': 0,
          'currentHD': 0
        },
        'songInfo': {
          'name': 'Song4',
          'artist': 'Artist4',
          'genre': 'Genre4',
          'album': 'Album4',
          'year': 2004,
          'duration': 40
        }
      },
      '1450': {
        'radioStation': {
          'frequency': 1450,
          'fraction': 0,
          'availableHDs': 3,
          'currentHD': 1
        },
        'songInfo': {
          'name': 'Song5',
          'artist': 'Artist5',
          'genre': 'Genre5',
          'album': 'Album5',
          'year': 2005,
          'duration': 50
        }
      }
    },
    'XM': {
    }
  },

  radioDetails: {
      radioStation: {
        frequency: 87,
        fraction: 9,
        availableHDs: 0,
        currentHD: 0
      },
      event: {
        EventName: 'String',
        phoneNumber: 'String',
        price: 14.7,
        eventTime: {
          hours: 18,
          minutes: 22,
          seconds: 46
        },
        location: {
          address: {
            state: 'String',
            zipcode: 'String',
            city: 'String',
            street: 'String'
          },
          gpsCoordinates: 'String'
        }
      },
      advertisement: {
        productName: 'String',
        companyName: 'String',
        phoneNumber: 'String',
        location: {
          address: {
            state: 'String',
            zipcode: 'String',
            city: 'String',
            street: 'String'
          },
          gpsCoordinates: 'String'
        }
      },
      activity: {
        url: 'String',
        actionCode: 5
      },
      songInfo: {
        name: '',
        artist: '',
        genre: '',
        album: '',
        year: 0,
        duration: ''
      },
      location: {
        address: {
          state: 'String',
          zipcode: 'String',
          city: 'String',
          street: 'String'
        },
        gpsCoordinates: 'String'
      }
    },

  /**
   * Timer for emulation of scan activity
   */
  scanTimer: null,

  statusBar: 'FM Radio',

  getRadioControlCapabilities: function() {
    var result = [];
    var capabilities = {
      moduleName: 'Radio Control Module',
      radioEnableAvailable: true,
      radioBandAvailable: true,
      radioFrequencyAvailable: true,
      hdChannelAvailable: true,
      rdsDataAvailable: true,
      availableHDsAvailable: true,
      stateAvailable: true,
      signalStrengthAvailable: true,
      signalChangeThresholdAvailable: true,
      sisDataAvailable: true
    };

    result.push(capabilities);

    return result;
  },

  getRadioButtonCapabilities: function() {
    var result = [
      {
        'name': 'VOLUME_UP',
        'shortPressAvailable': true,
        'longPressAvailable': true,
        'upDownAvailable': false
      },
      {
        'name': 'VOLUME_DOWN',
        'shortPressAvailable': true,
        'longPressAvailable': true,
        'upDownAvailable': false
      },
      {
        'name': 'EJECT',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'SOURCE',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'SHUFFLE',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      },
      {
        'name': 'REPEAT',
        'shortPressAvailable': true,
        'longPressAvailable': false,
        'upDownAvailable': false
      }
    ];
    return result;
  },

  getRadioControlData: function(forceGetAll) {
    var result = {
      radioEnable: this.radioControlStruct.radioEnable
    };

    if (result.radioEnable) {
      result = {
        frequencyInteger: this.radioControlStruct.frequencyInteger,
        frequencyFraction: this.radioControlStruct.frequencyFraction,
        radioEnable: this.radioControlStruct.radioEnable,
        rdsData: {},
        sisData:{
          stationIDNumber:{},
          stationLocation:{}
        },
      };

      if (forceGetAll || this.radioControlCheckboxes.band) {
        result.band = this.radioControlStruct.band;
      }
      if (forceGetAll || this.radioControlCheckboxes.rdsData.PS) {
        result.rdsData.PS = this.radioControlStruct.rdsData.PS;
      }
      if (forceGetAll || this.radioControlCheckboxes.rdsData.RT) {
        result.rdsData.RT = this.radioControlStruct.rdsData.RT;
      }
      if (forceGetAll || this.radioControlCheckboxes.rdsData.CT) {
        result.rdsData.CT = this.radioControlStruct.rdsData.CT;
      }
      if (forceGetAll || this.radioControlCheckboxes.rdsData.PI) {
        result.rdsData.PI = this.radioControlStruct.rdsData.PI;
      }
      if (forceGetAll || this.radioControlCheckboxes.rdsData.PTY) {
        result.rdsData.PTY = parseInt(this.radioControlStruct.rdsData.PTY);
      }
      if (forceGetAll || this.radioControlCheckboxes.rdsData.TP) {
        result.rdsData.TP = this.radioControlStruct.rdsData.TP;
      }
      if (forceGetAll || this.radioControlCheckboxes.rdsData.TA) {
        result.rdsData.TA = this.radioControlStruct.rdsData.TA;
      }
      if (forceGetAll || this.radioControlCheckboxes.rdsData.REG) {
        result.rdsData.REG = this.radioControlStruct.rdsData.REG;
      }

      if (forceGetAll || this.radioControlCheckboxes.availableHDs) {
        if (this.radioControlStruct.availableHDs > 0) {
          result.availableHDs = this.radioControlStruct.availableHDs;
        }
      }
      if (forceGetAll || this.radioControlCheckboxes.hdChannel) {
        if (this.radioControlStruct.hdChannel > 0) {
          result.hdChannel = this.radioControlStruct.hdChannel;
        }
      }
      if (forceGetAll || this.radioControlCheckboxes.signalStrength) {
        result.signalStrength = parseInt(this.radioControlStruct.signalStrength);
      }
      if (forceGetAll || this.radioControlCheckboxes.signalChangeThreshold) {
        result.signalChangeThreshold = parseInt(this.radioControlStruct.signalChangeThreshold);
      }
      if (forceGetAll || this.radioControlCheckboxes.state) {
        result.state = this.radioControlStruct.state;
      }
      if(forceGetAll || this.radioControlCheckboxes.sisData.stationShortName){
        result.sisData.stationShortName=this.radioControlStruct.sisData.stationShortName;
      }
      if(forceGetAll || this.radioControlCheckboxes.sisData.stationLongName){
        result.sisData.stationLongName=this.radioControlStruct.sisData.stationLongName;
      }
      if(forceGetAll || this.radioControlCheckboxes.sisData.stationMessage){
        result.sisData.stationMessage=this.radioControlStruct.sisData.stationMessage;
      }
      if(forceGetAll || this.radioControlCheckboxes.sisData.stationIDNumber.countryCode){
        result.sisData.stationIDNumber.countryCode=parseInt(this.radioControlStruct.sisData.stationIDNumber.countryCode);
      }
      if(forceGetAll || this.radioControlCheckboxes.sisData.stationIDNumber.fccFacilityId){
        result.sisData.stationIDNumber.fccFacilityId=parseInt(this.radioControlStruct.sisData.stationIDNumber.fccFacilityId);
      }
      if(forceGetAll || this.radioControlCheckboxes.sisData.stationLocation.gpsLocation){
        result.sisData.stationLocation.longitudeDegrees=parseFloat(this.radioControlStruct.sisData.stationLocation.longitudeDegrees);
        result.sisData.stationLocation.latitudeDegrees=parseFloat(this.radioControlStruct.sisData.stationLocation.latitudeDegrees);
        if(forceGetAll || this.radioControlCheckboxes.sisData.stationLocation.altitudeMeters){
          result.sisData.stationLocation.altitudeMeters=parseFloat(this.radioControlStruct.sisData.stationLocation.altitudeMeters);
        }
      }

      if (Object.keys(result.rdsData).length == 0) {
        delete result['rdsData'];
      }
      if(Object.keys(result.sisData).length==0){
        delete result['sisData'];
      }
      if(Object.keys(result.sisData.stationIDNumber).length==0){
        var temp=result.sisData;
        delete temp['stationIDNumber'];
      }
      if(Object.keys(result.sisData.stationLocation).length==0){
        var temp=result.sisData;
        delete temp['stationLocation'];
      }
    }

    return result;
  },

  setRadioData: function(data) {
    var properties = [];

    if (data.radioEnable != null) {
      this.setRadioEnable(data.radioEnable);
      properties.push('radioEnable');
    }

    if (this.radioControlStruct.radioEnable) {
      if (data.frequencyInteger != null) {
        this.setFrequencyInteger(data.frequencyInteger);
      }

      if (data.frequencyFraction != null) {
        this.setFrequencyFraction(data.frequencyFraction);
      }

      if (data.availableHDs != null) {
        this.setAvailableHDs(data.availableHDs);
      }

      if (data.hdChannel != null) {
        this.setCurrentHdChannel(data.hdChannel);
      }

      if (data.availableHDs != null || data.hdChannel != null) {
        this.updateRadioStationHdChannelInfo(data);
      }

      if (data.band  != null && data.band != this.radioControlStruct.band) {
        this.setRadioBand(data.band);
        if (data.band == 'FM') {
          this.switchRadioBandFrequency(data.frequencyInteger == null);
        }
        if (data.band == 'AM') {
          this.switchRadioBandFrequency(data.frequencyInteger == null);
        }
        if (data.band == 'XM') {
          this.switchRadioBandFrequency(data.frequencyInteger == null);
        }
      } else {
        this.updateCurrentFrequencyInfo();
      }

      if (data.rdsData != null) {
        this.setRadioRdsData(data.rdsData);
      }
      if(data.sisData!=null){
        this.setRadioSisData(data.sisData);
      }
      if (data.signalStrength != null) {
        this.setSignalStrength(data.signalStrength);
      }

      if (data.signalChangeThreshold != null) {
        this.setSignalChangeThreshold(data.signalChangeThreshold);
      }

      if (data.state != null) {
        this.setRadioState(data.state);
      }

      properties = [];
      for (var key in data) {
        properties.push(key);
      }

      if (properties.indexOf('band') >= 0) {
        if (this.radioControlStruct.band == 'FM') {
          properties.push('frequencyInteger');
          properties.push('frequencyFraction');
        }
        if (this.radioControlStruct.band == 'AM') {
          properties.push('frequencyInteger');
        }
        if (this.radioControlStruct.band == 'XM') {
          properties.push('frequencyInteger');
        }
      }
    }

    var result = this.getRadioControlData(true);
    return SDL.SDLController.filterObjectProperty(result, properties);
  },

  sendRadioChangeNotification: function(properties) {
    var data = this.getRadioControlData(false);
    data = SDL.SDLController.filterObjectProperty(data, properties);
    if (Object.keys(data).length > 0) {
      FFW.RC.onInteriorVehicleDataNotification({moduleType:'RADIO', radioControlData: data});
    }
  },

  getCurrentOptions: function() {
    var result = {
      'band': this.radioControlStruct.band,
      'rdsData': {
        'PS': this.radioControlStruct.rdsData.PS,
        'RT': this.radioControlStruct.rdsData.RT,
        'CT': this.radioControlStruct.rdsData.CT,
        'PI': this.radioControlStruct.rdsData.PI,
        'PTY': this.radioControlStruct.rdsData.PTY,
        'TP': this.radioControlStruct.rdsData.TP,
        'TA': this.radioControlStruct.rdsData.TA,
        'REG': this.radioControlStruct.rdsData.REG
      },
      'sisData':{
        'stationShortName':this.radioControlStruct.sisData.stationShortName,
        'stationMessage':this.radioControlStruct.sisData.stationMessage,
        'stationLongName':this.radioControlStruct.sisData.stationLongName,
        'stationLocation':{
          'longitudeDegrees':this.radioControlStruct.sisData.stationLocation.longitudeDegrees,
          'latitudeDegrees':this.radioControlStruct.sisData.stationLocation.latitudeDegrees,
          'altitudeMeters': this.radioControlStruct.sisData.stationLocation.altitudeMeters
        },
        'stationIDNumber':{
          'countryCode':this.radioControlStruct.sisData.stationIDNumber.countryCode,
          'fccFacilityId':this.radioControlStruct.sisData.stationIDNumber.fccFacilityId
        },
      },
      'availableHDs': this.radioControlStruct.availableHDs,
      'hdChannel': this.radioControlStruct.hdChannel,
      'signalStrength': this.radioControlStruct.signalStrength,
      'signalChangeThreshold': this.radioControlStruct.signalChangeThreshold,
      'state': this.radioControlStruct.state
    };
    return result;
  },

  getStation: function(stationID) {
    if (stationID in this.xmStations) {
      return this.xmStations[stationID];
    }
    return "SiriusXM";
  },

  saveCurrentOptions: function() {
    var result = this.getCurrentOptions();
    this.set('lastOptionParams.band', result.band);
    this.set('lastOptionParams.rdsData', {});
    this.set('lastOptionParams.rdsData.PS', result.rdsData.PS);
    this.set('lastOptionParams.rdsData.RT', result.rdsData.RT);
    this.set('lastOptionParams.rdsData.CT', result.rdsData.CT);
    this.set('lastOptionParams.rdsData.PI', result.rdsData.PI);
    this.set('lastOptionParams.rdsData.PTY', result.rdsData.PTY);
    this.set('lastOptionParams.rdsData.TP', result.rdsData.TP);
    this.set('lastOptionParams.rdsData.TA', result.rdsData.TA);
    this.set('lastOptionParams.rdsData.REG', result.rdsData.REG);
    this.set('lastOptionParams.sisData', {});
    this.set('lastOptionParams.sisData.stationShortName', result.sisData.stationShortName);
    this.set('lastOptionParams.sisData.stationMessage', result.sisData.stationMessage);
    this.set('lastOptionParams.sisData.stationLongName', result.sisData.stationLongName);
    this.set('lastOptionParams.sisData.stationLocation', {});
    this.set('lastOptionParams.sisData.stationLocation.longitudeDegrees', result.sisData.stationLocation.longitudeDegrees);
    this.set('lastOptionParams.sisData.stationLocation.latitudeDegrees', result.sisData.stationLocation.latitudeDegrees);
    this.set('lastOptionParams.sisData.stationLocation.altitudeMeters', result.sisData.stationLocation.altitudeMeters);
    this.set('lastOptionParams.sisData.stationIDNumber', {});
    this.set('lastOptionParams.sisData.stationIDNumber.countryCode', result.sisData.stationIDNumber.countryCode);
    this.set('lastOptionParams.sisData.stationIDNumber.fccFacilityId', result.sisData.stationIDNumber.fccFacilityId);
    this.set('lastOptionParams.availableHDs', result.availableHDs);
    this.set('lastOptionParams.hdChannel', result.hdChannel);
    this.set('lastOptionParams.signalStrength', result.signalStrength);
    this.set('lastOptionParams.signalChangeThreshold', result.signalChangeThreshold);
    this.set('lastOptionParams.state', result.state);
  },

  bandSelect: function(element) {
      SDL.RadioModel.band = element.selection.name;
    },

  saveStationToPreset: function(element) {
    var band = this.radioControlStruct.band;
    element.set('text', this.station);
    this.preset[band][element.preset] = this.station;

    SDL.RadioModel.set('activePreset', element.preset);
  },

  afterDirectTune: function() {
      this.set('station', this.temp);
      this.set('directTuneFinished', false);
      this.set('directTuneKeypressed', false);
      this.set('directTuneKeyItems', []);
  },

  beforeDirectTune: function() {
      this.set('temp', this.station);
  },

  directTune: function() {
      this.toggleProperty('tuneRadio');
      if (this.tuneRadio) {
        this.beforeDirectTune();
      } else {
        this.afterDirectTune();
      }
    },

  updateSongInfo: function(params) {

    if (!params) {

      this.set('radioDetails.songInfo.name', '');
      this.set('radioDetails.songInfo.album', '');
      this.set('radioDetails.songInfo.artist', '');
      this.set('radioDetails.songInfo.genre', '');
      this.set('radioDetails.songInfo.year', '');

    } else {
        if (params.name != null) {
          this.set('radioDetails.songInfo.name', params.name);
        } else {
          this.set('radioDetails.songInfo.name', '');
        }
        if (params.album != null) {
          this.set('radioDetails.songInfo.album', params.album);
        } else {
          this.set('radioDetails.songInfo.album', '');
        }
        if (params.artist != null) {
          this.set('radioDetails.songInfo.artist', params.artist);
        } else {
          this.set('radioDetails.songInfo.artist', '');
        }
        if (params.genre != null) {
          this.set('radioDetails.songInfo.genre', params.genre);
        } else {
          this.set('radioDetails.songInfo.genre', '');
        }
        if (params.year != null) {
          this.set('radioDetails.songInfo.year', params.year);
        } else {
          this.set('radioDetails.songInfo.year', '');
        }
        if (params.duration != null) {
          this.set('radioDetails.songInfo.duration', params.duration);
        } else {
          this.set('radioDetails.songInfo.duration', '');
        }
    }
  },

  updateRadioFrequency: function(params) {
    if (params) {
      if (params.frequency != null) {
        this.setFrequencyInteger(params.frequency);
      }
      if (params.fraction != null) {
        this.setFrequencyFraction(params.fraction);
      }
      if (params.availableHDs != null) {
        this.setAvailableHDs(params.availableHDs);
      }
      if (params.currentHD != null) {
        this.setCurrentHdChannel(params.currentHD);
      }
    }

    if (this.radioControlStruct.band === 'FM') {
      this.set('station',
        this.radioControlStruct.frequencyInteger + '.' +
        this.radioControlStruct.frequencyFraction
      );
    }
    if (this.radioControlStruct.band === 'AM') {
      this.set('station', this.radioControlStruct.frequencyInteger);
    }
    if (this.radioControlStruct.band === 'XM') {
      this.set('station',
        this.getStation(this.radioControlStruct.frequencyInteger)
      );
    }

    this.findStationPresets();
    this.updateHdChannelInfo();
  },

  /**
   * Update HD channel info for current station
   */
  updateHdChannelInfo: function() {
    var band = this.radioControlStruct.band;
    var station = this.changeFrequency(0);
    var stationData = this.stationsData[band][station];

    if (stationData != null && band != 'XM') {
      var availableHDs = stationData.radioStation.availableHDs;
      var hdChannel = stationData.radioStation.currentHD;
      hdChannel = (hdChannel < 1 && availableHDs > 0 ? 1 : hdChannel);
      if (availableHDs != this.radioControlStruct.availableHDs) {
        this.setAvailableHDs(availableHDs);
        this.setCurrentHdChannel(hdChannel);
      } else if (hdChannel != this.radioControlStruct.hdChannel) {
        this.setCurrentHdChannel(hdChannel);
      }
    } else {
      this.setAvailableHDs(0);
      this.setCurrentHdChannel(0);
    }
  },

  updateRadioStationHdChannelInfo: function(params) {
    var band = this.radioControlStruct.band;
    if (band == 'XM') {
      return;
    }
    var station = this.changeFrequency(0);
    var stationData = this.stationsData[band][station];

    var availableHDs = (params.availableHDs != null ?
      params.availableHDs : this.radioControlStruct.availableHDs
    );
    var hdChannel = (params.hdChannel ?
      params.hdChannel : this.radioControlStruct.hdChannel
    );

    if (stationData != null) {
      stationData.radioStation.availableHDs = availableHDs;
      stationData.radioStation.currentHD = hdChannel;
    } else {
      hdChannel = (hdChannel < 1 && availableHDs > 0 ? 1 : hdChannel);
      this.stationsData[band][station] = {
        'radioStation': {
          'frequency': this.radioControlStruct.frequencyInteger,
          'fraction': this.radioControlStruct.frequencyFraction,
          'availableHDs': availableHDs,
          'currentHD': hdChannel
        }
      };
    }
  },

  /**
   * Update current frequency display info
   */
  updateCurrentFrequencyInfo: function() {
    var data = this.changeFrequency(0);
    this.updateRadioFrequency();
    this.checkRadioDetailsSongInfo(data);
  },

  /**
   * Keys for direct tune component
   *
   * @property directTuneKeyItems
   * @return {number}
   */
  directTuneKeys: function() {
      var i, keys = [];
      var band = this.radioControlStruct.band;

      for (i = 0; i < this.directTuneItems[band].length; i++) {
        if (this.directTuneKeyItems.toString() ===
          this.directTuneItems[band][i].slice(0, this.directTuneKeyItems.length).toString()) {
            keys.push(
              Number(this.directTuneItems[band][i][this.directTuneKeyItems.length])
            );

            // Set true if find station
            if (this.directTuneKeyItems.length === this.directTuneItems[band][i].length) {
              this.set('directTuneFinished', true);
            }
        }
      }

      return keys;
    }.property('this.directTuneKeyItems.@each'),

  setStation: function(element) {
      var band = this.radioControlStruct.band;
      var data =  this.preset[band][element.preset];

      if (this.radioControlStruct.band === 'FM') {
        this.setFrequencyInteger(parseInt(data.slice(0, -1)));
        this.setFrequencyFraction(parseInt(data.slice(-1)));
      }
      if (this.radioControlStruct.band === 'AM') {
        this.setFrequencyInteger(parseInt(data));
      }
      if (this.radioControlStruct.band === 'XM') {
        this.setFrequencyInteger(parseInt(
          (function(value){
            var kArray = [], vArray = [];
            for (key in SDL.RadioModel.xmStations) {
              kArray.push(key);
              vArray.push(SDL.RadioModel.xmStations[key]);
            }

            var vIndex = vArray.indexOf(value);

            return kArray[vIndex];
          })(data)
        ));
      }

      this.updateCurrentFrequencyInfo();
      this.sendFrequencyChangeNotification();

      SDL.RadioModel.set('activePreset', element.preset);
    },

  tuneRadioStation: function(element) {
      if (!this.directTuneKeypressed) {
        this.set('directTuneKeypressed', true);
        this.set('station', '');
      }

      var max_range =
        this.radioControlStruct.band == 'FM' ? 108 : 1710;
      if (this.station < max_range && !isNaN(element.preset)) {
        this.set('station', this.station + element.preset);
        this.directTuneKeyItems.pushObject(element.preset);
      }
      if (element.preset == 'Enter') {
        var data = this.station;
        if (this.radioControlStruct.band === 'FM') {
          this.setFrequencyInteger(parseInt(data.slice(0, -1)));
          this.setFrequencyFraction(parseInt(data.slice(-1)));
        } else {
          this.setFrequencyInteger(parseInt(data));
        }

        this.updateCurrentFrequencyInfo();
        this.sendFrequencyChangeNotification();

        this.set('temp', this.station);
        this.set('directTuneFinished', false);
        this.set('directTuneKeypressed', false);
        this.set('directTuneKeyItems', []);
      }
      if (element.preset == 'X') {
        SDL.RadioModel.set('station', SDL.RadioModel.station.slice(0, -1));
        this.set('directTuneFinished', false);
        this.directTuneKeyItems.popObject();

        if (!this.directTuneKeyItems.length) {
          this.set('directTuneKeypressed', false);
          this.set('station', this.temp);
        }
      }

    },

  radioEnableKeyPress: function() {
    if (this.scanState) {
      this.stopScan();
    }

    if (this.directTuneKeyItems.length) {
      this.set('directTuneKeypressed', false);
      this.set('station', this.temp);
    }

    if (this.optionsEnabled) {
      this.toggleOptions();
    }

    SDL.RadioModel.toggleProperty('radioControlStruct.radioEnable');
    var data = this.getRadioControlData(true);
    data = SDL.SDLController.filterObjectProperty(data, 'band');
    if (data.band == 'FM') {
      this.sendRadioChangeNotification(['radioEnable',
                                        'frequencyInteger',
                                        'frequencyFraction',
                                        'band',
                                        'availableHDs',
                                        'hdChannel',
                                        'rdsData.*'
                                        ]);
      
    } else if (data.band == 'AM') {
      this.sendRadioChangeNotification(['radioEnable',
                                        'frequencyInteger',
                                        'band',
                                        'availableHDs',
                                        'hdChannel']);
    } else {
      this.sendRadioChangeNotification(['radioEnable',
                                        'frequencyInteger',
                                        'band',
                                        'signalStrength',
                                        'signalChangeThreshold',
                                        'state']);
    }
  },

  scanKeyPress: function() {
      if (!this.scanState) {
        this.startScan();
      } else {
        this.stopScan();
      }
    },

  startScan: function() {

    this.toggleProperty('scanState');

    if (this.tuneUpTimer === null) {
      this.tuneUpTimer = setInterval(function() {

        if (SDL.RadioModel.tuneUpTimer != null) {
          SDL.RadioModel.tuneUp();
        }

      }, 200
    );
    }

    //FFW.CAN.StartScan();
  },

  /*
   * True parameter means that scan is finished
   *
   * @param {Boolean} timedOut True parameter means that scan is finished
   */
  stopScan: function(timedOut) {

    this.toggleProperty('scanState');

    clearTimeout(this.tuneUpTimer);
    this.tuneUpTimer = null;

    //FFW.CAN.StopScan();
  },

  radioTune: function(params) {
      this.setFrequencyInteger(params.radioStation.frequency);
      this.setFrequencyFraction(params.radioStation.fraction);

      this.set('station', this.radioControlStruct.frequencyInteger + '.' +
        this.radioControlStruct.frequencyFraction
      );

      this.findStationPresets();

      //FFW.VehicleInfo.sendVIResult(SDL.SDLModel.data.resultCode["SUCCESS"], FFW.VehicleInfo.VITuneRadioRequestID, "VehicleInfo.TuneRadio");
      //FFW.CAN.send('frequency_set_' + Number(SDL.RadioModel.station)*1000);
    },

  tuneUpPress: function() {
      this.tuneUp();
    },

  tuneDownPress: function() {
      this.tuneDown();
    },

  changeFrequency(incement) {
    if (this.radioControlStruct.band === 'FM') {
      var data = this.radioControlStruct.frequencyFraction +
                 this.radioControlStruct.frequencyInteger * 10;

      if (incement > 0) {
        data += 2;
      } else if (incement < 0) {
        data -= 2;
      }

      if (data > 1080) {
        data = 875;
      } else if (data < 875) {
        data = 1080
      }

      this.setFrequencyInteger(Math.floor(data / 10));
      this.setFrequencyFraction(data % 10);

      return data;
    }
    if (this.radioControlStruct.band === 'AM') {
      var data = this.radioControlStruct.frequencyInteger;

      if (incement > 0) {
        data += 5;
      } else if (incement < 0) {
        data -= 5;
      }

      if (data > 1705) {
        data = 525;
      } else if (data < 525) {
        data = 1705;
      }

      this.setFrequencyInteger(data);
      this.setFrequencyFraction(0);

      return data;
    }
    if (this.radioControlStruct.band === 'XM') {
      var data = this.radioControlStruct.frequencyInteger;

      if (incement > 0) {
        data += 1;
      } else if (incement < 0) {
        data -= 1;
      }

      if (data > 100) {
        data = 1;
      } else if (data < 1) {
        data = 100;
      }

      this.setFrequencyInteger(data);
      this.setFrequencyFraction(0);

      return data;
    }
  },

  tuneUp: function() {
      if (this.tuneRadio) {
        this.afterDirectTune();
      }
      var data = this.changeFrequency(1);
      this.updateRadioFrequency();
      this.checkRadioDetailsSongInfo(data);
      this.sendFrequencyChangeNotification();
    },

  tuneDown: function() {
      if (this.tuneRadio) {
        this.afterDirectTune();
      }
      var data = this.changeFrequency(-1);
      this.updateRadioFrequency();
      this.checkRadioDetailsSongInfo(data);
      this.sendFrequencyChangeNotification();
    },

  checkRadioDetailsSongInfo: function(data) {
    var band = this.radioControlStruct.band;
    if (this.stationsData[band][data] && this.stationsData[band][data].songInfo) {
      if (this.tuneUpTimer != null) {
        clearInterval(this.tuneUpTimer);
        this.tuneUpTimer = null;

        setTimeout(function() {
              if (SDL.RadioModel.scanState === true &&
                SDL.RadioModel.tuneUpTimer === null) {
                SDL.RadioModel.tuneUpTimer = setInterval(function() {
                    SDL.RadioModel.tuneUp();
                  }, 200
                );
              }
            }, 2000
          );
      }
      this.updateSongInfo(this.stationsData[band][data].songInfo);
    } else {
      this.updateSongInfo();
    }
  },

  checkRadioFrequencyBoundaries: function(data) {
    var resultTable = {
      'success': true,
      'info': ''
    };
    var band = (data.band != null
      ? data.band : this.radioControlStruct.band
    );

    if (band == 'FM') {
      if (data.frequencyInteger == null && data.frequencyFraction == null && data.hdChannel == null) {
        return resultTable;
      }
      if ((data.frequencyInteger != null || data.frequencyFraction != null) && data.hdChannel != null) {
        resultTable.success = false;
        resultTable.info = 'Frequency and HD channel could not be set at once';
        return resultTable;
      }

      if (data.frequencyInteger != null || data.frequencyFraction != null) {
        var frequencyInteger = (data.frequencyInteger != null
        ? data.frequencyInteger : this.radioControlStruct.frequencyInteger
        );
        var frequencyFraction = (data.frequencyFraction != null
          ? data.frequencyFraction : this.radioControlStruct.frequencyFraction
        );
        var frequencyTotal = frequencyInteger * 10 + frequencyFraction;

        resultTable.success = (frequencyTotal >= 875 && frequencyTotal <= 1080);
        resultTable.info = (resultTable.success ?
          '' : 'Invalid radio frequency for desination radio band');

        return resultTable;
      }
      else {
        var channel = (data.hdChannel != null
          ? data.hdChannel : this.radioControlStruct.hdChannel);
        var maxChannels = (data.availableHDs != null
          ? data.availableHDs : this.radioControlStruct.availableHDs);
        resultTable.success = (channel >= 1 && channel <= maxChannels);
        resultTable.info = resultTable.success ?
          '' : 'Selected HD channel is not available';

        return resultTable;
      }
    }

    if (band == 'AM') {
      if (data.frequencyFraction != null) {
        resultTable.success = false;
        resultTable.info = 'Invalid radio frequency for desination radio band';
        return resultTable;
      }
      if (data.frequencyInteger == null && data.hdChannel == null) {
        return resultTable;
      }
      if (data.frequencyInteger != null && data.hdChannel != null) {
        resultTable.success = false;
        resultTable.info = 'Frequency and HD channel could not be set at once';
        return resultTable;
      }

      if (data.frequencyInteger != null) {
        var frequencyTotal = (data.frequencyInteger != null
          ? data.frequencyInteger : this.radioControlStruct.frequencyInteger);
        resultTable.success = (frequencyTotal >= 525 && frequencyTotal <= 1705);
        resultTable.info = (resultTable.success ?
          '' : 'Invalid radio frequency for desination radio band');
        return resultTable;
      }
      else {
        var channel = (data.hdChannel != null
          ? data.hdChannel : this.radioControlStruct.hdChannel);
        var maxChannels = (data.availableHDs != null
          ? data.availableHDs : this.radioControlStruct.availableHDs);
        resultTable.success = (channel >= 1 && channel <= maxChannels);
        resultTable.info = (resultTable.success ?
          '' : 'Selected HD channel is not available');
        return resultTable;
      }
    }

    if (band == 'XM') {
      if (data.frequencyFraction != null) {
        resultTable.success = false;
        resultTable.info = 'Invalid radio frequency for desination radio band';
        return resultTable;
      }
      if (data.hdChannel != null) {
        resultTable.success = false;
        resultTable.info = 'HD channel is not supported for XM radio band';
        return resultTable;
      }

      if (data.frequencyInteger == null) {
        return resultTable;
      }

      resultTable.success =
        (data.frequencyInteger >= 1 && data.frequencyInteger <= 1710);
      resultTable.info = (resultTable.success ?
          '' : 'Invalid radio frequency for desination radio band');

      return resultTable;
    }

    return resultTable;
  },

  sendFrequencyChangeNotification: function() {
    if (this.radioControlStruct.band === 'FM') {
      this.sendRadioChangeNotification(
        ['frequencyInteger',
         'frequencyFraction',
         'availableHDs',
         'hdChannel']
      );
    }
    if (this.radioControlStruct.band === 'AM') {
      this.sendRadioChangeNotification(['frequencyInteger',
                                        'availableHDs',
                                        'hdChannel']);
    }
    if (this.radioControlStruct.band === 'XM') {
      this.sendRadioChangeNotification(['frequencyInteger']);
    }
  },

  findStationPresets: function() {
    var i = 0;
    var band = this.radioControlStruct.band;

    this.set('activePreset', null);

    for (i; i < this.preset[band].length; i++) {
      if (this.station == this.preset[band][i]) {
        this.set('activePreset', i);
        break;
      }
    }
  },

  toggleOptions: function() {
    SDL.RadioModel.toggleProperty('optionsEnabled');
    if (this.optionsEnabled) {
      this.saveCurrentOptions();
    }
  },

  switchRadioBandFrequency: function(useDefault) {
    if (useDefault === true) {
      if (this.radioControlStruct.band === 'FM') {
        this.setFrequencyInteger(87);
        this.setFrequencyFraction(9);
      }
      if (this.radioControlStruct.band === 'AM') {
        this.setFrequencyInteger(540);
      }
      if (this.radioControlStruct.band === 'XM') {
        this.setFrequencyInteger(2);
      }
    }
    this.set('statusBar', this.radioControlStruct.band + ' Radio');
    this.updateCurrentFrequencyInfo();
  },

  sendAudioNotification:function()
  {
    this.setSource();
    var data = SDL.MediaController.getAudioControlData();
    if(data){
    FFW.RC.onInteriorVehicleDataNotification({moduleType:'AUDIO',audioControlData: {'source':data.source}});
  }
  },
  setSource:function()
  {
    SDL.MediaController.lastRadioControlStruct.source='RADIO_TUNER';
  },

  exitPopUp:function (param){
    if(false == param){
      SDL.RadioModel.toggleProperty('optionsEnabled');
    }
  },

  validateStrings: function(){
    var stationShortLength = this.lastOptionParams.sisData.stationShortName.length;
    var stationLongLength = this.lastOptionParams.sisData.stationLongName.length;
    var stationMessageLength = this.lastOptionParams.sisData.stationMessage.length;

    if(stationShortLength<4 || stationShortLength>7){
    popUp = SDL.PopUp.create();
    popUp.appendTo('body').popupActivate(
     'Sis Data is not set.' +
       '"Station short name" must have minlength = 4 and maxlength = 7 characters.',
       this.exitPopUp);
       return false;
    }

    if(stationLongLength>56){
      popUp = SDL.PopUp.create();
      popUp.appendTo('body').popupActivate(
       'Sis Data is not set.' +
        '"Station long name" must have maxlength = 56 characters.',
        this.exitPopUp);
        return false;
    }
    if(stationMessageLength>56){
      popUp = SDL.PopUp.create();
      popUp.appendTo('body').popupActivate(
       'Sis Data is not set.' +
        '"Station message" must have maxlength = 56 characters.',
        this.exitPopUp);
        return false;
    }
    return true;
  },

  sendButtonPress: function() {
    if(!this.validateStrings()){return;}
    var currentData = SDL.deepCopy(SDL.RadioModel.getCurrentOptions());
    var changedData = SDL.deepCopy(SDL.RadioModel.lastOptionParams);
    SDL.RadioModel.setRadioData(changedData);

    SDL.RadioModel.toggleProperty('optionsEnabled');

    var properties = SDL.SDLController.getChangedProperties(changedData, currentData);

    if (properties.indexOf('band') >= 0) {
      if (SDL.RadioModel.tuneRadio) {
        SDL.RadioModel.directTune();
      }
      if (SDL.RadioModel.scanState) {
        SDL.RadioModel.scanKeyPress();
      }
      if (SDL.RadioModel.radioControlStruct.band == 'FM') {
        properties.push('frequencyInteger');
        properties.push('frequencyFraction');
        SDL.RadioModel.switchRadioBandFrequency(true);
      }
      if (SDL.RadioModel.radioControlStruct.band == 'AM') {
        properties.push('frequencyInteger');
        SDL.RadioModel.switchRadioBandFrequency(true);
      }
      if (SDL.RadioModel.radioControlStruct.band == 'XM') {
        properties.push('frequencyInteger');
        SDL.RadioModel.switchRadioBandFrequency(true);
      }
    }

    if(properties.indexOf('stationLocation.longitudeDegrees')>=0){
      properties.push('stationLocation.latitudeDegrees');
    }else if(properties.indexOf('stationLocation.latitudeDegrees')>=0){
      properties.push('stationLocation.longitudeDegrees');
    }
    SDL.RadioModel.sendRadioChangeNotification(properties);
  },

  setFrequencyInteger: function(value) {
    this.set('radioControlStruct.frequencyInteger', value);
  },

  setFrequencyFraction: function(value) {
    this.set('radioControlStruct.frequencyFraction', value);
  },

  setRadioBand: function(value) {
    if (this.bandStruct.indexOf(value) >= 0) {
      this.set('radioControlStruct.band', value);
    }
  },

  setRadioRdsData: function(data) {
    if (data.PS != null) {
      this.set('radioControlStruct.rdsData.PS', data.PS);
    }
    if (data.RT != null) {
      this.set('radioControlStruct.rdsData.RT', data.RT);
    }
    if (data.CT != null) {
      this.set('radioControlStruct.rdsData.CT', data.CT);
    }
    if (data.PI != null) {
      this.set('radioControlStruct.rdsData.PI', data.PI);
    }
    if (data.PTY != null) {
      this.set('radioControlStruct.rdsData.PTY', data.PTY);
    }
    if (data.TP != null) {
      this.set('radioControlStruct.rdsData.TP', data.TP);
    }
    if (data.TA != null) {
      this.set('radioControlStruct.rdsData.TA', data.TA);
    }
    if (data.REG != null) {
      this.set('radioControlStruct.rdsData.REG', data.REG);
    }
  },
  setRadioSisData:function(data){
    if(data.stationShortName!=null){
      this.set('radioControlStruct.sisData.stationShortName',data.stationShortName);
    }
    if(data.stationLongName!=null){
      this.set('radioControlStruct.sisData.stationLongName',data.stationLongName);
    }
    if(data.stationMessage!=null){
      this.set('radioControlStruct.sisData.stationMessage',data.stationMessage);
    }
    if(data.stationIDNumber.countryCode!=null){
      this.set('radioControlStruct.sisData.stationIDNumber.countryCode',data.stationIDNumber.countryCode);
    }
    if(data.stationIDNumber.fccFacilityId!=null){
      this.set('radioControlStruct.sisData.stationIDNumber.fccFacilityId',data.stationIDNumber.fccFacilityId);
    }
    if(data.stationLocation.longitudeDegrees!=null){
      this.set('radioControlStruct.sisData.stationLocation.longitudeDegrees',data.stationLocation.longitudeDegrees);
    }
    if(data.stationLocation.latitudeDegrees!=null){
      this.set('radioControlStruct.sisData.stationLocation.latitudeDegrees',data.stationLocation.latitudeDegrees);
    }
    if(data.stationLocation.altitudeMeters!=null){
      this.set('radioControlStruct.sisData.stationLocation.altitudeMeters',data.stationLocation.altitudeMeters);
    }
  },
  setAvailableHDs: function(value) {
    if (this.hdChannelsStruct.indexOf(value) >= 0) {
      this.set('radioControlStruct.availableHDs', value);
    }
  },

  setCurrentHdChannel: function(value) {
    if (this.hdChannelsStruct.indexOf(value) >= 0
        && value <= this.radioControlStruct.availableHDs) {
      this.set('radioControlStruct.hdChannel', value);
    }
  },

  setSignalStrength: function(value) {
    this.set('radioControlStruct.signalStrength', value);
  },

  setSignalChangeThreshold: function(value) {
    this.set('radioControlStruct.signalChangeThreshold', value);
  },

  setRadioEnable: function(state) {
    this.set('radioControlStruct.radioEnable', state);
  },

  setRadioState: function(state) {
    this.set('radioControlStruct.state', state);
  }

}
);
