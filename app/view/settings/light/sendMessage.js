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
        SDL.RCModulesController.currentLightModel.lightSettings.density = parseFloat(SDL.RCModulesController.currentLightModel.lightSettings.density);
        SDL.RCModulesController.currentLightModel.lightSettings.color.red = parseInt(SDL.RCModulesController.currentLightModel.lightSettings.color.red);
        SDL.RCModulesController.currentLightModel.lightSettings.color.green = parseInt(SDL.RCModulesController.currentLightModel.lightSettings.color.green);
        SDL.RCModulesController.currentLightModel.lightSettings.color.blue = parseInt(SDL.RCModulesController.currentLightModel.lightSettings.color.blue);
        var length = SDL.RCModulesController.currentLightModel.lightState.length;
        var moduleUUId = SDL.RCModulesController.currentLightModel.UUID;
        var data = SDL.deepCopy(SDL.RCModulesController.currentLightModel.lightSettings);
        var oldData;
        for(var i = 0; i < length; ++i){
          if(SDL.RCModulesController.currentLightModel.lightState[i].id == SDL.RCModulesController.currentLightModel.lightSettings.id){
            oldData = SDL.deepCopy(SDL.RCModulesController.currentLightModel.lightState[i]);
            SDL.RCModulesController.currentLightModel.lightState[i] = SDL.deepCopy(SDL.RCModulesController.currentLightModel.lightSettings);
            break;
          }
        }
        if(data.color.red == oldData.color.red && 
           data.color.green == oldData.color.green && 
           data.color.blue == oldData.color.blue){
          delete data['color'];
        }
        if(data.density == oldData.density){
          delete data['density'];
        }
        if (Object.keys(data).length > 0) {
          FFW.RC.onInteriorVehicleDataNotification({moduleType:'LIGHT',moduleId: moduleUUId, lightControlData: {lightState: [data]}});
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
          contentBinding: 'SDL.RCModulesController.currentLightModel.lightStatusStruct',
          valueBinding: 'SDL.RCModulesController.currentLightModel.lightSettings.status'
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
          valueBinding: 'SDL.RCModulesController.currentLightModel.lightSettings.density',
        }
      ),
      rInput: Ember.TextField.extend(
        {
          elementId: 'rInput',
          classNames: 'rInput',
          valueBinding: 'SDL.RCModulesController.currentLightModel.lightSettings.color.red',
        }
      ),
      gInput: Ember.TextField.extend(
        {
          elementId: 'gInput',
          classNames: 'gInput',
          valueBinding: 'SDL.RCModulesController.currentLightModel.lightSettings.color.green',
        }
      ),
      bInput: Ember.TextField.extend(
        {
          elementId: 'bInput',
          classNames: 'bInput',
          valueBinding: 'SDL.RCModulesController.currentLightModel.lightSettings.color.blue',
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
