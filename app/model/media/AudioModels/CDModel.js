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
 * @name SDL.CDModel
 * @desc CD Media data model
 * @category Model
 * @filesource app/model/media/CDModel.js
 * @version 1.0
 */

SDL.CDModel = Em.Object.extend({

  active: true,

  statusBar: 'The Electric Broncos',

  init: function() {
      this._super();
      this.set('player', SDL.MediaCDPlayer.create({data: this.PlayList}));
      this.set('player.name', 'CD');
    },

  PlayList: SDL.Playlist.create({

    selectedIndex: 0,

    items: {
          0: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_1',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          1: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_2',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          2: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_3',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          3: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_4',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          4: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_5',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          5: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_6',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          6: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_7',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          7: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_8',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          8: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_9',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          ),
          9: SDL.PlaylistItem.create({
              nameBinding: 'SDL.locale.label.view_media_track_10',
              album: 'Lazer horse',
              artist: 'The Electric Broncos',
              genreBinding: 'MFT.locale.label.view_media_genre_electronic',
              disk: 'Lazerhorse',
              duration: 123
            }
          )
        },

    homeWidgetIcon: 'images/media/cd-ico-home.png'
  }
),
sendAudioNotification:function()
  {
    this.setSource();
    var data = SDL.RCModulesController.currentAudioModel.getAudioControlData();
    if(data){
    FFW.RC.onInteriorVehicleDataNotification({moduleType:'AUDIO', moduleId: this.UUID, audioControlData:{'source':data.source}});
  }
  },
  setSource:function()
  {
    SDL.RCModulesController.currentAudioModel.lastRadioControlStruct.source='CD';
  },
}
);
