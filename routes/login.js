var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const sequelize = require('../models/index');
const Model = sequelize.import('../models/users');

/* Login. */
router.post('/', function(req, res, next) {
	var code = 500;
	var message = 'Internal Server Error';
	var response = '';

	Model.find({
			where: {
				email: req.body.email,
				password: req.body.password
			}
		})
		.then(function (model) {
			if(model) {
				code = 200;
				message = 'OK';
				
				user = model.dataValues;
				user['full_name'] = user.firstname + ' ' + user.lastname;
				var payload = {user: user};
				
				var token = jwt.sign(payload, req.app.get('jwtSecret'), {
					expiresIn: '24h'
				});
				response = {token: token};
			} else {
				code = 404;
				message = 'Not found';
				response = {
					msg: 'Invalid Email or Password!'
				};
			}
			
			res.status(code);
			res.json({
				code: code,
				message: message,
				response: response
			});
		})
		.catch(function (err) {
			code = 500;
			response = message;

			res.status(code);
			res.json({
				code: code,
				message: message,
				response: {
					msg: response
				}
			});
		});
});

module.exports = router;
