# quasar

View the project at <a href="https://quasar.meteor.com">quasar.meteor.com</a>

quasar is a real-time video chatroom application. The frontend is powered by React, Flux and WebRTC and the backend is powered by Meteor.

quasar has been tested in Chrome and Firefox. Other browsers may not support WebRTC.

## Motivation

quasar is intended to be an example of how to create a WebRTC video chatroom and of how to integrate React and Flux in a Meteor app.

## Installation

1. Clone the project <code>git clone https://github.com/srtucker22/quasar.git</code>
2. Go to the primary directory <code>cd quasar</code>
3. Add a settings.json to the primary directory <code>touch settings.json</code>
4. Add your personal settings for the following services included in quasar (or remove the ones you don't want)

        {
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
            }
          }
        }

5. Run the app with the settings <code>meteor --settings settings.json</code>

## Application Design Overview

As mentioned previously, quasar is an example of how to create a WebRTC video chatroom and also of how to integrate React and Flux in a Meteor app.

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
Check out <a href="https://github.com/srtucker22/quasar/blob/master/client/routes.jsx">routes.jsx</a> for the main router code.

quasar uses <a href="https://github.com/arunoda/meteor-streams">Meteor Streams</a> to power the WebRTC communication.
[Note: Meteor Streams is now officially an inactive project]

The streams are handled by RTCStore in <a href="https://github.com/srtucker22/quasar/blob/master/client/stores/rtc.store.jsx">rtc.store.jsx</a> on the frontend.

The streams are managed by roomStream in <a href="https://github.com/srtucker22/quasar/blob/master/server/streams/room.stream.jsx">room.stream.jsx</a> on the backend.

## Contributing

This project welcomes code contributions, bug reports and feature requests.

## Motivation

quasar is intended to be an example of how to create a WebRTC video chatroom and of how to integrate React and Flux in a Meteor app.

## Resources
- [quasar Meteor Lightening Talk!](https://youtu.be/C0S_QCb6HSM)
- [Flux for Stupid People](http://blog.andrewray.me/flux-for-stupid-people/)
- [WebRTC Demos](https://github.com/webrtc/)

## Upcoming

-  Create a React Native / Meteor iOS app that works with quasar on the web
-  Change the name of the project to make it more accessible for projected users (suggestions welcome)

## TODO
-  Implement a global namespace for appName (clarify meaning)
-  Remove Radium local weirdness when issue is resolved
-  Add raix push notifications for cordova to enhance mobile support
-  Add TURN server support to make it more useful for real-world deployment
-  Add Google contact integration in tags input to make it easier to invite friends to chats
-  Package the application to make it easier to install

## License

The MIT License

Copyright (c) 2015 Glipcode http://glipcode.com

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
