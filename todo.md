0.02 release candidate fixes:
- **WAITING TO DEPLOY** guest login mobile
  - login with google option in sidebar and main home view
  - invite component
  - profile name field in HomeMobileComponent
- bug --> icon right on header needs dynamic placement based on device type or something -- matchmedia sucks (iphone 4 needs 24px right padding or something)
- **WAITING TO DEPLOY** bug --> list items are getting clicked accidentally -- try touchend vs. touchstart override for material-ui touch-ripple.jsx
- UI --> typeahead contact component needs padding before input and a placeholder and better Design

0.03
- bug --> slow UI on android is lamesauce
- bug --> don't include electron in cordova builds :/
- move the contacts from google to user level so google gets less importance
- bug --> logout spinner
- bug --> android photos not working
- transition the intro page nicely ~ maybe have the typeahead popup/down like in view mode
- remove yourself from the contact list
- update readme for android instructions
- notification collection for tracking all sorts of notifications
- show recently active for mobile contacts instead of showing all contacts ~ and then expand to all contacts when querying

- getContacts should only get the updated contacts instead of all contacts -- a little bit of work here
- show contact photo in answer-overlay
- smarter search --> use first or last name and email (got the name and email so far)
  - you would need to change AccountsGuest conditional to be about Cordova only
- small photo bug when first downloading with CollectionFS
https://github.com/CollectionFS/Meteor-CollectionFS/issues/591
