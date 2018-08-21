# SDL HMI

HTML5 based utility to see how the SDL works. It connects via WebSocket to [SDLCore](https://github.com/LuxoftSDL/sdl_core)

# Getting Started
A quick guide to installing, configuring, and running HMI.

	1. run SmartDeviceLinkCore
	2. run chromium-browser [root_of_cloned_sdl_hmi_repo/index.html]

## Simulating signals for LOW_VOLTAGE feature
In order to simulate UNIX signals used by the LOW_VOLTAGE feature, some additional setup is required

	1. run `deploy_server.sh`
	2. run the HMI normally
	3. open the `Exit Application` menu, choose a signal from the menu and press `Send signal`

## A quick note about dependencies
All dependencies are installed after the SDL Core is successfully installed.

## Note
SDL HMI utility is only for acquaintance with the SDL project.

## Look at configuration file app/FLAGS.js. You can found there:
 - SDL WebSocket connection string -
WEBSOCKET_URL
 - Python WebSocket url for handling signals -
PYTHON_SERVER_URL
