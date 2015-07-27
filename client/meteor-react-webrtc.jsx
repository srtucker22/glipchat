var HelloUser = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },

  render() {
    return (
      <div>Hello, {this.data.currentUser? this.data.currentUser._id : 'you need to log in'}!</div>
    );
  }
});

Meteor.startup(function () {
  React.render(
    <HelloUser />,
    document.getElementById('content')
  );
});
