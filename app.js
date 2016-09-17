const express = require('express');
const app = express();

const auth = require('basic-auth');
app.use(function(req, res, next) {
  const user = auth(req);
  if (!user || user.name != process.env.CLIENT_USERNAME || user.pass != process.env.CLIENT_PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="csvup"');
    return res.status(401).send();
  }

  return next();
});

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: [__dirname + '/views/partials'],
  helpers: {
  }
}));
app.set('view engine', 'handlebars');

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const api = require('lib/api');
app.use('/api/v1', api);

app.get('/', function (req, res) {
  const stats = {
    storage: {
      bucketId: "bucket id",
      mongoName: "mongo name",
      total: 100
    },
    stathat: {
      enabled: true ? 'enabled' : 'disabled'
    },
    api: {
      enabled: true ? 'enabled' : 'disabled'
    }
  }
  res.render('index', {nav: {home_active: true}, stats: stats});
});

app.get('/admin', function (req, res) {
  res.render('manage', {nav: {manage_active: true}});
});

app.get('/admin/save', function (req, res) {
  res.render('save');
});

app.get('/admin/api', function (req, res) {
  res.render('api', {nav: {api_active: true}});
});

app.listen(process.env.PORT, function () {
  console.log(`CSV UP istening on port ${process.env.PORT}`);
});
