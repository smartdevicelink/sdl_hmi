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
 * @name SDL.systemCapabilities
 * @desc System capabilities
 * @category Capability
 * @filesource capabilities/systemCapabilities.js
 * @version 1.0
 */

SDL.systemCapabilities =
{
    videoStreamingCapability: {
        preferredResolution: {
            resolutionWidth: 800,
            resolutionHeight: 380
        },
        maxBitrate: 20000,
        supportedFormats: [
            {
                protocol:  "RAW",
                codec: "H264"
            },
            {
                protocol:  "RTP",
                codec: "H264"
            },
            {
                protocol:  "RTSP",
                codec: "Theora"
            },
            {
                protocol:  "RTMP",
                codec: "VP8"
            },
            {
                protocol:  "WEBM",
                codec: "VP9"
            }
        ],
        hapticSpatialDataSupported: true,
        diagonalScreenSize: 8,
        pixelPerInch: 96,
        scale: 1,
        additionalVideoStreamingCapabilities: [
            {
                preferredResolution:
                {
                    resolutionWidth: 800,
                    resolutionHeight: 380
                },
                hapticSpatialDataSupported: true,
                scale: 1,
                diagonalScreenSize: 8
            },
            {
                preferredResolution:
                {
                    resolutionWidth: 320,
                    resolutionHeight: 200
                },
                hapticSpatialDataSupported: false,
                diagonalScreenSize: 3
            },
            {
                preferredResolution:
                {
                    resolutionWidth: 480,
                    resolutionHeight: 320
                },
                hapticSpatialDataSupported: true,
                diagonalScreenSize: 5
            },
            {
                preferredResolution:
                {
                    resolutionWidth: 400,
                    resolutionHeight: 380
                },
                hapticSpatialDataSupported: true,
                diagonalScreenSize: 4
            },
            {
                preferredResolution:
                {
                    resolutionWidth: 800,
                    resolutionHeight: 240
                },
                hapticSpatialDataSupported: true,
                diagonalScreenSize: 4
            },
            {
                preferredResolution:
                {
                    resolutionWidth: 800,
                    resolutionHeight: 380
                },
                hapticSpatialDataSupported: true,
                scale: 1.5,
                diagonalScreenSize: 5
            },
            {
                preferredResolution:
                {
                    resolutionWidth: 800,
                    resolutionHeight: 380
                },
                hapticSpatialDataSupported: true,
                scale: 2,
                diagonalScreenSize: 4
            }
        ]
    }
}
