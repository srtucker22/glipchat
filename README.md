# quasar

View the project at <a href="https://quasar.meteor.com" target="_blank">quasar.meteor.com</a>

quasar is a real-time video chatroom application. The frontend is powered by React, Flux and WebRTC and the backend is powered by Meteor.

quasar has been tested on the following:
- Android 4.3+ cordova app
- Chrome
- Chrome for Android (Android 5+)
- Firefox
- OS X (Electron application)

Other browsers and operating systems may not support WebRTC.

## Motivation

Quasar is intended to be a veritable open source solution for multi-user multi-platform video conferencing -- a product regular people can use and developers can modify and build into their own products.

It is also an example of how to create a WebRTC video chatroom and of how to integrate React and Flux in a Meteor app.

## Installation

1. Clone the project <code>git clone https://github.com/srtucker22/quasar.git</code>
2. Go to the primary directory <code>cd quasar</code>
3. Add a settings.json to the primary directory <code>touch settings.json</code>
4. Add your personal settings for the following services included in quasar (or remove the ones you don't want)

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
          },
          "kadira": {
            "appId": "YOUR_APP_ID",
            "appSecret": "YOUR_APP_SECRET
          },
          "public": {
            "analyticsSettings": {
              "Google Analytics": {"trackingId": "YOUR_TRACKING_ID"},
              "Segment.io" : {"apiKey": "YOUR_API_KEY"}
            },
            "google": {
              "browserKey": "YOUR_BROWSER_KEY"
            }
          }
          "electron": {
            "autoPackage": true,
            "builds": [{
              "platform": "darwin", "arch": "x64"
            },{
              "platform": "win32", "arch": "ia32"
            }],
            "downloadUrls": {
              "win32": "/public/downloads/win32/",
              "darwin": "/public/downloads/osx/quasar.zip"
            },
            "name": "quasar",
            "rootUrl": "https://quasar.meteor.com",
            "version": "0.0.1",
            "description": "Video Chatroom with Meteor + WebRTC + React + Flux",
            "height": 768,
            "width": 1024,
            "frame": true,
            "title-bar-style": "hidden",
            "resizable": true,
            "protocols": [{
              "name": "quasar",
              "schemes": ["quasar"]
            }]
          }
        }

5. Run the app with the settings <code>meteor --settings settings.json</code>

### Deployment Notes:

To deploy to a remote server, consider using a package like <a href="https://github.com/arunoda/meteor-up">Meteor Up</a>

### Android Cordova Notes:

In order to run video conferencing on quasar as a cordova app, you will to have the latest version of Android Studio installed and **you will need to use an actual Android device** (currently tested with devices 4.3+). Plug in your device to your computer via USB and run

<code>meteor run android-device -p {local port} --settings settings.json</code>

In order to use Google auth, you will need to run the application from a live mobiles server (see <a href="https://github.com/meteor/meteor/wiki/OAuth-for-mobile-Meteor-clients">OAuth for Mobile Meteor Clients</a> for details). To do this, first deploy your meteor application to a live server.

(e.g. <code>meteor deploy {your-server-url} --settings settings.json</code>)

Once the app is successfully deployed, run:

<code>meteor run android-device --mobile-server {your-server-url} --settings settings.json</code>

nice additional flags might be:
<code>--verbose
--production</code>

Please read the <a href="https://github.com/meteor/meteor/wiki/Meteor-Cordova-integration">Meteor Cordova Integration</a> docs for more details.

**The mobile UI is currently super slow. Any suggestions or contributions really appreciated here!**

### Electron Notes:

*Do NOT include the 'electron' field in your settings.json file if you are not running quasar from a Windows or Mac machine. meteor-electron will throw errors if you try and build from a Linux machine.*

quasar uses <a href="https://github.com/mixmaxhq/meteor-electron" target="_blank">meteor-electron</a> to easily transform into a downloadable desktop app and update as you develop. For <code>settings.json</code> configuration for this feature, please refer to the <a href="https://github.com/mixmaxhq/meteor-electron" target="_blank">meteor-electron documentation</a>.

meteor-electron has been modified to build a compressed version of the quasar desktop app at <code>quasar/public/downloads/{platform}-{arch}/quasar.zip</code>, which browser versions can reference for easy downloading. See <a href="https://github.com/srtucker22/quasar/blob/master/client/components/modules/download-button.component.jsx#L57" target="_blank">download-button.component.jsx</a> for how components reference this directory.

To run the Electron app pointing to localhost, exclude the <code>rootUrl</code> parameter from <code>settings.json</code>, otherwise the Electron app will point to https://quasar.meteor.com.

## Application Design Overview

Quasar is an example of how to create a WebRTC video chatroom and also of how to integrate React and Flux in a Meteor app.

Don't know React or Flux? No problem!

The best way to describe React is that it is a view layer only.

Flux is an architectural pattern that can be used with React to enable one-way data flows to a centralized application data store using an event system.
- Your Views "Dispatch" "Actions"
- Your "Store" Responds to Dispatched Events
- Your Store Emits a "Change" Event
- Your View Responds to the "Change" Event

Read these useful guides to get a quick overview:
- [ReactJS For Stupid People](http://blog.andrewray.me/reactjs-for-stupid-people/)
- [Flux For Stupid People](http://blog.andrewray.me/flux-for-stupid-people/)

The application folder structure logically reflects the flux architecture through folders such as actions and stores.

Routing is done with [React Router](https://github.com/rackt/react-router)

It's worth spending some time understanding how this router works before digging into the code.
Check out <a href="https://github.com/srtucker22/quasar/blob/master/client/routes.jsx" target="_blank">routes.jsx</a> for the main router code.

quasar uses <a href="https://github.com/arunoda/meteor-streams" target="_blank">Meteor Streams</a> to power the WebRTC communication.
[Note: Meteor Streams is now officially an inactive project]

The streams are handled by RTCStore in <a href="https://github.com/srtucker22/quasar/blob/master/client/stores/rtc.store.jsx" target="_blank">rtc.store.jsx</a> on the frontend.

The streams are managed by roomStream in <a href="https://github.com/srtucker22/quasar/blob/master/server/streams/room.stream.jsx" target="_blank">room.stream.jsx</a> on the backend.

## Contributing

This project welcomes code contributions, bug reports and feature requests.

## Motivation

quasar is intended to be an example of how to create a WebRTC video chatroom and of how to integrate React and Flux in a Meteor app.

## Resources
- [quasar Meteor Lightening Talk!](https://youtu.be/C0S_QCb6HSM)
- [Flux for Stupid People](http://blog.andrewray.me/flux-for-stupid-people/)
- [WebRTC Demos](https://github.com/webrtc/)

## Upcoming

-  Create a Meteor iOS app that works with quasar on the web
-  Change the name of the project to make it more accessible for projected users (suggestions welcome)

## TODO
-  Enhance invite workflow
  - mobile -- you send an invite
    - if an active invitee opens the app after a notification and the inviter is active, they will get a dialog asking to join the room and a notification in their quasar notification list for retrieval -- which shows 'join' cta until the users leave the room
    - if you invite non-users, they will go directly to room as guest. if the room is empty, user will be directed to notifications list on mobile or homepage on desktop. ~ implement with invitation codes in email
-  Add raix push notifications for cordova to enhance mobile support
-  Add TURN server support to make it more useful for real-world deployment

## License

The MIT License

Copyright (c) 2016 Glipcode http://glipcode.com

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
