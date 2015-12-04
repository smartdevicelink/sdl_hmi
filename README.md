# SDL HMI

HTML5 based utility to see how the SDL works. It connects via WebSocket to [SDLCore](https://github.com/LuxoftSDL/sdl_core)

# Getting Started
A quick guide to installing, configuring, and running HMI.

	1. In app/FLAGS.js configure SimpleFunctionality flag for your project
	2. run ./smartDeviceLinkCore
	3. run chromium-browser [path_to_index.html]

```
%cd [root of cloned sdl_hmi repo]
% chromium-browser index.html
```

## A quick note about dependencies
All dependencies are installed after the SDL Core is successfully installed.

## Note
SDL HMI utility is only for acquaintance with the SDL project.

## Look at configuration file app/FLAGS.js. You can found there:
 - SDL WebSocket connection string -
WEBSOCKET_URL
 - CAN WebSocket connection string -
CAN_WEBSOCKET_URL (REVSDL project)
 - New important ability to switch functionality between SDL Panasonic, SDL Genivi, Reverse SDL Projects
    You should just configure "SimpleFunctionality" flag into apropriate state (0 - Genivi, 1 - Panasonic, 2 - Reverse) and after that run command "chromium-browser [path_to_index.html]"
