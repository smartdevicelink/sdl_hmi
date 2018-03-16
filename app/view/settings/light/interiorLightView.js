SDL.InteriorLightView = Em.ContainerView.create({
    elementId: 'light_interior_light',
    classNames: 'in_light_interior_view',
    classNameBindings: [
      'SDL.States.settings.light.interiorLight.active:active_state:inactive_state'
    ],
    childViews: [
        'backButton',
        'appList',
        'label'
        
    ],
    label: SDL.Label.extend({
        elementId: 'label',
        classNames: 'label',
        content: 'Interior light'
    }),
    backButton: SDL.Button.extend({
        classNames: [
        'backButton'
        ],
        action: 'onState',
        target: 'SDL.SettingsController',
        goToState: 'light',
        icon: 'images/media/ico_back.png',
        onDown: false
    }),
    appList: SDL.List.extend({
          elementId: 'light_interior_list',
          itemsOnPage: 4,
          /** Items */
          items: []
    })
})
SDL.LightView.initList(SDL.LightModel.interiorLightNameStruct,SDL.InteriorLightView.appList.items);