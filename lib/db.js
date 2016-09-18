const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, {config: {autoIndex: !process.env.PRODUCTION}}); // Disable autoIndex for prod

const dataSetSchema = new Schema({
  categories: {
    type: [String],
    index: true
  },
  dataSource: String,
  description: String,
  title: {
    type: String,
    index: 'text'
  },
  uploadSource: String,
  url: {
    type: String,
    index: true
  }
});

const DataSet = mongoose.model('DataSet', dataSetSchema);

module.exports = {
  model: DataSet,
  mongoose: mongoose
};
