// UserStore Creator
var UserStore = () => {
  var self = {};

  // UserStore Reactive Vars
  var userIsSigning = new ReactiveVar(false);
  var loginOrCreate = new ReactiveVar('login');
  var createError   = new ReactiveVar('');
  var loginError    = new ReactiveVar('');
  var logoutError   = new ReactiveVar('');

  // Callbacks
  self.on = {
    userWantsToLogin() {
      userIsSigning.set(true);
      loginOrCreate.set('login');
    },

    userWantsToCreateAccount() {
      userIsSigning.set(true);
      loginOrCreate.set('create');
    },

    userWantsToLogout() {
      userIsSigning.set(false);
    },

    userCanceled() {
      userIsSigning.set(false);
    },

    loginFailed(error) {
      loginError.set(error);
    },

    createAccountFailed(error) {
      createError.set(error);
    },

    loginOrCreateSuccess() {
      loginError.set('');
      createError.set('');
      userIsSigning.set(false);
    },

    logoutFailed(error) {
      logoutError.set(error);
    },

    logoutSuccess() {
      logoutError.set('');
    },
  };

  // Getters
  self.get = {
    userIsSigning() {
      return userIsSigning.get();
    },

    loginOrCreate() {
      return loginOrCreate.get();
    },

    loginError() {
      return loginError.get();
    },

    createAccountError() {
      return createError.get();
    },

    logoutError() {
      return logoutError.get();
    },
  };

  self.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'USER_WANTS_TO_LOGIN':
        self.on.userWantsToLogin();
        break;
      case 'USER_WANTS_TO_CREATE_ACCOUNT':
        self.on.userWantsToCreateAccount();
        break;
      case 'USER_WANTS_TO_LOGOUT':
        self.on.userWantsToLogout();
        break;
      case 'USER_CANCELED':
        self.on.userCanceled();
        break;
      case 'CREATE_ACCOUNT_FAILED':
        self.on.createAccountFailed(payload.error);
        break;
      case 'LOGIN_FAILED':
        self.on.loginFailed(payload.error);
        break;
      case 'LOGIN_SUCCESS':
        self.on.loginOrCreateSuccess();
        break;
      case 'CREATE_ACCOUNT_SUCCEED':
        self.on.loginOrCreateSuccess();
        break;
      case 'LOGOUT_FAILED':
        self.on.logoutFailed(payload.error);
        break;
      case 'LOGOUT_SUCCESS':
        self.on.logoutSuccess();
        break;
    }
  });

  return self;
};

// Create the instance
Dependency.add('UserStore', new UserStore());
