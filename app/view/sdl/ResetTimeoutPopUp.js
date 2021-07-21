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
        if('string' == typeof msg) {
            this.contextView.set('content',msg)
        }
    },
    timeoutSeconds: {},
    timeoutString:'',
    defaultTimeout: 10,
    resetPeriod: 10,
    timer: null,
    callbacks: {},
    resetTimeoutCallback: {},
    requestIDs: {},
    resetTimeoutRPCs: [],
    
    /*
     * extendResetTimeoutRPCs function. Appends to current resetTimeoutRPCs 
     * list a new elements
     */ 
    extendResetTimeoutRPCs: function(resetTimeoutRPCs) {
        if(null == resetTimeoutRPCs){
            resetTimeoutRPCs = [];
        }
        this.resetTimeoutRPCs = this.resetTimeoutRPCs.concat(resetTimeoutRPCs);
    },

    /**
     * extendResetTimeoutCallBack function. expand callbacks that will be called when the 
     * resetTimeout button is pressed
     */
    extendResetTimeoutCallBack: function(resetTimeoutCallback, method) {
        this.resetTimeoutCallback[method] = resetTimeoutCallback;
    },

    /*
     * expandCallbacks function. expand callbacks that will be called when the 
     * respondButton button is pressed
     */     
    expandCallbacks: function(callback, method){
        if('function' == typeof callback) { 
            this.callbacks[method] = callback;
        }
    },

    /**
     * addCheckBox function for add Check box and label to the popUp view
     * for reseting the timeouts and
     * sending the response if RPC more then one 
     */
    addCheckBox: function(length) {
        var list = this.get('contextView.listOfRPC.list.childViews');
        list.clear();
        for(var i=0; i<length;++i){
            list.pushObject(Em.Checkbox.create(
                {
                  elementId: this.resetTimeoutRPCs[i] + 'checkBox',
                  classNames: 'component',
                  checked: true,
                  disabled: this.resetTimeoutRPCs[i] == 'UI.PerformInteraction' ? true : false
                }
              )),

              list.pushObject(SDL.Label.create({
                elementId: this.resetTimeoutRPCs[i] + 'Label',
                classNames: 'component',
                content: this.resetTimeoutRPCs[i]
              }))
        }
    },

    /**
     * setDefaultTimeout function for set default timeout
     */
    setDefaultTimeout: function()
    {
        self = this;
        this.resetTimeoutRPCs.forEach(function (method) {
            if (self.timeoutSeconds[method] == undefined) {
                self.timeoutSeconds[method] = self.defaultTimeout;
            }            
        });
    },

    /*
     * ActivatePopUp function. activates pop-up
     */
    ActivatePopUp: function(){
        length = this.resetTimeoutRPCs.length;
        if(1 < length) {
            this.addCheckBox(length);
        }
        this.set('isVisible', true);
        this.set('active', true);

        this.setDefaultTimeout();            
        this.resetTimeOutLabel();
        clearInterval(this.timer);
        
        const self = this;
        this.timer = setInterval(
            function() {
                    var message = '';
                    self.resetTimeoutRPCs.forEach(function (method) {
                        self.timeoutSeconds[method] = self.timeoutSeconds[method] - 1;
                        message = message + method + ": " + self.timeoutSeconds[method].toString() + '\n';
                     });
                    self.set('timeoutString',message);
            }, 1000
        ); 
    },

    /*
     * DeactivatePopUp function. deactivates pop-up
     */     
    DeactivatePopUp: function() {
        clearInterval(this.timer);
        this.get('contextView.listOfRPC.list.childViews').clear();
        this.get('contextView.listOfRPC.list').removeAllChildren();
        this.contextView.listOfRPC.list.refresh();
        this.set('isVisible', false);
        this.set('active', false);
        this.set('timer', null);
        this.set('timeoutSeconds', {});
        this.set('requestIDs', {});
        this.set('callbacks', {});
        this.set('resetTimeoutCallback', {});
        this.set('resetTimeoutRPCs', []);
        this.contextView.set('content',"")
        this.player.stopPlaying();
        this.player.clearFiles();
    },

    /**
     * resetMoreThanOneTimeout function for reset timeout if RPC more then one
     */
    resetMoreThanOneTimeout: function() {
        const self = this;
        self.resetTimeoutRPCs.forEach(function (method) {
            var element = document.getElementById(method + 'checkBox');
            var checked = element.checked;
            requestID = self.requestIDs[method];
            if(checked) {
                self.timeoutSeconds[method] = method == 'UI.PerformInteraction' ? self.resetPeriod * 2 : self.resetPeriod;
                self.resetTimeOutLabel();
                self.resetTimeoutCallback[method](self.timeoutSeconds[method] * 1000);
                if('UI.PerformInteraction' != method) {
                    FFW.BasicCommunication.OnResetTimeout(requestID, method, self.resetPeriod * 1000);
                }
            }
        });
    },

    /**
     * resetTimeOutLabel function for reset timeout label
     * on the popUp
     */
    resetTimeOutLabel: function() {
        var self = this;
        var message = '';
        self.resetTimeoutRPCs.forEach(function (method) {
            message = message + method + ": " + self.timeoutSeconds[method].toString() + '\n';
        });
        self.set('timeoutString',message);
    },

    /* 
     * resetTimeout function. sends to SDL OnResetTimeout
     */     
    resetTimeout: function() {
        if(this.resetPeriod > 1000) { 
            this.set('resetPeriod', this.defaultTimeout);
            SDL.ControlButtons.set('resetPeriodInput', this.defaultTimeout * 1000);
            document.getElementById('resetPeriodInput').value = this.defaultTimeout * 1000;
            return
        }
        self = SDL.ResetTimeoutPopUp;
        length = self.resetTimeoutRPCs.length;
        function reset(self) {
            self.timeoutSeconds[method] = self.resetPeriod;
            self.resetTimeoutCallback[method](self.timeoutSeconds[method] * 1000);
            requestID = self.requestIDs[method];
            self.resetTimeOutLabel();
            FFW.BasicCommunication.OnResetTimeout(requestID, method, self.resetPeriod * 1000);
        }

        if(1 < length) {
            self.resetMoreThanOneTimeout();
            return;
        }
        method = this.resetTimeoutRPCs[0];
        element = document.getElementById(method + 'checkBox');
        if(null !== element && element.checked){
            reset(self);
            return;
        }
        reset(self);
    },

    /*
     * timerHandler function. deactivate popup after timeout is expired
     */     
    timerHandler: function() {
        length = this.resetTimeoutRPCs.length;

        if(1 < length) {
            timeoutExpired = [];
            this.resetTimeoutRPCs.forEach((method) => {
                const TIME_OUT_EXPIRATION_SECONDS = 1;
                if(TIME_OUT_EXPIRATION_SECONDS == this.timeoutSeconds[method]) {
                    timeoutExpired.push(method);
                }
            });

            // Give higher priority to TTS part of the request
            const tts_speak_index = timeoutExpired.indexOf("TTS.Speak");
            if (tts_speak_index >= 0) {
                timeoutExpired.splice(tts_speak_index, 1);
                timeoutExpired = ["TTS.Speak", ...timeoutExpired];
            }

            timeoutExpired.forEach((method) => {
                this.resetTimeoutRPCs.removeObject(method);

                if(method != 'VR.PerformInteraction' && method != 'UI.PerformInteraction') {
                    this.callbacks[method]();
                    document.getElementById(method + 'checkBox').disabled = true;
                }
            });
            if(0 == this.resetTimeoutRPCs.length) {
                this.DeactivatePopUp();
            }
            return;
        }

        method = this.resetTimeoutRPCs[0];

        if(1 == this.timeoutSeconds[method]) {
            this.callbacks[method]();
            this.DeactivatePopUp();
        }

    }.observes('this.timeoutString'),

    /*
     * vrPerformInteractionDisableCheckBox function. deactivate checkbox for VR.PerformInteraction and activate checkbox for UI.PerformInteraction
     * after VR.PerformInteraction is closed by any reason
     */
    vrPerformInteractionDisableCheckBox: function() {
        length = this.resetTimeoutRPCs.length

        if (1 < length) {
            document.getElementById('VR.PerformInteraction' + 'checkBox').disabled = true;
            document.getElementById('UI.PerformInteraction' + 'checkBox').disabled = false;
        }
    }
});
