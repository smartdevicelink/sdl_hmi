SDL.SendMessage = Em.ContainerView.create({
      elementId: 'sendMessageView',
      classNames: 'sendMessageView',
      classNameBindings: [
        'active'
      ],
      childViews: [
        'backButton',
        'lightStatusLabel',
        'lightStatusSelect',
        'lightDensityLabel',
        'lightColorLabel',
        'rLabel',
        'gLabel',
        'bLabel',
        'densityInput',
        'rInput',
        'gInput',
        'bInput',
        'setButton'
      ],
      active: false,
      toggleActivity: function() {
        this.toggleProperty('active');
      },
      setSetting: function(){
        SDL.LightModel.lightSettings.density = parseFloat(SDL.LightModel.lightSettings.density);
        SDL.LightModel.lightSettings.sRGBColor.red = parseInt(SDL.LightModel.lightSettings.sRGBColor.red);
        SDL.LightModel.lightSettings.sRGBColor.green = parseInt(SDL.LightModel.lightSettings.sRGBColor.green);
        SDL.LightModel.lightSettings.sRGBColor.blue = parseInt(SDL.LightModel.lightSettings.sRGBColor.blue);
        var length = SDL.LightModel.lightState.length;

        var data = SDL.deepCopy(SDL.LightModel.lightSettings);
        var oldData;
        for(var i = 0; i < length; ++i){
          if(SDL.LightModel.lightState[i].id == SDL.LightModel.lightSettings.id){
            oldData = SDL.deepCopy(SDL.LightModel.lightState[i]);
            SDL.LightModel.lightState[i] = SDL.deepCopy(SDL.LightModel.lightSettings);
            break;
          }
        }
        if(data.sRGBColor.red == oldData.sRGBColor.red && 
           data.sRGBColor.green == oldData.sRGBColor.green && 
           data.sRGBColor.blue == oldData.sRGBColor.blue){
          delete data['sRGBColor'];
        }
        if(data.density == oldData.density){
          delete data['density'];
        }
        if (Object.keys(data).length > 0) {
          FFW.RC.onInteriorVehicleDataNotification({moduleType:'LIGHT', lightControlData: {lightState: [data]}});
        }
        SDL.SendMessage.toggleActivity();
      },

      backButton: SDL.Button.extend({
        classNames: [
          'backButton'
          ],
          action: function(){
            SDL.SendMessage.toggleActivity();
          },
          target: 'SDL.SettingsController',
          goToState: 'light',
          icon: 'images/settings/close_icon.png',
          onDown: false
      }),
      lightStatusLabel: SDL.Label.extend({
          elementId: 'lightStatusLabel',
          classNames: 'lightStatusLabel',
          content: 'Light Status'
      }),
      lightStatusSelect: Em.Select.extend({
          elementId: 'lightStatusSelect',
          classNames: 'lightStatusSelect',
          contentBinding: 'SDL.LightModel.lightStatusStruct',
          valueBinding: 'SDL.LightModel.lightSettings.status'
      }),
      lightDensityLabel: SDL.Label.extend({
        elementId: 'lightDensityLabel',
        classNames: 'lightDensityLabel',
        content: 'Light Density'
      }),
      lightColorLabel: SDL.Label.extend({
        elementId: 'lightColorLabel',
        classNames: 'lightColorLabel',
        content: 'Light Color:'
      }),
      rLabel: SDL.Label.extend({
        elementId: 'rLabel',
        classNames: 'rLabel',
        content: 'R'
      }),
      gLabel: SDL.Label.extend({
        elementId: 'gLabel',
        classNames: 'gLabel',
        content: 'G'
      }),
      bLabel: SDL.Label.extend({
        elementId: 'bLabel',
        classNames: 'bLabel',
        content: 'B'
      }),
      densityInput: Ember.TextField.extend(
        {
          elementId: 'densityInput',
          classNames: 'densityInput',
          valueBinding: 'SDL.LightModel.lightSettings.density',
        }
      ),
      rInput: Ember.TextField.extend(
        {
          elementId: 'rInput',
          classNames: 'rInput',
          valueBinding: 'SDL.LightModel.lightSettings.sRGBColor.red',
        }
      ),
      gInput: Ember.TextField.extend(
        {
          elementId: 'gInput',
          classNames: 'gInput',
          valueBinding: 'SDL.LightModel.lightSettings.sRGBColor.green',
        }
      ),
      bInput: Ember.TextField.extend(
        {
          elementId: 'bInput',
          classNames: 'bInput',
          valueBinding: 'SDL.LightModel.lightSettings.sRGBColor.blue',
        }
      ),
      setButton: SDL.Button.extend({
        elementId: 'setButton',
        classNames: 'setButton',
        classNames: [
          'setButton'
          ],
          action: function(){
            SDL.SendMessage.setSetting();
          },
          target: 'SDL.SettingsController',
          goToState: 'light',
          text: 'Set',
          onDown: false,
      }),
});
