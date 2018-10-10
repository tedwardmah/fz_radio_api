'use strict'

var express = require('express');
var controller = require('../controllers/userController.js');
var authController = require('../controllers/authController');

var router = express.Router();

/**
 * @api {get} /users Get list of users
 * @apiVersion 0.0.1
 * @apiName GetUsers
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiSuccess {Object[]} user Array of users
 * @apiSuccess {Number}  user._id The id
 * @apiSuccess {Boolean}  user.activated Indicates if the user was activated
 * @apiSuccess {String}  user.name Name of the user
 * @apiSuccess {String}  user.email Email of the user
 * @apiSuccess {Object}  user.role Role of the user
 * @apiSuccess {Object}  user.publisher The publisher the user belongs to
 * @apiSuccess {Object[]}  user.tags Array of Tag ids
 *
 * @apiError (Unauthorized 401) Unauthorized User must be authenticated and must be admin.
 */
router.get('/', authController.ensureAdmin, controller.index);

/**
 * @api {get} /users/:id Get user by id
 * @apiVersion 0.0.1
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiSuccess {Object} user The requested user
 * @apiSuccess {Number}  user._id The id
 * @apiSuccess {Boolean}  user.activated Indicates if the user was activated
 * @apiSuccess {String}  user.name Name of the user
 * @apiSuccess {String}  user.email Email of the user
 * @apiSuccess {Object}  user.role Role of the user
 * @apiSuccess {Object}  user.publisher The publisher the user belongs to
 * @apiSuccess {Object[]}  user.tags Array of Tag ids
 *
 * @apiError (Unauthorized 401) Unauthorized User must be authenticated.
 * @apiError (Not Found 404) NotFound User not found.
 */
router.get('/:id', authController.ensureRolePermission, controller.show);

/**
 * @api {post} /users Create new user
 * @apiVersion 0.0.1
 * @apiName PostUser
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiParam {String} name Name of the User.
 * @apiParam {String} email Email of the User.
 * @apiParam {Number} role Role id of the User.
 * @apiParam {Number} publisher Publisher id of the User.
 *
 * @apiSuccess (Created 201) {Object} user The created user.
 * @apiSuccess (Created 201) {Number}  user._id The id
 * @apiSuccess (Created 201) {Boolean}  user.activated Indicates if the user is activated
 * @apiSuccess (Created 201) {String}  user.name Name of the user
 * @apiSuccess (Created 201) {String}  user.email Email of the user
 * @apiSuccess (Created 201) {Object}  user.role Role of the user
 * @apiSuccess (Created 201) {Object}  user.publisher The publisher the user belongs to
 * @apiSuccess (Created 201) {Object[]}  user.tags Array of Tag ids
 *
 * @apiError (Unauthorized 401) Unauthorized User must be authenticated and must be admin.
 * @apiError (Bad Request 400) EmailRequired Email is required.
 * @apiError (Bad Request 400) EmailUnique Email is unique.
 * @apiError (Bad Request 400) RoleRequired Role is required.
 * @apiError (Bad Request 400) PublisherRequired If ROLE is Publisher then Publisher is required.
 * @apiError (Conflict 409) NoPublisherInDB There is no Publisher in DB with given ID.
 */
router.post('/', authController.ensureAdmin, controller.create);

/**
 * @api {put} /users/:id Update user by id
 * @apiVersion 0.0.1
 * @apiName PutUser
 * @apiGroup Users
 *
 * @apiParam {Object} params User params.
 *
 * @apiSuccess {Object} user The requested user
 * @apiSuccess {Number}  user._id The id
 * @apiSuccess {Boolean}  user.activated Indicates if the user was activated
 * @apiSuccess {String}  user.name Name of the user
 * @apiSuccess {String}  user.email Email of the user
 * @apiSuccess {Object}  user.role Role of the user
 * @apiSuccess {Object}  user.publisher The publisher the user belongs to
 * @apiSuccess {Object[]}  user.tags Array of Tag ids
 *
 * @apiError (Unauthorized 401) Unauthorized User must be authenticated.
 * @apiError (Not Found 404) NotFound User not found.
 * @apiError (Conflict 409) NoPublisherInDB There is no Publisher in DB with given ID.
 */
router.put('/:id', authController.ensureRolePermission, controller.update);

/**
 * @api {patch} /users/:id Patch user by id
 * @apiVersion 0.0.1
 * @apiName PatchUser
 * @apiGroup Users
 *
 * @apiParam {Object} params User params.
 *
 * @apiSuccess {Object} user The requested user
 * @apiSuccess {Number}  user._id The id
 * @apiSuccess {Boolean}  user.activated Indicates if the user was activated
 * @apiSuccess {String}  user.name Name of the user
 * @apiSuccess {String}  user.email Email of the user
 * @apiSuccess {Object}  user.role Role of the user
 * @apiSuccess {Object}  user.publisher The publisher the user belongs to
 * @apiSuccess {Object[]}  user.tags Array of Tag ids
 *
 * @apiError (Unauthorized 401) Unauthorized User must be authenticated.
 * @apiError (Not Found 404) NotFound User not found.
 */
router.patch('/:id', authController.ensureRolePermission, controller.update);

/**
 * @api {get} /users/:id Delete user by id
 * @apiVersion 0.0.1
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiSuccess (No Content 204) NoContent
 *
 * @apiError (Unauthorized 401) Unauthorized User must be authenticated and must be admin.
 * @apiError (Not Found 404) NotFound User not found.
 */
router.delete('/:id', authController.ensureAdmin, controller.destroy);

module.exports = router