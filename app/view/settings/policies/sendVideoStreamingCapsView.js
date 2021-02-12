/*
 * Copyright (c) 2020, Ford Motor Company All rights reserved.
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

SDL.SendVideoStreamingCapsView = Em.ContainerView.create(
    {
      elementId: 'policies_settings_sendVideoStreamingCapsView',
      classNames: 'in_settings_separate_view',
      classNameBindings: [
        'SDL.States.settings.policies.sendVideoStreamingCapabilities.active:active_state:inactive_state'
      ],
      childViews: [
        'backButton',
        'label',
        'videoCapabilitiesCodeEditor',
        'appIDContainerView',
        'sendNotificationButton'
      ],
      backButton: SDL.Button.extend(
        {
          classNames: [
            'backButton'
          ],
          action: 'onState',
          target: 'SDL.SettingsController',
          goToState: 'policies',
          icon: 'images/media/ico_back.png',
          onDown: false
        }
      ),
      label: SDL.Label.extend(
        {
          classNames: 'label',
          content: 'Configure and send VIDEO_STREAMING capabilities'
        }
      ),
      videoCapabilitiesCodeEditor: SDL.CodeEditor.extend(
        {
          elementId: 'videoCapabilitiesCodeEditor',
          codeEditorId: 'videoCapabilitiesCodeEditor'
        }
      ),
      appIDContainerView: Em.ContainerView.create({
        elementId: 'appIDContainerView',
        classNames: 'in_app_id_container_view',
        childViews: [
          'appIDLabel',
          'appIDSelect'
        ],

        appIDLabel: SDL.Label.create({
          classNames: 'label',
          content: 'Application ID'
        }),

        appIDSelect: Em.Select.extend({
          elementId: 'appIDSelect',
          classNames: 'appIDSelectView'
        }),
      }),
      sendNotificationButton: SDL.Button.extend(
        {
          elementId: 'sendNotificationButton',
          classNames: 'sendNotificationButton button',
          text: 'Send notification',
          action: 'saveVideoStreamingCapabilities',
          target: 'SDL.SettingsController',
          onDown: false
        }
      )
    }
  );
