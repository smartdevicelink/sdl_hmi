SDL.ClimateController = Em.Object.create(
  {
    modelBinding: 'SDL.ClimateControlModel',
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
    }
  }
);
