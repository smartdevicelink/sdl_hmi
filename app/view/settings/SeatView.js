/*
 * Copyright (c) 2018, Ford Motor Company All rights reserved.
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
 * @name SDL.SeatView
 * @desc Info Apps visual representation
 * @category View
 * @filesource app/view/settings/SeatView.js
 * @version 1.0
 */

SDL.SeatView = Em.ContainerView.create({
    elementId: 'seat',
    classNames: 'in_seat_view',

    classNameBindings: [
        'SDL.States.settings.seat.active:active_state:inactive_state'
    ],

    childViews: [
        'set',
        'id',
        'massageEnable',
        'heating',
        'cooling',
        'position',
        'backTiltAngle',
        'memory',
        'massageMode',
        'cushionFirmness'
    ],

    heating: Em.ContainerView.create({
        elementId: 'heating',
        classNames: 'in_seat_heating_view', 

        childViews: [
            'enable',
            'level'
        ],

        enable: Em.ContainerView.create({
            elementId: 'enable',
            classNames: 'in_seat_enable_view',

            childViews: [
                'enableLabel',
                'enableSelect'
            ],

            enableLabel: SDL.Label.extend({
                elementId: 'enableLabel',
                classNames: 'enableLabel',
                content: 'Heating enable'
            }),

            enableSelect:  Em.Select.extend({
                elementId: 'heating_enableSelect',
                classNames: 'enableSelect',
                contentBinding: 'SDL.SeatModel.enableStruct',
                valueBinding: 'SDL.SeatModel.heatingEnableData',
                change:function(){
                    SDL.SeatModel.set('tempSeatControlData.heatingEnabled',
                (SDL.SeatModel.heatingEnableData=='OFF')? true:false);
                SDL.SeatModel.update();
                }
            })
        }),

        level: Em.ContainerView.create({
            elementId: 'level',
            classNames: 'in_seat_level_view',

            childViews: [
                'levelLabel',
                'levelInput'
            ],

            levelLabel: SDL.Label.extend({
                elementId: 'levelLabel',
                classNames: 'levelLabel',
                content: 'Level'
            }),

            levelInput: Ember.TextField.extend({
                elementId: 'levelInput',
                classNames: 'levelInput',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.heatingLevel',      
            })
        })
    }),

    cooling: Em.ContainerView.create({
        elementId: 'cooling',
        classNames: 'in_seat_cooling_view',

        childViews: [
            'enable',
            'level'
        ],

        enable: Em.ContainerView.create({
            elementId: 'enable',
            classNames: 'in_seat_enable_view',

            childViews: [
                'enableLabel',
                'enableSelect'
            ],

            enableLabel: SDL.Label.extend({
                elementId: 'enableLabel',
                classNames: 'enableLabel',
                content: 'Cooling enable'
            }),

            enableSelect:  Em.Select.extend({
                elementId: 'cooling_enableSelect',
                classNames: 'enableSelect',
                contentBinding: 'SDL.SeatModel.enableStruct',
                valueBinding: 'SDL.SeatModel.coolingEnabledData',
                change:function(){
                    SDL.SeatModel.set('tempSeatControlData.coolingEnabled',
                (SDL.SeatModel.coolingEnabledData=='OFF')? true:false);
                SDL.SeatModel.update();
                }
            })
        }),

        level: Em.ContainerView.create({
            elementId: 'level',
            classNames: 'in_seat_level_view',

            childViews: [
                'levelLabel',
                'levelInput'
            ],

            levelLabel: SDL.Label.extend({
                elementId: 'levelLabel',
                classNames: 'levelLabel',
                content: 'Level'
            }),

            levelInput: Ember.TextField.extend({
                elementId: 'coolingLevelInput',
                classNames: 'levelInput',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.coolingLevel'     
            })
        })  
    }),

    cushionFirmness:Em.ContainerView.create({
        elementId: 'cushionFirmness',
        classNames: 'in_seat_cushionFirmness_view',

        childViews: [
            'cushionFirmnessLabel',
            'addButton',
            'massageCushionFirmness0',
            'massageCushionFirmness1',
            'massageCushionFirmness2',
            'massageCushionFirmness3',
            'massageCushionFirmness4'
        ],

        rm: function(item){
            var length = SDL.SeatModel.tempSeatControlData.massageCushionFirmness.length;
            if(length < 2){
                return;
            }
            for(var i = item; i < length - 1; ++i){
                SDL.SeatModel.tempSeatControlData.massageCushionFirmness[i] = 
                    SDL.SeatModel.tempSeatControlData.massageCushionFirmness[i+1];
            }
            SDL.SeatModel.tempSeatControlData.massageCushionFirmness.pop();
            SDL.SeatModel.update();        
        },

        addButton: SDL.Button.extend({
            elementId: 'cushionFirmnessAddButton',
            classNames: 'addButton',
            classNames: [
              'addButton'
              ],
              action: function(){
                if(SDL.SeatModel.tempSeatControlData.massageCushionFirmness.length > 4){
                    return;
                }
                SDL.SeatModel.tempSeatControlData.massageCushionFirmness.push(SDL.SeatModel.massageCushionFirmness);
                SDL.SeatModel.update();
              },
              text: 'Add',
              onDown: false,
        }),

        cushionFirmnessLabel: SDL.Label.create({
            elementId: 'ushionFirmnessLabel',
            classNames: 'in_seat_cushionFirmnessLabel_view',
            content: 'Cushion Firmness'
        }),

        massageCushionFirmness0: Em.ContainerView.create({
            elementId: 'massageCushionFirmness0',
            classNames: 'in_seat_cushionFirmnes_view',

            classNameBindings: [
                'SDL.SeatModel.massageCushionFirmness0:active_state:inactive_state'
            ],
       
            childViews: [
                'cushion',
                'firmnes',
                'dellButton'
            ],

            dellButton: SDL.Button.extend({
                classNames: [
                    'dellButton'
                ],

                action: function(){
                    SDL.SeatView.cushionFirmness.rm(0);  
                },

                icon: 'images/settings/close_icon_min.png',
                target: 'SDL.SettingsController',
                onDown: false,
            }),

            cushion:Em.ContainerView.create({
                elementId: 'cushion',
                classNames: 'in_seat_cushion_view',

                childViews: [
                    'cushionLabal',
                    'cushionSelect'
                ],

                cushionLabal: SDL.Label.extend({
                    elementId: 'cushionLabal',
                    classNames: 'cushionLabal',
                    content: 'Cushion'
                }),

                cushionSelect: Em.Select.create({
                    elementId: 'cushionSelect',
                    classNames: 'cushionSelect',
                    contentBinding: 'SDL.SeatModel.massageCushionStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.0.cushion'
                })
            }),

            firmnes:Em.ContainerView.create({
                elementId: 'firmnes',
                classNames: 'in_seat_firmnes_view',

                childViews: [
                    'firmnesLabal',
                    'firmnesInput'
                ],

                firmnesLabal: SDL.Label.extend({
                    elementId: 'firmnesLabal',
                    classNames: 'firmnesLabal',
                    content: 'Firmness'
                }),

                firmnesInput: Em.TextField.create({
                    elementId: 'firmnesInput',
                    classNames: 'firmnesInput',
                    tupe: 'integer',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.0.firmness' 
                })
            })
        }),

        massageCushionFirmness1: Em.ContainerView.create({
            elementId: 'massageCushionFirmness1',
            classNames: 'in_seat_cushionFirmnes_view',
            
            classNameBindings: [
                'SDL.SeatModel.massageCushionFirmness1:active_state:inactive_state'
            ],
            
            childViews: [
                'cushion',
                'firmnes',
                'dellButton'
            ],

            dellButton: SDL.Button.extend({
                elementId: 'massageCushionFirmness1_dellButton',
                classNames: 'dellButton',

                classNames: [
                  'dellButton'
                ],

                action: function(){
                    SDL.SeatView.cushionFirmness.rm(1); 
                },

                icon: 'images/settings/close_icon_min.png',
                target: 'SDL.SettingsController',
                onDown: false,
            }),

            cushion:Em.ContainerView.create({
                elementId: 'cushion',
                classNames: 'in_seat_cushion_view',

                childViews: [
                    'cushionLabal',
                    'cushionSelect1'
                ],

                cushionLabal: SDL.Label.extend({
                    elementId: 'cushionLabal',
                    classNames: 'cushionLabal',
                    content: 'Cushion'
                }),

                cushionSelect1: Em.Select.create({
                    elementId: 'cushionSelect1',
                    classNames: 'cushionSelect',
                    contentBinding: 'SDL.SeatModel.massageCushionStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.1.cushion'
                })
            }),

            firmnes:Em.ContainerView.create({
                elementId: 'firmnes',
                classNames: 'in_seat_firmnes_view',

                childViews: [
                    'firmnesLabal',
                    'firmnesInput'
                ],

                firmnesLabal: SDL.Label.extend({
                    elementId: 'firmnesLabal',
                    classNames: 'firmnesLabal',
                    content: 'Firmness'
                }),

                firmnesInput: Em.TextField.create({
                    elementId: 'massageCushionFirmness1_firmnesInput',
                    classNames: 'firmnesInput',
                    tupe: 'integer',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.1.firmness' 
                })
            })
        }),

        massageCushionFirmness2: Em.ContainerView.create({
            elementId: 'massageCushionFirmness2',
            classNames: 'in_seat_cushionFirmnes_view',
            
            classNameBindings: [
                'SDL.SeatModel.massageCushionFirmness2:active_state:inactive_state'
            ],
       
            
            childViews: [
                'cushion',
                'firmnes',
                'dellButton'
            ],

            dellButton: SDL.Button.extend({
                elementId: 'massageCushionFirmness2_dellButton',
                classNames: 'dellButton',

                classNames: [
                  'dellButton'
                ],

                action: function(){
                    SDL.SeatView.cushionFirmness.rm(2); 
                },

                icon: 'images/settings/close_icon_min.png',
                target: 'SDL.SettingsController',
                onDown: false,
              }),

            cushion:Em.ContainerView.create({
                elementId: 'cushion',
                classNames: 'in_seat_cushion_view',

                childViews: [
                    'cushionLabal',
                    'cushionSelect2'
                ],

                cushionLabal: SDL.Label.extend({
                    elementId: 'cushionLabal',
                    classNames: 'cushionLabal',
                    content: 'Cushion'
                }),

                cushionSelect2: Em.Select.create({
                    elementId: 'cushionSelect2',
                    classNames: 'cushionSelect',
                    contentBinding: 'SDL.SeatModel.massageCushionStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.2.cushion'
                })
            }),
            firmnes:Em.ContainerView.create({
                elementId: 'firmnes',
                classNames: 'in_seat_firmnes_view',
                
                childViews: [
                    'firmnesLabal',
                    'firmnesInput'
                ],

                firmnesLabal: SDL.Label.extend({
                    elementId: 'firmnesLabal',
                    classNames: 'firmnesLabal',
                    content: 'Firmness'
                }),

                firmnesInput: Em.TextField.create({
                    elementId: 'massageCushionFirmness2_firmnesInput',
                    classNames: 'firmnesInput',
                    tupe: 'integer',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.2.firmness' 
                })
            })
        }),
        massageCushionFirmness3: Em.ContainerView.create({
            elementId: 'massageCushionFirmness3',
            classNames: 'in_seat_cushionFirmnes_view',
            
            classNameBindings: [
                'SDL.SeatModel.massageCushionFirmness3:active_state:inactive_state'
            ],
       
            childViews: [
                'cushion',
                'firmnes',
                'dellButton'
            ],

            dellButton: SDL.Button.extend({
                elementId: 'massageCushionFirmness3_dellButton',
                classNames: 'dellButton',

                classNames: [
                  'dellButton'
                ],

                action: function(){
                    SDL.SeatView.cushionFirmness.rm(3); 
                },

                icon: 'images/settings/close_icon_min.png',
                target: 'SDL.SettingsController',
                onDown: false,
            }),

            cushion:Em.ContainerView.create({
                elementId: 'cushion',
                classNames: 'in_seat_cushion_view',

                childViews: [
                    'cushionLabal',
                    'cushionSelect3'
                ],
                
                cushionLabal: SDL.Label.extend({
                    elementId: 'cushionLabal',
                    classNames: 'cushionLabal',
                    content: 'Cushion'
                }),

                cushionSelect3: Em.Select.create({
                    elementId: 'cushionSelect3',
                    classNames: 'cushionSelect',
                    contentBinding: 'SDL.SeatModel.massageCushionStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.3.cushion'
                })
            }),

            firmnes:Em.ContainerView.create({
                elementId: 'firmnes',
                classNames: 'in_seat_firmnes_view',

                childViews: [
                    'firmnesLabal',
                    'firmnesInput'
                ],

                firmnesLabal: SDL.Label.extend({
                    elementId: 'firmnesLabal',
                    classNames: 'firmnesLabal',
                    content: 'Firmness'
                }),

                firmnesInput: Em.TextField.create({
                    elementId: 'massageCushionFirmness3_firmnesInput',
                    classNames: 'firmnesInput',
                    tupe: 'integer',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.3.firmness' 
                })
            })
        }),

        massageCushionFirmness4: Em.ContainerView.create({
            elementId: 'massageCushionFirmness4',
            classNames: 'in_seat_cushionFirmnes_view',
            
            classNameBindings: [
                'SDL.SeatModel.massageCushionFirmness4:active_state:inactive_state'
            ],

            childViews: [
                'cushion',
                'firmnes',
                'dellButton'
            ],

            dellButton: SDL.Button.extend({
                elementId: 'massageCushionFirmness4_dellButton',
                classNames: 'dellButton',

                classNames: [
                  'dellButton'
                ],

                action: function(){
                    SDL.SeatView.cushionFirmness.rm(4); 
                },

                icon: 'images/settings/close_icon_min.png',
                target: 'SDL.SettingsController',
                onDown: false,
              }),
            cushion:Em.ContainerView.create({
                elementId: 'cushion',
                classNames: 'in_seat_cushion_view',

                childViews: [
                    'cushionLabal',
                    'cushionSelect4'
                ],

                cushionLabal: SDL.Label.extend({
                    elementId: 'cushionLabal',
                    classNames: 'cushionLabal',
                    content: 'Cushion'
                }),

                cushionSelect4: Em.Select.create({
                    elementId: 'cushionSelect4',
                    classNames: 'cushionSelect',
                    contentBinding: 'SDL.SeatModel.massageCushionStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.4.cushion'
                })
            }),

            firmnes:Em.ContainerView.create({
                elementId: 'firmnes',
                classNames: 'in_seat_firmnes_view',

                childViews: [
                    'firmnesLabal',
                    'firmnesInput'
                ],

                firmnesLabal: SDL.Label.extend({
                    elementId: 'firmnesLabal',
                    classNames: 'firmnesLabal',
                    content: 'Firmness'
                }),

                firmnesInput: Em.TextField.create({
                    elementId: 'massageCushionFirmness4_firmnesInput',
                    classNames: 'firmnesInput',
                    tupe: 'integer',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageCushionFirmness.4.firmness' 
                })
            })
        })
        
    }),

    position: Em.ContainerView.create({
        elementId: 'position',
        classNames: 'in_seat_position_view',

        childViews: [
            'positionLabel',
            'horisontal',
            'vertical',
            'seatFrontVertical',
            'seatBackVertical',
            'headSupportHorizontal',
            'headSupportVertical'
        ],

        positionLabel:SDL.Label.extend({
            elementId: 'positionLabel',
            classNames: 'positionLabel',
            content: 'Position'
        }),

        horisontal: Em.ContainerView.create({
            elementId: 'horisontal',
            classNames: 'in_seat_horisontal_view',

            childViews: [
                'label',
                'input'
            ],

            label:SDL.Label.extend({
                elementId: 'label',
                classNames: 'label',
                content: 'Horizontal'
            }),

            input:Ember.TextField.extend({
                elementId: 'horisontalInput',
                classNames: 'input',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.horizontalPosition'      
            })
        }),

        vertical: Em.ContainerView.create({
            elementId: 'vertical',
            classNames: 'in_seat_vertical_view',

            childViews: [
                'label',
                'input'
            ],

            label:SDL.Label.extend({
                elementId: 'label',
                classNames: 'label',
                content: 'Vertical'
            }),

            input:Ember.TextField.extend({
                elementId: 'verticalInput',
                classNames: 'input',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.verticalPosition'      
            })
        }),

        seatFrontVertical: Em.ContainerView.create({
            elementId: 'seatFrontVertical',
            classNames: 'in_seat_seatFrontVertical_view',

            childViews: [
                'label',
                'input'
            ],

            label:SDL.Label.extend({
                elementId: 'label',
                classNames: 'label',
                content: 'Seat-front vertical'
            }),

            input:Ember.TextField.extend({
                elementId: 'seatFrontVerticalInput',
                classNames: 'input',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.frontVerticalPosition',      
            })
        }),

        seatBackVertical: Em.ContainerView.create({
            elementId: 'seatBackVertical',
            classNames: 'in_seat_seatBackVertical_view',

            childViews: [
                'label',
                'input'
            ],

            label:SDL.Label.extend({
                elementId: 'label',
                classNames: 'label',
                content: 'Seat-back vertical'
            }),

            input:Ember.TextField.extend({
                elementId: 'seatBackVerticalInput',
                classNames: 'input',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.backVerticalPosition'      
            })
        }),

        headSupportHorizontal: Em.ContainerView.create({
            elementId: 'headSupportHorizontal',
            classNames: 'in_seat_headSupportHorizontal_view',
            
            childViews: [
                'label',
                'input'
            ],

            label:SDL.Label.extend({
                elementId: 'label',
                classNames: 'label',
                content: 'Head support horizontal'
            }),

            input:Ember.TextField.extend({
                elementId: 'headSupportHorizontalInput',
                classNames: 'input',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.headSupportHorizontalPosition'            
            })
        }),

        headSupportVertical: Em.ContainerView.create({
            elementId: 'headSupportVertical',
            classNames: 'in_seat_headSupportVertical_view',

            childViews: [
                'label',
                'input'
            ],

            label:SDL.Label.extend({
                elementId: 'label',
                classNames: 'label',
                content: 'Head support vertical'
            }),

            input:Ember.TextField.extend({
                elementId: 'headSupportVerticalInput',
                classNames: 'input',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.headSupportVerticalPosition'      
            })
        })
    }),

    backTiltAngle: Em.ContainerView.create({
        elementId: 'backTiltAngle',
        classNames: 'in_seat_backTiltAngle_view',

        childViews: [
            'label',
            'input'
        ],

        label: SDL.Label.extend({
            elementId: 'label',
            classNames: 'label',
            content: 'Back tilt angle'
        }),

        input: Ember.TextField.extend({
            elementId: 'backTiltAngleInput',
            classNames: 'input',
            tupe: 'integer',
            valueBinding: 'SDL.SeatModel.tempSeatControlData.backTiltAngle'               
        })
    }),

    memory: Em.ContainerView.create({
        elementId: 'memory',
        classNames: 'in_memory_view',

        childViews: [
            'memoryLabel',
            'memoryId',
            'label',
            'action'
        ],

        memoryLabel: SDL.Label.extend({
            elementId: 'memoryLabel',
            classNames: 'memoryLabel',
            content: 'Memory action'
        }),

        memoryId: Em.ContainerView.create({
            elementId: 'memoryId',
            classNames: 'in_memoryId_view',

            childViews: [
                'labelId',
                'inputId'
            ],

            labelId: SDL.Label.extend({
                elementId: 'labelId',
                classNames: 'labelId',
                content: 'ID'
            }),

            inputId: Ember.TextField.extend({
                elementId: 'inputId',
                classNames: 'inputId',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.memory.id'               
            })
        }),
        label: Em.ContainerView.create({
            elementId: 'label',
            classNames: 'in_label_view',

            childViews: [
                'labelLabel',
                'inputLabel'
            ],

            labelLabel: SDL.Label.extend({
                elementId: 'labelLabel',
                classNames: 'labelLabel',
                content: 'Label'
            }),

            inputLabel: Ember.TextField.extend({
                elementId: 'inputLabel',
                classNames: 'inputLabel',
                tupe: 'integer',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.memory.label'               
            })
        }),

        action: Em.ContainerView.create({
            elementId: 'action',
            classNames: 'in_action_view',
            
            childViews: [
                'actionLabel',
                'actionSelect'
            ],

            actionLabel:  SDL.Label.extend({
                elementId: 'actionLabel',
                classNames: 'actionLabel',
                content: 'Action'
            }),

            actionSelect: Em.Select.extend({
                elementId: 'actionSelect',
                classNames: 'actionSelect',
                contentBinding: 'SDL.SeatModel.seatMemoryActionTypeStruct',
                valueBinding: 'SDL.SeatModel.tempSeatControlData.memory.action',
                change:function(){
                    switch(this.selection){
                        case 'SAVE':
                        if(SDL.SeatModel.tempSeatControlData.memory.id>0 &
                            SDL.SeatModel.tempSeatControlData.memory.id<=10){
                        if(SDL.SeatModel.ID=='DRIVER'){
                            SDL.SeatModel.set('seatControlData',
                                SDL.SeatModel.driverMemory[SDL.SeatModel.tempSeatControlData.memory.id]
                            );
                            SDL.SeatModel.applySettings();

                            SDL.SeatModel.driverMemory[SDL.SeatModel.tempSeatControlData.memory.id]=
                                SDL.deepCopy(SDL.SeatModel.tempSeatControlData);
                            return;
                        }
                        if(SDL.SeatModel.ID=='FRONT_PASSENGER'){
                            SDL.SeatModel.set('seatControlData',
                                SDL.SeatModel.passengerMemory[SDL.SeatModel.tempSeatControlData.memory.id]
                            );
                            SDL.SeatModel.applySettings();

                            SDL.SeatModel.passengerMemory[SDL.SeatModel.tempSeatControlData.memory.id]=
                                SDL.deepCopy(SDL.SeatModel.tempSeatControlData);
                            return;
                        }
                        }
                        break;
                        case 'RESTORE':
                        if(SDL.SeatModel.ID=='DRIVER'){
                            if(SDL.SeatModel.driverMemory[SDL.SeatModel.tempSeatControlData.memory.id]){
                                SDL.SeatModel.set('seatControlData',
                                    SDL.deepCopy(SDL.SeatModel.tempSeatControlData)
                                );
                                SDL.SeatModel.set('tempSeatControlData',
                                    SDL.SeatModel.driverMemory[SDL.SeatModel.tempSeatControlData.memory.id]
                                );
                                SDL.SeatModel.update();
                                SDL.SeatModel.applySettings();
                            }
                        }
                        if(SDL.SeatModel.ID=='FRONT_PASSENGER'){
                            if(SDL.SeatModel.passengerMemory[SDL.SeatModel.tempSeatControlData.memory.id]){
                                SDL.SeatModel.set('seatControlData',
                                    SDL.deepCopy(SDL.SeatModel.tempSeatControlData)
                                );
                                SDL.SeatModel.set('tempSeatControlData',
                                    SDL.SeatModel.passengerMemory[SDL.SeatModel.tempSeatControlData.memory.id]
                                );
                                SDL.SeatModel.update();
                                SDL.SeatModel.applySettings();
                            }
                        }
                        break;
                        case 'NONE':break;
                    }
                }
            })
        }),
    }),
    set: SDL.Button.create({
            classNames: [
              'setButton'
            ],

            text: 'Set',
            onDown: false,
            target: 'SDL.SeatModel',
            action: 'applySettings'
    }),

    massageEnable: Em.ContainerView.extend({
        elementId: 'massageEnable',
        classNames: 'in_massageEnable_view',
        
        childViews: [
            'label',
            'select'
        ],

        label: SDL.Label.extend({
            elementId: 'massageEnable_label',
            classNames: 'massageEnable_label',
            content: 'Massage'
        }),

        select: Em.Select.create({
            elementId: 'massageEnable_enableSelect',
            classNames: 'massageEnable_enableSelect',
            contentBinding: 'SDL.SeatModel.enableStruct',
            valueBinding: 'SDL.SeatModel.massageEnabledData',
            change:function(){
                SDL.SeatModel.set('tempSeatControlData.massageEnabled',
            (SDL.SeatModel.massageEnabledData=='OFF')? true:false);
            SDL.SeatModel.update();
            }
        })
    }),    
    id: Em.ContainerView.extend({
        elementId: 'id',
        classNames: 'in_id_view',

        childViews: [
            'label',
            'select'
        ],
        label: SDL.Label.extend({
            elementId: 'idlabel',
            classNames: 'idlabel',
            content: 'ID'
        }),

        select: Em.Select.create({
            elementId: 'idSelect',
            classNames: 'idSelect',
            contentBinding: 'SDL.SeatModel.supportedSeatStruct',
            valueBinding: 'SDL.SeatModel.ID',
            change: function(){
                if(SDL.SeatModel.ID!='DRIVER'){
                    SDL.SeatModel.set('temp.1',
                    SDL.deepCopy(SDL.SeatModel.tempSeatControlData));
                    SDL.SeatModel.set('tempSeatControlData',
                    SDL.deepCopy(SDL.SeatModel.temp[0]));
                    SDL.SeatModel.update();
                    return;
                }
                if(SDL.SeatModel.ID!='FRONT_PASSENGER'){
                    SDL.SeatModel.set('temp.0',
                    SDL.deepCopy(SDL.SeatModel.tempSeatControlData));
                    SDL.SeatModel.tempSeatControlData=
                    SDL.deepCopy(SDL.SeatModel.temp[1]);
                    SDL.SeatModel.update();
                    return;
                }
            }
        })
    }),

    massageMode: Em.ContainerView.create({
        elementId: 'massageMode',
        classNames: 'in_seat_massageModes_view',

        childViews: [
            'massageModeLabel',
            'addButton',
            'massageMode0',
            'massageMode1'
        ],

        rm: function(item){
            var length = SDL.SeatModel.tempSeatControlData.massageMode.length;
            if(length < 2){
                return;
            }
            for(var i = item; i < length - 1; ++i){
                SDL.SeatModel.tempSeatControlData.massageMode[i] = 
                    SDL.SeatModel.tempSeatControlData.massageMode[i+1];
            }
            SDL.SeatModel.tempSeatControlData.massageMode.pop();
            SDL.SeatModel.update();        
        },

        addButton: SDL.Button.extend({
            elementId: 'addButton',
            classNames: 'addButton',

            classNames: [
                'addButton'
            ],

            action: function(){
                if(SDL.SeatModel.tempSeatControlData.massageMode.length > 2){
                    return;
                }
                SDL.SeatModel.tempSeatControlData.massageMode.push(SDL.SeatModel.massageModeData);
                SDL.SeatModel.update();
            },

            text: 'Add',
            onDown: false,
        }),

        massageModeLabel: SDL.Label.create({
            elementId: 'massageModeLabel',
            classNames: 'massageModeLabel',
            content: 'Massage mode'
        }),

        massageMode0: Em.ContainerView.create({
            elementId: 'massageMode0',
            classNames: 'in_seat_massageMode_view',

            classNameBindings: [
                'SDL.SeatModel.massageMode0:active_state:inactive_state'
            ],

            childViews: [
                'zone',
                'mode',
                'dellButton'
            ],

            dellButton: SDL.Button.extend({
                elementId: 'massageMode0_dellButton',
                classNames: 'dellButton',

                classNames: [
                  'dellButton'
                ],

                action: function(){
                    SDL.SeatView.massageMode.rm(0); 
                },

                icon: 'images/settings/close_icon_min.png',
                target: 'SDL.SettingsController',
                onDown: false,
            }),

            zone:  Em.ContainerView.create({
                elementId: 'zone',
                classNames: 'in_zone_view',
                
                childViews: [
                    'label',
                    'select'
                ],

                label: SDL.Label.extend({
                    elementId: 'zone_label',
                    classNames: 'zone_label',
                    content: 'Zone'
                }),

                select: Em.Select.create({
                    elementId: 'zone_select',
                    classNames: 'zone_select',
                    contentBinding: 'SDL.SeatModel.massageZoneStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageMode.0.massageZone'
                })
            }),

            mode:  Em.ContainerView.create({
                elementId: 'modeM',
                classNames: 'in_mode_view',

                childViews: [
                    'label',
                    'select'
                ],

                label: SDL.Label.extend({
                    elementId: 'mode_label',
                    classNames: 'mode_label',
                    content: 'Mode'
                }),

                select: Em.Select.create({
                    elementId: 'mode_select',
                    classNames: 'mode_select',
                    contentBinding: 'SDL.SeatModel.massageModeStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageMode.0.massageMode'
                })
            })
        }),

        massageMode1: Em.ContainerView.create({
            elementId: 'massageMode1',
            classNames: 'in_seat_massageMode_view',

            classNameBindings: [
                'SDL.SeatModel.massageMode1:active_state:inactive_state'
            ],

            childViews: [
                'zone',
                'mode',
                'dellButton'
            ],

            dellButton: SDL.Button.extend({
                elementId: 'massageMode1_dellButton',
                classNames: 'dellButton',

                classNames: [
                  'dellButton'
                ],

                action: function(){
                    SDL.SeatView.massageMode.rm(1); 
                },

                icon: 'images/settings/close_icon_min.png',
                target: 'SDL.SettingsController',
                onDown: false,
            }),

            zone:  Em.ContainerView.create({
                elementId: 'zone',
                classNames: 'in_zone_view',

                childViews: [
                    'label',
                    'select'
                ],

                label: SDL.Label.extend({
                    elementId: 'zone_label',
                    classNames: 'zone_label',
                    content: 'Zone'
                }),

                select: Em.Select.create({
                    elementId: 'massageMode1_zone_select',
                    classNames: 'zone_select',
                    contentBinding: 'SDL.SeatModel.massageZoneStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageMode.1.massageZone'
                })
            }),

            mode:  Em.ContainerView.create({
                elementId: 'modeM',
                classNames: 'in_mode_view',

                childViews: [
                    'label',
                    'select'
                ],

                label: SDL.Label.extend({
                    elementId: 'mode_label',
                    classNames: 'mode_label',
                    content: 'Mode'
                }),
                
                select: Em.Select.create({
                    elementId: 'massageMode1_mode_select',
                    classNames: 'mode_select',
                    contentBinding: 'SDL.SeatModel.massageModeStruct',
                    valueBinding: 'SDL.SeatModel.tempSeatControlData.massageMode.1.massageMode'
                })
            })
        })

    })
})

