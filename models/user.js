var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var createdUpdatedPlugin = require('../lib/mongoose-createdat-updatedat');
var Schema = mongoose.Schema;
var Role = require('./role');
var Counter = require('./counter');

var UserSchema = new Schema({
  _id: {
    type: Number
  },  
  enabled: {
    type: Boolean,
    default: false
  },
  username: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  last_update_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }  
});
// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;
  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isNew) {
    return next();
  }
  Counter.findByIdAndUpdate({_id: 'userid'}, {$inc: {seq: 1}}, function(err, counter) {
    if (err) {
      return next(err);
    }
    user._id = counter.seq;
    next();
  });
});

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.plugin(createdUpdatedPlugin);

module.exports = mongoose.model('User', UserSchema);
