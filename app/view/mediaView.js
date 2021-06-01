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
/**
 * @name SDL.MediaView
 * @desc Media module visual representation
 * @category View
 * @filesource app/view/media/MediaView.js
 * @version 1.0
 */
SDL.MediaView = Em.ContainerView.create(
  {
    /** View Id */
    elementId: 'media',
    classNameBindings: 'SDL.States.media.active:active_state:inactive_state',
    /** Media components */
    childViews: [
      'leftMenu',
      'volumeMenu',
      'optionsMenu',
      SDL.playerView,
      'sdlView'
    ],
    /** Left Menu view component */
    leftMenu: SDL.LeftMenuView,
    /** Volume Menu view component */
    volumeMenu: SDL.VolumeMenuView,
    optionsMenu: SDL.audioView,
    sdlView: SDL.sdlView,

    /**
     * @description Callback for display image mode change.
     */
    imageModeChanged: function() { 
      this.leftMenu.radio.setMode(SDL.SDLModel.data.imageMode);
      this.leftMenu.cdButton.setMode(SDL.SDLModel.data.imageMode);
      this.leftMenu.usbButton.setMode(SDL.SDLModel.data.imageMode);
      this.leftMenu.bluetoothButton.setMode(SDL.SDLModel.data.imageMode);
      this.leftMenu.lineInButton.setMode(SDL.SDLModel.data.imageMode);
      this.leftMenu.ipodButton.setMode(SDL.SDLModel.data.imageMode);
      this.leftMenu.sdlButton.setMode(SDL.SDLModel.data.imageMode);

      this.volumeMenu.currentVolume.currentVolume_minus.setMode(SDL.SDLModel.data.imageMode);
      this.volumeMenu.currentVolume.currentVolume_plus.setMode(SDL.SDLModel.data.imageMode);

      this.optionsMenu.preferencesButton.optionsButton.setMode(SDL.SDLModel.data.imageMode);

      this.sdlView.innerMenu.setMode(SDL.SDLModel.data.imageMode);
      this.sdlView.controlls.Controls.PrevTrackButton.setMode(SDL.SDLModel.data.imageMode);
      this.sdlView.controlls.Controls.PlayButton.setMode(SDL.SDLModel.data.imageMode);
      this.sdlView.controlls.Controls.NextTrackButton.setMode(SDL.SDLModel.data.imageMode);

      this.sdlView.controlls.tuneButtons.wrapper.get('childViews').forEach( (view) => {
        view.setMode(SDL.SDLModel.data.imageMode);
      });
    }.observes('SDL.SDLModel.data.imageMode')
  }
);
