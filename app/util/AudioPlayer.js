/*
 * Copyright (c) 2018, Ford Motor Company All rights reserved.
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
 * @name SDL.AudioPlayer
 * @desc HTML5 Audio player
 * @category utils
 * @filesource app/util/AudioPlayer.js
 * @version 1.0
 */

SDL.AudioPlayer = Em.Object.extend({

  /**
   * Array of audio files to play
   */
  playlist: [],

  /**
   * Audio player component
   */
  audio: new Audio(),

  /**
   * Add audio file to the playlist
   */
  addFile: function(path) {
  	if (path != '') {
  		this.playlist.push(path);
  	}  	
  },

  /**
   * Clear audio files playlist
   */
  clearFiles: function() {
  	this.set('playlist', []);
  },

  /**
   * Start playlist playing
   */
  playFiles: function() {
  	if (this.playlist.length == 0) {
  		Em.Logger.log('Playing has finished');
  		this.stopPlaying();
  		return;
  	}
  	if (!this.audio.paused) {
  		Em.Logger.log('Audio is already playing');
  		return;
  	}
  	
  	var path = this.playlist[0];
  	this.playlist.shift();

  	Em.Logger.log('Playing: ' + path);
    var self = this;
    this.audio.onended = function() {
    	self.audio.src = '';
    	self.playFiles();
    }
    this.audio.src = path;
    this.audio.play();
  },

  /**
   * Stop playlist playing
   */
  stopPlaying: function() {  	
  	this.audio.onended = null;
  	if (!this.audio.paused) {
  		Em.Logger.log('Playing has stopped');
  		this.audio.pause();
  		this.audio.src = '';
  	}
  }

});
