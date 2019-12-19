const express = require('express');
const bodyparser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config.js');
const request = require('request');
const app = express();

app.use('/', express.static('static'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({
  extended: true
})); // to support URL-encoded bodies
app.disable('x-powered-by');

app.get('/rest/v1/system/:server', function (req, res) {
  request('http://' + req.params.server + '/info', { json: true }, (err, response, body) => {
    if (err) console.log(err);
    res.send(body);
  });
});

app.get('/rest/v1/dailyusage/:server', function (req, res) {
  const month = new Date().getMonth() + 1;
  database.collection('memory_usage').aggregate([
    {
      "$project": {
        "day": { "$dayOfMonth": "$date" },
        "month": { "$month": "$date" },
        "usage": "$usage",
        "device": "$device",
        "host": "$host"
      },
    },
    {
      "$match": { "host": req.params.server, "month": month }
    }
  ]).toArray().then(function (data) {
    res.send(data);
  })
});

app.get('/rest/v1/getusage/:server', function (req, res) {
  database.collection('server_load').find({}).sort({time: -1}).limit(40).toArray().then(function (data) {
    const sortedData = data.sort((a, b) => a.time - b.time)
    res.send(sortedData);
  })
});

MongoClient.connect('mongodb://' + config.database.user + ':' + config.database.password + '@' + config.database.host + ':' + config.database.port + '/' + config.database.database, function(err, db) {
  if(err) {
    console.log(err);
  }
  database = db.db(config.database.database);
});

app.listen(process.env.PORT || config.app.port, () => console.log('Example app listening on port ' + config.app.port));