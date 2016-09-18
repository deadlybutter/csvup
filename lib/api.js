const PAGE_SIZE = 25;

const express = require('express');
const router = express.Router();

const db = require(__dirname + '/db');
const storage = require(__dirname + '/storage');

const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.use(function timeLog(req, res, next) {
  const authKey = req.get('Authorization');
  if (!authKey || authKey != process.env.API_KEY) {
    return res.status(401).send("Invalid API Key");
  }

  next();
});

function evalRequest(params, req) {
  const body = req.body;
  if (!body) {
    return false;
  }

  const values = {};

  for (var param of params) {
    if (!body[param]) {
      return false;
    }

    values[param] = body[param];
  }

  return values;
}

// query for doc title
router.post('/search', (req, res) => {
  const values = evalRequest(['title'], req);

  if (values === false) {
    res.status(400).send("Missing parameters");
    return;
  }

  const page = req.body.page || 1;

  db.model.find({$text: {$search: values['title']}})
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .exec((err, dataSets) => {
      if (err) {
        console.log(err);
        res.status(500).send("DB error");
        return;
      }

      res.json({
        data: dataSets,
        pagination: {
          currentPage: page,
          pageSize: PAGE_SIZE
        }
      })
    });
});

// upload a new dataset & get a temp URL from Amazon to send the data
router.post('/upload', (req, res) => {
  const params = ['title', 'description', 'categories', 'dataSource'];
  const values = evalRequest(params, req);

  if (values === false) {
    res.status(400).send("Missing parameters");
    return;
  }

  values['categories'] = values['categories'].split(',');
  values['uploadSource'] = `admin-${process.env.PRODUCTION ? 'prod' : 'testing'}`;

  const dataSet = new db.model(values);
  dataSet.save((err, dataSet) => {
    if (err) {
      res.status(500).send("DB error");
      return;
    }

    storage(dataSet._id.toString(), (awsRes) => {
      dataSet.url = awsRes.url;
      dataSet.save((err, dataSet) => {
        if (err) {
          res.status(500).send("DB error");
          return;
        }

        res.json({
          data: dataSet,
          aws: awsRes
        });
      });
    });
  });
});

module.exports = {
  router: router,
  getDataSet: (id, cb) => {
    db.model.findOne({_id: id}, function(err, dataSet) {
      cb(dataSet);
    });
  },
  getRecentDataSets: (cb) => {
    db.model.find().sort({_id: -1}).limit(10).exec(function(err, dataSets) {
      cb(dataSets);
    });
  },
  stats: function() {
    return {
      bucketId: process.env.AWS_BUCKET,
      mongoUri: process.env.MONGO_URI,
      total: 100
    }
  }
};
