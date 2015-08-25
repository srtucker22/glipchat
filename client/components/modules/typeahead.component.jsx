// Dependencies
const {
  Avatar,
  FontIcon,
  Menu,
  MenuItem,
  Paper,
  TextField
} = MUI;

TypeaheadComponent = React.createClass({
  render() {
    var avatarComponent = (<img className='cell'
      src={'https://graph.facebook.com/10100803834281482/picture'}
    />);
    var avatarComponent2 = (<Avatar className='cell'
      src={'https://graph.facebook.com/10100803834281482/picture'}
    />);
    return (
      <div className='typeahead'>
        <div className='row'>
          <div className='col-xs-12 typeahead-input-wrapper'>
            <div className='row typeahead-chips'>
              <div className='typeahead-chip'>
                <div className='table'>
                  {avatarComponent}
                  <div className='cell text'>Test</div>
                  <FontIcon className="cell material-icons">remove_circle</FontIcon>
                </div>
              </div>
              <div className='typeahead-chip'>
                <div className='table'>
                  {avatarComponent}
                  <div className='cell text'>Test</div>
                  <FontIcon className="cell material-icons">remove_circle</FontIcon>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12 typeahead-input'>
                <input type='text' />
              </div>
            </div>
          </div>
        </div>
        <div className='row typeahead-menu-wrapper'>
          <Paper className='typeahead-menu col-xs-12' zDepth={1}>
            <div className='typeahead-menu-item table'>
              {avatarComponent2}
              <div className='cell right'>Test</div>
            </div>
            <div className='typeahead-menu-item table'>
              {avatarComponent2}
              <div className='cell right'>Test</div>
            </div>
          </Paper>
        </div>
      </div>
    );
  },
});
