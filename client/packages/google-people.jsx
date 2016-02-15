let GooglePeopleService = function() {
  let readyForUse = false;  // Google People API isn't ready for production
  let contacts;

  // Google People API isn't ready for production
  if (!readyForUse) {
    return {
      readyForUse
    };
  }

  // track changes to the user's google contacts
  Tracker.autorun((c)=> {
    if (!Meteor.user()) {
      contacts = [];
      return;
    }

    if (Meteor.user() && Meteor.user().services && Meteor.user().services.google) {
      contacts = Meteor.user().services.google.contacts;
    }
  });

  function getContacts() {
    let defer = Q.defer();

    function main() {
      const url = 'https://people.googleapis.com/v1/people/me/connections';
      let options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +
            Meteor.user().services.google.accessToken,
        },
        params: {
          pageSize: 500,
        }
      };

      // if we have contacts and a syncToken, just look for contact updates
      if (Meteor.user().services.google.contacts &&
        Meteor.user().services.google.contacts.syncToken) {
        options.params.syncToken =
          Meteor.user().services.google.contacts.syncToken;
      }

      // get all modified and new contacts
      HTTP.get(url, options, (err, res)=> {
        if (!err) {
          // updated contacts start as existing contacts or first contacts return
          let updatedContacts = contacts || {
            syncToken: res.data.nextSyncToken,
            connections: res.data.connections
          };

          // resolve changes between existing contacts and modified contacts
          let changedContacts = res.data.connections;
          if (!!changedContacts && changedContacts.length &&
            !!contacts && contacts.length) {
            // index the contacts by resourceName for O(n) updating
            let indexedContacts = _.indexBy(contacts, 'resourceName');

            // update and add changed/new contacts
            _.each(changedContacts, (contact)=> {
              indexedContacts[contact.resourceName] = contact;
            });

            // convert indexed list back to array
            updatedContacts.connections = _.map(indexedContacts, (val, key)=> {
              return val;
            });
          }

          // if updatedContacts reference has changed, we need to update user
          // if no changed/new contacts, don't update user
          if (updatedContacts !== contacts) {
            Meteor.users.update(
              {_id: Meteor.userId()},
              {$set:
                {'services.google.contacts': {
                  connections: updatedContacts.connections,
                  syncToken: updatedContacts.syncToken
                }}
              }
            );
          }
          defer.resolve(updatedContacts.connections);
        } else {
          defer.reject(err);
        }
      });
    }

    if (Meteor.user().services.google.expiresAt &&
      moment(Meteor.user().services.google.expiresAt).isBefore(moment())) {
      Meteor.call('exchangeRefreshToken', function(err, res) {
        if (!err) {
          main();
        } else {
          defer.reject(err);
        }
      });
    } else {
      main();
    }

    return defer.promise;
  }

  return {
    getContacts: getContacts,
    readyForUse: readyForUse
  };
};

GooglePeople = new GooglePeopleService();
