**high**
-  reduxify
  - **firefox testing and fixes**
  - **fix contacts ~ needs a new fs system** --> i would also suggest putting all the contact updating inside the first getContacts request :)
  - **invite modal component broken**
  - **revive electron**
  - interval in component for mic/vid rights gUM
  - slow to create room why?
  - **still need to reimplement invitations**
    - full screen the react-select and always open!!
    - exclude already selected contacts from list
    - proper invite functionality (meteorMethod -- createRoom)
    - fix or replace react-select for all its bugs
  - need to add/fix notifications
-  validate all error messages
-  add some settings ~ especially cordova related ones
-  hide status icon until you implement that feature
-  snooze notifications functionality

-  Enhance invite workflow
  - mobile -- you send an invite
    - if an active invitee opens the app after a notification and the inviter is active, they will get a dialog asking to join the room and a notification in their quasar notification list for retrieval -- which shows 'join' cta until the users leave the room
    - if you invite non-users, they will go directly to room as guest. if the room is empty, user will be directed to notifications list on mobile or homepage on desktop. ~ implement with invitation codes in email
-  Add raix push notifications for cordova to enhance mobile support
-  Add TURN server support to make it more useful for real-world deployment

**med**
- build CI into deployment
- tests for all components
- figure out component tests with meteor + redux
- tests for actions
- tests for stores
- test multiple users on desktop native
- test multiple users on desktop browser
- test everything on mobile
- test everything on desktop native
- test the contact list component
- remove yourself from the contact list
- getContacts should only get the updated contacts instead of all contacts -- a little bit of work here

**low**
- tags input css
- bug -- bookmark needs to be instantly selected for copying
- bug -- don't include electron in cordova builds :/
- move the contacts from google to user level so google gets less importance
- bug -- android photos not working
- transition the intro page nicely ~ maybe have the typeahead popup/down like in view mode
- notification collection for tracking all sorts of notifications
- show contact photo in answer-overlay
