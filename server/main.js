import '../imports/api/lib/config';
import '../imports/api/lib/images';
import '../imports/api/lib/messages';
import '../imports/api/lib/notifications';
import '../imports/api/lib/roles';
import '../imports/api/lib/rooms';
import '../imports/api/lib/streams';
import '../imports/api/lib/users';

import '../imports/startup/server/load-accounts.js';
import '../imports/startup/server/store-downloads.js';

import '../imports/api/methods/google.methods';
import '../imports/api/methods/notification.methods';
import '../imports/api/methods/room.methods';
import '../imports/api/methods/user.methods';

import '../imports/api/publications/image.publications';
import '../imports/api/publications/message.publications';
import '../imports/api/publications/notification.publications';
import '../imports/api/publications/room.publications';
import '../imports/api/publications/user.publications';

import '../imports/api/rest/auth-middleware.rest';
import '../imports/api/rest/manifest.rest';

import '../imports/api/streams/room.stream';
