var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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
	res.render('index', { input: body.article, abstract: 'how bow dah' });
});

app.listen(app.get('port'), function (){
	console.log('Listening on port', app.get('port'));
});
