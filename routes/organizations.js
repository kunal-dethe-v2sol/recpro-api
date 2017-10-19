var express = require('express');
var router = express.Router();

const sequelize = require('../models/index');
const Organization = sequelize.import('../models/organization');

/* GET Organizations. */
router.get('/', function (req, res, next) {
	var code = 500;
	var message = 'Internal Server Error';
	var result = '';
	
	var page = req.query.page || 1;
	var limit = req.query.limit || 5;
	var offset = (page - 1) * limit;
	
	Organization
		.findAndCountAll({
			offset: +offset,
			limit: +limit
		})
		.then(result => {
			code = 200;
			message = 'OK';
			
			res.json({
				code: code,
				message: message,
				response: {
					data: {organizations: result}
				}
			});
		});
});

/* POST new Organization. */
router.post('/', function (req, res, next) {
	//console.log('req.body', req.body);
	var code = 500;
	var message = 'Internal Server Error';
	var response = '';

	var postData = {
		name: req.body.name
	};

	Organization.create(postData)
		.then(function (organization) {
			code = 200;
			message = 'OK';
			response = 'Organization is successfully added.';

			res.json({
				code: code,
				message: message,
				response: {
					msg: response
				}
			});
		})
		.catch(function (err) {
			console.log('Error, do some kind of redirect?!', err);
		});
});

module.exports = router;
