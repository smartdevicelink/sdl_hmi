/**
 * @name SDL.CDView
 *
 * @desc Media CD module visual representation
 *
 * @category    View
 * @source    app/view/media/player/cdView.js
 * @version        1.0
 *
 * @author        Hoang Dinh
 */
SDL.cdView = Em.ContainerView.create(
  {
    elementId: 'media_player_cd_view',
    classNames: 'media_player_view_wrapper',
    classNameBindings: [
      'SDL.States.media.player.cd.active:active_state:inactive_state'
    ],
    /** View components*/
    childViews: [
      'controlls',
      'info',
      'rightmenu'
    ],
    info: Em.View.extend(
      {
        elementId: 'media_player_cd_view_info',
        template: Em.Handlebars.compile(
          '<div class="track-info">' +
            '<div class="total">' +
              '<div class="total-label" {{bindAttr class="SDL.CDModel.player.ejected:inactive_state:active_state"}}>' +
                '{{SDL.MediaController.currentSelectedPlayer.currentTrack}}/{{SDL.MediaController.currentSelectedPlayer.totalTracks}}' +
              '</div>'+
              '<div class="total-label inactive_state" {{bindAttr class="SDL.CDModel.player.ejected:active_state:inactive_state"}}>' +
                'No disk' +
              '</div>'+
            '</div>' +
            '<div class="divider_o"></div>' +
            '<div class="title" {{bindAttr class="SDL.CDModel.player.ejected:inactive_state"}}>' +
              '{{SDL.MediaController.currentSelectedPlayer.data.selectedItem.album}}' +
            '</div>' +
            '<div class="track-number" {{bindAttr class="SDL.CDModel.player.ejected:inactive_state"}}>' +
              '{{SDL.MediaController.currentSelectedPlayer.data.selectedItem.name}}' +
            '</div>' +
            '<div class="time" {{bindAttr class="SDL.CDModel.player.ejected:inactive_state"}}>' +
              '{{SDL.MediaController.currentSelectedPlayer.formatTimeToString}}' +
            '</div>' +
            '<div id="cd_logo" {{bindAttr class="SDL.CDModel.player.ejected:inactive_state"}}></div>' +
          '</div>'
        )
      }
    ),
    controlls: Em.ContainerView.extend(
      {
        elementId: 'media_player_cd_view_controlls',
        classNameBindings: [
          'SDL.CDModel.player.ejected:inactive_state:active_state'
        ],
        /** View components*/
        childViews: [
          'PrevTrackButton',
          'PlayButton',
          'NextTrackButton'
        ],
        classNames: 'player_controlls',
        PrevTrackButton: SDL.Button.extend(
          {
            elementId: 'media_player_cd_view_controlls_prev_track_button',
            classNames: ['bc-item-big', 'prev-cd'],
            target: 'SDL.MediaController',
            action: 'prevTrack',
            icon: 'images/media/ico_prew.png'
          }
        ),
        PlayButton: SDL.Button.extend(
          {
            elementId: 'media_player_cd_view_controlls_play_button',
            classNames: ['bc-item-big', 'play-cd'],
            target: 'SDL.MediaController',
            action: 'playTrack',
            /** Define button template */
            template: Ember.Handlebars.compile(
              '<img class="playIcon hideicon"{{bindAttr class="SDL.MediaController.currentSelectedPlayer.isPlaying:visible"}} src="images/media/ico_pause.png" />' +
              '<img class="playIcon showicon"{{bindAttr class="SDL.MediaController.currentSelectedPlayer.isPlaying:not-visible"}} src="images/media/ico-play.png" />'
            )
          }
        ),
        NextTrackButton: SDL.Button.extend(
          {
            elementId: 'media_player_cd_view_controlls_next_track_button',
            classNames: ['bc-item-big', 'next-cd'],
            target: 'SDL.MediaController',
            action: 'nextTrack',
            icon: 'images/media/ico_next.png'
          }
        )
      }
    ),
    rightmenu: Em.ContainerView.create(
      {
        /** View ID */
        elementId: 'media_cd_rightmenu',
        /** Class Names */
        classNames: ['player-right-stock'],
        classNameBindings: [
          'SDL.States.media.player.cd.moreinfo.active:hidden'
        ],
        /** View Components*/
        childViews: [
          'ejectButton',
          'repeatButton',
          'shuffleButton',
          'moreInfoButton'
        ],
        ejectButton: SDL.Button.extend(
          {
            elementId: 'media_cd_rightmenu_ejectButton',
            classNames: ['rs-item', 'helpmode_box_shadow'],
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.CDModel.player.ejected);
            }.property('SDL.CDModel.player.ejected'),
            iconBinding: 'onIconChange',
            target: 'SDL.MediaController',
            action: 'ejectCD',
            onDown: false,
            textBinding: 'SDL.locale.label.view_media_eject',
            disabledBinding: 'SDL.reversHelpModeBoolean'
          }
        ),
        repeatButton: SDL.Button.extend(
          {
            elementId: 'media_cd_rightmenu_repeatButton',
            classNames: ['rs-item'],
            onRepeatPressed: function() {
              switch (SDL.CDModel.player.repeat) {
                case 'NONE':
                  return SDL.locale.label.view_media_repeat_no;
                case 'ALL':
                  return SDL.locale.label.view_media_repeat_all;
                case 'ONE':
                  return SDL.locale.label.view_media_repeat_one;
              }
            }.property(
              'SDL.CDModel.player.repeat'
            ),
            textBinding: 'onRepeatPressed',
            disabledBinding: 'SDL.CDModel.player.ejected',
            target: 'SDL.MediaController',
            action: 'repeatPress'
          }
        ),
        shuffleButton: SDL.Button.extend(
          {
            elementId: 'media_cd_rightmenu_shuffleButton',
            classNames: ['rs-item'],
            onIconChange: function() {
              return SDL.SDLController.getLedIndicatorImagePath(
                SDL.CDModel.player.shuffle
              );
            }.property(
              'SDL.CDModel.player.shuffle'
            ),
            iconBinding: 'onIconChange',
            textBinding: Ember.Binding.oneWay(
              'SDL.locale.label.view_media_shuffle'
            ),
            target: 'SDL.MediaController',
            action: 'turnOnShuffle',
            onDown: false,
            disabledBinding: 'SDL.CDModel.player.ejected'
          }
        ),
        moreInfoButton: SDL.Button.extend(
          {
            classNameBindings: ['SDL.helpMode:moreinfoButton_help'],
            elementId: 'media_cd_rightmenu_moreinfoButton',
            action: 'turnOnMoreInfo',
            target: 'SDL.MediaController',
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
