// Dependencies
var RoomActions = null;
var RoomStore   = null;
var UserStore   = null;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  RoomStore   = Dependency.get('RoomStore');
  UserStore   = Dependency.get('UserStore');
});

RoomComponent = React.createClass({
  statics: {
    // async transition requirements
    willTransitionTo: function(transition, params, query, callback) {
      UserStore.requireUser().then((user)=> {

        Dispatcher.dispatch({
          actionType: 'ENTER_ROOM',
          roomId: params.roomId,
        });

        RoomStore.requireRoom(params.roomId).then((room)=> {
          callback();
        })

        .catch((err)=> {
          console.error(err);
          transition.abort();
          callback();
        });
      })

      .catch((err)=> {
        console.error(err);
        transition.abort();
        callback();
      });
    },

    willTransitionFrom: function(transition, component) {
      console.log('leaving');

      // if (component.formHasUnsavedData()) {
      //   if (!confirm('You have unsaved information,'+
      //                'are you sure you want to leave this page?')) {
      //     transition.abort();
      //   }
      // }
    },
  },

  render() {
    return (
      <div>
        <div>
          I am a room
        </div>
        <VideoComponent />
      </div>
    );
  },
});
