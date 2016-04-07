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
 * @name SDL.NavigationController
 * @desc Navigation module logic
 * @category Controller
 * @filesource app/controller/NavigationController.js
 * @version 1.0
 */

SDL.NavigationController = Em.Object.create({

  /**
   * Model binding
   */
  modelBinding: 'SDL.NavigationModel',

  /**
   * GetWayPoints request handler method
   *
   * @param {Object} request
   */
  getWayPoint: function(request) {
    if (model.appReqPull.indexOf(request.params.appID) == -1) {

      model.appReqPull.push(request.params.appID);
      setTimeout(function() {
        FFW.Navigation.wayPointSend(SDL.SDLModel.data.resultCode.SUCCESS,
            model.LocationDetails,
            request.id);
        model.appReqPull.
        splice(model.appReqPull.indexOf(request.params.appID), 1);
      },
      model.wpProcessTime);
    } else {
      FFW.Navigation.wayPointSend(SDL.SDLModel.data.resultCode.IN_USE);
    }
  },

  /**
   * SubscribeWayPoints request handler method
   *
   * @param {Object} request
   */
  subscribeWayPoints: function(request) {
    if (model.isSubscribedOnWayPoints) {
      model.set('isSubscribedOnWayPoints', true);
      FFW.Navigation.sendNavigationResult(
          SDL.SDLModel.data.resultCode.SUCCESS,
          request.id,
          request.method
      );
    } else {
      FFW.Navigation.sendError(
          SDL.SDLModel.data.resultCode.REJECTED,
          request.id,
          request.method,
          'SDL Should not send this request more than once'
      );
    }
  },

  /**
   * SubscribeWayPoints request handler method
   *
   * @param {Object} request
   */
  unsubscribeWayPoints: function(request) {
    if (!model.isSubscribedOnWayPoints) {
      model.set('isSubscribedOnWayPoints', false);
      FFW.Navigation.sendNavigationResult(
          SDL.SDLModel.data.resultCode.SUCCESS,
          request.id,
          request.method
      );
    } else {
      FFW.Navigation.sendError(
          SDL.SDLModel.data.resultCode.REJECTED,
          request.id,
          request.method,
          'SDL Should not send this request more than once'
      );
    }
  }

});
