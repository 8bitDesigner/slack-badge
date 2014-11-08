var request = require('request')

module.exports = function requestImage(url, cb) {
  request.get({
    url: url,
    method: 'GET',
    encoding: 'binary'
  }, function(err, resp, body) {
    var image = new Canvas.Image()
    image.src = new Buffer(body, 'binary')
    cb(err, image)
  })
}

