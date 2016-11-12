import Colors from 'material-ui/styles/colors';
import GlobalStyles from '../styles/global.styles';
import LoadingDialogComponent from './loading-dialog.component';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

const styles = {
  css: {
    color: Colors.fullWhite,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 3,
  },
};

export class ReadyPromptComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    // join room stream directly if alone in room
    if (!this.props.room.connected.length) {
      this.setState({
        loading: true,
      });
    };
  }

  render() {
    let loading = '';

    if (this.props.room.connected.length &&
      !~this.props.room.connected.indexOf(this.props.user._id)) {
      loading = (<div style={[GlobalStyles.table, styles.css]}>
        <LoadingDialogComponent
          open={(!!this.state.loading)}
          onTouchTap={this.props.onTouchTap}
          title='Joining'
          style={{zIndex: 3}}/>
        <div className='text-center' style={[GlobalStyles.cell]}>
          <p>Are you ready to join?</p>
          <RaisedButton label='Join'
            secondary={true}
            onTouchTap={this.props.joinRoomStream}>
          </RaisedButton>
        </div>
      </div>);
    }

    return (
      <div onTouchTap={this.props.onTouchTap}>
        {loading}
      </div>
    );
  }
}

ReadyPromptComponent.propTypes = {
  joinRoomStream: React.PropTypes.func,
  onTouchTap: React.PropTypes.func,
  room: React.PropTypes.object,
  user: React.PropTypes.object,
};

export default Radium(ReadyPromptComponent);
