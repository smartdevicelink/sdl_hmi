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

FFW.ExternalPolicies = Em.Object.create({

    packClient: null,

    packClientURL: 'ws://127.0.0.1:8088',

    unpackClient: null,

    unpackClientURL: 'ws://127.0.0.1:8089',

    packResponseReady: false,

    waitForUnpackResponse: false,

    packMessagesToSend: [],

    unpackMessagesToSend: [],

    sysReqParams: {},

    createPackClient(){
        this.packClient = new WebSocket(this.packClientURL);
        var self = this;
        this.packClient.onopen = function(evt) {
            self.onWSOpen(evt, this);
            self.onPackMessageSend();
        };
        this.packClient.onclose = function(evt) {
            self.onWSClose(evt);
            self.packClient = null;
            setTimeout(() => { self.createPackClient(); }, 5000);
        };
        this.packClient.onmessage = function(evt) {
            self.onPackMessage(evt);
        };
        this.packClient.onerror = function(evt) {
            self.onWSError(evt);
        };
    },

    createUnpackClient(){
        this.unpackClient = new WebSocket(this.unpackClientURL);
        var self = this;
        this.unpackClient.onopen = function(evt) {
            self.onWSOpen(evt, this);
            self.onUnpackMessageSend();
        };
        this.unpackClient.onclose = function(evt) {
            self.onWSClose(evt);
            self.unpackClient = null;
            setTimeout(() => { self.createUnpackClient(); }, 5000);
        };
        this.unpackClient.onmessage = function(evt) {
            self.onUnpackMessage(evt);
        };
        this.unpackClient.onerror = function(evt) {
            self.onWSError(evt);
        };
    },

    connect: function() {
        this.createPackClient();
        this.createUnpackClient();
    },

    onWSOpen: function(evt, socket) {
        Em.Logger.log('ExternalPolicies onWSOpen');
    },

    onWSClose: function(evt) {
        Em.Logger.log('ExternalPolicies onWSClose');
    },

    onWSError: function(evt) {
        Em.Logger.log('ExternalPolicies onWSError');
    },

    pack: function(params) {
        Em.Logger.log("Pack")
        this.sysReqParams = params;
        this.packMessagesToSend.push(this.sysReqParams);
        this.onPackMessageSend();
    },

    onPackMessageSend: function() {
        if (this.packMessagesToSend.length == 0) {
            return;
        }

        const str_message = JSON.stringify(this.packMessagesToSend[0]);

        if (this.packClient && this.packClient.readyState == this.packClient.OPEN){
            this.packClient.send(str_message);
            this.packMessagesToSend.pop();
            this.onPackMessageSend();
        }
    },

    unpack: function(params) {
        Em.Logger.log("Unpack")
        this.unpackMessagesToSend.push(params);
        this.onUnpackMessageSend();
    },

    onUnpackMessageSend: function() {
        if (this.unpackMessagesToSend.length == 0) {
            return;
        }

        const str_message = JSON.stringify(this.unpackMessagesToSend[0]);

        if (this.unpackClient && this.unpackClient.readyState == this.unpackClient.OPEN){
            this.unpackClient.send(str_message);
            this.unpackMessagesToSend.pop();
            this.onUnpackMessageSend();
        }
    },

    onPackMessage: function(evt) {
        Em.Logger.log('ExternalPolicies onWSMessage ' + evt.data);
        this.packResponseReady = true;
        SDL.SettingsController.policyUpdateRetry(this.sysReqParams);

        this.sysReqParams = {};
    },

    onUnpackMessage: function(evt) {
        Em.Logger.log('ExternalPolicies onWSMessage ' + evt.data);
        this.unpackResponseReady = true;

        let jsonData;
        try {
            jsonData = JSON.parse(evt.data)
        }
        catch {
            Em.Logger.log('ExternalPolicies: failed to parse JSON content from WSMessage');
            return;
        }

        if(jsonData.requestType == 'PROPRIETARY'){
            FFW.BasicCommunication.OnReceivedPolicyUpdate(jsonData.data);
        }
    },

});
