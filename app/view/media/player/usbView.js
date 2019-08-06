/**
 * @name SDL.CDView
 *
 * @desc Media CD module visual representation
 *
 * @category    View
 * @filesource    app/view/media/player/usbView.js
 * @version        2.0
 *
 * @author        Igor Zhavoronkin
 */
SDL.usbView = Em.ContainerView.create(
  {
    elementId: 'media_player_usb_view',
    classNames: 'media_player_view_wrapper',
    classNameBindings: [
      'SDL.States.media.player.usb.active:active_state:inactive_state'
    ],
    /** View components*/
    childViews: [
      'controlls',
      'info',
      'audioModuleUUID',
      'rightmenu'
    ],
    
    info: Em.View.extend(
      {
        elementId: 'media_player_usb_view_info',
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
      contentBinding: 'SDL.RCModulesController.getAudioCurrentID'
    }),
    
    controlls: Em.ContainerView.extend(
      {
        elementId: 'media_player_usb_view_controlls',
        /** View components*/
        childViews: [
          'PrevTrackButton',
          'PlayButton',
          'NextTrackButton'
        ],
        classNames: 'player_controlls',
        PrevTrackButton: SDL.Button.extend(
          {
            elementId: 'media_player_usb_view_controlls_prev_track_button',
            classNames: ['bc-item-big', 'prev-usb'],
            target: 'SDL.RCModulesController.currentAudioModel',
            action: 'prevTrack',
            icon: 'images/media/ico_prew.png'
          }
        ),
        PlayButton: SDL.Button.extend(
          {
            elementId: 'media_player_usb_view_controlls_play_button',
            classNames: ['bc-item-big', 'play-usb'],
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
            elementId: 'media_player_usb_view_controlls_next_track_button',
            classNames: ['bc-item-big', 'next-usb'],
            target: 'SDL.RCModulesController.currentAudioModel',
            action: 'nextTrack',
            icon: 'images/media/ico_next.png'
          }
        )
      }
    ),
    rightmenu: Em.ContainerView.create(
      {
        /** View ID */
        elementId: 'media_usb_rightmenu',
        /** Class Names */
        classNames: ['player-right-stock'],
        classNameBindings: [
          'SDL.States.media.player.usb.options.active:hidden',
          'SDL.States.media.player.usb.browse.active:hidden',
          'SDL.States.media.player.usb.moreinfo.active:hidden'
        ],
        /** View Components*/
        childViews: [
          'repeatButton',
          'shuffleButton',
          'moreInfoButton'
        ],
        repeatButton: SDL.Button.extend(
          {
            elementId: 'media_usb_rightmenu_repeatButton',
            classNames: ['rs-item'],
            onRepeatPressed: function() {
              switch (SDL.RCModulesController.currentAudioModel.usbModel.player.repeat) {
                case 'NONE':
                  return SDL.locale.label.view_media_repeat_no;
                case 'ALL':
                  return SDL.locale.label.view_media_repeat_all;
                case 'ONE':
                  return SDL.locale.label.view_media_repeat_one;
              }
            }.property(
              'SDL.RCModulesController.currentAudioModel.usbModel.player.repeat'
            ),
            textBinding: 'onRepeatPressed',
            target: 'SDL.RCModulesController.currentAudioModel',
            action: 'repeatPress'
          }
        ),
        shuffleButton: SDL.Button.extend(
          {
            elementId: 'media_usb_rightmenu_shuffleButton',
            classNames: ['rs-item'],
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.RCModulesController.currentAudioModel.usbModel.player.shuffle
              );
            }.property(
              'SDL.RCModulesController.currentAudioModel.usbModel.player.shuffle'
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
            elementId: 'media_usb_rightmenu_moreinfoButton',
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
    )
  }
);
