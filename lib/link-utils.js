var team = process.env.TEAM
  , badgeServer = process.env.SERVER

function userLink(user) {
  return "https://"+team+".slack.com/messages/@"+user.name
}

function userBadge(user) {
  return badgeServer+"/users/"+user.name+".png"
}

function altText(user) {
  var name = user.profile ? user.profile.first_name + " " + user.profile.last_name : "me"
  return "Find " + name + " on Slack!"
}

module.exports = {
  userAnchor: function(user) {
    if (user.profile) {
      return "<a href=\""+userLink(user)+"\"><img src=\""+userBadge(user)+"\" alt=\""+altText(user)+"\"></a>"
    } else {
      return "<a href=\""+userLink(user)+"\"><img src=\""+userBadge(user)+"\"></a>"
    }
  },
  userMarkdown: function(user) {
    return "[!["+altText(user)+"]("+userBadge(user)+")]("+userLink(user)+")"
  }
}
