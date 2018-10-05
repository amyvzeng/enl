'use strict';

var express = require('express');
var router = express.Router();
const mysqlx = require('@mysql/xdevapi');

const options = {
	user: 'amyzeng',
	password: 'Amonkeys21!',
	host: 'localhost',
	schema: 'tutorial'
};

var firstURL = Array(15).fill("https://image.shutterstock.com/image-photo/closeup-nature-green-leaf-blurred-450w-1163072119.jpg");
var secondURL = Array(15).fill("https://image.shutterstock.com/image-photo/wave-boat-on-beach-background-450w-1074395291.jpg");
var thirdURL = Array(15).fill("https://image.shutterstock.com/image-photo/natural-abstract-vintage-colorful-pebbles-450w-428477185.jpg");

router.get('/', function(req, res, next) {

	res.render('trial', {
		window: {
			firstURL: firstURL,
			secondURL: secondURL,
			thirdURL: thirdURL
		}
	});
	/*mysqlx
	    .getSession(options)
	    .then(session => {
	        return session
	            .sql('CREATE TABLE schemaName.tableName (column INT)')
	            .execute()
	            .then(() => {
	                return session.getSchema('tutorial').getTable('example');
	            });
	    })
	    .then(table => {
	        // work with the Table object
	    })
	    .catch(err => {
	        // something went wrong
	    })
	    .then(() => {
	    	res.render('trial',);
	    });*/

	

	/*var mySession = mysqlx.getSession(options);
	var table = session.getTable('example');
	res.clearCookie('testData');
	session.close();
	.then(session => {
		var table = session.getSchema('tutorial').getTable('example')
			.then(function() {
				res.cookie("testCookie", "testCookieValue");
				res.clearCookie("testData");
				session.close();
			})
	})
	.catch(err => {
		console.log(err.stack);
	});

	mySession.then(function() {
		res.render('trial');
	});*/
});

module.exports = router;