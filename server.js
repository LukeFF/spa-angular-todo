#!/usr/bin/env node


var express = require('express')

var DEFAULT_PORT = 8080

var app = express()

app.use(express.static('assets'));
app.use(express.static('bower_components'));


app.get('/', function(req, res) {
  res.send('Hello World!')
})

var server = app.listen(DEFAULT_PORT, function() {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
