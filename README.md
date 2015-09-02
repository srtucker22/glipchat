# quasar

View the project at <a href="https://quasar.meteor.com">quasar.meteor.com</a>

A real-time video chatroom app built with Meteor + React + Flux + WebRTC

FE: react + flux + webrtc
BE: meteor

quasar works in browsers that support WebRTC and has so far been tested in Chrome and Firefox.

## Installation

1. Clone the project <code>git clone https://github.com/srtucker22/quasar.git</code>
2. Go to the primary directory <code>cd quasar</code>
3. Add a settings.json to the primary directory <code>touch settings.json</code>
4. Add your personal settings for the following services included in quasar (or remove the ones you don't want)

        {
          "facebook" : {
            "appId": "YOUR_APP_ID",
            "secret": "YOUR_APP_SECRET"
          },
          "google" : {
            "clientId" : "YOUR_CLIENT_ID",
            "clientSecret" : "YOUR_CLIENT_SECRET"
          },
          "kadira": {
            "appId": "YOUR_APP_ID",
            "appSecret": "YOUR_APP_SECRET
          }
        }

6. run the app with the settings <code>meteor --settings settings.json</code>
7. enjoy!

## Code Example

Most of the WebRTC magic happens using communication via <a href="https://github.com/arunoda/meteor-streams">Meteor Streams</a>. On the backend, the streams are managed in roomStream in <a href="https://github.com/srtucker22/quasar/blob/master/server/streams/room.stream.jsx">room.stream.jsx</a> and handled by RTCStore on the frontend in <a href="https://github.com/srtucker22/quasar/blob/master/client/stores/rtc.store.jsx">rtc.store.jsx</a>.

## Contributing

Would love any code contributions, and please raise issues if you run into bugs or have feature requests, etc. Thanks!

## Motivation

My original motivation for quasar was to learn React, Flux, and WebRTC in one go and further my Meteor skill.

quasar makes for a solid example of how to integrate React + Flux in a Meteor app, and how to get a WebRTC video chatroom up and running.

## Upcomming

-  React Native / Meteor iOS app that works with quasar on the web
-  Whatever else the people want

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
