'use strict';

var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');

/* Login */
/**
 * @api {post} /login User login
 * @apiVersion 0.0.1
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} email Email of the User.
 * @apiParam {String} password Password of the User.
 *
 * @apiSuccess {Object} user The logged-in User.
 * @apiSuccess {String} msg Success message.
 * @apiSuccess {String} sessionId The session id.
 *
 * @apiError (Unauthorized 401) MissingCredentials Missing credentials.
 * @apiError (Unauthorized 401) IncorrectCredentials Incorrect email or password.
 */
router.post('/login', authController.login);

/* Logout */
/**
 * @api {get} /logout User logout
 * @apiVersion 0.0.1
 * @apiName Logout
 * @apiGroup Authentication
 *
 * @apiSuccess {String} msg Success message.
 */
router.get('/logout', authController.logout);

/* Sign up */
/**
 * @api {post} /signup User sign up
 * @apiVersion 0.0.1
 * @apiName Signup
 * @apiDescription User sign up, given email and password. If successful, login and return user.
 * @apiGroup Authentication
 *
 * @apiParam {String} email Email of the User.
 * @apiParam {String} password Password of the User.
 *
 * @apiSuccess {Object} user The signed-up User.
 * @apiSuccess {String} msg Success message.
 * @apiSuccess {String} sessionId The session id.
 *
 * @apiError (Not Found 404) UserNotFound User not found.
 * @apiError (Bad Request 400) EmailRequired Email is required.
 * @apiError (Bad Request 400) PasswordRequired Password is required.
 * @apiError (Bad Request 400) UserAlreadyActivated User is already activated.
 */
router.post('/signup', authController.signup);

module.exports = router