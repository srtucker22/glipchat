import Colors from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import GlobalStyles from '../styles/global.styles';

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

  render() {
    return (
      <div onTouchTap={this.props.onTouchTap}>
        <div style={[GlobalStyles.table, styles.css]}>
          <div className="text-center" style={[GlobalStyles.cell]}>
            <p>Are you ready to join?</p>
            <RaisedButton
              label="Join"
              secondary
              onTouchTap={this.props.joinRoomStream}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReadyPromptComponent.propTypes = {
  joinRoomStream: PropTypes.func,
  onTouchTap: PropTypes.func,
};

export default Radium(ReadyPromptComponent);
