const AWS = require('aws-sdk');
const s3  = new AWS.S3();

module.exports = (dataSetId, cb) => {
  const s3Params = {
    Bucket: process.env.AWS_BUCKET,
    Key: dataSetId,
    ContentType: 'text/csv',
    Expires: 60,
    ACL: 'public-read'
  }

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      cb(false);
      return;
    }

    cb({
      signedRequest: data,
      url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${dataSetId}`
    });
  });
}
