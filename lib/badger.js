var Canvas = require('canvas')
  , imager = require('./imager.js')
  , borderWidth = 4
  , contentPadding = 8
  , sidebarPadding = 0


var colors = {
  green: '#87bc46',
  greenDark: '#4ea343',
  light: 'white',
  dark: '#372b36',
  mid: '#4d384b'
}

function draw(user, dims, cb) {
  var canvas = new Canvas(dims.width, dims.height)
    , ctx = canvas.getContext('2d')
    , pad = borderWidth/2
    , sideDims = {
        width: dims.height - borderWidth,
        height: dims.height - borderWidth
      }
    , bodyDims = {
        width: dims.width - borderWidth - sideDims.width,
        height: dims.height - borderWidth
      }

  drawInit(dims, function(err, bgCanvas) {
    drawSidebar(user, sideDims, function(err, sideCanvas) {
      drawContent(user, bodyDims, function(err, bodyCanvas) {
        ctx.drawImage(bgCanvas, 0, 0, dims.width, dims.height)

        ctx.drawImage(sideCanvas, pad, pad, sideDims.width, sideDims.height)
        ctx.drawImage(bodyCanvas, sideDims.width+pad, pad, bodyDims.width, bodyDims.height)
        cb(null, canvas)
      })
    })
  })
}

function drawInit(dims, cb) {
  var canvas = new Canvas(dims.width, dims.height)
    , ctx = canvas.getContext('2d')

  imager("repeat.png", function(err, img) {
    ctx.fillStyle = ctx.createPattern(img, 'repeat')
    ctx.fillRect(0, 0, dims.width, dims.height)
    ctx.strokeStyle = colors.dark
    ctx.lineWidth = borderWidth
    ctx.strokeRect(0, 0, dims.width, dims.height)

    cb(err, canvas)
  })
}

function drawSidebar(user, dims, cb) {
  var canvas = new Canvas(dims.width, dims.height)
    , ctx = canvas.getContext('2d')
    , sidebarPadding = 0

  imager(user.profile.image_72, function(err, img) {
    //ctx.fillStyle = '#'+user.color
    ctx.fillStyle = colors.mid
    ctx.fillRect(0, 0, dims.width, dims.height)
    ctx.drawImage(img, sidebarPadding, sidebarPadding, dims.width - 2*sidebarPadding, dims.height - 2*sidebarPadding)
    // drawIndicator(dims, ctx)

    cb(null, canvas)
  })
}

function drawIndicator(dims, ctx) {
  var x = dims.size - 10
    , y = dims.size - 8
    , r = 5
    , border = 3
    , grad = ctx.createLinearGradient(y, x, x+r, y+r)

  grad.addColorStop(0, colors.green)
  grad.addColorStop(1, colors.greenDark)

  ctx.arc(x, y, r, 0, Math.PI*2,true)
  ctx.strokeStyle = 'white'
  ctx.lineWidth = border
  ctx.fillStyle = grad
  ctx.stroke()
  ctx.fill()
}

function drawContent(user, dims, cb) {
  var canvas = new Canvas(dims.width, dims.height)
    , ctx = canvas.getContext('2d')
    , fontSize = {
        name: 18,
        title: 14
      }

  ctx.font = 'bold ' + fontSize.name + 'px Helvetica'
  ctx.fillStyle = colors.dark
  ctx.fillText(user.profile.real_name_normalized, contentPadding, contentPadding + fontSize.name)

  ctx.font = 'normal ' + fontSize.title + 'px Helvetica'
  ctx.fillText(user.profile.title || '', contentPadding, contentPadding*1.5 + fontSize.name + fontSize.title)

  cb(null, canvas)
}

module.exports = {
  draw: draw
}

