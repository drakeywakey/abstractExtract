var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var abstractExtractor = require('./abstract');

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('index', { input: '', abstract: '' });
});

app.post('/', function (req, res) {
	var body = req.body;
	abstractExtractor.summarize(body.article)
	.then(function (abstract) {
		res.render('index', { input: body.article, abstract: abstract });
	})
	.catch(function (err) {
		console.error(err);
	});
	//var abstract = abstractExtractor(body.article);
	//console.log(abstract);
	//res.render('index', { input: body.article, abstract: abstract });
});

app.listen(app.get('port'), function (){
	console.log('Listening on port', app.get('port'));
});
