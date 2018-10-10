'use strict';

var express = require('express');
var config = require('../config');
var authController = require('../controllers/authController');
var router = express.Router();

// CORS
router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', config.frontendURL);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

/* Home */
/**
 * @api {get} / API Home
 * @apiVersion 0.0.1
 * @apiName GetHome
 * @apiGroup Home
 *
 * @apiSuccess {String} message OK response.
 */
router.get('/', function(req, res, next) {
  res.send({message: 'OK'});
});

/* Authentication */
router.use('/', require('./auth'));

/* Users */
router.use('/users', require('./users'));

module.exports = router