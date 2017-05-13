- electron icon
- electron auto-updater fix
- user login is really slow again -- maybe refactor all the google stuff
- electron download buttons
- electron settings for file locations

- rtc.actions.js:306 DOMException: Failed to set remote answer sdp: Called in wrong state: STATE_INPROGRESS

**high**
- **notification bug** -- sometimes first notification isn't received, probably due to new subscriptionid
  - we should clear old subscriptionids for the same device
  - missing a notification leads to being 1 behind in the chain
  - batch and send unsent notifications on getNotification as a single notification (2 ppl sent you requests)
  - make notification dropdown in main with notifications (active/inactive)
  - single notification for all subscriptionids
  - clicking notification with open window should redirect without reloading page
- notifications
  - android
  - firefox
  - mobile calling overlay
- validate all error messages

**med**
- firefox save gum rights
- 'connecting' dialog should start for inviter as soon as someone tries to joinroom
- change joining connecting etc to constants
- full screen the react-select and always open!!
- exclude already selected contacts from list
- fix or replace react-select for all its bugs
- Enhance invite workflow
  - mobile -- you send an invite
    - if an active invitee opens the app after a notification and the inviter is active, they will get a dialog asking to join the room and a notification in their notification list for retrieval -- which shows 'join' cta until the users leave the room
    - if you invite non-users, they will go directly to room as guest. if the room is empty, user will be directed to notifications list on mobile or homepage on desktop. ~ implement with invitation codes in email
-  Add raix push notifications for cordova to enhance mobile support
-  Add TURN server support to make it more useful for real-world deployment
- add some settings ~ especially cordova related ones
- hide status icon until you implement that feature
- snooze notifications functionality
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
- firefox ui when leaving stream can be funky
