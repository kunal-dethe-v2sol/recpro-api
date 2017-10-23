var express = require('express');
var router = express.Router();

const sequelize = require('../models/index');
const Model = sequelize.import('../models/organization');

/* GET Models. */
router.get('/', function (req, res, next) {
	var code = 500;
	var message = 'Internal Server Error';
	var result = '';
	
	var page = req.query.page || 1;
	var limit = req.query.limit || 5;
	var offset = (page - 1) * limit;
	
	Model
		.findAndCountAll({
			offset: +offset,
			limit: +limit
		})
		.then(result => {
			code = 200;
			message = 'OK';
			
			res.status(code);
			res.json({
				code: code,
				message: message,
				response: {
					data: {models: result}
				}
			});
		});
});

/* GET Model. */
router.get('/:id', function (req, res, next) {
	var code = 500;
	var message = 'Internal Server Error';
	var result = '';
	
	var id = req.params.id | 0;
	
	Model
		.find({
			where: {
				id: id
			}
		})
		.then(result => {
			code = 200;
			message = 'OK';
			
			res.status(code);
			res.json({
				code: code,
				message: message,
				response: {
					data: {model: result}
				}
			});
		});
});

/* POST new Model. */
router.post('/', function (req, res, next) {
	var code = 500;
	var message = 'Internal Server Error';
	var response = '';

	var postData = {
		name: req.body.name
	};

	Model.create(postData)
		.then(function (model) {
			console.log('model', model);
			
			code = 200;
			message = 'OK';
			response = 'Record is successfully added.';

			res.status(code);
			res.json({
				code: code,
				message: message,
				response: {
					msg: response
				}
			});
		})
		.catch(function (err) {
			console.log('err', err);
			
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

/* PUT old Model. */
router.put('/:id', function (req, res, next) {
	var code = 500;
	var message = 'Internal Server Error';
	var response = '';

	var id = req.params.id;
	var putData = {
		name: req.body.name
	};

	Model.update(putData,
			{
				where: {
					id: id
				}
			}
		)
		.then(function (model) {
			code = 200;
			message = 'OK';
			response = 'Record is successfully updated.';

			res.status(code);
			res.json({
				code: code,
				message: message,
				response: {
					msg: response
				}
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

/* DELETE Model. */
router.delete('/:id', function (req, res, next) {
	var code = 500;
	var message = 'Internal Server Error';
	var response = '';

	var id = req.params.id;
	
	Model.destroy(
			{
				where: {
					id: id
				}
			}
		)
		.then(function (deletedRecord) {
			if(deletedRecord === 1) {
				code = 200;
				message = 'OK';
				response = 'Record is successfully deleted.';
			} else {
				code = 404;
				message = 'OK';
				response = 'Record not found.';
			}
			res.status(code);
			res.json({
				code: code,
				message: message,
				response: {
					msg: response
				}
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
