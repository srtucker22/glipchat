Inbox = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },

  statics: {
    willTransitionTo(transition, params, query) {

      if(!Meteor.user()){
        transition.abort();
      }
    },

    willTransitionFrom(transition, component) {
      // if (component.formHasUnsavedData()) {
      //   if (!confirm('You have unsaved information,'+
      //                'are you sure you want to leave this page?')) {
      //     transition.abort();
      //   }
      // }
    }
  },

  render() {
    return <h2>Inbox</h2>;
  }
});
