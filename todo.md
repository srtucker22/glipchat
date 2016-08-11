**high**
- react-list
- switch to people api at user level (500 people ~ 5 req/ 100 sec/ user)
- remove cf image storing
- fix isScrolling for TypeaheadContactComponent
- revive electron
- remove yourself from the contact list
- getContacts should only get the updated contacts instead of all contacts -- a little bit of work here
- show recently active/most frequent for mobile contacts instead of showing all contacts ~ and then expand to all contacts when querying

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

**low**
- bug -- bookmark needs to be instantly selected for copying
- bug -- warning on name input
- bug -- coloring of loading-dialog
- bug -- don't include electron in cordova builds :/
- move the contacts from google to user level so google gets less importance
- bug -- logout spinner
- bug -- android photos not working
- transition the intro page nicely ~ maybe have the typeahead popup/down like in view mode
- update readme for android instructions
- notification collection for tracking all sorts of notifications
- show contact photo in answer-overlay
- smarter search --> use first or last name and email (got the name and email so far)
  - you would need to change AccountsGuest conditional to be about Cordova only
- small photo bug when first downloading with CollectionFS
https://github.com/CollectionFS/Meteor-CollectionFS/issues/591
