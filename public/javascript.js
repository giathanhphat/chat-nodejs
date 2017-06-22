  //truy cap den server
  var socket = io('http://localhost:3000');
  socket.on('server-send-failure', function() {
      alert('Username da co nguoi su dung');
  });
  socket.on('server-send-success', function(data) {
      $('#current_User').append(data);
      $('#loginForm').hide(1000);
      $('#show_chatForm').show(2000);
  });
  socket.on('server-send-usersList', function(data) {
      $('.users_list').html("");
      data.forEach(function(element) {
          $('.users_list').append("<li><i class='fa fa-circle' aria-hidden='true'>  " + element + "</i></li>");
      });
  });
  $(document).ready(function() {
      $('#btnregister').click(function() {
          socket.emit('client-send-name', $('#txtusername').val());
      });
  });