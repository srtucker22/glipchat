(()=> {
  // Dependencies
  const {
    FontIcon,
    Menu,
    MenuItem,
    Paper,
    TextField
  } = MUI;

  let GlobalStyles = null;
  let RoomActions = null;
  let RoomStore = null;

  let ThemeManager = new MUI.Styles.ThemeManager();

  var Style = Radium.Style;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
    RoomActions = Dependency.get('RoomActions');
    RoomStore = Dependency.get('RoomStore');
  });

  const styles = {
    css: {
      border: '1px solid rgb(228,228,228)',
      padding: '10px',
    },

    chip: {
      css: {
        borderRadius: '24px',
        height: '24px',
      },

      border: {
        css: {
          display: 'inline-block',
          padding: '5px 5px 5px 0',
        },
      },

      icon: {
        css: {
          cursor: 'pointer',
          width: '24px',
        },
      },
      text: {
        css: {
          padding: '4px 5px 0 10px',
          fontSize: '12px',
          verticalAlign: 'top',
        }
      },
    },
  };

  TypeaheadChipComponent = Radium(React.createClass({
    childContextTypes: {
      muiTheme: React.PropTypes.object
    },

    getChildContext() {
      return {
        muiTheme: ThemeManager.getCurrentTheme()
      };
    },

    render(){
      return (
        <div style={styles.chip.border.css}>
          <Paper zDepth={1} style={styles.chip.css}>
            <div style={[GlobalStyles.table]}>
              <div style={[GlobalStyles.cell, styles.chip.text.css]}>{this.props.tag}</div>
              <FontIcon onTouchTap={this.props.remove} className='material-icons' style={styles.chip.icon.css}>remove_circle</FontIcon>
            </div>
          </Paper>
        </div>
      );
    }
  }));

  TypeaheadComponent = Radium(React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
      return {
        invitees: RoomStore.invitees.get()
      };
    },

    renderTag(key, tag, removeHandler) {
      if(tag){
        return (
          <TypeaheadChipComponent key={key} tag={tag} remove={removeHandler}/>
        );
      }
    },

    updateInvitees(i) {
      RoomActions.updateInvitees(i);
    },

    validate(tag) {
      let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/i

      return re.test(tag);
    },

    render() {
      return (
        <div className='typeahead'>
          <Style
            scopeSelector='.typeahead'
            rules={{
              input: {
                border: 'none',
                display: 'block',
                width: '100%',
              },
              'input:focus': {
                outline: 'none',
              }
            }}
          />
          <div className='row'>
            <div className='col-xs-12' style={[GlobalStyles.inset, styles.css]}>
              <TagsInput placeholder='+ Add email addresses' ref='tags' renderTag={this.renderTag} validate={this.validate} onChange={this.updateInvitees}/>
            </div>
          </div>
        </div>
      );
    },
  }));
})();
