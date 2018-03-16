/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
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
 * @name SDL.States
 * @desc State manager definition
 * @category State Manager
 * @filesource app/StateManager.js
 * @version 1.0
 */

// Extend base Em.State object
Em.State.reopen(
  {
    // used for determine display status
    active: false,
    enter: function() {
      this.set('active', true);
    },
    exit: function() {
      this.set('active', false);
      SDL.SDLController.triggerState();
    }
  }
);
// State Manager class
var StateManager = Em.StateManager.extend(
  {
    // default state
    initialState: 'home',
    /**
     * Name of the next state to which at the moment is a transition
     */
    nextState: 'home',
    /**
     * Method used for determine previous currentState and make
     */
    goToStates: function(stateName) {
      SDL.SDLController.userStateAction();
      this.set('nextState', stateName);
      this.transitionTo(stateName);
    },
    /** Go to parent state */
    back: function() {
      if (this.currentState.parentState.hasOwnProperty('name')) {
        this.goToStates(this.currentState.parentState.get('path'));
      } else {
        this.goToStates('home');
      }
      SDL.StateVisitor.visit(this.currentState);
    },
    /** Home state */
    home: Em.State.create(
      {}
    ),
    /** Climate state */
    climate: Em.State.create(
      {}
    ),
    /** info state */
    info: Em.State.create(
      {
        exit: function() {
          SDL.InfoController.set(
            'activeState', SDL.States.currentState.get('path')
          );
          this._super();
        },
        services: Em.State.create(
          {}
        ),
        travelLink: Em.State.create(
          {}
        ),
        alerts: Em.State.create(
          {}
        ),
        calendar: Em.State.create(
          {}
        ),
        apps: Em.State.create(
          {
            /**
             * Calls function from BasicCommunicationRPC to get new list of
             * applications
             */
            enter: function() {
              this._super();
              FFW.BasicCommunication.OnFindApplications();
            }
          }
        ),
        devicelist: Em.State.create(
          {
            /**
             * Calls function to clear device list on DeviceListView
             */
            enter: function() {
              this._super();
              SDL.DeviceListView.clearDeviceList();
              FFW.BasicCommunication.OnStartDeviceDiscovery();
            }
          }
        ),
        devicelocation: Em.State.create(
          {
            /**
             * Calls function to clear device list on DeviceListView
             */
            enter: function() {
              this._super();
              FFW.BasicCommunication.OnStartDeviceDiscovery();
            }
          }
        ),
        nonMedia: Em.State.create(
          {
            enter: function() {
              this._super();
              if (SDL.SDLModel.data.mediaPlayerActive) {
                SDL.SDLController.onEventChanged('player', false);
              }
              SDL.SDLController.activateTBT();
            },
            exit: function() {
              this._super();
              SDL.SDLModel.data.set('limitedExist', false);
              SDL.SDLController.deactivateApp();
            }
          }
        )
      }
    ),
    /** settings state */
    settings: Em.State.create(
      {
        exit: function() {
          SDL.SettingsController.set(
            'activeState', SDL.States.currentState.get('path')
          );
          this._super();
        },
        policies: Em.State.create(
          {
            statisticsInfo: Em.State.create({}),
            getUrls: Em.State.create({}),
            connectionSettings: Em.State.create(
              {
                enter: function() {
                  this._super();
                  SDL.ConnectionSettingsView.showEntitiesList();
                }
              }
            ),
            deviceConfig: Em.State.create(
              {
                enter: function() {
                  this._super();
                  SDL.DeviceConfigView.showDeviceList();
                }
              }
            ),
            appPermissionsList: Em.State.create(
              {
                enter: function() {
                  this._super();
                }
              }
            ),
            appPermissions: Em.State.create({}),
            systemError: Em.State.create({}),
            deviceStateChange: Em.State.create(
              {
                enter: function() {
                  this._super();
                  SDL.DeviceStateChangeView.showDeviceList();
                }
              }
            ),
            rsdlOptionsList: Em.State.create(
              {
                enter: function() {
                  this._super();
                }
              }
            )
          }
        ),
        HMISettings: Em.State.create({}),

        light: Em.State.create({
          singleLight: Em.State.create({
                enter: function() {
                  this._super();
                }
          }),
          exteriorLight: Em.State.create({
            enter: function() {
              this._super();
            }
          }),
          interiorLight: Em.State.create({
            enter: function() {
              this._super();
            }
          }),
          locationLight: Em.State.create({
            enter: function() {
              this._super();
            }
          })
        })
      }
    ),
    /** Media state */
    media: Em.State.create(
      {
        player: Em.State.create(
          {
            enter: function() {
              if (SDL.SDLController.model) {
                SDL.SDLController.model.set('active', false);
              }
              SDL.SDLController.onEventChanged(this.name, true);
              this._super();
            },
            radio: Em.State.create(
              {
                enter: function() {
                  SDL.MediaController.set('activeState',
                    SDL.States.nextState);
                    SDL.RadioModel.sendAudioNotification();
                  if (!SDL.RadioModel.radioControlStruct.radioEnable) {
                    SDL.RadioModel.radioEnableKeyPress();
                  }
                  this._super();
                },
                exit: function() {
                  SDL.MediaController.deactivateCD();
                  SDL.MediaController.currentSelectedPlayer.pause();
                  SDL.MediaController.deactivateUSB();
                  SDL.MediaController.deactivateBluetooth();
                  SDL.MediaController.deactivateLineIn();
                  SDL.MediaController.deactivateIPod();
                  this._super();
                }
              }
            ),
            cd: Em.State.create(
              {
                enter: function() {
                  SDL.MediaController.set('activeState',
                    SDL.States.nextState);
                  SDL.CDModel.sendAudioNotification();
                  this._super();
                },
                exit: function() {
                  SDL.MediaController.deactivateRadio();
                  SDL.MediaController.deactivateUSB();
                  SDL.MediaController.deactivateBluetooth();
                  SDL.MediaController.deactivateLineIn();
                  SDL.MediaController.deactivateIPod();
                  
                  this._super();
                },
                moreinfo: Em.State.create(
                  {}
                )
              }
            ),
            usb: Em.State.create(
              {
                enter: function() {
                  SDL.MediaController.set('activeState',
                    SDL.States.nextState);
                  SDL.USBModel.sendAudioNotification();
                  this._super();
                },
                exit: function() {
                  this._super();
                  SDL.MediaController.deactivateRadio();
                  SDL.MediaController.deactivateCD();
                  SDL.MediaController.deactivateBluetooth();
                  SDL.MediaController.deactivateLineIn();
                  SDL.MediaController.deactivateIPod();
                },
                moreinfo: Em.State.create(
                  {
                   
                  }
                )
              }
            ),

            bluetooth: Em.State.create(
            {
              enter:function()
              {
                SDL.MediaController.set('activeState',
                  SDL.States.nextState);
                SDL.BluetoothModel.sendAudioNotification();
                this._super();
              },
              exit:function()
              {
                this._super();
                SDL.MediaController.deactivateRadio();
                SDL.MediaController.deactivateCD();
                SDL.MediaController.deactivateUSB();
                SDL.MediaController.deactivateLineIn();
                SDL.MediaController.deactivateIPod();
              },
              moreinfo:Em.State.create(
              {}
              )
            }
        ),
            lineIn: Em.State.create(
            {
              enter:function()
              {
                SDL.MediaController.set('activeState',
                  SDL.States.nextState);
                SDL.LineInModel.sendAudioNotification();
                this._super();
              },
              exit:function()
              {
                this._super();
                SDL.MediaController.deactivateRadio();
                SDL.MediaController.deactivateCD();
                SDL.MediaController.deactivateUSB();
                SDL.MediaController.deactivateBluetooth();
                SDL.MediaController.deactivateIPod();
              },
              moreinfo:Em.State.create(
              {}
              )
            }
            ),
         
            ipod: Em.State.create(
            {
              enter:function()
              {
                SDL.MediaController.set('activeState',
                  SDL.States.nextState);
                SDL.IPodModel.sendAudioNotification();
                this._super();
              },
              exit:function()
              {
                this._super();
                SDL.MediaController.deactivateRadio();
                SDL.MediaController.deactivateCD();
                SDL.MediaController.deactivateUSB();
                SDL.MediaController.deactivateLineIn();
                SDL.MediaController.deactivateBluetooth();
              },
            }
          ),
            }
        ),
          
        sdlmedia: Em.State.create(
          {
            enter: function() {
              SDL.MediaController.deactivateRadio();
              SDL.MediaController.deactivateUSB();
              SDL.MediaController.deactivateCD();
              SDL.MediaController.radioControlStruct.source='MOBILE_APP';
              var data = SDL.MediaController.getAudioControlData();
              FFW.RC.onInteriorVehicleDataNotification({moduleType:'AUDIO',audioControlData:{'source':data.source}});
              if (SDL.SDLModel.data.mediaPlayerActive) {
                SDL.SDLController.onEventChanged('player', false);
              }
              SDL.SDLController.activateTBT();

              SDL.MediaController.set('activeState',
                SDL.States.nextState);
              this._super();
            },
            exit: function() {
              this._super();
              SDL.SDLModel.data.stateLimited = SDL.SDLController.model.appID;
              SDL.SDLModel.data.set('limitedExist', true);
              SDL.SDLController.deactivateApp();
            }
          }
        )
      }
    ),
    navigationApp: Em.State.create(
      {
        baseNavigation: Em.State.create(
          {}
        ),
        enter: function() {
          if (SDL.SDLModel.data.mediaPlayerActive) {
            SDL.SDLController.onEventChanged('player', false);
            SDL.MediaController.deactivateCD();
            SDL.MediaController.deactivateUSB();
            SDL.MediaController.deactivateRadio();
          }
          SDL.MediaController.set('activeState',
            SDL.States.nextState);
          this._super();
        },
        exit: function() {
          this._super();
          SDL.SDLModel.data.stateLimited = SDL.SDLController.model.appID;
          SDL.SDLModel.data.set('limitedExist', false);
          SDL.SDLController.deactivateApp();
        }
      }
    ),
    /** Navigation state */
    navigation: Em.State.create(
      {
        exit: function() {
          this._super();
          SDL.SDLController.onEventChanged(this.name, false);
        },
        enter: function() {
          this._super();
          SDL.SDLController.onEventChanged(this.name, true);
          SDL.NavigationController.initialize();
        }
      }
    ),
    /** Phone state */
    phone: Em.State.create(
      {
        dialpad: Em.State.create(
          {}
        )
      }
    )
  }
);
