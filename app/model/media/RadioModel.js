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

  hdChannelsStruct: [
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
    'XM': []
  },

  presetMetaData: [
      {
        songInfo: {
          genre: 'Pop',
          name: 'BlUE SKY',
          artist: 'THE MAX'
        }
      },
      {
        songInfo: {
          genre: 'Club',
          name: 'JUMP AND DOWN',
          artist: 'THE PROJECT X'
        }
      },
      {
        songInfo: {
          genre: 'Rock',
          name: 'WELCOME HOME',
          artist: 'TODD SULLIVAN'
        }
      },
      {
        songInfo: {
          genre: 'Pop',
          name: 'LETS DANCE',
          artist: 'MICHAEL JOHNSON'
        }
      },
      {
        songInfo: {
          genre: 'Pop Rock',
          name: 'YESTERDAY NIGHT',
          artist: 'JOHN SMITH'
        }
      },
      {
        songInfo: {
          genre: 'Classic',
          name: 'TENTH SYMPHONY',
          artist: 'SPENCER M.'
        }
      }
    ],

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
    availableHDs: 3,
    hdChannel: 1,
    signalStrength: 50,
    signalChangeThreshold: 60,
    radioEnable: false,
    state: 'MULTICAST'
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
    availableHDs: true,
    hdChannel: true,
    signalStrength: true,
    signalChangeThreshold: true,
    state: true
  },

  stationsData: {
    'FM': {
      '895': {
        'radioStation': {
          'frequency': 89,
          'fraction': 5,
          'availableHDs': 0,
          'currentHD': 0
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
          'availableHDs': 0,
          'currentHD': 0
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
          'availableHDs': 0,
          'currentHD': 0
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
          'availableHDs': 0,
          'currentHD': 0
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
          'availableHDs': 0,
          'currentHD': 0
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
          'frequency': 95,
          'fraction': 3,
          'availableHDs': 0,
          'currentHD': 0
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
          'frequency': 100,
          'fraction': 1,
          'availableHDs': 0,
          'currentHD': 0
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
      '1450': {
        'radioStation': {
          'frequency': 105,
          'fraction': 3,
          'availableHDs': 0,
          'currentHD': 0
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
    var result = {
      moduleName: 'Radio Control Module',
      radioEnableAvailable: true,
      radioBandAvailable: true,
      radioFrequencyAvailable: true,
      hdChannelAvailable: true,
      rdsDataAvailable: true,
      availableHDsAvailable: true,
      stateAvailable: true,
      signalStrengthAvailable: true,
      signalChangeThresholdAvailable: true
    };

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
        rdsData: {}
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
        result.availableHDs = this.radioControlStruct.availableHDs;
      }
      if (forceGetAll || this.radioControlCheckboxes.hdChannel) {
        result.hdChannel = this.radioControlStruct.hdChannel;
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

      if (Object.keys(result.rdsData).length == 0) {
        delete result['rdsData'];
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

      if (data.frequencyInteger != null ||
          data.frequencyFraction != null) {
        this.updateRadioFrequency();
      }

      if (data.band  != null) {
        if (data.band != this.radioControlStruct.band) {
          this.setRadioBand(data.band);
          this.switchRadioBandFrequency(data.frequencyInteger == null);
        }
      }

      if (data.rdsData != null) {
        this.setRadioRdsData(data.rdsData);
      }

      if (data.availableHDs != null) {
        this.setAvailableHDs(data.availableHDs);
      }

      if (data.hdChannel != null) {
        this.setCurrentHdChannel(data.hdChannel);
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
        properties.push('frequencyInteger');
        if (data.band == 'FM') {
          properties.push('frequencyFraction');
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
      FFW.RC.onInteriorVehicleDataNotification('RADIO', null, data);
    }
  },

  saveCurrentOptions: function() {
    this.lastOptionParams = {
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
      'availableHDs': this.radioControlStruct.availableHDs,
      'hdChannel': this.radioControlStruct.hdChannel,
      'signalStrength': this.radioControlStruct.signalStrength,
      'signalChangeThreshold': this.radioControlStruct.signalChangeThreshold,
      'state': this.radioControlStruct.state
    };
  },

  restoreCurrentOptions: function() {
    if (!this.lastOptionParams) {
      return;
    }
    this.setRadioData(this.lastOptionParams);
  },

  getChangedProperties: function(lhs, rhs, stack) {
    if (stack == null) {
        stack = '';
    }

    var properties = [];
    for (var key in rhs) {
      if (typeof rhs[key] == 'object') {
        var obj_properties = this.getChangedProperties(
          lhs[key], rhs[key], key + '.'
        );
        properties = properties.concat(obj_properties);
      } else if (lhs[key] != rhs[key]) {
        properties.push(stack + key);
      }
    }

    return properties;
  },

  bandSelect: function(element) {
      SDL.RadioModel.band = element.selection.name;
    },

  saveStationToPreset: function(element) {
      var band = this.radioControlStruct.band;
      element.set('text', this.station);
      this.preset[band][element.preset] = this.station;

      SDL.RadioModel.set('activePreset', element.preset);
      //FFW.RC.OnPresetsChanged(this.preset);
    },

  directTune: function() {
      this.toggleProperty('tuneRadio');
      if (this.tuneRadio) {
        this.set('temp', this.station);
      } else {
        this.set('station', this.temp);
        this.set('directTuneFinished', false);
        this.set('directTuneKeypressed', false);
        this.set('directTuneKeyItems', []);
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
      if (SDL.RadioModel.activeBand == 'fm') {

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
    } else {
      this.set('station', this.radioControlStruct.frequencyInteger);
    }

    this.findStationPresets();
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
      } else {
        this.setFrequencyInteger(parseInt(data));
      }

      data = this.changeFrequency(0);
      this.updateRadioFrequency();
      this.checkRadioDetailsSongInfo(data);
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

        data = this.changeFrequency(0);
        this.updateRadioFrequency();
        this.checkRadioDetailsSongInfo(data);
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
    this.sendRadioChangeNotification(['radioEnable']);
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

      if (data > 1079) {
        data = 879;
      } else if (data < 879) {
        data = 1079
      }

      this.setFrequencyInteger(Math.floor(data / 10));
      this.setFrequencyFraction(data % 10);

      return data;
    } else {
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
  },

  tuneUp: function() {
      var data = this.changeFrequency(1);
      this.updateRadioFrequency();
      this.checkRadioDetailsSongInfo(data);
      this.sendFrequencyChangeNotification();
    },

  tuneDown: function() {
      var data = this.changeFrequency(-1);
      this.updateRadioFrequency();
      this.checkRadioDetailsSongInfo(data);
      this.sendFrequencyChangeNotification();
    },

  checkRadioDetailsSongInfo: function(data) {
    var band = this.radioControlStruct.band;
    if (this.stationsData[band][data]) {
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
    var band = (data.band != null
      ? data.band : this.radioControlStruct.band
    );

    if (band == 'FM') {
      if (data.frequencyInteger == null && data.frequencyFraction == null) {
        return true;
      }

      var frequencyInteger = (data.frequencyInteger != null
        ? data.frequencyInteger : this.radioControlStruct.frequencyInteger
      );
      var frequencyFraction = (data.frequencyFraction != null
        ? data.frequencyFraction : this.radioControlStruct.frequencyFraction
      );
      var frequencyTotal = frequencyInteger * 10 + frequencyFraction;

      return (frequencyTotal >= 875 && frequencyTotal <= 1080);
    }

    if (band == 'AM') {
      if (data.frequencyFraction != null) {
        return false;
      }
      if (data.frequencyInteger == null) {
        return true;
      }

      var frequencyTotal = (data.frequencyInteger != null
        ? data.frequencyInteger : this.radioControlStruct.frequencyInteger
      );

      return (frequencyTotal >= 525 && frequencyTotal <= 1705);
    }

    return true;
  },

  sendFrequencyChangeNotification: function() {
    if (this.radioControlStruct.band === 'FM') {
      this.sendRadioChangeNotification(
        ['frequencyInteger', 'frequencyFraction']
      );
    } else {
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
    } else {
      this.restoreCurrentOptions();
    }
  },

  switchRadioBandFrequency: function(useDefault) {
    if (useDefault === true) {
      if (this.radioControlStruct.band === 'FM') {
        this.setFrequencyInteger(87);
        this.setFrequencyFraction(9);
      } else {
        this.setFrequencyInteger(540);
      }
    }
    this.set('statusBar', this.radioControlStruct.band + ' Radio');

    var data = this.changeFrequency(0);
    this.updateRadioFrequency();
    this.checkRadioDetailsSongInfo(data);
  },

  sendButtonPress: function() {
    var beforeChange = SDL.deepCopy(this.lastOptionParams);
    this.saveCurrentOptions();
    var afterChange = SDL.deepCopy(this.lastOptionParams);
    var properties = this.getChangedProperties(beforeChange, afterChange);

    SDL.RadioModel.toggleProperty('optionsEnabled');
    this.sendRadioChangeNotification(properties);

    if (properties.indexOf('band') >= 0) {
      this.switchRadioBandFrequency(true);
      this.sendFrequencyChangeNotification();
    }
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

  setAvailableHDs: function(value) {
    if (this.hdChannelsStruct.indexOf(value) >= 0) {
      this.set('radioControlStruct.availableHDs', value);
    }
  },

  setCurrentHdChannel: function(value) {
    if (this.hdChannelsStruct.indexOf(value) >= 0) {
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
