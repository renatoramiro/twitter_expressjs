module.exports = function (app) {
  var controller = app.controllers.account;

  app.post('/login', controller.login);
  app.post('/register', controller.register);
  // app.post('/logout', Auth.isAuthenticated, controller.logout);
}
