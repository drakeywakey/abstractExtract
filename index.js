var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
	var body = req.body;
	res.set('Content-Type', 'text/plain');
	res.send(body.article);
});

app.listen(app.get('port'), function (){
	console.log('Listening on port', app.get('port'));
});
