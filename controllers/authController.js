'use strict';

var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'},
  function(username, password, done) {
    User.findOne({ email: username }).populate('role').exec(function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Sorry, we didn\'t recognize that username and password combination. Please double-check and try again.' });
      }
      if (!user.activated) {
        return done(null, false, { message: 'User has not been activated.' });
      }
      if (!user.role) {
        return done(null, false, { message: 'User does not have a ROLE.' });
      }

      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return done(err); }
        if (!isMatch) {
          return done(null, false, { message: 'Sorry, we didn\'t recognize that username and password combination. Please double-check and try again.' });
        }
        return done(null, user);
      })
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).populate('role').exec(function(err, user) {
    done(err, user);
  });
});

module.exports = {

  login: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          err: info // Note the use 'info' to get back error condition from passport
        })
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({
            err: 'Could not log user in.'
          })
        }
        res.status(200).json({
          user: user,
          msg: 'Login success!',
          sessionId: req.session.id
        });
      });
    })(req, res, next);
  },

  // Destroys the session id, removes req.user
  logout: function(req, res) {
    req.logout();
    res.status(200).json({
      msg: 'Successfully logged out.'
    });
  },

  signup: function(req, res, next) {
    if (!req.body.email) {
      return res.status(400).json({
        msg: 'Email is required.'
      });
    }
    if (!req.body.password) {
      return res.status(400).json({
        msg: 'Password is required.'
      });
    }
    User.findOne({ email: req.body.email }).populate('role').exec(function(err, user) {
      if (err) { return next(err); }
      if (!user) {
        return res.status(404).json({
          msg: 'User not found.'
        });
      }
      if (user.activated) {
        return res.status(400).json({
          msg: 'User is already activated. Please try to log in.'
        });
      }
      var updatedUser = User(_.merge(user, {
        password: req.body.password, activated: true, last_update_by: user._id
      }));
      updatedUser.save(function (err, user) {
        if (err) { return next(err); }
        req.login(user, function(err) {
          if (err) {
            return res.status(500).json({
              err: 'Could not log user in.'
            })
          }
          res.status(200).json({
            user: user,
            msg: 'Sign-up success!',
            sessionId: req.session.id
          });
        });
      });
    });
  },

  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.sendStatus(401);
    }
  },

  ensureRolePermission: function(req, res, next) {
    // ensure authenticated user exists with admin role or
    // ensure authenticated user exists with publisher role, checking user id and param id are equal
    // otherwise send 401 response status
    if (!req.user) {
      return res.sendStatus(401);
    }
    if (req.user.role.name === 'ADMIN') {
      return next();
    }
    if (req.user.role.name === 'PUBLISHER' && parseInt(req.user._id) === parseInt(req.params.id)) {
      return next();
    }
    return res.status(401).send({
      message: 'User does not have explicit permissions to perform this action.'
    });
  },

  ensureAdmin: function(req, res, next) {
    // ensure authenticated user exists with admin role,
    // otherwise send 401 response status
    if (!req.user) {
      return res.sendStatus(401);
    }
    if (req.user.role.name === 'ADMIN') {
      return next();
    }
    return res.status(401).send({
      message: 'User does not have explicit permissions to perform this action.'
    });
  }
}