var request = require('request')
  , server = "https://slack.com/api"
  , token = process.env.TOKEN

function normalizeParams(obj) {
  obj.token = token
  return obj
}

function toArray(arrayish) {
  return Array.prototype.slice.call(arrayish)
}

function makeRequest(/*url, [params,] cb */) {
  var args = toArray(arguments)
    , url = args.shift()
    , cb = args.pop()
    , params = args.length ? args.pop() : {}

  request({
    url: server + url,
    json: true,
    qs: normalizeParams(params)
  }, function(err, resp, json) {
    if (err) {
      return cb(err, null)
    } else if (json && json.ok) {
      return cb(null, json)
    } else if (json && !json.ok) {
      return cb(new Error(json.error), null)
    }
  })
}

module.exports = {
  channels: {
    info: function() {}
  },
  user: {
    info: function(id, cb) {
      makeRequest('/users.info', {user: id}, function(err, resp) {
        if (err) {
          cb(err, null)
        } else {
          cb(null, resp.user)
        }
      })
    },

    list: function(cb) {
      makeRequest('/users.list', function(err, resp) {
        if (err) {
          cb(err, null)
        } else {
          cb(null, resp.members)
        }
      })
    },

    presence: function(id, cb) {
      makeRequest('/users.getPresence', {user: id}, function(err, resp) {
        if (err) {
          cb(err, null)
        } else {
          cb(null, resp.presence)
        }
      })
    }
  }
}
