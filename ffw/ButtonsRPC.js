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
/*
 * Reference implementation of Buttons component.
 *
 * Buttons sends to SDLCore press and hold events of soft buttons, presets and
 * some hard keys.
 */
FFW.Buttons = FFW.RPCObserver.create(
  {
    /*
     * access to basic RPC functionality
     */
    client: FFW.RPCClient,
    onButtonSubscriptionSubscribeRequestID: -1,
    onButtonSubscriptionUnsubscribeRequestID: -1,
    componentName: "Buttons",
    /**
     * Contains response codes for request that should be processed but there
     * were some kind of errors Error codes will be injected into response.
     */
    errorResponsePull: {},
    /**
     * @param subscribedButtons
     * @type Object
     * @description Container of subscribed buttons by app ID
     */
    subscribedButtons: {},
    /*
     * connect to RPC bus
     */
    connect: function () {
      this.client.connect(this.componentName, this);
    },

    /**
     * @function sendMessage
     * @param {Em.Object} JSONMessage
     * @desc sending message to SDL
     */
    sendMessage: function (JSONMessage) {
      this.client.send(JSONMessage, this.componentName);
    },

    /**
     * @function subscribeToNotification
     * @param {Em.Object} notification
     * @desc subscribe to notifications from SDL
     */
    subscribeToNotification: function (notification) {
      this.client.subscribeToNotification(notification, this.componentName);
    },

    /*
     * disconnect from RPC bus
     */
    disconnect: function () {
      this.onRPCUnregistered();
      this.client.disconnect();
    },

    /*
     * Client is registered - we can send request starting from this point of
     * time
     */
    onRPCRegistered: function () {
      Em.Logger.log('FFW.Buttons.onRPCRegistered');
      this._super();
    },
    /*
     * Client is unregistered - no more requests
     */
    onRPCUnregistered: function () {
      Em.Logger.log('FFW.Buttons.onRPCUnregistered');
      this._super();
    },
    /*
     * Client disconnected.
     */
    onRPCDisconnected: function () {
    },
    /*
     * when result is received from RPC component this function is called It is
     * the propriate place to check results of reuqest execution Please use
     * previously store reuqestID to determine to which request repsonse belongs
     * to
     */
    onRPCResult: function (response) {
      Em.Logger.log('FFW.Buttons.onRPCResult');
      this._super();
    },
    /*
     * handle RPC erros here
     */
    onRPCError: function (error) {
      Em.Logger.log('FFW.Buttons.onRPCError');
      this._super();
    },
    /*
     * handle RPC notifications here
     */
    onRPCNotification: function (notification) {
      Em.Logger.log('FFW.Buttons.onRPCNotification');
      this._super();
    },
    /*
     * handle RPC requests here
     */
    onRPCRequest: function (request) {
      Em.Logger.log('FFW.Buttons.onRPCRequest');
      this._super();
      switch (request.method) {
        case 'Buttons.ButtonPress': {
          Em.Logger.log('FFW.' + request.method + ' Reqeust');

          if (!FFW.RC.consentedAppCheck(request)) {
            this.sendError(
              SDL.SDLModel.data.resultCode.REJECTED,
              request.id, request.method
            );
            return;
          }

          var result_struct =
            SDL.SDLController.onButtonPressEvent(request.params);
          var result_code = result_struct.resultCode;
          var result_info = (result_struct.resultInfo === "" ?
            null : result_struct.resultInfo);

          if (result_code == SDL.SDLModel.data.resultCode.SUCCESS) {
            this.sendButtonsResult(
              result_code, request.id, request.method
            );
          } else {
            this.sendError(
              result_code, request.id, request.method, result_info
            );
          }
          break;
        }
        case 'Buttons.GetCapabilities': {
          // send response
          var JSONMessage = {
            'jsonrpc': '2.0',
            'id': request.id,
            'result': {
              'capabilities': [...SDL.ButtonCapability, ...SDL.NAVButtonCapability],
              'presetBankCapabilities': {
                'onScreenPresetsAvailable': true
              },
              'code': SDL.SDLModel.data.resultCode.SUCCESS,
              'method': 'Buttons.GetCapabilities'
            }
          };
          this.client.send(JSONMessage);
          break;
        }
        case 'Buttons.SubscribeButton': {
          const { buttonName, appID } = request.params;
          if(buttonName.includes("NAV_")) {
            this.navButtonSubscriptionToggle(appID, buttonName, true);
            const resultCode = SDL.SDLModel.data.resultCode.SUCCESS;
            console.log("Button " + buttonName + " " + resultCode + " resultCode");
            this.sendButtonsResult(resultCode, request.id, request.method);
          } else {
            try {
              const resultCode = this.subscribeButton(appID, buttonName);
              console.log("Button " + buttonName + " " + resultCode + " resultCode");
              this.sendButtonsResult(resultCode, request.id, request.method);
            } catch (e) {
              Em.Logger.log('Do not respond on this request');
            }
          }
          break;
        }
        case 'Buttons.UnsubscribeButton': {
          const { buttonName, appID } = request.params;
          if(buttonName.includes("NAV_")) {
            this.navButtonSubscriptionToggle(appID, buttonName, false);
            const resultCode = SDL.SDLModel.data.resultCode.SUCCESS;
            console.log("Button " + buttonName + " " + resultCode + " resultCode");
            this.sendButtonsResult(resultCode, request.id, request.method);
          } else {
            try {
              if (this.isButtonSubscribed(appID, buttonName)) {
                const code = FFW.RPCHelper.getUnSubscribeButtonCustomResultCode(appID, buttonName);
                console.log("Button " + buttonName + " " + code + " Unsubscribe");
                this.sendButtonsResult(code, request.id, request.method);
                if (FFW.RPCHelper.isSuccessResultCode(code)) {
                  this.unsubscribeButton(appID, buttonName);
                }
              } else {
                console.log("Button " + buttonName + " REJECTED Unsubscribe");
                this.sendError(
                  SDL.SDLModel.data.resultCode.REJECTED,
                  request.id,
                  request.method,
                  'SDL Should not send this request more than once'
                );
              }
            } catch (e) {
              Em.Logger.log('Do not respond on this request');
            }
          }
          break;
        }
      }
    },
    /**
     * @function navButtonSubscriptionToggle
     * @param {Number} appID
     * @param {String} buttonName
     * @param {Boolean} subscribe
     * @description Toggle navigation button subscription by app ID and button name
     */
    navButtonSubscriptionToggle(appID, buttonName, subscribe) {
      const model = SDL.SDLController.getApplicationModel(appID);
      if (!model) {
        return;
      }
      model.setNavButton(buttonName, subscribe);
    },
    /**
     * @function isButtonSubscribed
     * @param {Number} appID
     * @param {String} buttonName
     * @returns {boolean}
     * @description Check is button subscribed
     */
    isButtonSubscribed: function (appID, buttonName) {
      return (appID in this.subscribedButtons)
        && (buttonName in this.subscribedButtons[appID])
        && (this.subscribedButtons[appID][buttonName] === true);
    },
    /**
     * @function subscribeButton
     * @param {Number} appID
     * @param {String} buttonName
     * @returns {number} Subscription result code
     */
    subscribeButton: function (appID, buttonName) {
      try {
        const code = FFW.RPCHelper.getSubscribeButtonCustomResultCode(appID, buttonName);
        if (!FFW.RPCHelper.isSuccessResultCode(code)) {
          return code;
        }
        if (!(appID in this.subscribedButtons)) {
          this.subscribedButtons[appID] = {};
        }
        this.subscribedButtons[appID][buttonName] = true;
        const model = SDL.SDLController.getApplicationModel(appID);
        model.set(buttonName, true);
        return code;
      } catch(e) {
        throw e;
      }
    },
    /**
     * @function unsubscribeButton
     * @param {Number} appID
     * @param {String} buttonName
     * @description Mark the subscribed button as unsubscribed
     */
    unsubscribeButton: function (appID, buttonName) {
      if (this.isButtonSubscribed(appID, buttonName)) {
        this.subscribedButtons[appID][buttonName] = false;
        const model = SDL.SDLController.getApplicationModel(appID);
        model.set(buttonName, false);
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
    sendButtonsResult: function (resultCode, id, method) {
      Em.Logger.log('FFW.' + method + ' Response');
      if (FFW.RPCHelper.isSuccessResultCode(resultCode)) {

        // send repsonse
        var JSONMessage = {
          'jsonrpc': '2.0',
          'id': id,
          'result': {
            'code': resultCode,
            'method': method
          }
        };
        this.sendMessage(JSONMessage);
      } else {
        this.sendError(resultCode, id, method, `${method} Error`);
      }
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
    sendError: function (resultCode, id, method, message) {
      Em.Logger.log('FFW.' + method + ' Response');
      if (resultCode) {

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
    /*
     * Notifies the ButtonsRPC that the web is all set. Should be called twice:
     * when the RPC link is up or failed to connect and all the views are
     * rendered.
     */
    buttonPressed: function (id, type) {
      Em.Logger.log('FFW.Buttons.buttonPressed ' + type);
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'Buttons.OnButtonPress',
        'params': {
          'name': id,
          'mode': type
        }
      };
      this.sendMessage(JSONMessage);
    },
    /*
     * Notifies the ButtonsRPC that the web is all set. Should be called twice:
     * when the RPC link is up or failed to connect and all the views are
     * rendered.
     */
    buttonEvent: function (id, type) {
      Em.Logger.log('FFW.Buttons.OnButtonEvent ' + type);
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'Buttons.OnButtonEvent',
        'params': {
          'name': id,
          'mode': type
        }
      };
      this.sendMessage(JSONMessage);
    },
    /*
     * Notifies the ButtonsRPC that the web is all set. Should be called twice:
     * when the RPC link is up or failed to connect and all the views are
     * rendered.
     */
    buttonPressedCustom: function (name, type, softButtonID, appID) {
      Em.Logger.log('FFW.Buttons.OnButtonPress ' + type);
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'Buttons.OnButtonPress',
        'params': {
          'name': name,
          'mode': type,
          'customButtonID': softButtonID,
          'appID': appID
        }
      };
      this.sendMessage(JSONMessage);
    },
    /*
     * Notifies the ButtonsRPC that the web is all set. Should be called twice:
     * when the RPC link is up or failed to connect and all the views are
     * rendered.
     */
    buttonEventCustom: function (name, type, softButtonID, appID) {
      Em.Logger.log('FFW.Buttons.OnButtonEvent ' + type);
      var JSONMessage = {
        'jsonrpc': '2.0',
        'method': 'Buttons.OnButtonEvent',
        'params': {
          'name': name,
          'mode': type,
          'customButtonID': softButtonID,
          'appID': appID
        }
      };
      this.sendMessage(JSONMessage);
    }
  }
);
