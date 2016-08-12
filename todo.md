**high**
-  Enhance invite workflow
  - mobile -- you send an invite
    - if an active invitee opens the app after a notification and the inviter is active, they will get a dialog asking to join the room and a notification in their quasar notification list for retrieval -- which shows 'join' cta until the users leave the room
    - if you invite non-users, they will go directly to room as guest. if the room is empty, user will be directed to notifications list on mobile or homepage on desktop. ~ implement with invitation codes in email
-  Add raix push notifications for cordova to enhance mobile support
-  Add TURN server support to make it more useful for real-world deployment
- notifications not working
- why is list so slow?
- revive electron

**med**
- build CI into deployment
- tests for all components
- figure out component tests with meteor + flux
- tests for actions
- tests for stores
- test multiple users on desktop native
- test multiple users on desktop browser
- test everything on mobile
- test everything on desktop native
- test the contact list component
- improve image storing
- remove yourself from the contact list
- getContacts should only get the updated contacts instead of all contacts -- a little bit of work here

**low**
- bug -- bookmark needs to be instantly selected for copying
- bug -- warning on name input
- bug -- don't include electron in cordova builds :/
- move the contacts from google to user level so google gets less importance
- bug -- logout spinner
- bug -- android photos not working
- transition the intro page nicely ~ maybe have the typeahead popup/down like in view mode
- notification collection for tracking all sorts of notifications
- show contact photo in answer-overlay
- small photo bug when first downloading with CollectionFS
https://github.com/CollectionFS/Meteor-CollectionFS/issues/591
