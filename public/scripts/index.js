var form = $('.new-badge')
  , template = _.template($('#badge-tmpl').text())

form.on('submit', function(e) {
  var user = form.find('.username').val()
  e.preventDefault()

  $.get('/users/'+user+'.json').then(function(resp) {
    $('.created-badge').empty().append(template(resp))
  }).fail(function() {
    $('.created-badge').empty().append("<div class='alert alert-danger'>Could not find user <b>"+user+"</b>.</div>")
  })
})

