**high**
- BUG: first time push service worker fails
- BUG: rtc.actions.js:306 DOMException: Failed to set remote answer sdp: Called in wrong state: STATE_INPROGRESS
- BUG: sometimes first notification isn't received, probably due to new subscriptionid
  - missing a notification leads to being 1 behind in the chain
- ENHANCEMENT: Streamline build/publish process for Electron
- ENHANCEMENT: handle all error messages
- ENHANCEMENT: should clear old subscriptionids for the same device
- ENHANCEMENT: single notification for all subscriptionids
- FEATURE: mobile calling overlay
- FEATURE: UI for mobile notifications
- TEST: electron auto-updater test

**med**
- ENHANCEMENT: Add TURN server support to make it more useful for real-world deployment
- ENHANCEMENT: change joining connecting etc to constants
- ENHANCEMENT: electron icon
- ENHANCEMENT: exclude already selected contacts from list
- ENHANCEMENT: fix or replace react-select for all its bugs
- ENHANCEMENT: getContacts should only get the updated contacts instead of all contacts -- a little bit of work here
- ENHANCEMENT: remove yourself from the contact list
- ENHANCEMENT: user login is really slow due to SimpleSchema so it's commented out, but we could use some validation
- FEATURE: 'connecting' dialog should start for inviter when someone tries to joinroom
- FEATURE: improve invite workflow
  - mobile -- you send an invite
    - if an active invitee opens the app after a notification and the inviter is active, they will get a dialog asking to join the room and a notification in their notification list for retrieval -- which shows 'join' cta until the users leave the room
    - if you invite non-users, they will go directly to room as guest. if the room is empty, user will be directed to notifications list on mobile or homepage on desktop. ~ implement with invitation codes in email
- FEATURE: hide status icon until you implement that feature
- TEST: build CI into deployment
- TEST: tests for actions
- TEST: tests for all components
- TEST: tests for stores

**low**
- BUG: firefox ui when leaving stream can be funky ~ something abrupt is happening with unmounting
- ENHANCEMENT: clicking notification with open window should redirect without reloading page
- ENHANCEMENT: bookmark needs to be instantly selected for copying
- ENHANCEMENT: full screen the react-select and always open!!
- ENHANCEMENT: improve tags input css
- FEATURE: show contact photo in answer-overlay
- FEATURE: snooze notifications functionality
- FEATURE: transition the intro page nicely ~ maybe have the typeahead popup/down like in view mode