var Canvas = require('canvas')
  , imager = require('./imager.js')
  , borderWidth = 4
  , contentPadding = 8
  , sidebarPadding = 0

var colors = {
  light: 'white',
  dark: '#372b36',
  mid: '#4d384b'
}

var presenceSteps = {
  active: ['#87bc46', '#4ea343'],
  away: ['#d51d20', '#a10709']
}

var bgBuffer = null

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
    , presenceDims = {
        width: 15,
        height: 15
      }

  drawInit(dims, function(err, bgCanvas) {
    drawSidebar(user, sideDims, function(err, sideCanvas) {
      drawContent(user, bodyDims, function(err, bodyCanvas) {
        drawPresence(user, presenceDims, function(err, presenceCanvas) {
          ctx.drawImage(bgCanvas, 0, 0, dims.width, dims.height)
          ctx.drawImage(sideCanvas, pad, pad, sideDims.width, sideDims.height)
          ctx.drawImage(bodyCanvas, sideDims.width+pad, pad, bodyDims.width, bodyDims.height)
          ctx.drawImage(
            presenceCanvas,
            sideDims.width - presenceDims.width,
            sideDims.height - presenceDims.height,
            presenceDims.width,
            presenceDims.height
          )
          cb(null, canvas)
        })
      })
    })
  })
}

function drawInit(dims, cb) {
  var canvas = new Canvas(dims.width, dims.height)
    , ctx = canvas.getContext('2d')

  function draw(img) {
    ctx.fillStyle = ctx.createPattern(img, 'repeat')
    ctx.fillRect(0, 0, dims.width, dims.height)
    ctx.strokeStyle = colors.dark
    ctx.lineWidth = borderWidth
    ctx.strokeRect(0, 0, dims.width, dims.height)
  }

  if (bgBuffer) {
    draw(bgBuffer)
    cb(null, canvas)
  } else {
    imager("repeat.png", function(err, img) {
      bgBuffer = img
      draw(bgBuffer)
      cb(err, canvas)
    })
  }
}

function drawSidebar(user, dims, cb) {
  var canvas = new Canvas(dims.width, dims.height)
    , ctx = canvas.getContext('2d')
    , sidebarPadding = 0

  imager(user.profile.image_72, function(err, img) {
    ctx.fillStyle = colors.mid
    ctx.fillRect(0, 0, dims.width, dims.height)
    ctx.drawImage(img, sidebarPadding, sidebarPadding, dims.width - 2*sidebarPadding, dims.height - 2*sidebarPadding)

    cb(null, canvas)
  })
}

function drawPresence(user, dims, cb) {
  var canvas = new Canvas(dims.width, dims.height)
    , ctx = canvas.getContext('2d')
    , midpoint = dims.width/2
    , border = 3
    , r = midpoint - border
    , grad = ctx.createLinearGradient(0, 0, dims.width, dims.height)
    , steps = presenceSteps[user.presence]

  grad.addColorStop(0, steps[0])
  grad.addColorStop(1, steps[1])

  ctx.arc(midpoint, midpoint, r, 0, Math.PI*2,true)
  ctx.strokeStyle = 'white'
  ctx.lineWidth = border
  ctx.fillStyle = grad
  ctx.stroke()
  ctx.fill()

  cb(null, canvas)
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

