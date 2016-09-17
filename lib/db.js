const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, {config: {autoIndex: !process.env.PRODUCTION}}); // Disable autoIndex for prod

const dataSetSchema = new Schema({
  title: String,
  description: String,
  source: {
    data: String,
    upload: String
  },
  url: {
    type: String,
    index: true
  }
});
dataSetSchema.index({title: 'text'});

const DataSet = new mongoose.model('DataSet', dataSetSchema);
