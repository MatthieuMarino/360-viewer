/**
 * Created by garageposte5 on 18/05/2016.
 */
var express = require('express');
var http = require('http');

var app = express();
var config = require('./config.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded());     // to support URL-encoded bodies

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});


var port = process.env.PORT || '3436';
app.set('port', port);

app.use(express.static(config.path));

app.get('/:name', function (req, res) {
    console.log((new Date()).toUTCString(), ':> file request');
    res.sendFile('./' + req.params.name);
});

app.get('/', function (req, res) {
    console.log((new Date()).toUTCString(), ':> site request');
    res.sendFile('./index.html');
});

app.get('/ping', function (req, res) {
    res.send("pong");
});

http.createServer(app).listen(port, function (err) {
    console.log('listening in http://localhost:' + port);
});

module.exports = app;
