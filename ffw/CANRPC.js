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
FFW.CAN = FFW.RPCObserver.create(
  {
    /**
     * If true then CAN is present and ready to communicate with SDL.
     *
     * @type {Boolean}
     */
    isReady: true,
    /**
     * Contains response codes for request that should be processed but there
     * were some kind of errors Error codes will be injected into response.
     */
    errorResponsePull: {},
    /**
     * access to basic RPC functionality
     */
    client: FFW.RPCClient.create(
      {
        componentName: 'CAN',
        url: FLAGS.CAN_WEBSOCKET_URL,
        /*
         * Overriding RPCClient send method
         * stringify object and send via socket connection
         */
        send: function(obj) {
          if (FLAGS.SimpleFunctionality === 1 && FLAGS.CAN) {
            if (this.socket.readyState == this.socket.OPEN) {
              var strJson = JSON.stringify(obj);
              var logTime = new Date();
              console.log(
                logTime.getHours() + ':' + logTime.getMinutes() + ':' +
                logTime.getSeconds() + ':' + logTime.getMilliseconds()
              );
              this.socket.send(strJson);
              if (obj.method) {
                Em.Logger.log('FFW.' + obj.method + ' Notification send.');
              } else if (obj.result) {
                Em.Logger.log('FFW.' + obj.method + ' Response send.');
              } else if (obj.params) {
                Em.Logger.log('FFW.' + obj.method + ' Request send.');
              } else {
                Em.Logger.error('FFW.' + obj.method + ' Error Response send.');
              }
              Em.Logger.log(strJson);
            } else {
              Em.Logger.error(
                'RPCClient: Can\'t send message since socket is not ready'
              );
            }
          }
        }
      }
    ),
    /**
     * connect to RPC bus
     */
    connect: function() {
      this.client.connect("CAN", this);
    },

    sendMessage: function(JSONMessage){
      this.client.send(JSONMessage, "CAN");
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
      Em.Logger.log('FFW.CAN.onRPCRegistered');
      this._super();
    },
    /**
     * Client is unregistered - no more requests
     */
    onRPCUnregistered: function() {
      Em.Logger.log('FFW.CAN.onRPCUnregistered');
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
      Em.Logger.log('FFW.CAN.onRPCResult');
      this._super();
    },
    /**
     * handle RPC erros here
     */
    onRPCError: function(error) {
      Em.Logger.log('FFW.CAN.onRPCError');
      this._super();
    },
    /**
     * handle RPC notifications here
     */
    onRPCNotification: function(notification) {
      Em.Logger.log('FFW.CAN.onRPCNotification');
      switch (notification.method) {
        case 'CAN.OnRadioDetails':
        {
          if ('radioStation' in notification.params) {
            SDL.RadioModel.updateRadioFrequency(
              notification.params.radioStation
            );
          }
          SDL.RadioModel.updateSongInfo(notification.params.songInfo);
          break;
        }
        case 'CAN.StartScan':
        {
          SDL.RadioModel.toggleProperty('scanState');
          break;
        }
        case 'CAN.StopScan':
        {
          SDL.RadioModel.toggleProperty('scanState');
          break;
        }
        default:
        {
          // statements_def
          break;
        }
      }
      this._super();
    },
    /**
     * handle RPC requests here
     *
     * @type {Object} request
     */
    onRPCRequest: function(request) {
      Em.Logger.log('FFW.CAN.onRPCRequest');
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
      if (resultCode != SDL.SDLModel.data.resultCode.SUCCESS) {

        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': id,
          'error': {
            'code': resultCode, // type (enum) from SDL protocol
            'message': message,
            'data': {
              'method': method
            }
          }
        };
        this.sendMessage(JSONMessage);
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
    sendCANResult: function(resultCode, id, method) {
      if (resultCode === SDL.SDLModel.data.resultCode.SUCCESS) {

        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': id,
          'result': {
            'code': resultCode, // type (enum) from SDL protocol
            'method': method
          }
        };
        this.sendMessage(JSONMessage);
      }
    },
    /**
     * Send notification to CAN to tune radio
     *
     */
    TuneUp: function() {

      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'CAN.TuneUp'
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Send notification to CAN to tune radio
     *
     */
    TuneDown: function() {

      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'CAN.TuneDown'
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Send notification to CAN to Start Scan logic
     *
     */
    StartScan: function() {

      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'CAN.StartScan'
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Send notification to CAN to Start Scan logic
     *
     */
    StopScan: function() {

      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'CAN.StopScan'
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Notification about changed on HMI screen radio presets send to SDL
     *
     * @param {Object}
     */
    OnPresetsChanged: function(presets) {

      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'CAN.OnPresetsChanged',
        'params': {
          'customPresets': presets
        }
      };
      this.sendMessage(JSONMessage);
    },
    /**
     * Send response for request GetRadioDetails
     *
     * @param {Object}
     */
    GetRadioDetails: function(request) {

      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'id': id,
        'method': 'CAN.GetRadioDetails',
        'result': {
          'code': resultCode,
          'method': method
        }
      };
      for (var key in SDL.RadioModel.radioDetails) {
        JSONMessage.result[key] = SDL.RadioModel.radioDetails[key];
      }
      this.sendMessage(JSONMessage);
    },
    /**
     * Notification When any of current radio tuner details are changed
     *
     * @param {Object}
     */
    OnRadioDetails: function(data) {

      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'CAN.OnRadioDetails',
        'params': {}
      };
      for (var key in data) {
        JSONMessage.params[key] = data[key];
      }
      this.sendMessage(JSONMessage);
    },
    /**
     * Notification when have action in player
     *
     * @param {Object}
     */
    OnPlayerDetails: function(data) {

      // send response
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'CAN.OnPlayerDetails',
        'params': {}
      };
      for (var key in data) {
        JSONMessage.params[key] = data[key];
      }
      this.sendMessage(JSONMessage);
    },
    /**
     * Notification about changed on HMI screen radio presets send to SDL
     *
     * @param {Object}
     */
    OnPresetsChanged: function(presets) {

      // send repsonse
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'CAN.OnPresetsChanged',
        'params': {
          'customPresets': presets
        }
      };
      this.sendMessage(JSONMessage);
    },
    sendPlayerDetails: function() {
      var player = SDL.RCModulesController.currentAudioModel.get('currentSelectedPlayer');
      if (player) {
        var media = player.data.get('selectedItem'),
          params = {
            'songInfo': {
              'name': media.name,
              'artist': media.artist,
              'genre': media.genre,
              'album': media.album,
              'year': media.year,
              'duration': media.duration,
              'currentTime': player.get('currentTime')
            },
            'model': player.name
          };
        FFW.CAN.OnPlayerDetails(params);
      }
    }
  }
);
