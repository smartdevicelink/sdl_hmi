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

SDL.NavigationController = Em.Object.create(
  {
    /**
     * Model binding
     */
    modelBinding: 'SDL.NavigationModel',
    /**
     * POI list switcher method
     */
    showPoiList: function() {
      this.model.toggleProperty('poi');
    },
    /**
     * Navigation.SendLocation request handler
     *
     * @param {Object} request
     */
    sendLocation: function(request) {
      this.model.LocationDetails.pushObject(
        {
          coordinate: {
            latitudeDegrees: request.params.latitudeDegrees,
            longitudeDegrees: request.params.longitudeDegrees
          },
          locationName: request.params.locationName,
          addressLines: request.params.addressLines,
          locationDescription: request.params.locationDescription,
          phoneNumber: request.params.phoneNumber,
          locationImage: request.params.locationImage,
          searchAddress: request.params.address
        }
      );
      FFW.Navigation.sendNavigationResult(
        SDL.SDLModel.data.resultCode.SUCCESS,
        request.id,
        request.method
      );
    },
    /**
     * Navigation view List Button action handler
     * Opens selected WayPoint structure
     *
     * @param {Object} element
     */
    openWayPoint: function(element) {
      var itemID = element.itemID;
      this.model.set(
        'currentWayPointData',
        JSON.stringify(SDL.NavigationModel.LocationDetails[itemID], null, 2)
      );
      SDL.NavigationView.codeEditor.activate(
        function(data, isDeleted) {
          if (isDeleted) {
            SDL.NavigationModel.get('LocationDetails').removeObject(
              SDL.NavigationModel.LocationDetails[itemID]
            );
          } else {
            SDL.NavigationModel.LocationDetails[itemID] = data;
            FFW.Navigation.onWayPointChange(
              [SDL.NavigationModel.LocationDetails[itemID]]
            );
          }
        }
      );
    },
    /**
     * GetWayPoints request handler method
     *
     * @param {Object} request
     */
    getWayPoint: function(request) {
      if (this.model.appReqPull.indexOf(request.params.appID) == -1) {
        this.model.appReqPull.push(request.params.appID);
        setTimeout(
          function() {
            FFW.Navigation.wayPointSend(
              SDL.SDLModel.data.resultCode.SUCCESS,
              SDL.NavigationModel.LocationDetails,
              request.id,
              request.params.appID
            );
            SDL.NavigationModel.appReqPull.splice(
              SDL.NavigationModel.appReqPull.indexOf(request.params.appID), 1
            );
          },
          SDL.NavigationModel.wpProcessTime
        );
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
      if (!this.model.isSubscribedOnWayPoints) {
        this.model.set('isSubscribedOnWayPoints', true);
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
      if (this.model.isSubscribedOnWayPoints) {
        this.model.set('isSubscribedOnWayPoints', false);
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
    isInitialized: false,
    isRouteSet: false,
    map: null,
    directionsService: null,
    marker: null,
    polyline: null,
    polyline2: [],
    startLocation: null,
    endLocation: null,
    timerHandle: null,
    infowindow: null,
    initialize: function() {
      if (!this.isInitialized && SDL.States.navigation.active) {
        this.isInitialized = true;
      } else {
        return false;
      }
      infowindow = new google.maps.InfoWindow(
        {
          size: new google.maps.Size(150, 50)
        }
      );
      var myOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      SDL.NavigationController.map =
        new google.maps.Map(document.getElementById('map'), myOptions);
      address = SDL.NavigationController.model.startLoc;
      geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {'address': address}, function(results, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            SDL.NavigationController.map.fitBounds(
              results[0].geometry.viewport
            );
          } else {
            SDL.PopUp.create().appendTo('body').popupActivate(
              'Navigation error: ' + status + '. Resend ShowConstantTBT!'
            );
          }
        }
      );
    },
    createMarker: function(latlng, label, html) {
      var contentString = '<b>' + label + '</b><br>' + html;
      var marker = new google.maps.Marker(
        {
          position: latlng,
          map: SDL.NavigationController.map,
          title: label,
          zIndex: Math.round(latlng.lat() * -100000) << 5
        }
      );
      marker.myname = label;
      google.maps.event.addListener(
        marker, 'click', function() {
          SDL.NavigationController.infowindow.setContent(contentString);
          SDL.NavigationController.infowindow.open(
            SDL.NavigationController.map,
            marker
          );
        }
      );
      return marker;
    },
    setRoutes: function() {
      SDL.NavigationController.polyline = null;
      var rendererOptions = {
        map: SDL.NavigationController.map,
        suppressMarkers: true,
        preserveViewport: true
      };
      SDL.NavigationController.directionsService =
        new google.maps.DirectionsService();
      var travelMode = google.maps.DirectionsTravelMode.DRIVING;
      var request = {
        origin: SDL.NavigationController.model.startLoc,
        destination: SDL.NavigationController.model.endLoc,
        travelMode: travelMode
      };
      SDL.NavigationController.directionsService.route(
        request,
        makeRouteCallback()
      );
      function makeRouteCallback() {
        var disp;
        if (SDL.NavigationController.polyline && (
          SDL.NavigationController.polyline.getMap() != null)) {
          SDL.NavigationController.startAnimation();
          return;
        }
        return function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            SDL.NavigationController.startLocation = {};
            SDL.NavigationController.endLocation = {};
            SDL.NavigationController.polyline = new google.maps.Polyline(
              {
                path: [],
                strokeColor: '#FFFF00',
                strokeWeight: 3
              }
            );
            SDL.NavigationController.polyline2 = new google.maps.Polyline(
              {
                path: [],
                strokeColor: '#FFFF00',
                strokeWeight: 3
              }
            );
            var route = response.routes[0].legs[0];
            disp = new google.maps.DirectionsRenderer(rendererOptions);
            disp.setMap(SDL.NavigationController.map);
            disp.setDirections(response);
            SDL.NavigationController.startLocation.latlng =
              route.start_location;
            SDL.NavigationController.startLocation.address =
              route.start_address;
            if (SDL.NavigationController.marker) {
              SDL.NavigationController.marker.setMap(null);
            }
            SDL.NavigationController.marker =
              SDL.NavigationController.createMarker(
                route.start_location,
                'start',
                route.start_address,
                'green'
              );
            SDL.NavigationController.endLocation.latlng =
              route.end_location;
            SDL.NavigationController.endLocation.address =
              route.end_address;
            var steps = route.steps;
            for (j = 0; j < steps.length; j++) {
              var nextSegment = steps[j].path;
              for (k = 0; k < nextSegment.length; k++) {
                SDL.NavigationController.polyline.getPath().push(
                  nextSegment[k]
                );
              }
            }
          } else {
            SDL.PopUp.create().appendTo('body').popupActivate(
              'Navigation error: ' + status
            );
            return;
          }
          SDL.NavigationController.polyline.setMap(
            SDL.NavigationController.map
          );
          SDL.NavigationController.startAnimation();
        };
      };
    },
    lastVertex: 1,
    step: function() {
      return SDL.SDLVehicleInfoModel.vehicleData.speed *
        (10 / 36) / 2;
    }.property('SDL.SDLVehicleInfoModel.vehicleData.speed'),
    tick: 500, // milliseconds
    eol: [],
    updatePoly: function(d) {
      // Spawn a new polyline every 20 vertices, because updating a 100-vertex
      // poly is too slow
      if (SDL.NavigationController.polyline2.getPath().getLength() > 20) {
        SDL.NavigationController.polyline2 = new google.maps.Polyline(
          {
            path: [
              SDL.NavigationController.polyline.getPath().getAt(
                SDL.NavigationController.lastVertex - 1
              )
            ],
            strokeColor: '#FFFF00',
            strokeWeight: 3
          }
        );
      }
      if (SDL.NavigationController.polyline.GetIndexAtDistance(d) <
        SDL.NavigationController.lastVertex + 2) {
        if (SDL.NavigationController.polyline2.getPath().getLength() > 1) {
          SDL.NavigationController.polyline2.getPath().removeAt(
            SDL.NavigationController.polyline2.getPath().getLength() - 1
          );
        }
        SDL.NavigationController.polyline2.getPath().insertAt(
          SDL.NavigationController.polyline2.getPath().getLength(),
          SDL.NavigationController.polyline.GetPointAtDistance(d)
        );
      } else {
        SDL.NavigationController.polyline2.getPath().insertAt(
          SDL.NavigationController.polyline2.getPath().getLength(),
          SDL.NavigationController.endLocation.latlng
        );
      }
    },
    animate: function(d) {
      if (d > SDL.NavigationController.eol) {
        SDL.NavigationController.marker.setPosition(
          SDL.NavigationController.endLocation.latlng
        );
        SDL.NavigationController.marker.setAnimation(
          google.maps.Animation.BOUNCE
        );
        return;
      }
      var p = SDL.NavigationController.polyline.GetPointAtDistance(d);
      SDL.NavigationController.map.panTo(p);
      SDL.NavigationController.marker.setPosition(p);
      SDL.SDLVehicleInfoModel.onGPSDataChanged(p.lat(), p.lng());
      SDL.NavigationController.updatePoly(d);
      SDL.NavigationController.timerHandle = setTimeout(
        function() {
          SDL.NavigationController.animate(
            d + SDL.NavigationController.get('step')
          );
        },
        SDL.NavigationController.tick
      );
    },
    startAnimation: function() {
      if (SDL.NavigationController.timerHandle) {
        clearTimeout(SDL.NavigationController.timerHandle);
      }
      SDL.NavigationController.eol =
        SDL.NavigationController.polyline.Distance();
      SDL.NavigationController.map.setCenter(
        SDL.NavigationController.polyline.getPath().getAt(0)
      );
      SDL.NavigationController.polyline2 = new google.maps.Polyline(
        {
          path: [SDL.NavigationController.polyline.getPath().getAt(0)],
          strokeColor: '#FFFF00',
          strokeWeight: 3
        }
      );
      SDL.NavigationController.timerHandle = setTimeout(
        function() {
          SDL.NavigationController.animate(0);
        },
        2000
      );  // Allow time for the initial map display
    }
  }
);
