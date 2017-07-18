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

    var i,
      frequency = 87,
      fraction = 9;

    this._super();

    for (i = 879; i <= 1079; i++) {
      this.directTuneItems.push(i.toString().split(''));

      if (fraction < 9) {
        fraction++;
      } else {
        frequency++;
        fraction = 0;
      }
    }

    this.updateRadioFrequency();
  },

  /**
   * GetInteriorVehicleDataConsent
   * Consented app for RADIO noduleType
   */
  consentedApp: null,

  optionsEnabled: false,

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

  preset: [
    '87.9',
    '90.9',
    '105.1',
    '98.5',
    '106.3',
    '107.9'
  ],

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

  directTuneItems: [],

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

  getRadioControlData: function() {
    var result = {
        frequencyInteger: this.radioControlStruct.frequencyInteger,
        frequencyFraction: this.radioControlStruct.frequencyFraction,
        band: this.radioControlStruct.band,
        rdsData: {
          PS: this.radioControlStruct.rdsData.PS,
          RT: this.radioControlStruct.rdsData.RT,
          CT: this.radioControlStruct.rdsData.CT,
          PI: this.radioControlStruct.rdsData.PI,
          PTY: parseInt(this.radioControlStruct.rdsData.PTY),
          TP: this.radioControlStruct.rdsData.TP,
          TA: this.radioControlStruct.rdsData.TA,
          REG: this.radioControlStruct.rdsData.REG
        },
        availableHDs: this.radioControlStruct.availableHDs,
        hdChannel: this.radioControlStruct.hdChannel,
        signalStrength: parseInt(this.radioControlStruct.signalStrength),
        signalChangeThreshold: parseInt(
          this.radioControlStruct.signalChangeThreshold
        ),
        radioEnable: this.radioControlStruct.radioEnable,
        state: this.radioControlStruct.state
      };

    return result;
  },

  radioZone: {
      'col': 0,
      'row': 0,
      'level': 0,
      'colspan': 2,
      'rowspan': 1,
      'levelspan': 1
    },

  stationsData: {
      '1001': {
        'radioStation': {
          'frequency': 100,
          'fraction': 1,
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

  setRadioData: function(data) {

    if (data.frequencyInteger) {
      this.set('radioControlStruct.frequencyInteger', data.frequencyInteger);
    }

    if (data.frequencyFraction) {
      this.set('radioControlStruct.frequencyFraction', data.frequencyFraction);
    }

    this.set('station',
      this.radioControlStruct.frequencyInteger + '.' +
      this.radioControlStruct.frequencyFraction
    );

    if (data.band) {
      this.set('radioControlStruct.band', data.band);
    }

    if (data.rdsData) {
      this.set('radioControlStruct.rdsData', data.rdsData);
    }

    if (data.availableHDs) {
      this.set('radioControlStruct.availableHDs', data.availableHDs);
    }

    if (data.hdChannel) {
      this.set('radioControlStruct.hdChannel', data.hdChannel);
    }

    if (data.signalStrength) {
      this.set('radioControlStruct.signalStrength', data.signalStrength);
    }

    if (data.signalChangeThreshold) {
      this.set('radioControlStruct.signalChangeThreshold',
        data.signalChangeThreshold
      );
    }

    if (data.radioEnable) {
      this.set('radioControlStruct.radioEnable', data.radioEnable);
    }

    if (data.state) {
      this.set('radioControlStruct.state', data.state);
    }

    FFW.RC.onInteriorVehicleDataNotification('RADIO', null,
      this.getRadioControlData()
    );
  },

  bandSelect: function(element) {
      SDL.RadioModel.band = element.selection.name;
    },

  saveStationToPreset: function(element) {
      element.set('text', this.station);
      this.preset[element.preset] = this.station;

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
        this.set('radioControlStruct.frequencyInteger', params.frequency);
      }
      if (params.fraction != null) {
        this.set('radioControlStruct.frequencyFraction', params.fraction);
      }
      if (params.availableHDs != null) {
        this.set('radioControlStruct.availableHDs', params.availableHDs);
      }
      if (params.currentHD != null) {
        this.set('radioControlStruct.currentHD', params.currentHD);
      }
    }

    this.set('station',
      this.radioControlStruct.frequencyInteger + '.' +
      this.radioControlStruct.frequencyFraction
    );

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

      for (i = 0; i < this.directTuneItems.length; i++) {
        if (this.directTuneKeyItems.toString() ===
          this.directTuneItems[i].slice(0, this.directTuneKeyItems.length).
                                  toString()) {
          keys.push(
            Number(this.directTuneItems[i][this.directTuneKeyItems.length])
          );

          // Set true if find station
          if (this.directTuneKeyItems.length === this.directTuneItems[i].length) {
            this.set('directTuneFinished', true);
          }
        }
      }

      return keys;
    }.property('this.directTuneKeyItems.@each'),

  setStation: function(element) {
      this.set('station', this.preset[element.preset]);

      SDL.RadioModel.set('activePreset', element.preset);
      SDL.RadioModel.set('radioControlStruct.frequencyInteger',
        parseInt(SDL.RadioModel.station.slice(0, -1))
      );
      SDL.RadioModel.set('radioControlStruct.frequencyFraction',
        parseInt(SDL.RadioModel.station.slice(-1))
      );
      FFW.RC.onInteriorVehicleDataNotification('RADIO', null,
        this.getRadioControlData()
      );

      SDL.SDLModel.resetControl();
    },

  tuneRadioStation: function(element) {
      if (!this.directTuneKeypressed) {
        this.set('directTuneKeypressed', true);
        this.set('station', '');
      }

      if (this.station < 108 && !isNaN(element.preset)) {
        this.set('station', this.station + element.preset);
        this.directTuneKeyItems.pushObject(element.preset);
      }
      if (element.preset == 'Enter' && SDL.RadioModel.station.indexOf('.') < 0) {
        SDL.RadioModel.set('station', SDL.RadioModel.station.slice(0, -1) + '.' +
          SDL.RadioModel.station.slice(-1)
        );
        SDL.RadioModel.set('radioControlStruct.frequencyInteger',
          parseInt(SDL.RadioModel.station.slice(0, -1))
        );
        SDL.RadioModel.set('radioControlStruct.frequencyFraction',
          parseInt(SDL.RadioModel.station.slice(-1))
        );
        this.set('temp', this.station);
        this.set('directTuneFinished', false);
        this.set('directTuneKeypressed', false);
        this.set('directTuneKeyItems', []);

        this.findStationPresets();

        FFW.RC.onInteriorVehicleDataNotification('RADIO', null,
          this.getRadioControlData()
        );

        SDL.SDLModel.resetControl();
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
    SDL.RadioModel.toggleProperty('radioControlStruct.radioEnable');

    if (this.scanState) {
      this.stopScan();
    }

    if (this.directTuneKeyItems.length) {
      this.set('directTuneKeypressed', false);
      this.set('station', this.temp);
    }

    if (this.optionsEnabled) {
      this.toggleProperty('optionsEnabled');
    }

    SDL.SDLModel.resetControl();
  },

  scanKeyPress: function() {
      if (!this.scanState) {
        this.startScan();
      } else {
        this.stopScan();
      }

      SDL.SDLModel.resetControl();
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
      this.radioControlStruct.frequencyInteger = params.radioStation.frequency;
      this.radioControlStruct.frequencyFraction = params.radioStation.fraction;

      this.set('station', this.radioControlStruct.frequencyInteger + '.' +
        this.radioControlStruct.frequencyFraction
      );

      this.findStationPresets();

      //FFW.VehicleInfo.sendVIResult(SDL.SDLModel.data.resultCode["SUCCESS"], FFW.VehicleInfo.VITuneRadioRequestID, "VehicleInfo.TuneRadio");
      //FFW.CAN.send('frequency_set_' + Number(SDL.RadioModel.station)*1000);
    },

  tuneUpPress: function() {
      this.tuneUp();

      SDL.SDLModel.resetControl();
    },

  tuneDownPress: function() {
      this.tuneDown();

      SDL.SDLModel.resetControl();
    },

  tuneUp: function() {
      //FFW.CAN.TuneUp('step_up');
      var data = this.radioControlStruct.frequencyFraction +
        this.radioControlStruct.frequencyInteger * 10;

      data += 2;

      if (data >= 1080) {
        data = 879;
      }

      this.set('radioControlStruct.frequencyInteger', Math.floor(data / 10));
      this.set('radioControlStruct.frequencyFraction', data % 10);

      this.updateRadioFrequency();
      this.checkRadioDetailsSongInfo(data);
    },

  tuneDown: function() {
      //FFW.CAN.TuneDown('step_down');
      var data = this.radioControlStruct.frequencyFraction +
        this.radioControlStruct.frequencyInteger * 10;

      data -= 2;

      if (data <= 877) {
        data = 1079;
      }

      this.set('radioControlStruct.frequencyInteger', Math.floor(data / 10));
      this.set('radioControlStruct.frequencyFraction', data % 10);

      this.updateRadioFrequency();
      this.checkRadioDetailsSongInfo(data);
    },

  checkRadioDetailsSongInfo: function(data) {

    if (this.stationsData[data]) {

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

      this.updateSongInfo(this.stationsData[data].songInfo);

      FFW.RC.onInteriorVehicleDataNotification('RADIO', null,
        this.getRadioControlData()
      );
    } else {

      FFW.RC.onInteriorVehicleDataNotification('RADIO', null,
        this.getRadioControlData()
      );
    }
  },

  findStationPresets: function() {
      var i = 0;

      this.set('activePreset', null);

      for (i; i < this.preset.length; i++) {
        if (this.station == this.preset[i]) {
          this.set('activePreset', i);

          break;
        }
      }
    }
}
);
