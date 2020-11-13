var express = require('express');
var url = require('url');
const request = require('request');

var app = express();
getClientAddress = function (req) {
	return (req.headers['x-forwarded-for'] || '').split(',')[0] 
	|| req.connection.remoteAddress;
};
// set up handlebars view engine
var handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));

getClientAddress = function (req) {
	return (req.headers['x-forwarded-for'] || '').split(',')[0] 
	|| req.connection.remoteAddress;
};
app.get('/', function(req, res) {
	var href = req.query.url;
	if (href) {
		request(href, function (error, response, body) {
			console.error('error:', error);
			console.log('statusCode:', response && response.statusCode);
			//console.log('body:', body);
			var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
			if (error == null) {
				return res.render('home', { statusCode: response.statusCode, ip: ip, body: body });
			} else {
				return res.render('home', { statusCode: error, ip: ip, body: body });
			}
		});
	} else {
		var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
		return res.render('home', { ip: ip });
	}
});
app.get('/api', function(req, res) {
	var href = req.query.url;
	if (href) {
		request(href, function (error, response, body) {
			console.error('error:', error);
			console.log('statusCode:', response && response.statusCode);
			//console.log('body:', body);
			if (error == null) {
				return res.json(response.statusCode);
			} else {
				return res.json(response.error);
			}
		});
	} else {
		return res.json('!!!no url!!!');
	}
});
app.get('/code', function(req, res) {
	var href = req.query.url;
	if (href) {
		request(href, function (error, response, body) {
			console.error('error:', error);
			console.log('statusCode:', response && response.statusCode);
			//console.log('body:', body);
			var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
			if (error == null) {
				return res.json(body);
			} else {
				return res.json(body);
			}
		});
	} else {
		var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
		return res.json('/?url=NULL');
	}
});

app.use("/404",function (request, response) {
	response.status(404);
	response.json(`404 not found`);
});
app.use("/500",function (request, response) {
	response.status(404);
	response.json(`500 server error`);
});
app.use("/429",function (request, response) {
	response.status(404);
	response.json(`429 to many requests`);
});
app.use("/:stcode",function (request, response) {
	response.status(request.params.stcode);
	response.json(request.params.stcode + ' error');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' + 
        app.get('port') + '; press Ctrl-C to terminate.' );
});
