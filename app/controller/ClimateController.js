/*
 * Copyright (c) 2019, Ford Motor Company All rights reserved.
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
 * @name SDL.ClimateController
 * @desc Climate Controller logic
 * @category Controller
 * @filesource app/controller/ClimateController.js
 * @version 1.0
 */

SDL.ClimateController = Em.Object.create(
  {
    modelBinding: 'SDL.RCModulesController.currentClimateModel',
    getTemperatureStruct: function(type, value) {
      var t = (type == 'CELSIUS' ? value : value * 9 / 5 + 32);
      var result = {
        unit: type,
        value: parseFloat(t.toFixed(1))
      }
      return result;
    },
    extractTemperatureFromStruct: function(data) {
      return (data.unit == 'CELSIUS'
        ? data.value
        : Math.round((data.value - 32) * 5 / 9));
    },
    getClimateControlData: function() {
      var properties = this.model.getDataForSending();
      var climateControlData = this.model.getClimateControlData();
      var data = SDL.SDLController.filterObjectProperty(climateControlData, properties);
      if(!climateControlData.climateEnable) {
        data['currentTemperature'] = this.model.getClimateControlData().currentTemperature;
      }
      return data;
    },
  }
);
