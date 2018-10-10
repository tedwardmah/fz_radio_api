/**
* Endpoints
* GET     /users              ->  index
* POST    /users              ->  create
* GET     /users/:id          ->  show
* PUT     /users/:id          ->  update
* DELETE  /users/:id          ->  destroy
*/

'use strict'

var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

require('bluebird').promisifyAll(mongoose);

// Get list of users
exports.index = function(req, res, next) {
  User
    .find({}, '_id activated name email tags role')
    .populate('role')
    .execAsync()
    .then(function (roles) {
      return res.json(roles)
    })
    .catch(function (err) {
      return next(err);
    });
}

// Get a single user
exports.show = function(req, res, next) {
  User
    .findById(req.params.id, '_id activated name email tags role')
    .populate('role')
    .execAsync()
    .then(function (user) {
      if (!user) { return res.status(404).send('Not Found'); }
      return res.json(user);
    })
    .catch(function (err) {
      return next(err);
    });
}

// Creates a new user in the DB.
exports.create = function(req, res, next) {
  User.create(_.merge({last_update_by: req.user.id}, req.body), function(err, user) {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(201).json(user);
  });
}

// Updates an existing user in the DB.
exports.update = function(req, res, next) {
  if (req.body._id) { delete req.body._id }

  User
    .findById(req.params.id)
    .execAsync()
    .then(function (user) {
      if (!user) {
        return res.status(404).send('Not Found');
      }
      var updatedUser = User(_.merge(user, req.body, {last_update_by: req.user.id}));
      return updatedUser.saveAsync()
        .then(function (user) {
          return res.status(200).json(user);
        })
        .catch(function (err) {
          return res.status(400).send(err);
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

// Deletes a user from the DB.
exports.destroy = function(req, res, next) {
  User
    .findById(req.params.id)
    .execAsync()
    .then(function (user) {
      if (!user) {
        return res.status(404).send('Not Found');
      }
      return user.removeAsync()
        .then(function (user) {
          return res.status(204).send('No Content');
        })
        .catch(function (err) {
          return next(err);
        });
    })
    .catch(function (err) {
      return next(err);
    });
}