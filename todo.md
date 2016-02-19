0.02 release candidate fixes:
- batch publications
- bug --> icon right on header needs dynamic placement based on device type or something -- matchmedia sucks (iphone 4 needs 24px right padding or something)
- bug --> list items are getting clicked accidentally -- try touchend vs. touchstart override for material-ui touch-ripple.jsx
- bug --> slow UI on android is lamesauce
- bug --> can't read property 'name' of undefined
- UI --> typeahead contact component needs padding before input and a placeholder and better Design
- release this with android notes for 5+ mobile web

0.03
- move the contacts from google to user level so google gets less importance
- bug --> logout spinner
- bug --> android app not working!!!
- transition the intro page nicely ~ maybe have the typeahead popup/down like in view mode
- clean up all android related bugs
- remove yourself from the contact list
- update readme for android instructions
- notification collection for tracking all sorts of notifications
- show recently active for mobile contacts instead of showing all contacts ~ and then expand to all contacts when querying

- getContacts should only get the updated contacts instead of all contacts -- a little bit of work here
- show contact photo in answer-overlay
- active contact tracking, subscribing shouldn't happen so often
- smarter search --> use first or last name and email (got the name and email so far)
- maybe be more open with login options for mobile browsers --> opt to go anonymous in login and have a flow like desktop
  - you would need to change AccountsGuest conditional to be about Cordova only
- small photo bug when first downloading with CollectionFS
- slow
https://github.com/CollectionFS/Meteor-CollectionFS/issues/591
