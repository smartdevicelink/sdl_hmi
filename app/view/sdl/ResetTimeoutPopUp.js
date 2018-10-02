/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
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
        'respondButton',
        'timerLabel'
    ],
    active: false,
    isVisible: false,
    contextView: Em.ContainerView.create({
        elementId: 'contextView',
        classNames: 'contextView',
        childViews: [
            'textArea'
        ],
        content: "",
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
    respondButton: SDL.Button.extend({
        classNames: 'respondButton',
        elementId: 'respondButton',
        text: 'Send Respond',
        action: 'sendRespond',
        target: 'parentView',
    }),
    timerLabel: SDL.Label.extend({
        elementId: 'timerLabel',
        classNames: 'timerLabel',
        contentBinding: 'parentView.timerSeconds'
    }),

    player: SDL.AudioPlayer.create(),

    /*
     * play function. plays the file
     */
    play: function (files){
        if (files != '') {
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
    setContext: function(msg){
        if('string' != typeof msg) { return; }
        this.contextView.set('content',msg)
    },

    timerSeconds: 5,
    timer: null,
    defaultTimeout: 5,
    callbacks: [],
    resetTimeoutCallback: null,
    requestIDs: {},
    resetTimeoutRPCs: [],
    
    /*
     * expandКResetTimeoutRPCs function. Extends the set  of RPC with which the 
     * timeout will surrender
     */ 
    expandКResetTimeoutRPCs: function(resetTimeoutRPCs){
        if(null == resetTimeoutRPCs){
            resetTimeoutRPCs = [];
        }
        this.resetTimeoutRPCs = this.resetTimeoutRPCs.concat(resetTimeoutRPCs);
    },

    /*
     * expandCallbacks function. expand callbacks that will be called when the 
     * respondButton button is pressed
     */     
    expandCallbacks: function(callback){
        if('function' != typeof callback) { return; }
        this.callbacks.push(callback);
    },

    /*
     * ActivatePopUp function. activates pop-up
     */     
    ActivatePopUp: function(resetTimeoutCallback){
        this.resetTimeoutCallback = resetTimeoutCallback;
        this.set('isVisible', true);
        this.set('active', true);
        var self = this;
        this.timer = setInterval(
            function() {
                self.set('timerSeconds', self.timerSeconds - 1);
            }, 1000
        ); 
    },

    /*
     * DeactivatePopUp function. deactivates pop-up
     */     
    DeactivatePopUp: function() {
        clearInterval(this.timer);
        this.set('isVisible', false);
        this.set('active', false);
        this.set('timer', null);
        this.set('timerSeconds', this.defaultTimeout);
        this.set('requestIDs', {});
        this.set('callbacks', []);
        this.set('resetTimeoutRPCs', []);
        this.contextView.set('content',"")
        this.player.stopPlaying();
        this.player.clearFiles();
    },

    /* 
     * resetTimeout function. sends to SDL OnResetTimeout
     */     
    resetTimeout: function() {
        this.set('timerSeconds', this.timerSeconds + this.defaultTimeout);
        if('function' == typeof this.resetTimeoutCallback){
            this.resetTimeoutCallback(this.timerSeconds * 1000);
        }
        self = this;
        this.resetTimeoutRPCs.forEach(function (method) {
            requestID = self.requestIDs[method];
            FFW.BasicCommunication.OnResetTimeout(requestID, method, self.timerSeconds);
        });
    },

    /*
     * sendRespond function. call callbacks 
     */     
    sendRespond: function() {
        if(0 == this.callbacks.length){
            return;
        }
        for (index = 0; index < this.callbacks.length; ++index){
            this.callbacks[index]();
        }
        this.DeactivatePopUp();
    },

    /*
     * timerHandler function. deactivates popup after time expires
     */     
    timerHandler: function() {
        if (0 === this.timerSeconds) {
          this.DeactivatePopUp();
        }
    }.observes('this.timerSeconds'),
});
