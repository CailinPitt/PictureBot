var faker = require('Faker');
var request = require('request');
var fs = require('fs');

// Download random image to detect
downloadImage();

function downloadImage() {
  var imageUrl = faker.Image.imageUrl();

  request(imageUrl).pipe(fs.createWriteStream('image.png'));
}
