// Dependencies
const {History} = ReactRouter;
const {FontIcon, RaisedButton} = MUI;
const {Colors} = MUI.Styles;

const styles = {
  css: {
    backgroundAttachment: 'fixed',
    backgroundImage: 'url(images/quasar.jpg)',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: Colors.fullWhite,
    height: '100%',
    minHeight: '300px',
  },

  title: {
    css: {
      color: Colors.fullWhite,
      fontSize: '80px',
      textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
    },
  },
};

let GlobalStyles = null;
let RoomStore = null;
let RoomActions = null;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomStore = Dependency.get('RoomStore');
  RoomActions = Dependency.get('RoomActions');
});

HomeComponent = Radium(React.createClass({
  mixins: [ReactMeteorData, History],

  getMeteorData() {
    return {
      currentRoom: RoomStore.currentRoom.get(),
    };
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.data.currentRoom) {
      this.history.pushState(null, '/room/' + this.data.currentRoom._id);
    }
  },

  createRoom() {
    RoomActions.createRoom();
    this.setState({
      loading: true
    });
  },

  getInitialState() {
    return {
      loading: false
    };
  },

  render() {
    return (
      <div style={[styles.css]}>
        <GithubComponent />
        {this.state.loading ?
          <LoadingDialogComponent open={true} title='Starting video call'/> : ''
        }
        <div style={[GlobalStyles.stickyFooterPage]}>
          <HeaderComponent/>
          <div className='row'>
            <div className='col-xs-12 text-center'>
              <h1 style={[styles.title.css]}>{'quasar'}</h1>
              <br />
              <RaisedButton
                onTouchTap={this.createRoom}
                label='Start video call'
                primary={true}
              />
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    );
  },
}));
