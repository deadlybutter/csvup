// Mongo Doc
// -----
// title -- $Text
// description
// data source
// upload source
// ---
// cloudfront link

const express = require('express');
const router = express.Router();
const db = require('db');

// check for API key
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// query for doc
router.get('/', function(req, res) {
  res.send('Birds home page');
});

module.exports = router;
