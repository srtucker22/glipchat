/**
 * @todo: recursively send requests until all contacts are fetched
 *
 * @see https://developers.google.com/google-apps/contacts/v3/reference#ContactsFeed
 *
 * To API test requests:
 *
 * @see https://developers.google.com/oauthplayground/
 *
 * To format JSON nicely:
 *
 * @see http://jsonviewer.stack.hu/
 *
 * Note: The Contacts API has a hard limit to the number of results it can return at a
 * time even if you explicitly request all possible results. If the requested feed has
 * more fields than can be returned in a single response, the API truncates the feed and adds
 * a "Next" link that allows you to request the rest of the response.
 */
var EventEmitter = Npm.require('events').EventEmitter,
  _ = Npm.require('underscore'),
  qs = Npm.require('querystring'),
  util = Npm.require('util'),
  url = Npm.require('url'),
  https = Npm.require('https'),
  querystring = Npm.require('querystring');

GoogleContacts = function (opts) {
  if (typeof opts === 'string') {
    opts = { token: opts };
  }
  if (!opts) {
    opts = {};
  }

  this.contacts = [];
  this.consumerKey = opts.consumerKey ? opts.consumerKey : null;
  this.consumerSecret = opts.consumerSecret ? opts.consumerSecret : null;
  this.token = opts.token ? opts.token : null;
  this.refreshToken = opts.refreshToken ? opts.refreshToken : null;
};

GoogleContacts.prototype = {};

util.inherits(GoogleContacts, EventEmitter);


GoogleContacts.prototype._get = function (params, cb) {
  var self = this;

  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  var req = {
    host: 'www.google.com',
    port: 443,
    path: this._buildPath(params),
    method: 'GET',
    headers: {
      'Authorization': 'OAuth ' + this.token
    }
  };

  // console.log(req);

  https.request(req, function (res) {
    var data = '';

    res.on('end', function () {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        var error = new Error('Bad client request status: ' + res.statusCode);
        return cb(error);
      }
      try {
        data = JSON.parse(data);
        cb(null, data);
      }
      catch (err) {
        cb(err);
      }
    });

    res.on('data', function (chunk) {
      //console.log(chunk.toString());
      data += chunk;
    });

    res.on('error', function (err) {
      cb(err);
    });

    //res.on('close', onFinish);
  }).on('error', function (err) {
    cb(err);
  }).end();
};

GoogleContacts.prototype._getPhotoData = function (params, cb) {
  var self = this;

  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  var req = {
    host: 'www.google.com',
    port: 443,
    path: this._buildPath(params),
    method: 'GET',
    headers: {
      'Authorization': 'OAuth ' + this.token
    }
  };

  // console.log(req);

  https.request(req, function (res) {
    var data;
    var dataType = false;
    // var data = new Buffer();

    res.on('end', function () {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        var error = new Error('Bad client request status: ' + res.statusCode);
        return cb(error);
      }
      try {
        // console.log('end: ', data.length);
        cb(null, data);
      }
      catch (err) {
        cb(err);
      }
    });

    res.on('data', function (chunk) {
      // console.log(req.path, " : ", chunk.toString().length, ": ", chunk.length);
      if (dataType) {
        chunk_buffer = new Buffer(chunk, 'binary');
        // data += chunk;
        data = Buffer.concat([data, chunk_buffer]);
      } else {
        data = new Buffer(chunk, 'binary');
        dataType = true;
        // console.log('start: ');
      }
      // console.log('chunk: ', chunk.length);
    });

    res.on('error', function (err) {
      cb(err);
    });

    //res.on('close', onFinish);
  }).on('error', function (err) {
    cb(err);
  }).end();
};

GoogleContacts.prototype.getPhoto = function (path, cb) {
  var self = this;

  this._getPhotoData({path: path}, receivedPhotoData);
  function receivedPhotoData(err, data) {
    cb(err, data);
  }
};

GoogleContacts.prototype.getContacts = function (cb, contacts) {
  var self = this;

  this._get({ type: 'contacts' }, receivedContacts);
  function receivedContacts(err, data) {
    if (err) return cb(err);

    self._saveContactsFromFeed(data.feed);

    var next = false;
    data.feed.link.forEach(function (link) {
      if (link.rel === 'next') {
        next = true;
        var path = url.parse(link.href).path;
        self._get({ path: path }, receivedContacts);
      }
    });
    if (!next) {
      cb(null, self.contacts);
    }
  }
};

GoogleContacts.prototype._saveContactsFromFeed = function (feed) {
  var self = this;
  //console.log(feed);
  var i = 0;
  feed.entry.forEach(function (entry) {
    //console.log(entry);
    try {
      var id = entry.id['$t'];
      var name = entry.title['$t'];
      var email = entry['gd$email'][0].address; // only save first email
      var photoUrl;
      var mimeType;
      entry.link.some(function(link) {
        if ((link.rel) && (link.rel.indexOf('#photo') !== -1) && (link.type.indexOf('image') !== -1)){
          photoUrl = link.href;
          mimeType = link.type;
          // console.log(link);
        }
      });
      if (photoUrl){
        self.contacts.push({ name: name, email: email, photoUrl: photoUrl, mime_type: mimeType, id: id});
      }
    }
    catch (e) {
      // property not available...
    }
  });
};

GoogleContacts.prototype._buildPath = function (params) {
  if (params.path) return params.path;

  params = params || {};
  params.type = params.type || 'contacts';
  params.alt = params.alt || 'json';
  params.projection = params.projection || 'thin';
  params.email = params.email || 'default';
  params['max-results'] = params['max-results'] || 2000;

  var query = {
    alt: params.alt,
    'max-results': params['max-results']
  };

  var path = '/m8/feeds/';
  path += params.type + '/';
  path += params.email + '/';
  path += params.projection;
  path += '?' + qs.stringify(query);

  return path;
};

GoogleContacts.prototype.refreshAccessToken = function (refreshToken, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  var data = {
    refresh_token: refreshToken,
    client_id: this.consumerKey,
    client_secret: this.consumerSecret,
    grant_type: 'refresh_token'

  };

  var body = qs.stringify(data);

  var opts = {
    host: 'accounts.google.com',
    port: 443,
    path: '/o/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    }
  };

  //console.log(opts);
  //console.log(data);

  var req = https.request(opts, function (res) {
    var data = '';
    res.on('end', function () {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        var error = new Error('Bad client request status: ' + res.statusCode);
        return cb(error);
      }
      try {
        data = JSON.parse(data);
        //console.log(data);
        cb(null, data.access_token);
      }
      catch (err) {
        cb(err);
      }
    });

    res.on('data', function (chunk) {
      //console.log(chunk.toString());
      data += chunk;
    });

    res.on('error', function (err) {
      cb(err);
    });

    //res.on('close', onFinish);
  }).on('error', function (err) {
    cb(err);
  });

  req.write(body);
  req.end();
};