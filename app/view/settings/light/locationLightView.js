SDL.LocationLightView = Em.ContainerView.create({
    elementId: 'light_location_light',
    classNames: 'in_light_location_view',
    classNameBindings: [
      'SDL.States.settings.light.locationLight.active:active_state:inactive_state'
    ],
    childViews: [
        'backButton',
        'appList',
        'label'
    ],
    label: SDL.Label.extend({
        elementId: 'label',
        classNames: 'label',
        content: 'Location light'
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
          elementId: 'light_location_list',
          itemsOnPage: 4,
          /** Items */
          items: []
    })
})
SDL.LightView.initList(SDL.LightModel.locationLightNameStruct,SDL.LocationLightView.appList.items);