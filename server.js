var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser'),
  myDB = require("./api/models/userModel"),
  routes = require('./api/routes/userRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //we'll be using json

//initialize database
myDB.initDB();

//setup the routes
routes(app);

//app.use(function(req, res) 
//{
//  res.status(404).send({url: req.originalUrl + ' not found'})
//});

app.listen(port);

console.log('user RESTful API server started on: ' + port);

process.on('SIGINT', cleanup);//catch a ctrl+c
process.on('SIGTERM', cleanup);//or a terminate command

function cleanup() {

  myDB.closeDB();
  process.exit();
}


