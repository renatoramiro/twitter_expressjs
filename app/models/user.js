var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = bcrypt.genSaltSync(8);

module.exports = function (app) {
  var userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    followers: [{type: Schema.ObjectId, ref: 'User'}],
    following: [{type: Schema.ObjectId, ref: 'User'}]
  });

  userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();

    user.password = bcrypt.hashSync(user.password, SALT_WORK_FACTOR);
    next();
  });

  userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  userSchema.methods.follow = function (id) {
    if (this.following.indexOf(id) === -1) {
      this.following.push(id);
    } else {
      this.following.splice(this.following.indexOf(id), 1);
    }
  };

  return mongoose.model('users', userSchema);
}
