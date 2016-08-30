var faker = require('Faker');
var request = require('request');
var fs = require('fs');
var watson = require('watson-developer-cloud');

// Download random image to classify
classifyImage();

function classifyImage() {

  var imageUrl = chooseImage();
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

function chooseImage() {
  var imageUrl;
  var randomNumber = faker.random.number(14);
  // Get random number between 1 - 14

  if (randomNumber == 0)
    imageUrl = faker.Image.avatar();
  else if (randomNumber == 1)
    imageUrl = faker.Image.imageUrl();
  else if (randomNumber == 2)
    imageUrl = faker.Image.abstractImage();
  else if (randomNumber == 3)
    imageUrl = faker.Image.animals();
  else if (randomNumber == 4)
    imageUrl = faker.Image.business();
  else if (randomNumber == 5)
    imageUrl = faker.Image.cats();
  else if (randomNumber == 6)
    imageUrl = faker.Image.city();
  else if (randomNumber == 7)
    imageUrl = faker.Image.food();
  else if (randomNumber == 8)
    imageUrl = faker.Image.nightlife();
  else if (randomNumber == 9)
    imageUrl = faker.Image.fashion();
  else if (randomNumber == 10)
    imageUrl = faker.Image.people();
  else if (randomNumber == 11)
    imageUrl = faker.Image.nature();
  else if (randomNumber == 12)
    imageUrl = faker.Image.sports();
  else if (randomNumber == 13)
    imageUrl = faker.Image.technics();
  else
    imageUrl = faker.Image.transport();

  return imageUrl;
}
