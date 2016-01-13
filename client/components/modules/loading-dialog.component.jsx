// Dependencies
const {
  Dialog,
  CircularProgress
} = MUI;

const {Colors} = MUI.Styles;

const styles = {
  body: {
    css: {
      background: Colors.grey900,
    }
  },

  content: {
    css: {
      background: 'none',
      borderRadius: '10px',
      maxWidth: '300px',
      textAlign: 'center',
      textTransform: 'uppercase'
    },
  }
};

LoadingDialogComponent = Radium(React.createClass({
  render() {
    return (
      <div className='LoadingDialog'>
        <Dialog
          bodyStyle={styles.body.css}
          contentStyle={styles.content.css}
          onRequestClose={false}
          open={this.props.open}>
          <h4>{this.props.title}</h4>
          <CircularProgress mode='indeterminate'/>
        </Dialog>
      </div>
    );
  },
}));
