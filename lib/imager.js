var Canvas = require('canvas')
  , request = require('request')
  , fs = require('fs')

function bufferFromFs(path, cb) {
  fs.readFile(__dirname + '/../' + path, function(err, buffer) {
    cb(err, buffer)
  })
}

function bufferFromNet(path, cb) {
  request.get({
    url: path,
    method: 'GET',
    encoding: 'binary'
  }, function(err, resp, body) {
    var buf = err ? null : new Buffer(body, 'binary')
    cb(err, buf)
  })
}

module.exports = function requestImage(path, cb) {
  var fetcher = path.indexOf('http') === 0 ? bufferFromNet : bufferFromFs

  fetcher(path, function(err, buf) {
    var image = new Canvas.Image()
    image.src = buf
    cb(err, image)
  })
}

