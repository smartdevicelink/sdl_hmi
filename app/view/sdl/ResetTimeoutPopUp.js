/*
 * Copyright (c) 2021, Ford Motor Company All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *  · Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *  · Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *  · Neither the name of the Ford Motor Company nor the names of its
 * contributors may be used to endorse or promote products derived from this
 * software without specific prior written permission.
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

SDL.ResetTimeoutPopUp = Em.ContainerView.create({
    elementId: 'ResetTimeoutPopUp',
    classNames: 'ResetTimeoutPopUp',

    childViews: [
        'contextView',
        'resetTimeoutButton',
        'timerLabel'
    ],
    active: false,
    isVisible: false,
    contextView: Em.ContainerView.create({
        elementId: 'contextView',
        classNames: 'contextView',
        childViews: [
            'textArea',
            'listOfRPC'
        ],
        content: "",
        listOfRPC: SDL.List.extend({

            elementId: 'select_items',
            disableScrollbar: true,
            value: true,
            items: new Array()
        }
        ),
        textArea: Ember.TextArea.extend({
            elementId: 'textArea',
            classNames: 'textArea',
            valueBinding: 'parentView.content'
        }),
    }),
    resetTimeoutButton: SDL.Button.extend({
        classNames: 'resetTimeoutButton',
        elementId: 'resetTimeoutButton',
        text: 'Reset Timeout',
        action: 'resetTimeout',
        target: 'parentView',
    }),
    timerLabel: SDL.Label.extend({
        elementId: 'timerLabel',
        classNames: 'timerLabel',
        contentBinding: 'parentView.timeoutString'
    }),

    player: SDL.AudioPlayer.create(),

    /**
     * @function addRpc
     * @param {Object} req
     * @param {Function} callback
     * @param {Function} resetTimeoutCallback
     * @param {number} timeoutSeconds
     * @description Function to add rpc for processing
     */
    addRpc(req, callback, resetTimeoutCallback, timeoutSeconds) {
        const MS_TO_SEC = 1000;
        this.resetTimeoutRPCs[req.id] = {
            method: req.method,
            timeoutSeconds: timeoutSeconds ? timeoutSeconds / MS_TO_SEC : this.defaultTimeout,
            callback,
            resetTimeoutCallback
        };
    },

    /**
     * @function getTimeoutForRpc
     * @param {sting} rpcName
     * @returns Current timeout value for requested rpc
     */
    getTimeoutForRpc(rpcName) {
        for (const [key, value] of Object.entries(this.resetTimeoutRPCs)) {
            const method = value.method.split('.')[1];
            if (method.toLowerCase() === rpcName.toLowerCase().replaceAll('_', '')) return value.timeoutSeconds * 1000
        }
        return undefined;
    },

    /**
     * @function includes
     * @param {string} rpcName
     * @returns true if rpc is in process
     */
    includes(rpcName) {
        for (let key in this.resetTimeoutRPCs) {
            if (this.resetTimeoutRPCs[key].method === rpcName) return true;
        }
        return false;
    },

    /**
     * @function stopRpcProcessing
     * @param {string} rpcName
     * @param {Boolean} withinCallback
     * @description Stop rpc timeout handling by rpc name and
     * call callback if second parameter is true
     */
    stopRpcProcessing(rpcName, withinCallback = false) {
        for (const [key, value] of Object.entries(this.resetTimeoutRPCs)) {
            if (value.method === rpcName) {
                if (withinCallback) value.callback();
                delete this.resetTimeoutRPCs[key];
                break;
            }
        }
        if (this.getPRCsLength() === 0) {
            this.DeactivatePopUp();
        } else {
            this.addCheckBox();
        }
    },

    /**
     * @function getPRCsLength
     * @returns length of RPC's
     */
    getPRCsLength() {
        return Object.keys(this.resetTimeoutRPCs).length;
    },

    /*
     * play function. plays the file
     */
    play: function (files) {
        if (files !== '') {
            var files_to_play = files.split('\n');
            for (var i = 0; i < files_to_play.length; ++i) {
                this.player.addFile(files_to_play[i]);
            }
            this.player.playFiles();
        }
    },

    /*
     * setContext function. sets the text displayed in the pop-up
     */
    setContext: function (msg) {
        if ('string' === typeof msg) {
            this.contextView.set('content', msg)
        }
    },
    timeoutSeconds: {},
    timeoutString: '',
    defaultTimeout: 10,
    resetPeriod: 10,
    timer: null,
    resetTimeoutRPCs: {},

    /**
     * addCheckBox function for add Check box and label to the popUp view
     * for reseting the timeouts and
     * sending the response if RPC more then one
     */
    addCheckBox: function () {
        this.contextView.listOfRPC.list.removeAllChildren();
        this.contextView.listOfRPC.list.refresh();
        var list = this.get('contextView.listOfRPC.list.childViews');
        list.clear();
        for (let key in this.resetTimeoutRPCs) {
            list.pushObject(Em.Checkbox.create(
                {
                    elementId: this.resetTimeoutRPCs[key].method + 'checkBox',
                    classNames: 'component',
                    checked: true,
                    disabled: this.resetTimeoutRPCs[key].method === 'UI.PerformInteraction' ? true : false
                }
            )),

                list.pushObject(SDL.Label.create({
                    elementId: this.resetTimeoutRPCs[key].method + 'Label',
                    classNames: 'component',
                    content: this.resetTimeoutRPCs[key].method
                }))
        }
    },

    /*
     * ActivatePopUp function. activates pop-up
     */
    ActivatePopUp: function () {
        length = this.getPRCsLength();
        if (1 < length) {
            this.addCheckBox();
        }
        this.set('isVisible', true);
        this.set('active', true);
        this.resetTimeOutLabel();
        clearInterval(this.timer);
        this.timer = setInterval(
            () => {
                let message = '';
                for (const [key, value] of Object.entries(this.resetTimeoutRPCs)) {
                    value.timeoutSeconds -= 1;
                    message = message + `${value.method} : ${value.timeoutSeconds}\n`
                }
                this.set('timeoutString', message);
            }
            , 1000
        );
    },

    /*
     * DeactivatePopUp function. deactivates pop-up
     */
    DeactivatePopUp: function () {
        clearInterval(this.timer);
        this.contextView.listOfRPC.list.removeAllChildren();
        this.contextView.listOfRPC.list.refresh();
        this.set('isVisible', false);
        this.set('active', false);
        this.set('timer', null);
        this.set('timeoutSeconds', {});
        this.set('resetTimeoutRPCs', {});
        this.contextView.set('content', "")
        this.player.stopPlaying();
        this.player.clearFiles();
    },

    /**
     * resetMoreThanOneTimeout function for reset timeout if RPC more then one
     */
    resetMoreThanOneTimeout: function () {
        for (let [requestID, value] of Object.entries(this.resetTimeoutRPCs)) {
            var element = document.getElementById(value.method + 'checkBox');
            var checked = element.checked;
            if (checked) {
                value.timeoutSeconds = value.method === 'UI.PerformInteraction' ? this.resetPeriod * 2 : this.resetPeriod;
                this.resetTimeOutLabel();
                if (value.resetTimeoutCallback !== undefined) {
                    value.resetTimeoutCallback(value.timeoutSeconds * 1000);
                }
                if ('UI.PerformInteraction' != value.method) {
                    FFW.BasicCommunication.OnResetTimeout(requestID, value.method, this.resetPeriod * 1000);
                }
            }
        }
    },

    /**
     * resetTimeOutLabel function for reset timeout label
     * on the popUp
     */
    resetTimeOutLabel: function () {
        let message = '';
        for (let key in this.resetTimeoutRPCs) {
            message = `${message} ${this.resetTimeoutRPCs[key].method} : ${this.resetTimeoutRPCs[key].timeoutSeconds}\n`
        }
        this.set('timeoutString', message);
    },

    /*
     * resetTimeout function. sends to SDL OnResetTimeout
     */
    resetTimeout: function () {
        if (this.resetPeriod > 1000) {
            this.set('resetPeriod', this.defaultTimeout);
            SDL.ControlButtons.set('resetPeriodInput', this.defaultTimeout * 1000);
            document.getElementById('resetPeriodInput').value = this.defaultTimeout * 1000;
            return
        }

        reset = () => {
            const requestID = Object.keys(this.resetTimeoutRPCs)[0];
            this.resetTimeoutRPCs[requestID].timeoutSeconds = this.resetPeriod;
            if (this.resetTimeoutRPCs[requestID].resetTimeoutCallback !== undefined) {
                this.resetTimeoutRPCs[requestID].resetTimeoutCallback(this.resetTimeoutRPCs[requestID].timeoutSeconds * 1000);
            }
            this.resetTimeOutLabel();
            FFW.BasicCommunication.OnResetTimeout(requestID, this.resetTimeoutRPCs[requestID].method, this.resetPeriod * 1000);
        }

        const length = this.getPRCsLength();
        if (1 < length) {
            this.resetMoreThanOneTimeout();
            return;
        }
        reset();
    },

    /*
     * timerHandler function. deactivate popup after timeout is expired
     */
    timerHandler: function () {
        let length = this.getPRCsLength();
        if (1 < length) {
            timeoutExpired = [];
            for (let [key, value] of Object.entries(this.resetTimeoutRPCs)) {
                const TIME_OUT_EXPIRATION_SECONDS = 1;
                if (TIME_OUT_EXPIRATION_SECONDS === value.timeoutSeconds) {
                    // Give higher priority to TTS part of the request
                    const tts_speak_index = value.method.indexOf('TTS.Speak');
                    if (tts_speak_index >= 0) {
                        timeoutExpired.unshift(key);
                        continue;
                    }
                    timeoutExpired.push(key);
                }
            }
            timeoutExpired.forEach((requestID, index) => {
                console.log('Id' + index, requestID);
                if (this.resetTimeoutRPCs[requestID].method != 'VR.PerformInteraction'
                    && this.resetTimeoutRPCs[requestID].method != 'UI.PerformInteraction') {
                    this.resetTimeoutRPCs[requestID].callback();
                    document.getElementById(this.resetTimeoutRPCs[requestID].method + 'checkBox').disabled = true;
                }
                delete this.resetTimeoutRPCs[requestID];
            });
            length = this.getPRCsLength();
            if (length === 0) {
                this.DeactivatePopUp();
            }
            return;
        }
        let requestID = Object.keys(this.resetTimeoutRPCs)[0];
        if (this.resetTimeoutRPCs[requestID].timeoutSeconds === 1) {
            this.resetTimeoutRPCs[requestID].callback();
            this.DeactivatePopUp();
        }

    }.observes('this.timeoutString'),

    /*
     * vrPerformInteractionDisableCheckBox function. deactivate checkbox for VR.PerformInteraction and activate checkbox for UI.PerformInteraction
     * after VR.PerformInteraction is closed by any reason
     */
    vrPerformInteractionDisableCheckBox: function () {
        length = this.resetTimeoutRPCs.length

        if (1 < length) {
            document.getElementById('VR.PerformInteraction' + 'checkBox').disabled = true;
            document.getElementById('UI.PerformInteraction' + 'checkBox').disabled = false;
        }
    }
});
