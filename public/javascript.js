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
      $('.users_list_don').html("");
      data.forEach(function(element) {
          $('.users_list_don').append("<li class='userID' data-id='" + element.name + "'><i class='fa fa-circle' aria-hidden='true'>  " + element.name + "</i></li>");
      });
  });
  socket.on('server-send-message', function(data) {
      $('#content_chat').append("<p>" + data.un + ": " + data.nd + "</p>");
  });

  $(document).ready(function() {
      $('#btnregister').click(function() {
          socket.emit('client-send-name', $('#txtusername').val());
      });
      $('#btnlogout').click(function() {
          socket.emit('logout');
          $('#loginForm').show(2000);
          $('#show_chatForm').hide(1000);
      });
      $('#btn_send').click(function() {
          socket.emit('user-send-message', $('#txt_chat').val());
      });
      //dùng on mới nhận
      $('.users_list_don').on('dblclick', '.userID', function() {
          var row = $(this).closest("li");
          $id = row.data("id");
          alert($id);
      });
  });