var team = process.env.TEAM
  , badgeServer = 'http://localhost:3000'

function userLink(name) {
  return "https://"+team+".slack.com/messages/@"+name
}

function userBadge(name) {
  return badgeServer+"/users/"+username+".png"
}

modules.export = {
  userAnchor: function(user) {
    return "<a href=\""+userLink(user)+"\"><img src=\""+userBadge(user)+"\"></a>"
  },
  userMarkdown: function(user) {
    return "[![Find me on Slack!]("+userBadge(user)+")]("+userLink(user)+")"
  }
}
