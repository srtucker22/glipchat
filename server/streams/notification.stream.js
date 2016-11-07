import { notificationStream } from '../../lib/streams';

// notification permissions
notificationStream.allowRead((eventName)=> {
  return this.userId == eventName;
});

// users cannot write notification events
notificationStream.allowWrite('none');
