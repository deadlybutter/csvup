const express = require('express');
const app = express();

const adminRouter = express.Router();
app.use('/admin', adminRouter);

const auth = require('basic-auth');
adminRouter.use((req, res, next) => {
  const user = auth(req);
  if (!user || user.name != process.env.CLIENT_USERNAME || user.pass != process.env.CLIENT_PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="csvup"');
    return res.status(401).send();
  }

  next();
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

const api = require(`${__dirname}/lib/api`);
if (process.env.ENABLE_API) {
  app.use('/api/v1', api.router);
}

app.get('/', (req, res) => {
  res.redirect('/admin')
});;

adminRouter.get('/', (req, res) => {
  const stats = {
    storage: api.stats(),
    stathat: {
      enabled: process.env.PRODUCTION ? 'enabled' : 'disabled'
    },
    api: {
      enabled: process.env.ENABLE_API ? 'enabled' : 'disabled'
    }
  }
  res.render('index', {nav: {home_active: true}, stats: stats, key: process.env.API_KEY});
});

adminRouter.get('/save', (req, res) => {
  res.render('save', {nav: {save_active: true}, key: process.env.API_KEY});
});

adminRouter.get('/manage', (req, res) => {
  api.getRecentDataSets(dataSets => {
    res.render('manage', {nav: {manage_active: true}, dataSets: dataSets, key: process.env.API_KEY});
  });
});

adminRouter.get('/manage/dataset/:id', (req, res) => {
  api.getDataSet(req.params['id'], dataSet => {
    res.render('dataset', {nav: {manage_active: true}, dataSet: dataSet, key: process.env.API_KEY});
  })
});

adminRouter.get('/manage/api', (req, res) => {
  res.render('api', {nav: {api_active: true}, key: process.env.API_KEY});
});

app.listen(process.env.PORT, () => {
  console.log(`CSV UP istening on port ${process.env.PORT}`);
});
