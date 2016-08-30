var faker = require('Faker');
var request = require('request');
var fs = require('fs');
var watson = require('watson-developer-cloud');
var Twit = require('twit')

var T = new Twit({
  consumer_key:         process.env.PB_CONSUMER_KEY,
  consumer_secret:      process.env.PB_CONSUMER_SECRET,
  access_token:         process.env.PB_ACCESS_TOKEN,
  access_token_secret:  process.env.PB_ACCESS_TOKEN_SECRET,
});
// Set up access to @PictureGuesser

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
        tweet(gatherImageInfo(res));
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

function gatherImageInfo(imageInfo) {
  var guess;

  for (var i = 0; i < imageInfo.images[0].classifiers[0].classes.length; i++)
  {
    guess += imageInfo.images[0].classifiers[0].classes[i].class + " ("
      + (imageInfo.images[0].classifiers[0].classes[i].score * 100).toFixed(2) + "% sure)" + "\n";
  }
  // Parse JSON to get image classification and score

  return guess;
}

function tweet(guess) {
  var b64content = fs.readFileSync('./image.png', { encoding: 'base64' })

  // Post media to Twitter
  T.post('media/upload', { media_data: b64content }, function (err, data, response) {

    // Assign alt-text
    var mediaIdStr = data.media_id_string
    var altText = "PictureBot's guess"
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // Post tweet with image and guess
        var params = { status: guess.replace('undefined',''), media_ids: [mediaIdStr] }

        T.post('statuses/update', params, function (err, data, response) {
          console.log(data)
        })
      }
    })
  })
}
