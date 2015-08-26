(()=> {
  // Dependencies
  const {
    Avatar,
    FontIcon,
    Menu,
    MenuItem,
    Paper,
    TextField
  } = MUI;

  let GlobalStyles = null;

  let ThemeManager = new MUI.Styles.ThemeManager();

  var Style = Radium.Style;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
  });

  const styles = {
    css: {
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
      avatar: {
        css: {
          borderRadius: '50%',
          border: 'solid 1px rgba(0, 0, 0, 0.08)',
          height: '24px',
          marginLeft: '1px',
          width: '24px',
        },
      },
      text: {
        css: {
          padding: '4px 5px 0',
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
              <img style={[GlobalStyles.cell, styles.chip.avatar.css]}
                src={'https://graph.facebook.com/10100803834281482/picture'}
              />
              <div style={[GlobalStyles.cell, styles.chip.text.css]}>{this.props.tag}</div>
              <FontIcon onTouchTap={this.props.remove} className='material-icons' style={styles.chip.icon.css}>remove_circle</FontIcon>
            </div>
          </Paper>
        </div>
      );
    }
  }));

  TypeaheadComponent = Radium(React.createClass({

    renderTag(key, tag, removeHandler) {
      if(tag){
        return (
          <TypeaheadChipComponent key={key} tag={tag} remove={removeHandler}/>
        );
      }
    },

    render() {
      var avatarComponent = (<img className='cell'
        src={'https://graph.facebook.com/10100803834281482/picture'}
      />);
      var avatarComponent2 = (<Avatar className='cell'
        src={'https://graph.facebook.com/10100803834281482/picture'}
      />);
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
              <TagsInput ref='tags' renderTag={this.renderTag}/>
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
  }));
})();
