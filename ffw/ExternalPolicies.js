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

    sysReqParams: {},

    createPackClient(){
        this.packClient = new WebSocket(this.packClientURL);
        var self = this;
        this.packClient.onopen = function(evt) {
            self.onWSOpen(evt, this);
        };
        this.packClient.onclose = function(evt) {
            self.onWSClose(evt);
            this.packClient = null;
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
        };
        this.unpackClient.onclose = function(evt) {
            self.onWSClose(evt);
            this.unpackClient = null;
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

    onPackMessage: function(evt) {
        Em.Logger.log('ExternalPolicies onWSMessage ' + evt.data);
        this.packResponseReady = true;
        SDL.SettingsController.policyUpdateRetry(this.sysReqParams);

        this.sysReqParams = {};
    },
    onUnpackMessage: function(evt) {
        Em.Logger.log('ExternalPolicies onWSMessage ' + evt.data);
        this.unpackResponseReady = true;

        FFW.BasicCommunication.OnReceivedPolicyUpdate(evt.data);
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
        this.packClient.send(JSON.stringify(this.sysReqParams));     
    },
    unpack: function(params) {
        Em.Logger.log("Unpack")
        this.unpackClient.send(JSON.stringify(params));
    }

});
