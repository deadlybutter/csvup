const express = require('express');
const router = express.Router();
const db = require(__dirname + '/db');
const storage = require(__dirname + '/storage');

// check for API key
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// query for doc
router.get('/', function(req, res) {
  res.send('Birds home page');
});

module.exports = {
  router: router,
  stats: function() {
    return {
      bucketId: "bucket id",
      mongoName: "mongo name",
      total: 100
    }
  }
};
