

SDL.RPCViewHelper = {
    getBackButton: function(){
        return SDL.Button.extend({
            classNames: [
                'backControl'
            ],
            action: 'onState',
            target: 'SDL.SettingsController',
            goToState: 'rpccontrol',
            icon: 'images/media/ico_back.png',
            style: 'top: 100px',
            onDown: false
        });
    },

    getQueueControls: function(rpc){
        return Em.ContainerView.create({
            childViews: [
                'newButton',
                'removeButton',
                'previousButton',
                'nextButton',
                'counterLabel',
              ],

            newButton: SDL.Button.extend({
                classNames: [
                    'newButton'
                ],
                action: 'new' + rpc,
                target: 'FFW.RPCHelper',
                text: 'New',
                onDown: false
            }),

            removeButton: SDL.Button.extend({
                classNames: [
                    'removeButton'
                ],

                isDisabled: function() {
                    return FFW.RPCHelper[rpc + 'ResultCodes'].length == 1;
                }.property('FFW.RPCHelper.' + rpc + 'Index'),

                disabledBinding: 'isDisabled',
                action: 'remove' + rpc,
                target: 'FFW.RPCHelper',
                text: 'Remove',
                onDown: false
            }),

            previousButton: SDL.Button.extend({
                classNames: [
                    'previousButton'
                ],
                
                isDisabled: function() {
                    return FFW.RPCHelper[rpc + 'Index'] == 0;
                }.property('FFW.RPCHelper.' + rpc + 'Index'),

                disabledBinding: 'isDisabled',
                action: 'previous' + rpc,
                target: 'FFW.RPCHelper',
                text: 'Previous',
                onDown: false
            }),

            nextButton: SDL.Button.extend({
                classNames: [
                    'nextButton'
                ],

                isDisabled: function() {
                    return FFW.RPCHelper[rpc + 'Index'] == 
                                FFW.RPCHelper[rpc + 'ResultCodes'].length - 1;
                }.property('FFW.RPCHelper.' + rpc + 'Index'),

                disabledBinding: 'isDisabled',
                action: 'next' + rpc,
                target: 'FFW.RPCHelper',
                text: 'Next',
                onDown: false
            }),  

            counterLabel: SDL.Label.extend({
                elementId: 'counterLabel',
                classNames: 'counterLabel',
                contentBinding: 'FFW.RPCHelper.' + rpc + 'ResponseStatus'
            }),    
        });
    },

    getSingleSelect: function(rpc){
        return  Em.Select.extend({
              elementId: rpc + 'Select',
              classNames: rpc + 'Select',
              contentBinding: 'SDL.SDLModel.data.resultCodes',
              valueBinding: 'FFW.RPCHelper.' + rpc
        });
    }
};
