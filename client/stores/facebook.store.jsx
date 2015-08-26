// Dependencies
var UserStore = null;

Dependency.autorun(()=> {
  UserStore = Dependency.get('UserStore');
});

// FacebookStore Creator
var FacebookStore = function() {
  var _this = this;

  _this.status = ReactiveVar(null);

  _this.checkLoginState = (callback)=> {
    FB.getLoginStatus(callback);
  }

  _this.init = ()=> {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '426987064151795',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.4'
      });

      _this.checkLoginState(function(response){
        _this.status.set(response.status);
      });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  };

  _this.getFriends = ()=> {
    Meteor.call('getFriends', (err, res)=>{
      if(!err){
        console.log(res);
      } else {
        console.error(err);
      }
    });
  },

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'GET_FACEBOOK_FRIENDS':
        _this.getFriends();
        break;
      case 'INITIALIZE_FACEBOOK':
        _this.init();
        break;
    }
  });

  return _this;
};

// Create the instance
Dependency.add('FacebookStore', new FacebookStore());
