import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  // Obtain a new access token using the refresh token
  exchangeRefreshToken() {
    this.unblock();

    let user;
    if (this.userId) {
      user = Meteor.users.findOne({ _id: this.userId });
    }

    const config = Accounts.loginServiceConfiguration.findOne({ service: 'google' });
    if (!config) {
      throw new Meteor.Error(500, 'Google service not configured.');
    }

    if (!user.services || !user.services.google || !user.services.google.refreshToken) {
      throw new Meteor.Error(500, 'Refresh token not found.');
    }

    let result;
    try {
      result = Meteor.http.call('POST',
        'https://accounts.google.com/o/oauth2/token',
        {
          params: {
            client_id: config.clientId,
            client_secret: config.secret,
            refresh_token: user.services.google.refreshToken,
            grant_type: 'refresh_token',
          },
        });
    } catch (e) {
      const code = e.response ? e.response.statusCode : 500;
      throw new Meteor.Error(code, 'Unable to exchange google refresh token.', e.response);
    }

    if (result.statusCode === 200) {
      // console.log('success');
      // console.log(EJSON.stringify(result.data));

      Meteor.users.update(user._id, {
        $set: {
          'services.google.accessToken': result.data.access_token,
          'services.google.expiresAt': (new Date()) + (1000 * result.data.expires_in),
        },
      });

      return result.data;
    }

    throw new Meteor.Error(result.statusCode, 'Unable to exchange google refresh token.', result);
  },
});
