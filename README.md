# SDL HMI

HTML5 based utility to see how the SDL works. It connects via WebSocket to [SDL Core](https://github.com/smartdevicelink/sdl_core)


# Getting Started

This project interacts with [SDL Core](https://github.com/smartdevicelink/sdl_core).
To initialize the git submodules in this project after cloning, run the following commands:
```
cd sdl_hmi
git submodule init
git submodule update
```
Alternatively, you can clone this repository with the --recurse-submodules flag.

## Dependencies 
 
 * ffmpeg : `sudo apt install ffmpeg`
 * Python3,PIP : `sudo apt install python3, python3-pip`
 * python-ffmpeg : `sudo python3 -m pip install ffmpeg-python`
 * chroium-browser : `sudo apt install chromium-browser`

## Start HMI
A quick guide to installing, configuring, and running HMI.

	1. run `deploy_server.sh`
	2. run SmartDeviceLinkCore
	3. run chromium-browser [root_of_cloned_sdl_hmi_repo/index.html]

Note that all these 3 steps are foreground processes and block terminal window, so you should use separate terminal windows for all of them. 

## deploy_server.sh responsibility

External python server is required for :
 - simulating Low voltage signals
 - transferring video data from sdl_core to HMI in browser
 - Simulating Policy table update using in-vehicle modem 

If deploy_server.sh will not be started this functionality won't work.

## Simulating signals for LOW_VOLTAGE feature
	* Open the `Exit Application` menu, choose a signal from the menu and press `Send signal`

## PTU With vehicle modem
	* Click  the `System Request` button
    * Select the `PTU using in-vehicle modem` checkbox to enable the feature

## Show navi/projection streaming
 * Configure SDL ini file : `VideoStreamConsumer = pipe`
  
## Note
SDL HMI utility is only for acquaintance with the SDL project.

## Look at configuration file app/FLAGS.js. You can found there:
 - SDL WebSocket connection string -
WEBSOCKET_URL
 - Python WebSocket url for handling signals -
PYTHON_SERVER_URL
