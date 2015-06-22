# SDL HMI

HTML5 based utility to see how the SDL works. It connects via WebSocket to [SDLCore](https://github.com/LuxoftSDL/sdl_core)

# Getting Started
A quick guide to installing, configuring, and running HMI.

	1. Run SDLCore
	2. Open index.html via Chromium browser

```
%cd [root of cloned sdl_hmi repo]
% chromium-browser index.html
```

## A quick note about dependencies
All dependencies are installed after the SDL Core is successfuly installed.

## Note
SDL HMI utility is only for acquaintance with the SDL project.

# HMI Initiated Policy Table Update
Policy Update button located next to the vehicle info on the right side of the HMI emulator. This button initiates an OnPolicyTableReceived notification to core which updates the policy database from the file "/IVSU/POLICY_UPDATE_TEST". This file is a clone of the current PT json file located in the SDL core repo in the /src/appMain folder. Changes can be made to certain areas of this file, and changes will be refelected in the db upon using the HMI "Policy Update" button.
