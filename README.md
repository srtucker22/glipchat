# glipchat

* [Overview](#overview)
* [Live Demo](#live-demo)
* [Motivation](#motivation)
* [Installation](#installation)
* [Electron Notes](#electron-notes)
* [Android Cordova Notes](#android-cordova-notes)
* [Resources](#resources)
* [Contributing](#contributing)
* [Licence](#licence)

# Overview
glipchat is a real-time video chatroom application. glipchat is powered by Meteor, with React + Redux + WebRTC on the frontend.

glipchat has been tested on the following:
- Android 4.3+ cordova app (currently disabled)
- Chrome
- Chrome for Android (Android 5+)
- Firefox
- OS X (Electron application)

Other browsers and operating systems may not support WebRTC.

# Live Demo
View the project at [https://glipchat.herokuapp.com/](https://glipchat.herokuapp.com/)

# Motivation
glipchat's mission is to be a veritable OSS solution for multi-user multi-platform video conferencing -- a product regular people can use and developers can modify and build into their own products.

# Installation
1. Clone the project `git clone https://github.com/srtucker22/glipchat.git`
2. Go to the primary directory `cd glipchat`
3. Add a `settings.json` to the primary directory `touch settings.json`
4. Add your personal settings for the following services included in glipchat (or remove the ones you don't want)

        {
          "admins": [{
            "name": "Administrator",
            "email": "admin@example.com",
            "roles": ["admin"],
            "password": "ADMIN_PASSWORD"
          }],
          "google" : {
            "clientId" : "YOUR_CLIENT_ID",
            "clientSecret" : "YOUR_CLIENT_SECRET"
            "browserKey": "YOUR_BROWSER_KEY",
            "apiKey": "YOUR_API_KEY",
            "projectNumber": "YOUR_PROJECT_NUMBER"
          },
          "public": {
            "analyticsSettings": {
              "Google Analytics": {"trackingId": "YOUR_TRACKING_ID"},
              "Segment.io" : {"apiKey": "YOUR_API_KEY"}
            }
          }
        }

5. Run the app with the settings `npm start`

# Electron Notes:
glipchat uses [electron](https://github.com/electron) to easily transform into a downloadable desktop app. The code for this app is located at [`private/electron`](https://github.com/srtucker22/glipchat/blob/master/private/electron)

We use [electron-simple-updater](https://github.com/megahertz/electron-simple-updater) for building, publishing, and updating the electron application. View the [README]{https://github.com/srtucker22/glipchat/blob/master/private/electron/README.md} in `private/electron` for details on how to use these tools.

See [download-button.component.js](https://github.com/srtucker22/glipchat/blob/master/client/components/modules/download-button.component.jsx#L57) for how components reference this directory.

# Android Cordova Notes:
In order to run video conferencing on glipchat as a cordova app, you will to have the latest version of Android Studio installed and **you will need to use an actual Android device** (currently tested with devices 4.3+). Plug in your device to your computer via USB and run

`meteor run android-device -p {local port} --settings settings.json`

In order to use Google auth, you will need to run the application from a live mobiles server (see [OAuth for Mobile Meteor Clients](https://github.com/meteor/meteor/wiki/OAuth-for-mobile-Meteor-clients] for details). To do this, first deploy your meteor application to a live server.

(e.g. `meteor deploy {your-server-url} --settings settings.json`)

Once the app is successfully deployed, run:

`meteor run android-device --mobile-server {your-server-url} --settings settings.json`

nice additional flags might be:
`--verbose
--production`

Please read the [Meteor Cordova Integration](https://github.com/meteor/meteor/wiki/Meteor-Cordova-integration) docs for more details.

# Application Design Overview
glipchat is an example of how to create a WebRTC video chatroom and also of how to integrate React with Redux in a Meteor app.

Don't know React or Redux? No problem!

The best way to describe React is that it is a view layer only.

Redux is a flavor of Flux, and is an architectural pattern that can be used with React to enable one-way data flows to a centralized application data store using an event system.

Read these useful guides to get a quick overview:
- [ReactJS For Stupid People](http://blog.andrewray.me/reactjs-for-stupid-people/)
- [Flux For Stupid People](http://blog.andrewray.me/flux-for-stupid-people/)
- [Redux Docs](http://redux.js.org/)

Routing is done with [React Router](https://github.com/rackt/react-router)

Routing in this application may not be obvious.
Check out [routes.js](https://github.com/srtucker22/glipchat/blob/master/client/routes.jsx) for the main router code.

glipchat uses [RocketChat:Streamer](https://github.com/RocketChat/meteor-streamer) to power the WebRTC communication.

# Resources
- [glipchat (formerly named quasar) meteor lightening talk @MeteorHQ ](https://youtu.be/C0S_QCb6HSM)

# Contributing
This project welcomes code contributions, bug reports and feature requests. Please see the guidelines in [CONTRIBUTING.MD](CONTRIBUTING.MD) if you are interested in contributing.

# License
The MIT License

Copyright (c) 2016 Glipcode https://glipcode.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
