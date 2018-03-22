SDL.ExteriorLightView = Em.ContainerView.create({
    elementId: 'light_exterior_light',
    classNames: 'in_light_exterior_view',
    classNameBindings: [
      'SDL.States.settings.light.exteriorLight.active:active_state:inactive_state'
    ],
    childViews: [
        'backButton',     
        'appList',
        'label'
    ],
    label: SDL.Label.extend({
        elementId: 'label',
        classNames: 'label',
        content: 'Exterior light'
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
          elementId: 'light_exterior_list',
          itemsOnPage: 4,
          /** Items */
          items: []
    })
})
SDL.LightView.initList(SDL.LightModel.exteriorLightNameStruct,SDL.ExteriorLightView.appList.items);