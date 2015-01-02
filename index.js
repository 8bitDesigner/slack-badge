require('dotenv').load() // Load env variables

var express = require('express')
  , path = require('path')
  , port = process.env.PORT || 3000
  , app = express()
  , badger = require('./lib/badger')
  , slack = require('./lib/slack')
  , linkUtils = require('./lib/link-utils.js')

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

function getUser(req, res, next) {
  slack.user.infoByUsername(req.params.name, function(err, user) {
    if (!err && !user) {
      err = new Error('User "'+req.params.name+'" could not be found')
    }
    res.user = user
    next(err)
  })
}

function getPresence(req, res, next) {
  slack.user.presence(res.user.id, function(err, presence) {
    res.user.presence = presence
    next(err)
  })
}

function drawUser(req, res, next) {
  badger.draw(res.user, {width: 350, height: 60}, function(err, canvas) {
    res.canvas = canvas
    next(err)
  })
}

app.get('/', function(req, res) {
  var paulUser = {
    name: 'paulsweeney',
    presence: 'active',
    profile: {
      first_name: 'Paul',
      last_name: 'Sweeney'
    }
  }

  res.render('index', {
    anchorExample: linkUtils.userAnchor({name: '<username>'}),
    mdExample: linkUtils.userMarkdown({name: '<username>'}),
    badge: linkUtils.userAnchor(paulUser)
  })
})

app.get('/users/:name.json', getUser, getPresence, function(req, res) {
  res.send({
    anchorBadge: linkUtils.userAnchor(res.user),
    markdownBadge: linkUtils.userMarkdown(res.user),
  })
})

app.get('/users/:name.png', getUser, getPresence, drawUser, function(req, res) {
  res.setHeader('content-type', 'image/png')
  res.canvas.pngStream().pipe(res)
})

// Boot our server
app.listen(port, function() {
  console.log('Listening for requests on port', port)
})

