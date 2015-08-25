(()=> {
  const styles = {
    css: {
      maxHeight: '100%',
      maxWidth: '100%',
      objectFit: 'cover',
      transition: 'opacity 1s ease-in-out',
    },

    flip: {
      css: {
        transform: 'scale(-1, 1)',
      },
    },

    fullScreen: {
      css: {
        height: '100%',
        width: '100%',
      },
    },
  };

  VideoComponent = Radium(React.createClass({
    render() {

      return (
        <video style={[styles.css, this.props.flip && styles.flip.css, this.props.fullScreen && styles.fullScreen.css]} src={URL.createObjectURL(this.props.src)} muted={this.props.muted} autoPlay></video>
      );
    },
  }));
})();
