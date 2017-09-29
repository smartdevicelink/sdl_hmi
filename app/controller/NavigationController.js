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
      if (!this.model.poi && this.model.LocationDetails.length == 0) {
        SDL.PopUp.create().appendTo('body').popupActivate(
          'List is empty. Please navigate to some new places!'
        );
        return;
      }
      if (this.model.poi == false && this.model.wp) {
        this.model.toggleProperty('wp');
      }
      this.model.toggleProperty('poi');
    },
    /**
     * WP list switcher method
     */
    showWpList: function() {
      if (!this.model.wp && this.model.WayPointDetails.length == 0) {
        SDL.PopUp.create().appendTo('body').popupActivate(
          'List is empty. Please setup navigation route!'
        );
        return;
      }
      if (this.model.wp == false && this.model.poi) {
        this.model.toggleProperty('poi');
      }
      this.model.toggleProperty('wp');
    },
    /**
     * Callback for location prompt
     */
    onSendLocationPromptAnswered: function(request, result) {
      if (result) {
        if (SDL.NavigationController.isAnimateStarted) {
          SDL.NavigationController.startAnimation();
        }

        SDL.NavigationController.addPOIMarker(
          request.params.latitudeDegrees,
          request.params.longitudeDegrees
        );
        SDL.NavigationController.setRoutes();

        FFW.Navigation.sendNavigationResult(
          SDL.SDLModel.data.resultCode.SUCCESS,
          request.id,
          request.method
        );
      } else {
        FFW.Navigation.sendError(
          SDL.SDLModel.data.resultCode.DISALLOWED,
          request.id,
          request.method,
          "Navigation to destination point was rejected by driver"
        );
      }
    },
    /**
     * Converts DateTime structure from request to Date object
     *
     * @param {Object} timeStamp
     */
    convertDateTimeStructure: function(timeStamp) {
      var dt = new Date();
      if (timeStamp) {
        if (timeStamp.millisecond) {
          dt.setUTCMilliseconds(timeStamp.millisecond);
        }
        if (timeStamp.second) {
          dt.setUTCSeconds(timeStamp.second);
        }
        if (timeStamp.minute) {
          dt.setUTCMinutes(timeStamp.minute);
        }
        if (timeStamp.hour) {
          dt.setUTCHours(timeStamp.hour);
        }
        if (timeStamp.day) {
          dt.setUTCDate(timeStamp.day);
        }
        if (timeStamp.month) {
          dt.setUTCMonth(timeStamp.month - 1);
        }
        if (timeStamp.year) {
          dt.setUTCFullYear(timeStamp.year);
        }
        if (timeStamp.tz_hour) {
          dt.setUTCHours(dt.getUTCHours() - timeStamp.tz_hour);
        }
        if (timeStamp.tz_minute) {
          dt.setUTCMinutes(dt.getUTCMinutes() - timeStamp.tz_minute);
        }
      }
      return dt;
    },
    /**
     * Converts Date object to DateTime structure
     *
     * @param {Object} dt
     */
    convertDateObject: function(dt) {
      var res = {
        millisecond: dt.getMilliseconds(),
        second: dt.getSeconds(),
        minute: dt.getMinutes(),
        hour: dt.getHours(),
        day: dt.getDate(),
        month: dt.getMonth() + 1,
        year: dt.getFullYear(),
        tz_hour: Math.floor(dt.getTimezoneOffset() / 60 * -1),
        tz_minute: dt.getTimezoneOffset() % 60 * -1
      };
      return res;
    },
    /**
     * Navigation.SendLocation request handler
     *
     * @param {Object} request
     */
    sendLocation: function(request) {
      var deliveryMode =
        request.params.deliveryMode ? request.params.deliveryMode : 'PROMPT';

      if (deliveryMode == 'PROMPT') {
        var popUp = SDL.PopUp.create().appendTo('body').popupActivate(
          'Would you like to start navigation to destination point at (' + request.params.latitudeDegrees +
          ', ' + request.params.longitudeDegrees + ')?',
          function(result) {
            SDL.NavigationController.onSendLocationPromptAnswered(request, result);
          }
        );

        setTimeout(
          function() {
            if (popUp && popUp.active) {
              popUp.deactivate();
              FFW.Navigation.sendError(
                SDL.SDLModel.data.resultCode.TIMED_OUT,
                request.id,
                request.method,
                'Driver did not respond in time'
              );
            }
          }, 9500
        );

        return;
      }

      if (deliveryMode == 'DESTINATION') {
        if (SDL.NavigationController.isAnimateStarted) {
          SDL.NavigationController.startAnimation();
        }

        SDL.NavigationController.addPOIMarker(
          request.params.latitudeDegrees,
          request.params.longitudeDegrees
        );
        SDL.NavigationController.setRoutes();

        FFW.Navigation.sendNavigationResult(
          SDL.SDLModel.data.resultCode.SUCCESS,
          request.id,
          request.method
        );
        return;
      }

      if (deliveryMode == 'QUEUE') {
        var res = SDL.NavigationController.getLocationByCoord(
          request.params.latitudeDegrees,
          request.params.longitudeDegrees
        );

        if (res.index < 0) {
          var dt =
            SDL.NavigationController.convertDateTimeStructure(request.params.timeStamp);

          var locations = SDL.deepCopy(SDL.NavigationModel.LocationDetails);
          var insertInd = SDL.NavigationController.getInsertLocationIndex(locations, dt);
          var timeStampStuct = SDL.NavigationController.convertDateObject(dt);
          var location = {
            coordinate: {
              latitudeDegrees: request.params.latitudeDegrees,
              longitudeDegrees: request.params.longitudeDegrees
            },
            locationName: request.params.locationName,
            addressLines: request.params.addressLines,
            locationDescription: request.params.locationDescription,
            phoneNumber: request.params.phoneNumber,
            locationImage: request.params.locationImage,
            searchAddress: request.params.address,
            timeStamp: timeStampStuct
          };

          if (insertInd >= 0) {
            locations.splice(insertInd, 0, location);
          } else {
            locations.push(location);
          }
          SDL.NavigationModel.set('LocationDetails', locations);
        }

        FFW.Navigation.sendNavigationResult(
          SDL.SDLModel.data.resultCode.SUCCESS,
          request.id,
          request.method
        );
        return;
      }

      FFW.Navigation.sendError(
        SDL.SDLModel.data.resultCode.INVALID_DATA,
        request.id,
        request.method
      );
    },
    /**
     * Gets index to insert item with specified dt
     *
     * @param {Object} locations
     * @param {Object} dt
     */
    getInsertLocationIndex: function(locations, dt) {
      for (var i = 0; i < locations.length; ++i) {
        var item = locations[i];
        if (item.timeStamp == null) {
          return i;
        }
        var stamp =
          SDL.NavigationController.convertDateTimeStructure(item.timeStamp);
        if (dt >= stamp) {
          return i;
          break;
        }
      }
      return -1;
    },
    /**
     * Navigation view List Button action handler
     * Opens selected WayPoint structure
     *
     * @param {Object} element
     */
    openDestPoint: function(element) {
      var itemID = element.itemID;
      this.model.set(
        'currentWayPointData',
        JSON.stringify(SDL.NavigationModel.LocationDetails[itemID], null, 2)
      );
      SDL.NavigationView.codeEditor.activate(
        function(data, isDeleted) {
          if (isDeleted) {
            var location = SDL.NavigationModel.LocationDetails[itemID];
            SDL.NavigationModel.LocationDetails.removeObject(location);
            if (SDL.NavigationModel.LocationDetails.length == 0) {
              SDL.NavigationModel.set('poi', false);
            }
          } else {
            var locations = SDL.deepCopy(SDL.NavigationModel.LocationDetails);
            var old_coords = locations[itemID].coordinate;
            var new_location = JSON.parse(data);
            locations.splice(itemID, 1);
            var dt =
              SDL.NavigationController.convertDateTimeStructure(new_location.timeStamp);
            var insertInd =
              SDL.NavigationController.getInsertLocationIndex(locations, dt);

            if (insertInd >= 0) {
              locations.splice(insertInd, 0, new_location);
            } else {
              locations.push(new_location);
            }
            SDL.NavigationModel.set('LocationDetails', locations);
          }
        }
      );
    },
    /**
     * Navigation view List Button action handler
     * Selects current WayPoint
     *
     * @param {Object} element
     */
    selectWayPoint: function(element) {
      var itemID = element.itemID;
      var marker = this.model.WayPointMarkers[itemID];
      this.map.panTo(marker.getPosition());
    },
    /**
     * Navigation view List Button action handler
     * Selects current WayPoint
     *
     * @param {Object} element
     */
    getLastWayPoint: function(element) {
      var wp = SDL.NavigationModel.WayPointMarkers;
      if (wp.length == 0) {
        return null;
      }
      return wp[wp.length - 1];
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
              request.id
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
    isAnimateStarted: false,
    map: null,
    directionsService: null,
    directionsRenderer: null,
    marker: null,
    polyline: null,
    timerHandle: null,

    initialize: function() {
      if (!this.isInitialized) {
        this.isInitialized = true;
      } else {
        return false;
      }
      var myOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false
      };
      SDL.NavigationController.map =
        new google.maps.Map(document.getElementById('map'), myOptions);
      address = SDL.NavigationController.model.initialLoc;
      geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {'address': address}, function(results, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            SDL.NavigationController.map.fitBounds(
              results[0].geometry.viewport
            );
            SDL.NavigationController.addCarMarker(results[0].geometry.location);
          } else {
            SDL.PopUp.create().appendTo('body').popupActivate(
              'Navigation error: ' + status + '. Resend ShowConstantTBT!'
            );
          }
        }
      );
      var rendererOptions = {
        map: SDL.NavigationController.map,
        suppressMarkers: true,
        preserveViewport: true
      };
      SDL.NavigationController.directionsService =
        new google.maps.DirectionsService();
      SDL.NavigationController.directionsRenderer =
        new google.maps.DirectionsRenderer(rendererOptions);

      this.map.addListener('click', function(e) {
        SDL.NavigationController.addPOIMarker(
          e.latLng.lat(), e.latLng.lng()
        );
      });
    },
    setLocationInfoFromItem: function(item, info) {
      if (item.types == null) {
        return;
      }

      // country info
      if (item.types.indexOf('country') >= 0) {
        var country_obj =
          item.address_components ? item.address_components[0] : item;
        if (country_obj.long_name) {
          info.searchAddress.countryName = country_obj.long_name;
        }
        if (country_obj.short_name) {
          info.searchAddress.countryCode = country_obj.short_name;
        }
        return;
      }

      // postal code
      if (item.types.indexOf('postal_code') >= 0) {
        var postal_code_obj =
          item.address_components ? item.address_components[0] : item;
        if (postal_code_obj.long_name) {
          info.searchAddress.postalCode = postal_code_obj.long_name;
        }
        return;
      }

      //administrative area
      if (item.types.indexOf('administrative_area_level_1') >= 0) {
        var adm_area_obj =
          item.address_components ? item.address_components[0] : item;
        if (adm_area_obj.long_name) {
          info.searchAddress.administrativeArea = adm_area_obj.long_name;
        }
        return;
      }

      //sub administrative area
      if (item.types.indexOf('administrative_area_level_2') >= 0) {
        var adm_subarea_obj =
          item.address_components ? item.address_components[0] : item;
        if (adm_subarea_obj.long_name) {
          info.searchAddress.subAdministrativeArea = adm_subarea_obj.long_name;
        }
        return;
      }

      //locality
      if (item.types.indexOf('locality') >= 0) {
        var locality_obj =
          item.address_components ? item.address_components[0] : item;
        if (locality_obj.long_name) {
          info.searchAddress.locality = locality_obj.long_name;
        }
        return;
      }

      //sublocality
      if (item.types.indexOf('sublocality') >= 0) {
        var sublocality_obj =
          item.address_components ? item.address_components[0] : item;
        if (sublocality_obj.long_name) {
          info.searchAddress.subLocality = sublocality_obj.long_name;
        }
        return;
      }

      //thoroughfare
      if (item.types.indexOf('route') >= 0) {
        var route_obj =
          item.address_components ? item.address_components[0] : item;
        if (route_obj.long_name) {
          info.searchAddress.thoroughfare = route_obj.long_name;
        }
        return;
      }

      //subthoroughfare
      if (item.types.indexOf('street_number') >= 0) {
        var street_obj =
          item.address_components ? item.address_components[0] : item;
        if (street_obj.long_name) {
          info.searchAddress.subThoroughfare = street_obj.long_name;
        }
        return;
      }
    },
    getLocationByCoord: function(lat, lng) {
      for (var i = 0; i < this.model.LocationDetails.length; ++i) {
        var point = this.model.LocationDetails[i];
        if (point.coordinate.latitudeDegrees == lat &&
            point.coordinate.longitudeDegrees == lng) {
              return {
                location: point,
                index: i
              };
        }
      }
      return {
        location: null,
        index: -1
      };;
    },
    addCarMarker: function(latLng) {
      var marker = new google.maps.Marker({
          //animation: google.maps.Animation.BOUNCE,
          position: latLng,
          map: this.map,
          icon: 'images/nav/marker.png',
          title: 'You are here'
      });
      this.model.set('vehicleLocationMarker', marker);
    },
    addPOIMarker: function(lat, lng) {
      var latlng = new google.maps.LatLng(lat, lng);
      var marker = this.model.selectedLocationMarker;
      if (!marker) {
        marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: latlng,
          map: this.map
        });
        this.model.selectedLocationMarker = marker;
      } else {
        marker.setMap(this.map);
        marker.setPosition(latlng);
        marker.setAnimation(google.maps.Animation.DROP);
      }
      this.map.panTo(marker.getPosition());
    },
    addWaypointLocation: function(latlng) {
      var res = SDL.NavigationController.getLocationByCoord(
        latlng.lat(), latlng.lng()
      );

      if (res.index >= 0) {
        FFW.Navigation.onWayPointChange([res.location]);
        return;
      }

      var dt = new Date();
      var location = {
        coordinate: {
          latitudeDegrees: latlng.lat(),
          longitudeDegrees: latlng.lng()
        },
        locationName: 'Unknown Location',
        addressLines: [],
        locationDescription: '',
        phoneNumber: '',
        locationImage: {
          value: '',
          imageType: 'DYNAMIC'
        },
        searchAddress: {
          countryName: '',
          countryCode: '',
          postalCode: '',
          administrativeArea: '',
          subAdministrativeArea: '',
          locality: '',
          subLocality: '',
          thoroughfare: '',
          subThoroughfare: ''
        },
        timeStamp: SDL.NavigationController.convertDateObject(dt)
      };

      var locations = SDL.deepCopy(SDL.NavigationModel.LocationDetails);
      var insertInd = SDL.NavigationController.getInsertLocationIndex(locations, dt);
      if (insertInd >= 0) {
        locations.splice(insertInd, 0, location);
      } else {
        locations.push(location);
      }
      SDL.NavigationModel.set('LocationDetails', locations);

      geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          var res = SDL.NavigationController.getLocationByCoord(
            latlng.lat(), latlng.lng()
          );
          if (res.index < 0) {
            return;
          }
          if (results[0]) {
            res.location.addressLines = [results[0].formatted_address];
          }
          if (results[1]) {
            res.location.locationName = results[1].formatted_address;
          }

          for (i = 0; i < results.length; ++i) {
            var item = results[i];
            for (j = 0; j < item.address_components.length; ++j) {
              SDL.NavigationController.setLocationInfoFromItem(
                item.address_components[j], res.location
              );
            }
          }

          var locations = SDL.deepCopy(SDL.NavigationModel.LocationDetails);
          locations[res.index] = res.location;
          SDL.NavigationModel.set('LocationDetails', locations);
        } else {
          Em.Logger.error('Navigation: Geocoder failed due to: ' + status);
        }
      });
    },
    waypointSelected: function() {
      var data = SDL.NavigationView.codeEditor.content;
      var location = JSON.parse(data);
      var latlng = new google.maps.LatLng(
        location.coordinate.latitudeDegrees,
        location.coordinate.longitudeDegrees
      );

      this.model.selectedLocationMarker.setMap(this.map);
      this.model.selectedLocationMarker.setPosition(latlng);
      this.map.panTo(this.model.selectedLocationMarker.getPosition());
      SDL.NavigationView.codeEditor.deactivate();
    },
    makeRouteCallback: function() {
      return function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          SDL.NavigationModel.selectedLocationMarker.setMap(null);
          SDL.NavigationController.directionsRenderer.setMap(SDL.NavigationController.map);
          SDL.NavigationController.directionsRenderer.setDirections(response);
          var route = response.routes[0].legs[0];
          var marker = SDL.NavigationModel.destinationLocationMarker;
          if (!marker) {
            marker = new google.maps.Marker({
              animation: google.maps.Animation.DROP,
              position: route.end_location,
              map: SDL.NavigationController.map,
              title: 'Destination point'
            });
            SDL.NavigationModel.destinationLocationMarker = marker;
          } else {
            marker.setMap(SDL.NavigationController.map);
            marker.setPosition(route.end_location);
            marker.setAnimation(google.maps.Animation.DROP);
          }

          var steps = route.steps;
          for (j = 0; j < steps.length; j++) {
            var nextSegment = steps[j].path;
            for (k = 0; k < nextSegment.length; k++) {
              SDL.NavigationController.polyline.getPath().push(
                nextSegment[k]
              );
            }
          }
          SDL.NavigationController.set('isRouteSet', true);
          // SDL.NavigationController.polyline.setMap(
          //   SDL.NavigationController.map
          // );
        } else {
          SDL.PopUp.create().appendTo('body').popupActivate(
            'Navigation error: ' + status
          );
          return;
        }
      };
    },
    setRoutes: function() {
      if (SDL.NavigationModel.selectedLocationMarker == null) {
        SDL.PopUp.create().appendTo('body').popupActivate(
            'Navigation error: Destination point is not set'
        );
        return;
      }
      if (SDL.NavigationController.isRouteSet == false &&
          SDL.NavigationModel.selectedLocationMarker.getMap() == null) {
        SDL.PopUp.create().appendTo('body').popupActivate(
            'Navigation error: Destination point is not selected'
        );
        return;
      }
      if (SDL.NavigationController.isRouteSet &&
          SDL.NavigationModel.selectedLocationMarker.getMap() == null) {
        SDL.NavigationController.clearRoutes();
        return;
      }

      SDL.NavigationController.addWaypointLocation(
        SDL.NavigationModel.selectedLocationMarker.getPosition()
      );

      if (SDL.NavigationController.polyline) {
        SDL.NavigationController.polyline.setMap(null);
      }
      SDL.NavigationController.polyline = new google.maps.Polyline(
        {
          path: [],
          strokeColor: '#0000FF',
          strokeWeight: 3
        }
      );

      var travelMode = google.maps.DirectionsTravelMode.DRIVING;
      var request = {
        origin: SDL.NavigationModel.vehicleLocationMarker.getPosition(),
        destination: SDL.NavigationModel.selectedLocationMarker.getPosition(),
        travelMode: travelMode
      };
      SDL.NavigationController.directionsService.route(
        request,
        SDL.NavigationController.makeRouteCallback()
      );
    },
    lastVertex: 1,
    step: function() {
      return SDL.SDLVehicleInfoModel.vehicleData.speed *
        (10 / 36) / 2;
    }.property('SDL.SDLVehicleInfoModel.vehicleData.speed'),
    tick: 500, // milliseconds
    eol: [],
    animate: function(d) {
      if (d > SDL.NavigationController.eol) {
        var endLocation =
          SDL.NavigationModel.destinationLocationMarker.getPosition();
        SDL.NavigationModel.destinationLocationMarker.setMap(null);
        SDL.NavigationController.directionsRenderer.setMap(null);
        SDL.NavigationModel.vehicleLocationMarker.setAnimation(null);

        SDL.NavigationModel.vehicleLocationMarker.setPosition(
          endLocation
        );
        SDL.NavigationModel.vehicleLocationMarker.setAnimation(
          google.maps.Animation.BOUNCE
        );
        SDL.NavigationController.set('isRouteSet', false);
        SDL.NavigationController.toggleProperty('isAnimateStarted');

        setTimeout(
          function() {
            SDL.NavigationModel.vehicleLocationMarker.setAnimation(null);
          },
          5000
        );

        return;
      }

      var p = SDL.NavigationController.polyline.GetPointAtDistance(d);
      SDL.NavigationController.map.panTo(p);
      SDL.NavigationModel.vehicleLocationMarker.setPosition(p);
      // SDL.SDLVehicleInfoModel.onGPSDataChanged(p.lat(), p.lng());
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
      if (SDL.NavigationController.isAnimateStarted) {
        if (SDL.NavigationController.timerHandle) {
          clearTimeout(SDL.NavigationController.timerHandle);
        }
        SDL.NavigationController.toggleProperty('isAnimateStarted');
        SDL.NavigationController.setRoutes();
        return;
      }
      if (this.model.poi) {
        this.model.toggleProperty('poi');
      }
      if (SDL.SDLVehicleInfoModel.vehicleData.speed == 0) {
        SDL.SDLVehicleInfoModel.set('vehicleData.speed', 80);
      }

      SDL.NavigationController.toggleProperty('isAnimateStarted');
      SDL.NavigationController.eol =
        SDL.NavigationController.polyline.Distance();
      SDL.NavigationController.map.setCenter(
        SDL.NavigationController.polyline.getPath().getAt(0)
      );
      SDL.NavigationController.timerHandle = setTimeout(
        function() {
          SDL.NavigationController.animate(0);
        },
        500
      );  // Allow time for the initial map display
    }
  }
);
