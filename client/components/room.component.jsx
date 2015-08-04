// Dependencies
var RoomStore   = null;
var RoomActions = null;

Dependency.autorun(()=> {
  RoomStore   = Dependency.get('RoomStore');
  RoomActions = Dependency.get('RoomActions');
});

RoomComponent = React.createClass({
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
