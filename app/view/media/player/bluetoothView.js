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
SDL.bluetoothView = Em.ContainerView.create(
  {
    elementId: 'media_player_bluetooth_view',
    classNames: 'media_player_view_wrapper',
    classNameBindings: [
      'SDL.States.media.player.bluetooth.active:active_state:inactive_state'
    ],
    childViews: [
    	
      'controlls',
      'info',
      'audioModuleUUID',
      'rightmenu'
    ],
    info: Em.View.extend(
      {
        elementId: 'media_player_bluetooth_view_info',
        template: Em.Handlebars.compile(
          '<div class="track-info">' +
          '<div class="total">{{SDL.RCModulesController.currentAudioModel.currentSelectedPlayer.currentTrack}}/{{SDL.RCModulesController.currentAudioModel.currentSelectedPlayer.totalTracks}}</div>' +
          '<div class="divider_o"></div>' +
          '<div class="title">{{SDL.RCModulesController.currentAudioModel.currentSelectedPlayer.data.selectedItem.album}}</div>' +
          '<div class="track-number" >{{SDL.RCModulesController.currentAudioModel.currentSelectedPlayer.data.selectedItem.name}}</div>' +
          '<div class="time">{{SDL.RCModulesController.currentAudioModel.currentSelectedPlayer.formatTimeToString}}</div>' +
          '<div id="usb_logo"></div>' +
          '</div>'
        )
      }
    ),

    audioModuleUUID: SDL.Label.create({
      elementId: 'audioModuleCurrent',
      classNames: 'audioModuleCurrent',
      contentBinding: 'SDL.RCModulesController.currentAudioModuleID'
    }),

    rightmenu: Em.ContainerView.create(
      {
        /** View ID */
        elementId: 'media_bluetooth_rightmenu',
        /** Class Names */
        classNames: ['player-right-stock'],
        classNameBindings: [
          'SDL.States.media.player.bluetooth.options.active:hidden',
          'SDL.States.media.player.bluetooth.browse.active:hidden',
          'SDL.States.media.player.bluetooth.moreinfo.active:hidden'
        ],
        /** View Components*/
        childViews: [
          'repeatButton',
          'shuffleButton',
          'moreInfoButton'
        ],
        repeatButton: SDL.Button.extend(
          {
            elementId: 'media_bluetooth_rightmenu_repeatButton',
            classNames: ['rs-item'],
            onRepeatPressed: function() {
              switch (SDL.RCModulesController.currentAudioModel.bluetoothModel.player.repeat) {
                case 'NONE':
                  return SDL.locale.label.view_media_repeat_no;
                case 'ALL':
                  return SDL.locale.label.view_media_repeat_all;
                case 'ONE':
                  return SDL.locale.label.view_media_repeat_one;
              }
            }.property(
              'SDL.RCModulesController.currentAudioModel.bluetoothModel.player.repeat'
            ),
            textBinding: 'onRepeatPressed',
            target: 'SDL.RCModulesController.currentAudioModel',
            action: 'repeatPress'
          }
        ),
        shuffleButton: SDL.Button.extend(
          {
            elementId: 'media_bluetooth_rightmenu_shuffleButton',
            classNames: ['rs-item'],
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.RCModulesController.currentAudioModel.bluetoothModel.player.shuffle
              );
            }.property(
              'SDL.RCModulesController.currentAudioModel.bluetoothModel.player.shuffle'
            ),
            iconBinding: 'onIconChange',
            textBinding: Ember.Binding.oneWay(
              'SDL.locale.label.view_media_shuffle'
            ),
            target: 'SDL.RCModulesController.currentAudioModel',
            action: 'turnOnShuffle',
            onDown: false
          }
        ),
        
        moreInfoButton: SDL.Button.extend(
          {
            classNameBindings: ['SDL.helpMode:moreinfoButton_help'],
            elementId: 'media_bluetooth_rightmenu_moreinfoButton',
            action: 'turnOnMoreInfo',
            target: 'SDL.RCModulesController.currentAudioModel',
            classNames: ['rs-item'],
            icon: 'images/media/active_arrow.png',
            textBinding: Ember.Binding.oneWay(
              'SDL.locale.label.view_media_moreInfo'
            ),
            onDown: false,
            disabled: true // TODO - add more info view
          }
        )
      }
    ),
    controlls: Em.ContainerView.extend(
      {
        elementId: 'media_player_bluetooth_view_controlls',
        /** View components*/
        childViews: [
          'PrevTrackButton',
          'PlayButton',
          'NextTrackButton'
        ],
        classNames: 'player_controlls',
        PrevTrackButton: SDL.Button.extend(
          {
            elementId: 'media_player_bluetooth_view_controlls_prev_track_button',
            classNames: ['bc-item-big', 'prev-bluetooth'],
            target: 'SDL.RCModulesController.currentAudioModel',
            action: 'prevTrack',
            icon: 'images/media/ico_prew.png'
          }
        ),
        PlayButton: SDL.Button.extend(
          {
            elementId: 'media_player_bluetooth_view_controlls_play_button',
            classNames: ['bc-item-big', 'play-bluetooth'],
            target: 'SDL.RCModulesController.currentAudioModel',
            action: 'playTrack',
            /** Define button template */
            template: Ember.Handlebars.compile(
              '<img class="playIcon hideicon"{{bindAttr class="SDL.RCModulesController.currentAudioModel.currentSelectedPlayer.isPlaying:visible"}} src="images/media/ico_pause.png" />' +
              '<img class="playIcon showicon"{{bindAttr class="SDL.RCModulesController.currentAudioModel.currentSelectedPlayer.isPlaying:not-visible"}} src="images/media/ico-play.png" />'
            )
          }
        ),
        NextTrackButton: SDL.Button.extend(
          {
            elementId: 'media_player_bluetooth_view_controlls_next_track_button',
            classNames: ['bc-item-big', 'next-bluetooth'],
            target: 'SDL.RCModulesController.currentAudioModel',
            action: 'nextTrack',
            icon: 'images/media/ico_next.png'
          }
        )
      }
    ),
}
);
