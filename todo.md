icon right on header needs dynamic placement based on device type or something -- matchmedia sucks
the dialog will ask the user if they want to send the invites,
  it will be clever about whether the invites are all for non users or any existing users
send invites button makes a request to the roomstore
  if users exist in list, will open the room and send invites to all parties, otherwise will send invites and that's it -- matchmedia sucks
  it will also start a timer for waiting for responses. if no response is received within timer, we end the call but keep the screen and offer to retry
