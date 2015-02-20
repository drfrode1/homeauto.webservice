/**
 * Module dependencies.
 */
var express = require('express');
var app = express();
var api = require('./routes/api');
var bodyParser = require('body-parser');
var passport = require('passport')
var BearerStrategy = require('passport-http-bearer').Strategy;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

var users = [
	{ id: 1, username: 'autouser', token: '123456789', email: 'test@test.com'}
];

function findByToken(token, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.token === token) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

passport.use(new BearerStrategy({
	},
	function(token, done) {
		process.nextTick(function() {
		
		findByToken(token, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			return done(null, user);
		})
	});
	}
));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);
app.use(bodyParser.json());

//var port = process.env.PORT || 8080;        // set our port

var router = express.Router(); 

app.use('/routes', router);
app.get('/switches', passport.authenticate('bearer', { session: false }), api.switches);
app.put('/switches/:id', passport.authenticate('bearer', { session: false }), api.editSwitch)
	

app.listen(8000);
console.log("Server running at http://127.0.0.1:8000/")