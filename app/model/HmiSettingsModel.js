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
 * @name SDL.HmiSettingsModel
 * @desc Navigation model
 * @category Model
 * @filesource app/model/HmiSettingsModel.js
 * @version 1.0
 */

SDL.HmiSettingsModel = Em.Object.create({

    displayModeStruct: [
        'DAY',
        'NIGHT',
        'AUTO'
      ],
      displayMode: 'DAY',
      
      distanceUnitStruct:[
        'MILES',
        'KILOMETERS'
      ],
      distanceUnit: 'MILES',
    
      temperatureUnitStruct: [
        'FAHRENHEIT',
        'CELSIUS'
      ],
      temperatureUnit: SDL.ClimateControlModel.climateControlData.temperatureUnit,
    
      getHmiSettingsCapabilities: function() {
        var capabilities = {
          moduleName: 'HMISettingsControlCapabilities',
          distanceUnitAvailable: true,
          temperatureUnitAvailable: true,
          displayModeUnitAvailable: true
        };
    
        return capabilities;
      },
    
      setHmiSettingsData: function(data){
        if(null != data.displayMode){
          this.set('displayMode',data.displayMode);
        }
        if(null != data.temperatureUnit){
          this.set('temperatureUnit',data.temperatureUnit);
          if('CELSIUS' == data.temperatureUnit){
            SDL.ClimateControlModel.temperatureUnitCelsiusEnable();
          }else{
            SDL.ClimateControlModel.temperatureUnitFahrenheitEnable();
          }
        }
        if(null != data.distanceUnit){
          this.set('distanceUnit',data.distanceUnit);
        }

        properties = [];
        for (var key in data) {
          properties.push(key);
        }

        var result = this.getHmiSettingsControlData(true);
        return SDL.SDLController.filterObjectProperty(result, properties);
      },
      
      getHmiSettingsControlData: function(){
        var result = {
          temperatureUnit: this.temperatureUnit,
          displayMode: this.displayMode,
          distanceUnit: this.distanceUnit
        };
        
        return result;
      }
})

