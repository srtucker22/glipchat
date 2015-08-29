(()=> {

  const {FontIcon} = MUI;
  const Colors = MUI.Styles.Colors;

  const styles = {
    css: {

    },

    general: {
      css: {
        color: Colors.fullWhite,
        fontSize: '20px',
        fontWeight: 'bold',
      },

      icon: {
        css: {
          display: 'block',
          margin: '20px auto',
        },
      },
    },

    permissionDenied: {
      css: {
        color: Colors.fullWhite,
        fontSize: '20px',
        margin: 'auto',
        maxWidth: '800px',
        minWidth: '520px',
      },

      arrow: {
        css: {
          padding: 0,
          width: '100px',
        },
      },

      icon: {
        css: {
          top: '4px',
        },
      },

      cell: {
        css: {
          paddingTop: '50px',
        },
      }
    },
  };

  let GlobalStyles = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
  });

  let permissionDeniedComponent = (appName)=> {
    return (
      <div style={[styles.permissionDenied.css]}>
        <div className='row'>
          <div className='col-xs-12 text-center' style={[GlobalStyles.table]}>
            <img style={[GlobalStyles.cell, styles.permissionDenied.cell.css, styles.permissionDenied.arrow.css]} src='images/arrow-left.png' />
            <div style={[GlobalStyles.cell, styles.permissionDenied.cell.css]}>
              Click the <FontIcon className='material-icons' style={styles.permissionDenied.icon.css} color={Colors.red500}>videocam_off</FontIcon> icon in the URL bar above to give {appName} access to your computer's camera and microphone.
            </div>
            <img style={[GlobalStyles.cell, styles.permissionDenied.cell.css, styles.permissionDenied.arrow.css]} src='images/arrow-right.png' />
          </div>
        </div>
      </div>
    );
  };

  let duplicateErrorComponent = (
    <div className='row' style={[styles.general.css]}>
      <div className='col-xs-12 text-center'>
        <img src='images/camel.png' style={[styles.general.icon.css]}/>
        <p>Uh oh! You're already connected to this room in a different window, tab, or browser.</p>
      </div>
    </div>
  );

  let generalErrorComponent = (
    <div className='row' style={[styles.general.css]}>
      <div className='col-xs-12 text-center'>
        <img src='images/atomic.png' style={[styles.general.icon.css]}/>
        <p>Uh oh! Something went wrong. Please try refreshing the page.</p>
      </div>
    </div>
  );

  let notSupportedErrorComponent = (
    <div className='row' style={[styles.general.css]}>
      <div className='col-xs-12 text-center'>
        <img src='images/astronaut.png' style={[styles.general.icon.css]}/>
        <p>Sorry, we don't currently support your browser. Please use Chrome or Firefox.</p>
      </div>
    </div>
  );

  LocalStreamErrorComponent = Radium(React.createClass({
    render(){
      var { ...other } = this.props;

      var errorComponent = <div>{this.props.error.status}</div>;

      switch(this.props.error.status){
        case 'PermissionDeniedError':
          errorComponent = permissionDeniedComponent(this.props.appName);
          break;
        case 405:
          errorComponent = notSupportedErrorComponent;
          break;
        case 409:
          errorComponent = duplicateErrorComponent;
          break;
        default:
          errorComponent = generalErrorComponent;
          break;
      }

      return errorComponent;
    }
  }));
})();
