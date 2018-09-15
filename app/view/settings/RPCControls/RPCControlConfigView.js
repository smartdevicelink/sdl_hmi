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

SDL.RPCControlConfigView = Em.ContainerView.create(
    {
          elementId: 'rpc_settings_deviceConfig',
          classNames: 'rpc_settings_separate_view',
          classNameBindings: [
              'SDL.States.settings.rpccontrol.rpcconfig.active:active_state:inactive_state'
          ],
          childViews: [
              'backButton',
              'rpcList',
              'resultCodeTracker',
              'saveButton',
              'resetButton',
              'appNameLabel'
          ],         
          appNameLabel: SDL.Label.extend(
            {
              elementId: 'appNameLabel',
              classNames: 'appNameLabel'
            }
          ),
          resetButton: SDL.Button.extend(
            {
              classNames: [
                'resetButton'
              ],
              action: 'resetButton',
              target: 'FFW.RPCHelper',
              goToState: 'rpccontrol',
              text:'Reset to default',
              onDown: false
            }
          ),
          saveButton: SDL.Button.extend(
            {
              classNames: [
                'saveButton'
              ],
              action: 'saveButton',
              target: 'FFW.RPCHelper',
              goToState: 'rpccontrol',
              text:'Save',
              onDown: false
            }
          ),
          backButton: SDL.Button.extend(
            {
              classNames: [
                'backControl'
              ],
              action: 'onState',
              target: 'SDL.SettingsController',
              goToState: 'rpccontrol',
              icon: 'images/media/ico_back.png',
              style: 'top: 100px',
              onDown: false
            }
          ),
          rpcList: Em.ContainerView.extend(
            {
              elementId: 'rpcList',
              classNames: 'rpcList',
              childViews: [
                'vrAddComandlabel',
                'uiAddComandlabel',
                'addSubMenulabel',
                'uisetGlobalPropertieslabel',
                'ttssetGlobalPropertieslabel',
                'subscribeVehicleDatalabel',
                'subscribeWayPointslabel',                
                'subscribeVehicleDataList',
                'vehicleDataGlobal',
                'subscribeVehicleDataSelections'
              ],
              vehicleDataGlobal: SDL.Label.extend(
                {
                  elementId: 'vehicleDataGlobal',
                  classNames: 'vehicleDataGlobal',
                  content: 'SubscribeVehicleData'
                }
              ),
              vrAddComandlabel: SDL.Label.extend(
                {
                  elementId: 'addComandlabel',
                  classNames: 'vrAddComandlabel',
                  content: 'VR.AddCommand'
                }
              ),
              uiAddComandlabel: SDL.Label.extend(
                {
                  elementId: 'addComandlabel',
                  classNames: 'uiAddComandlabel',
                  content: 'UI.AddCommand'
                }
              ),
              addSubMenulabel: SDL.Label.extend(
                {
                  elementId: 'addSubMenulabel',
                  classNames: 'addSubMenulabel',
                  content: 'AddSubMenu'
                }
              ),
              uisetGlobalPropertieslabel: SDL.Label.extend(
                {
                  elementId: 'uisetGlobalProperties',
                  classNames: 'uisetGlobalProperties',
                  content: 'UI.SetGlobalProperties'
                }
              ),
              ttssetGlobalPropertieslabel: SDL.Label.extend(
                {
                  elementId: 'ttssetGlobalPropertieslabel',
                  classNames: 'ttssetGlobalPropertieslabel',
                  content: 'TTS.SetGlobalProperties'
                }
              ),
              subscribeVehicleDatalabel: SDL.Label.extend(
                {
                  elementId: 'subscribeVehicleData',
                  classNames: 'subscribeVehicleData',
                  content: ':SubscribeVehicleDataParams'
                }
              ),
              subscribeWayPointslabel: SDL.Label.extend(
                {
                  elementId: 'subscribeWayPoints',
                  classNames: 'subscribeWayPoints',
                  content: 'SubscribeWayPoints'
                }
              ),              
              subscribeVehicleDataSelections:  Em.ContainerView.extend(
                {
                  elementId: 'subscribeVehicleDataSelections',
                  classNames: 'subscribeVehicleDataSelections',
                  childViews: [
                    'gpsSelect',
                    'speedSelect',
                    'rpmSelect',
                    'fuelLevelSelect',
                    'fuelLevel_StateSelect',
                    'instantFuelConsumptionSelect',
                    'fuelRangeSelect',
                    'externalTemperatureSelect',
                    'turnSignalSelect',
                    'prndlSelect',
                    'tirePressureSelect',
                    'odometerSelect',
                    'beltStatusSelect',
                    'bodyInformationSelect',
                    'deviceStatusSelect',
                    'driverBrakingSelect',
                    'wiperStatusSelect',
                    'headLampStatusSelect',
                    'engineTorqueSelect',
                    'accPedalPositionSelect',
                    'steeringWheelAngleSelect',
                    'engineOilLifeSelect',
                    'electronicParkBrakeStatusSelect',
                    'eCallInfoSelect',
                    'airbagStatusSelect',
                    'emergencyEventSelect',
                    'clusterModesSelect',
                    'myKeySelect'
                  ],
                  gpsSelect: Em.Select.extend(
                    {
                      elementId: 'gpsSelect',
                      classNames: 'gps',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.gps'
                    }
                  ),
                  speedSelect: Em.Select.extend(
                    {
                      elementId: 'speedSelect',
                      classNames: 'speed',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.speed'
                    }
                  ),
                  rpmSelect: Em.Select.extend(
                    {
                      elementId: 'rpmSelect',
                      classNames: 'rpm',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.rpm'
                    }
                  ),
                  fuelLevelSelect: Em.Select.extend(
                    {
                      elementId: 'fuelLevelSelect',
                      classNames: 'fuelLevel',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.fuelLevel'
                    }
                  ),
                  fuelLevel_StateSelect: Em.Select.extend(
                    {
                      elementId: 'fuelLevel_StateSelect',
                      classNames: 'fuelLevel_State',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.fuelLevel_State'
                    }
                  ),
                  instantFuelConsumptionSelect: Em.Select.extend(
                    {
                      elementId: 'instantFuelConsumptionSelect',
                      classNames: 'instantFuelConsumption',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.instantFuelConsumption'
                    }
                  ),
                  fuelRangeSelect: Em.Select.extend(
                    {
                      elementId: 'fuelRangeSelect',
                      classNames: 'fuelRange',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.fuelRange'
                    }
                  ),
                  externalTemperatureSelect: Em.Select.extend(
                    {
                      elementId: 'externalTemperatureSelect',
                      classNames: 'externalTemperature',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.externalTemperature'
                    }
                  ),
                  turnSignalSelect: Em.Select.extend(
                    {
                      elementId: 'turnSignalSelect',
                      classNames: 'turnSignal',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.turnSignal'
                    }
                  ),
                  prndlSelect: Em.Select.extend(
                    {
                      elementId: 'prndlSelect',
                      classNames: 'prndl',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.prndl'
                    }
                  ),
                  tirePressureSelect: Em.Select.extend(
                    {
                      elementId: 'tirePressureSelect',
                      classNames: 'tirePressure',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.tirePressure'
                    }
                  ),
                  odometerSelect: Em.Select.extend(
                    {
                      elementId: 'odometerSelect',
                      classNames: 'odometer',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.odometer'
                    }
                  ),
                  beltStatusSelect: Em.Select.extend(
                    {
                      elementId: 'beltStatusSelect',
                      classNames: 'beltStatus',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.beltStatus'
                    }
                  ),
                  bodyInformationSelect: Em.Select.extend(
                    {
                      elementId: 'bodyInformationSelect',
                      classNames: 'bodyInformation',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.bodyInformation'
                    }
                  ),
                  deviceStatusSelect: Em.Select.extend(
                    {
                      elementId: 'deviceStatusSelect',
                      classNames: 'deviceStatus',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.deviceStatus'
                    }
                  ),
                  driverBrakingSelect: Em.Select.extend(
                    {
                      elementId: 'driverBrakingSelect',
                      classNames: 'driverBraking',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.driverBraking'
                    }
                  ),
                  wiperStatusSelect: Em.Select.extend(
                    {
                      elementId: 'wiperStatusSelect',
                      classNames: 'wiperStatus',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.wiperStatus'
                    }
                  ),
                  headLampStatusSelect: Em.Select.extend(
                    {
                      elementId: 'headLampStatusSelect',
                      classNames: 'headLampStatus',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.headLampStatus'
                    }
                  ),
                  engineTorqueSelect: Em.Select.extend(
                    {
                      elementId: 'engineTorqueSelect',
                      classNames: 'engineTorque',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.engineTorque'
                    }
                  ),
                  accPedalPositionSelect: Em.Select.extend(
                    {
                      elementId: 'accPedalPositionSelect',
                      classNames: 'accPedalPosition',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.accPedalPosition'
                    }
                  ),
                  steeringWheelAngleSelect: Em.Select.extend(
                    {
                      elementId: 'steeringWheelAngleSelect',
                      classNames: 'steeringWheelAngle',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.steeringWheelAngle'
                    }
                  ),
                  engineOilLifeSelect: Em.Select.extend(
                    {
                      elementId: 'engineOilLifeSelect',
                      classNames: 'engineOilLife',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.engineOilLife'
                    }
                  ),
                  electronicParkBrakeStatusSelect: Em.Select.extend(
                    {
                      elementId: 'electronicParkBrakeStatusSelect',
                      classNames: 'electronicParkBrakeStatus',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.electronicParkBrakeStatus'
                    }
                  ),
                  eCallInfoSelect: Em.Select.extend(
                    {
                      elementId: 'eCallInfoSelect',
                      classNames: 'eCallInfo',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.eCallInfo'
                    }
                  ),
                  airbagStatusSelect: Em.Select.extend(
                    {
                      elementId: 'airbagStatusSelect',
                      classNames: 'airbagStatus',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.airbagStatus'
                    }
                  ),
                  emergencyEventSelect: Em.Select.extend(
                    {
                      elementId: 'emergencyEventSelect',
                      classNames: 'emergencyEvent',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.emergencyEvent'
                    }
                  ),
                  clusterModesSelect: Em.Select.extend(
                    {
                      elementId: 'clusterModesSelect',
                      classNames: 'clusterModes',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.clusterModes'
                    }
                  ),
                  myKeySelect: Em.Select.extend(
                    {
                      elementId: 'myKeySelect',
                      classNames: 'myKey',
                      contentBinding: 'SDL.SDLModel.data.vehicleDataResultCode',
                      valueBinding: 'FFW.RPCHelper.currentVehicleDataStruct.myKey'
                    }
                  ),
                }
              ),
              subscribeVehicleDataList: Em.ContainerView.extend(
              {
                elementId: 'subscribeVehicleDataList',
                classNames: 'subscribeVehicleDataList',
                      childViews: [
                        'gpsLabel',
                        'speedLabel',
                        'rpmLabel',
                        'fuelLevelLabel',
                        'fuelLevel_StateLabel',
                        'instantFuelConsumptionLabel',
                        'fuelRangeLabel',
                        'externalTemperatureLabel',
                        'turnSignalLabel',
                        'prndlLabel',
                        'tirePressureLabel',
                        'odometerLabel',
                        'beltStatusLabel',
                        'bodyInformationLabel',
                        'deviceStatusLabel',
                        'driverBrakingLabel',
                        'wiperStatusLabel',
                        'headLampStatusLabel',
                        'engineTorqueLabel',
                        'accPedalPositionLabel',
                        'steeringWheelAngleLabel',
                        'engineOilLifeLabel',
                        'electronicParkBrakeStatusLabel',
                        'eCallInfoLabel',
                        'airbagStatusLabel',
                        'emergencyEventLabel',
                        'clusterModesLabel',
                        'myKeyLabel'
                      ],
                      gpsLabel: SDL.Label.extend(
                        {
                          elementId: 'gpsLabel',
                          classNames: 'gps',
                          content: 'GPS'
                        }
                      ),
                      speedLabel: SDL.Label.extend(
                        {
                          elementId: 'speedLabel',
                          classNames: 'speed',
                          content: 'Speed'
                        }
                      ),
                      rpmLabel: SDL.Label.extend(
                        {
                          elementId: 'rpmLabel',
                          classNames: 'rpm',
                          content: 'rpm'
                        }
                      ),
                      fuelLevelLabel: SDL.Label.extend(
                        {
                          elementId: 'fuelLevelLabel',
                          classNames: 'fuelLevel',
                          content: 'fuelLevel'
                        }
                      ),
                      fuelLevel_StateLabel: SDL.Label.extend(
                        {
                          elementId: 'fuelLevel_StateLabel',
                          classNames: 'fuelLevel_State',
                          content: 'fuelLevel_State'
                        }
                      ),
                      instantFuelConsumptionLabel: SDL.Label.extend(
                        {
                          elementId: 'instantFuelConsumptionLabel',
                          classNames: 'instantFuelConsumption',
                          content: 'instantFuelConsumption'
                        }
                      ),
                      fuelRangeLabel: SDL.Label.extend(
                        {
                          elementId: 'fuelRangeLabel',
                          classNames: 'fuelRange',
                          content: 'fuelRange'
                        }
                      ),
                      externalTemperatureLabel: SDL.Label.extend(
                        {
                          elementId: 'externalTemperatureLabel',
                          classNames: 'externalTemperature',
                          content: 'externalTemperature'
                        }
                      ),
                      turnSignalLabel: SDL.Label.extend(
                        {
                          elementId: 'turnSignalLabel',
                          classNames: 'turnSignal',
                          content: 'turnSignal'
                        }
                      ),
                      prndlLabel: SDL.Label.extend(
                        {
                          elementId: 'prndlLabel',
                          classNames: 'prndl',
                          content: 'prndl'
                        }
                      ),
                      tirePressureLabel: SDL.Label.extend(
                        {
                          elementId: 'tirePressureLabel',
                          classNames: 'tirePressure',
                          content: 'tirePressure'
                        }
                      ),
                      odometerLabel: SDL.Label.extend(
                        {
                          elementId: 'odometerLabel',
                          classNames: 'odometer',
                          content: 'odometer'
                        }
                      ),
                      beltStatusLabel: SDL.Label.extend(
                        {
                          elementId: 'beltStatusLabel',
                          classNames: 'beltStatus',
                          content: 'beltStatus'
                        }
                      ),
                      bodyInformationLabel: SDL.Label.extend(
                        {
                          elementId: 'bodyInformationLabel',
                          classNames: 'bodyInformation',
                          content: 'bodyInformation'
                        }
                      ),
                      deviceStatusLabel: SDL.Label.extend(
                        {
                          elementId: 'deviceStatusLabel',
                          classNames: 'deviceStatus',
                          content: 'deviceStatus'
                        }
                      ),
                      driverBrakingLabel: SDL.Label.extend(
                        {
                          elementId: 'driverBrakingLabel',
                          classNames: 'driverBraking',
                          content: 'driverBraking'
                        }
                      ),
                      wiperStatusLabel: SDL.Label.extend(
                        {
                          elementId: 'wiperStatusLabel',
                          classNames: 'wiperStatus',
                          content: 'wiperStatus'
                        }
                      ),
                      headLampStatusLabel: SDL.Label.extend(
                        {
                          elementId: 'headLampStatusLabel',
                          classNames: 'headLampStatus',
                          content: 'headLampStatus'
                        }
                      ),
                      engineTorqueLabel: SDL.Label.extend(
                        {
                          elementId: 'engineTorqueLabel',
                          classNames: 'engineTorque',
                          content: 'engineTorque'
                        }
                      ),
                      accPedalPositionLabel: SDL.Label.extend(
                        {
                          elementId: 'accPedalPositionLabel',
                          classNames: 'accPedalPosition',
                          content: 'accPedalPosition'
                        }
                      ),
                      steeringWheelAngleLabel: SDL.Label.extend(
                        {
                          elementId: 'steeringWheelAngleLabel',
                          classNames: 'steeringWheelAngle',
                          content: 'steeringWheelAngle'
                        }
                      ),
                      engineOilLifeLabel: SDL.Label.extend(
                        {
                          elementId: 'engineOilLifeLabel',
                          classNames: 'engineOilLife',
                          content: 'engineOilLife'
                        }
                      ),
                      electronicParkBrakeStatusLabel: SDL.Label.extend(
                        {
                          elementId: 'electronicParkBrakeStatusLabel',
                          classNames: 'electronicParkBrakeStatus',
                          content: 'electronicParkBrakeStatus'
                        }
                      ),
                      eCallInfoLabel: SDL.Label.extend(
                        {
                          elementId: 'eCallInfoLabel',
                          classNames: 'eCallInfo',
                          content: 'eCallInfo'
                        }
                      ),
                      airbagStatusLabel: SDL.Label.extend(
                        {
                          elementId: 'airbagStatusLabel',
                          classNames: 'airbagStatus',
                          content: 'airbagStatus'
                        }
                      ),
                      emergencyEventLabel: SDL.Label.extend(
                        {
                          elementId: 'emergencyEventLabel',
                          classNames: 'emergencyEvent',
                          content: 'emergencyEvent'
                        }
                      ),
                      clusterModesLabel: SDL.Label.extend(
                        {
                          elementId: 'clusterModesLabel',
                          classNames: 'clusterModes',
                          content: 'clusterModes'
                        }
                      ),
                      myKeyLabel: SDL.Label.extend(
                        {
                          elementId: 'myKeyLabel',
                          classNames: 'myKey',
                          content: 'myKey'
                        }
                      )
                    }
                  ),
                }
              ),
              resultCodeTracker: Em.ContainerView.extend(
                {
                  elementId: 'resultCodeTracker',
                  classNames: 'resultCodeTracker',
                  childViews: [
                  'vrAddComandSelect',
                  'uiAddComandSelect',
                  'addSubMenuSelect',
                  'uisetGlobalPropertiesSelect',
                  'ttssetGlobalPropertiesSelect',
                  'subscribeWayPointsSelect',
                  'vehicleDataGlobalSelect'
                  ],
                  vehicleDataGlobalSelect: Em.Select.extend(
                    {
                      elementId: 'vehicleDataGlobalSelect',
                      classNames: 'vehicleDataGlobalSelect',
                      contentBinding: 'SDL.SDLModel.data.resultCodes',
                      valueBinding: 'FFW.RPCHelper.currentSubscribeVehicleData'
                    }
                  ),
                  vrAddComandSelect: Em.Select.extend(
                    {
                      elementId: 'vrAddComandSelect',
                      classNames: 'vrAddComandSelect',
                      contentBinding: 'SDL.SDLModel.data.resultCodes',
                      valueBinding: 'FFW.RPCHelper.rpcStruct.vrAddCommand'
                    }
                  ),
                  uiAddComandSelect: Em.Select.extend(
                    {
                      elementId: 'uiAddComandSelect',
                      classNames: 'uiAddComandSelect',
                      contentBinding: 'SDL.SDLModel.data.resultCodes',
                      valueBinding: 'FFW.RPCHelper.rpcStruct.uiAddCommand'
                    }
                  ),
                  addSubMenuSelect: Em.Select.extend(
                    {
                      elementId: 'addSubMenuSelect',
                      classNames: 'addSubMenuSelect',
                      contentBinding: 'SDL.SDLModel.data.resultCodes',
                      valueBinding: 'FFW.RPCHelper.rpcStruct.AddSubmenu'
                    }
                  ),
                  uisetGlobalPropertiesSelect: Em.Select.extend(
                    {
                      elementId: 'uisetGlobalPropertiesSelect',
                      classNames: 'uisetGlobalPropertiesSelect',
                      contentBinding: 'SDL.SDLModel.data.resultCodes',
                      valueBinding: 'FFW.RPCHelper.rpcStruct.uiSetGlobalProperties'
                    }
                  ),
                  ttssetGlobalPropertiesSelect: Em.Select.extend(
                    {
                      elementId: 'ttssetGlobalPropertiesSelect',
                      classNames: 'ttssetGlobalPropertiesSelect',
                      contentBinding: 'SDL.SDLModel.data.resultCodes',
                      valueBinding: 'FFW.RPCHelper.rpcStruct.ttsSetGlobalProperties'
                    }
                  ),                  
                  subscribeWayPointsSelect: Em.Select.extend(
                    {
                      elementId: 'subscribeWayPointsSelect',
                      classNames: 'subscribeWayPointsSelect',
                      contentBinding: 'SDL.SDLModel.data.resultCodes',
                      valueBinding: 'FFW.RPCHelper.currentSubscribeWayPoints'
                    }
                  ),
                }
              )
    }
);
