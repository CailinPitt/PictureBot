var faker = require('Faker');
var request = require('request');
var fs = require('fs');
var watson = require('watson-developer-cloud');

// Download random image to classify
classifyImage();

function classifyImage() {

  var imageUrl = faker.Image.imageUrl();
  // Get image URL to classify

  var stream = request(imageUrl).pipe(fs.createWriteStream('image.png'));
  // Download image

  stream.on('finish', function() {
    // When image is done downloading, classify
    var visual_recognition = watson.visual_recognition({
      api_key: process.env.WATSON_API,
      version: 'v3',
      version_date: '2016-05-20'
    });

    var params = {
      images_file: fs.createReadStream('./image.png')
    };

    visual_recognition.classify(params, function(err, res) {
      if (err)
        console.log(err);
      else
        console.log(JSON.stringify(res, null, 2));
    });
  });
}
