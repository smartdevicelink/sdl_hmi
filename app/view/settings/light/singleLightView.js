SDL.SingleLightView = Em.ContainerView.create({
    elementId: 'light_single_light',
    classNames: 'in_light_single_view',
    classNameBindings: [
      'SDL.States.settings.light.singleLight.active:active_state:inactive_state'
    ],
    childViews: [
        'backButton',
        'appList',
        'label'
    ],
    label: SDL.Label.extend({
        elementId: 'label',
        classNames: 'label',
        content: 'Single light'
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
          elementId: 'light_single_list',
          itemsOnPage: 4,
          /** Items */
          items: []
    })
})
SDL.LightView.initList(SDL.LightModel.singleLightNameStruct,SDL.SingleLightView.appList.items);