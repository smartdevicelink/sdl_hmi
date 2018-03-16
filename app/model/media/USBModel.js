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
 * @name SDL.USBModel
 * @desc USB Media data model
 * @category Model
 * @source app/model/media/USBModel.js
 * @version 1.0
 */

SDL.USBModel = Em.Object.create({
    active: false,
    optionsEnabled:false,
    statusBar: 'Luk Marko',
    usbControl:{
      keepContext: false
    },
boolStruct: [
    true,
    false
  ],
  equalizerSettings: {
        channelId:10,
        channelName:'Station'
      },
    /** USB Player*/
    init: function() {
      this._super();
      this.set('player', SDL.MediaCDPlayer.create({data: this.PlayList}));
      this.set('player.name', 'USB');
    },
    toggleOptions:function(){
      SDL.USBModel.toggleProperty('optionsEnabled');
    },
    sendAudioNotification:function()
  {
    this.setSource();
    var data = SDL.MediaController.getAudioControlData();
    if(data){
    FFW.RC.onInteriorVehicleDataNotification('AUDIO',{audioControlData: data});
  }
  },
  setSource:function()
  {
    SDL.MediaController.radioControlStruct.source='USB';
  },
    // sendButton:function(){
    //   var properties = {'source':'USB',
    //   'equalizerSettings':{
    //     'channelId':this.equalizerSettings.channelId,
    //     'channelName':this.equalizerSettings.channelName
    //   }, 
    //   'keepContext':this.usbControl.keepContext,
    //   'volume':SDL.MediaController.currentVolume
    // };
    //   FFW.RC.onInteriorVehicleDataNotification('AUDIO',properties);
    // },




    PlayList: SDL.Playlist.create({
        selectedIndex: 0,
        items: {
          0: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_1',
              album: 'Color of the Fall',
              artist: 'Luk Marko',
              genre: 'Rock',
              disk: 'Fall',
              duration: 123
            }
          ),
          1: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_2',
              album: 'Color of the Fall',
              artist: 'Luk Marko',
              genre: 'Rock',
              disk: 'Fall',
              duration: 123
            }
          ),
          2: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_3',
              album: 'Color of the Fall',
              artist: 'Luk Marko',
              genre: 'Rock',
              disk: 'Fall',
              duration: 123
            }
          ),
          3: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_4',
              album: 'Color of the Fall',
              artist: 'Luk Marko',
              genre: 'Rock',
              disk: 'Fall',
              duration: 123
            }
          ),
          4: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_5',
              album: 'Color of the Fall',
              artist: 'Luk Marko',
              genre: 'Rock',
              disk: 'Fall',
              duration: 123
            }
          ),
          5: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_6',
              album: 'Color of the Fall',
              artist: 'Luk Marko',
              genre: 'Rock',
              disk: 'Fall',
              duration: 123
            }
          )
        },
        homeWidgetIcon: 'images/media/usb-h-ico.png'
      }
    )
  }
);
