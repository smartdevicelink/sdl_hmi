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
 * @name SDL.NavigationModel
 * @desc Navigation model
 * @category Model
 * @filesource app/model/NavigationModel.js
 * @version 1.0
 */

SDL.NavigationModel = Em.Object.create({

  /**
   * Array of applications appID's requested GetWayPoints that
   * currently processed by HMI
   */
  appReqPull: [],

  /**
   * Initial location point
   */
  initialLoc: '230 Canal St, New York, NY 10013, USA',

  /**
   * POI list switcher flag
   */
  poi: false,

  /**
   * WP list switcher flag
   */
  wp: false,

  /**
   * Content for code editor view to display current waypoint data
   */
  currentWayPointData: '',

  /**
   * flag changed by SubscribeWayPoints and UnsubscribeWayPoints requests
   */
  isSubscribedOnWayPoints: false,

  /**
   * Delay Time in ms
   * used to set the delay of GetWayPoints response
   */
  wpProcessTime: 5,

  /**
   * Current location of the vehicle
   */
  vehicleLocationMarker: null,

  /**
   * Selected location
   */
  selectedLocationMarker: null,

  /**
   * Saved destination points array
   */
  LocationDetails: [],

  /**
   * Saved waypoints array
   */
  WayPointDetails: [],

  /**
   * Waypoint markers array
   */
  WayPointMarkers: []
}
);
