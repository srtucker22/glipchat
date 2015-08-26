FB = Meteor.npmRequire('fb');

Meteor.methods({
  getFriends() {
    var user = Meteor.user();
    try {
      let token = user.services.facebook.accessToken;
      FB.setAccessToken(token);
      FB.api('me/friends', function (res) {
        if(!res || res.error) {
         console.log(!res ? 'error occurred' : res.error);
         return;
        }
        console.log(res);
        console.log(res.data);
        return res;
      });
    } catch(e){
      console.error(e);
    }
  },
});
