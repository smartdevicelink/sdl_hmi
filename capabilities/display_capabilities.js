/*
 * Copyright (c) 2019, Ford Motor Company All rights reserved.
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
 * @name SDL.templateCapabilities
 * @desc Display capabilities
 * @category Capability
 * @filesource capabilities/display_capabilities.js
 * @version 1.0
 */

SDL.templateCapabilities = {
    "MEDIA": {
        "displayCapabilities": {
            "displayType": "GEN2_8_DMA",
            "displayName": "SDL_HMI",
            "textFields": [{
                    "name": "mainField1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mainField2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "statusBar",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mediaClock",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mediaTrack",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "templateTitle",
                    "characterSet": "TYPE2SET",
                    "width": 100,
                    "rows": 1
                },
                {
                    "name": "alertText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "alertText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "alertText3",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "scrollableMessageBody",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "initialInteractionText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "navigationText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "navigationText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "ETA",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "totalDistance",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "audioPassThruDisplayText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "audioPassThruDisplayText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "sliderHeader",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "sliderFooter",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "menuName",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "secondaryText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "tertiaryText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "menuTitle",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "locationName",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "locationDescription",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "addressLines",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "phoneNumber",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                }
            ],
            "imageFields": [{
                    "name": "softButtonImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "choiceImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "choiceSecondaryImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "vrHelpItem",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "turnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "menuIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "cmdIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "graphic",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "secondaryGraphic",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTNextTurnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTNextTurnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "alertIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 105,
                        "resolutionHeight": 65
                    }
                }
            ],
            "mediaClockFormats": [
                "CLOCK1", "CLOCK2", "CLOCK3", "CLOCKTEXT1", "CLOCKTEXT2",
                "CLOCKTEXT3", "CLOCKTEXT4"
            ],
            "graphicSupported": true,
            "imageCapabilities": ["DYNAMIC", "STATIC"],
            "templatesAvailable": ["MEDIA", "NON-MEDIA", "ONSCREEN_PRESETS", "NAV_FULLSCREEN_MAP"],
            "screenParams": {
                "resolution": {
                    "resolutionWidth": 800,
                    "resolutionHeight": 480
                },
                "touchEventAvailable": {
                    "pressAvailable": true,
                    "multiTouchAvailable": true,
                    "doublePressAvailable": false
                }
            },
            "numCustomPresetsAvailable": 10
        },
        "buttonCapabilities": [{
            "name": "PRESET_0",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_1",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_2",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_3",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_4",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_5",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_6",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_7",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_8",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_9",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "OK",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PLAY_PAUSE",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "SEEKLEFT",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "SEEKRIGHT",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "TUNEUP",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "TUNEDOWN",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }],
        "softButtonCapabilities": [{
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true,
            "imageSupported": true
        }],
        "presetBankCapabilities": {
            "onScreenPresetsAvailable": true
        }
    },
    "ONSCREEN_PRESETS": {
        "displayCapabilities": {
            "displayType": "GEN2_8_DMA",
            "displayName": "SDL_HMI",
            "textFields": [{
                    "name": "mainField1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mainField2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "statusBar",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mediaClock",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mediaTrack",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "templateTitle",
                    "characterSet": "TYPE2SET",
                    "width": 100,
                    "rows": 1
                },
                {
                    "name": "alertText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "alertText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "alertText3",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "scrollableMessageBody",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "initialInteractionText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "navigationText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "navigationText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "ETA",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "totalDistance",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "audioPassThruDisplayText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "audioPassThruDisplayText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "sliderHeader",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "sliderFooter",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "menuName",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "secondaryText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "tertiaryText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "menuTitle",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "locationName",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "locationDescription",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "addressLines",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "phoneNumber",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                }
            ],
            "imageFields": [{
                    "name": "softButtonImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "choiceImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "choiceSecondaryImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "vrHelpItem",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "turnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "menuIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "cmdIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "graphic",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "secondaryGraphic",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTNextTurnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTNextTurnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "alertIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 105,
                        "resolutionHeight": 65
                    }
                }
            ],
            "mediaClockFormats": [
                "CLOCK1", "CLOCK2", "CLOCK3", "CLOCKTEXT1", "CLOCKTEXT2",
                "CLOCKTEXT3", "CLOCKTEXT4"
            ],
            "graphicSupported": true,
            "imageCapabilities": ["DYNAMIC", "STATIC"],
            "templatesAvailable": ["MEDIA", "NON-MEDIA", "ONSCREEN_PRESETS", "NAV_FULLSCREEN_MAP"],
            "screenParams": {
                "resolution": {
                    "resolutionWidth": 800,
                    "resolutionHeight": 480
                },
                "touchEventAvailable": {
                    "pressAvailable": true,
                    "multiTouchAvailable": true,
                    "doublePressAvailable": false
                }
            },
            "numCustomPresetsAvailable": 10
        },
        "buttonCapabilities": [{
            "name": "PRESET_0",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_1",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_2",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_3",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_4",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_5",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_6",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_7",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_8",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_9",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "OK",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "SEEKLEFT",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "SEEKRIGHT",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "TUNEUP",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "TUNEDOWN",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }],
        "softButtonCapabilities": [{
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true,
            "imageSupported": true
        }],
        "presetBankCapabilities": {
            "onScreenPresetsAvailable": true
        }
    },
    "NON-MEDIA": {
        "displayCapabilities": {
            "displayType": "GEN2_8_DMA",
            "displayName": "SDL_HMI",
            "textFields": [{
                    "name": "mainField1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mainField2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mainField3",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mainField4",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "statusBar",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mediaClock",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mediaTrack",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "templateTitle",
                    "characterSet": "TYPE2SET",
                    "width": 100,
                    "rows": 1
                },
                {
                    "name": "alertText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "alertText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "alertText3",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "scrollableMessageBody",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "initialInteractionText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "navigationText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "navigationText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "ETA",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "totalDistance",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "audioPassThruDisplayText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "audioPassThruDisplayText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "sliderHeader",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "sliderFooter",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "menuName",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "secondaryText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "tertiaryText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "menuTitle",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "locationName",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "locationDescription",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "addressLines",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "phoneNumber",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                }
            ],
            "imageFields": [{
                    "name": "softButtonImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "choiceImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "choiceSecondaryImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "vrHelpItem",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "turnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "menuIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "cmdIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "graphic",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "secondaryGraphic",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTNextTurnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTNextTurnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "alertIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 105,
                        "resolutionHeight": 65
                    }
                }
            ],
            "mediaClockFormats": [
                "CLOCK1", "CLOCK2", "CLOCK3", "CLOCKTEXT1", "CLOCKTEXT2",
                "CLOCKTEXT3", "CLOCKTEXT4"
            ],
            "graphicSupported": true,
            "imageCapabilities": ["DYNAMIC", "STATIC"],
            "templatesAvailable": ["MEDIA", "NON-MEDIA", "ONSCREEN_PRESETS", "NAV_FULLSCREEN_MAP"],
            "screenParams": {
                "resolution": {
                    "resolutionWidth": 800,
                    "resolutionHeight": 480
                },
                "touchEventAvailable": {
                    "pressAvailable": true,
                    "multiTouchAvailable": true,
                    "doublePressAvailable": false
                }
            },
            "numCustomPresetsAvailable": 8
        },
        "buttonCapabilities": [{
            "name": "PRESET_0",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_1",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_2",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_3",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_4",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_5",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_6",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_7",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_8",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "PRESET_9",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "OK",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "SEEKLEFT",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "SEEKRIGHT",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "TUNEUP",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }, {
            "name": "TUNEDOWN",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }],
        "softButtonCapabilities": [{
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true,
            "imageSupported": true
        }],
        "presetBankCapabilities": {
            "onScreenPresetsAvailable": true
        }
    },
    "NAV_FULLSCREEN_MAP": {
        "displayCapabilities": {
            "displayType": "GEN2_8_DMA",
            "displayName": "SDL_HMI",
            "textFields": [{
                    "name": "mainField1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mainField2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mainField3",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mainField4",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "statusBar",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mediaClock",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "mediaTrack",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "templateTitle",
                    "characterSet": "TYPE2SET",
                    "width": 100,
                    "rows": 1
                },
                {
                    "name": "alertText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "alertText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "alertText3",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "scrollableMessageBody",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "initialInteractionText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "navigationText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "navigationText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "ETA",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "totalDistance",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "audioPassThruDisplayText1",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "audioPassThruDisplayText2",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "sliderHeader",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "sliderFooter",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "menuName",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "secondaryText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "tertiaryText",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "menuTitle",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "locationName",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "locationDescription",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "addressLines",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                },
                {
                    "name": "phoneNumber",
                    "characterSet": "TYPE2SET",
                    "width": 500,
                    "rows": 1
                }
            ],
            "imageFields": [{
                    "name": "choiceImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "choiceSecondaryImage",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "vrHelpItem",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "turnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "menuIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "cmdIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTNextTurnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "showConstantTBTNextTurnIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 64,
                        "resolutionHeight": 64
                    }
                },
                {
                    "name": "alertIcon",
                    "imageTypeSupported": [
                        "GRAPHIC_BMP",
                        "GRAPHIC_JPEG",
                        "GRAPHIC_PNG"
                    ],
                    "imageResolution": {
                        "resolutionWidth": 105,
                        "resolutionHeight": 65
                    }
                }
            ],
            "mediaClockFormats": [
                "CLOCK1", "CLOCK2", "CLOCK3", "CLOCKTEXT1", "CLOCKTEXT2",
                "CLOCKTEXT3", "CLOCKTEXT4"
            ],
            "graphicSupported": true,
            "imageCapabilities": ["DYNAMIC", "STATIC"],
            "templatesAvailable": ["MEDIA", "NON-MEDIA", "ONSCREEN_PRESETS", "NAV_FULLSCREEN_MAP"],
            "screenParams": {
                "resolution": {
                    "resolutionWidth": 800,
                    "resolutionHeight": 480
                },
                "touchEventAvailable": {
                    "pressAvailable": true,
                    "multiTouchAvailable": true,
                    "doublePressAvailable": false
                }
            }
        },
        "buttonCapabilities": [{
            "name": "CUSTOM_BUTTON",
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true
        }],
        "softButtonCapabilities": [{
            "shortPressAvailable": true,
            "longPressAvailable": true,
            "upDownAvailable": true,
            "imageSupported": true
        }],
        "presetBankCapabilities": {
            "onScreenPresetsAvailable": false
        }
    },
    "WEB_VIEW": {
        "displayCapabilities": {
            "displayType": "GEN2_8_DMA",
            "displayName": "SDL_HMI",
            "graphicSupported": true,
            "imageCapabilities": ["DYNAMIC", "STATIC"],
            "templatesAvailable": ["MEDIA", "NON-MEDIA", "ONSCREEN_PRESETS", "NAV_FULLSCREEN_MAP", "WEB_VIEW"],
            "screenParams": {
                "resolution": {
                    "resolutionWidth": 800,
                    "resolutionHeight": 480
                },
                "touchEventAvailable": {
                    "pressAvailable": true,
                    "multiTouchAvailable": true,
                    "doublePressAvailable": false
                }
            }
        }
    }
}