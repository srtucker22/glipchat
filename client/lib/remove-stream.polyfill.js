if (window.mozRTCPeerConnection) {
  RTCPeerConnection.prototype.removeStream = function(stream) {
    this.getSenders().forEach(sender =>
      stream.getTracks().includes(sender.track) && this.removeTrack(sender));
  };
}
