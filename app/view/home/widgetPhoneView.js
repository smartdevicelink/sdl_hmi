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
 * @name SDL.WidgetPhoneView
 *
 * @desc Component for Phone Home Widget
 *
 * @category  view
 * @filesource  app/view/home/widgetPhoneView.js
 * @version    1.0
 */

SDL.WidgetPhoneView = Em.ContainerView.extend({

  elementId: 'home_widgetPhone',

  classNameBindings: [
    'SDL.FuncSwitcher.rev::is-disabled'
  ],
  childViews: [
    'rcStatusLabel',
    'phoneStatusImage'
  ],

  phoneStatusImage: SDL.Button.extend({
  	elementId:'phoneStatusImage',
  	templateName:'icon',
  	icon:'./images/home/home_phoneWidget.png'
  }),

  rcStatusLabel: SDL.Label.extend(
			
          {
          	getLabelText: function(){

          		if (SDL.SDLModel.appRCStatus.length == 0){
          			return [];	
          		} 
          		else {
          			var rcStatus = [];
                    for (var key in SDL.SDLModel.appRCStatus){
          				var model = SDL.SDLController.getApplicationModel(+key);
          				var strHeader = model.appName+': ';
          				rcStatus.push(strHeader);
          				if (SDL.SDLModel.appRCStatus[+key].allocated.length > 0){
          					var allocated = SDL.SDLModel.appRCStatus[+key].allocated;
          					var allocatedStr = 'Allocates:';
          					for (var i = 0; i < allocated.length; ++i) {
          						allocatedStr += (i>0)? ', ': ' ';
          						allocatedStr += allocated[i].moduleType.toLowerCase() ;  							 					
          					}
          					rcStatus.push(allocatedStr);
          				}

          				if (SDL.SDLModel.appRCStatus[+key].free.length > 0){
          					var free = SDL.SDLModel.appRCStatus[+key].free;
          					var freeStr = 'Can allocate:';
          					for (var i = 0; i < free.length; ++i) {
          						freeStr += (i>0)? ', ': ' ';
          						freeStr += free[i].moduleType.toLowerCase() ;  							        						
          					}
          					rcStatus.push(freeStr);
          				}
          			}
          			return rcStatus;
          		}
          	}.property('SDL.SDLModel.appRCStatus'),
            elementId: 'rcStatusLabel',
            linesBinding:'getLabelText',
            templateName: 'multiLine'
            //'SDL.SDLModel.appRCStatus'
          }

        )
}
);
