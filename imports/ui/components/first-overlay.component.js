import PropTypes from 'prop-types';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import Colors from 'material-ui/styles/colors';
import React, { PureComponent } from 'react';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    color: Colors.fullWhite,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },

  invite: {
    css: {
      margin: '0 0 20px 0',
      width: '100%',
    },
    cell: {
      css: {
        padding: '10px',
        width: '50%',
      },
    },
  },

  linkUrl: {
    css: {
      backgroundColor: Colors.fullWhite,
      color: Colors.fullBlack,
      margin: '10px auto',
      overflow: 'hidden',
      padding: '10px',
      textOverflow: 'ellipsis',
    },
  },
};

export class FirstOverlayComponent extends PureComponent {
  render() {
    return (
      <div onTouchTap={this.props.onTouchTap}>
        <div style={[GlobalStyles.table, styles.css]}>
          <div style={[GlobalStyles.cell]}>
            <div style={[GlobalStyles.table, styles.invite.css]}>
              <div
                style={[
                  GlobalStyles.cell,
                  styles.invite.cell.css]}
                className="text-right"
              >You are the only one here.
              </div>
              <div
                style={[
                  GlobalStyles.cell,
                  styles.invite.cell.css]} className="text-left"
              >
                <RaisedButton
                  label="Invite people"
                  secondary
                  onTouchTap={this.props.action}
                />
              </div>
            </div>
            <div>
              <div className="text-center">
                {'Share the permanent link. Bookmark and come back anytime.'}
              </div>
              <div
                style={[
                  GlobalStyles.table,
                  GlobalStyles.inset,
                  styles.linkUrl.css]}
              >
                {this.props.linkUrl}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FirstOverlayComponent.propTypes = {
  action: PropTypes.func,
  linkUrl: PropTypes.string,
  onTouchTap: PropTypes.func,
};

export default Radium(FirstOverlayComponent);
