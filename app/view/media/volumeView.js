/*
 * Copyright (c) 2017, Ford Motor Company All rights reserved.
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
 * @name SDL.LeftMenuView
 * @desc Media Left Menu module visual representation
 * @category View
 * @filesource app/view/media/SiriusView.js
 * @version 1.0
 */

SDL.VolumeMenuView = Em.ContainerView.extend(
  {
    /** View ID */
    elementId: 'media_volumemenu',
    /** View components */
    childViews: [
      'volume_label',
      'currentVolume'
    ],
    volume_label: SDL.Label.extend(
      {
        elementId: 'volume_label',
        content: 'Volume'
      }
    ),
    currentVolume: Em.ContainerView.extend(
      {
        elementId: 'currentVolume_container',
        classNames: 'calc_container',
        childViews: [
          'currentVolume_label',
          'currentVolume_minus',
          'currentVolume_plus'
        ],
        currentVolume_minus: SDL.Button.extend(
          {
            elementId: 'currentVolume_minus',
            classNames: 'minus',
            templateName: 'icon',
            icon: 'images/climate/minus_ico.png',
            onDown: false,
            model: 'currentAudioModel',
            method: 'volumeDownPress',
            target: 'SDL.RCModulesController',
            action: 'action'
          }
        ),
        currentVolume_label: SDL.Label.extend(
          {
            elementId: 'currentVolume_label',
            getVolume: function() {
              return SDL.RCModulesController.currentAudioModel.currentVolume.toString() + '%';
            }.property(
              'SDL.RCModulesController.currentAudioModel.currentVolume'
            ),
            contentBinding: 'getVolume'
          }
        ),
        currentVolume_plus: SDL.Button.extend(
          {
            elementId: 'currentVolume_plus',
            classNames: 'plus',
            templateName: 'icon',
            icon: 'images/climate/plus_ico.png',
            onDown: false,
            model: 'currentAudioModel',
            method: 'volumeUpPress',
            target: 'SDL.RCModulesController',
            action: 'action'
          }
        )
      }
    ),
  }
);
