var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = function (app) {
  var User = app.models.user;
  var controller = {};

  controller.login = function (req, res) {
    User.findOne({username: req.body.username}, function (err, user) {
      if (err) return res.status(400).json(err);
      if (!user) {
        return res.json({ success: false, message: 'Authentication failed. User not found.'})
      } else {
        var token = jwt.sign(user, app.get('secret'));
        user.password = undefined;
        return res.json({
          success: true,
          message: 'Logged!',
          token: token,
          currentUser: user;
        });
      }
    });
  };

  controller.register = function (req, res) {
    var bodyUser = {
      username: req.body.username || '',
      name: req.body.name || '',
      email: req.body.email || '',
      password: req.body.password || '',
    };

    if (bodyUser.name === '' || bodyUser.username === '' || bodyUser.email === '' || bodyUser.password === '') {
      return res.json({success: false, message: 'You need fill all fields'});
    }

    User.findOne({$or: [{username: bodyUser.username}, {email: bodyUser.email}]}, function (err, user) {
      if (err) return res.status(400).json(err);
      if (user) {
        return res.json({ success: false, message: 'Registration failed. Already exist a user with this email or username.'})
      } else {
        var newUser = new User(bodyUser);
        newUser.save(function (err) {
          if (err) return res.json(err);
          newUser.password = undefined;
          return res.json(newUser);
        });
      }
    });
  };

  return controller;
}
