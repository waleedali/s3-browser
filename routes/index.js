var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
var prettyBytes = require('pretty-bytes');

/* GET home page. */
router.get('/', function(req, res, next) {

  // get the list of file on the passed bucket
  var s3 = new AWS.S3();

  // just return an empty content if the s3 bucket was not specified
  if (!process.env.S3BUCKET) {
    console.log("S3BUCKET", "environment variable was not provided");
    res.render('index', { title: 'S3 Browser', bucket: "No bucket provided", contents: [] });
  } else {
    s3.listObjects({Bucket: process.env.S3BUCKET}, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(JSON.stringify(data, null, 2));

        // update the file size to look better on the page
        for (var i=0; i < data.Contents.length; i++) {
          data.Contents[i].Size = prettyBytes(data.Contents[i].Size);
        }

        res.render('index', { title: 'S3 Browser', bucket: process.env.S3BUCKET, contents: data.Contents });
      }
    });
  }

});

module.exports = router;
