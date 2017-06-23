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
          $('.users_list').append("<li id='" + element.NAME + "'><i class='fa fa-circle' aria-hidden='true'>  " + element.NAME + "</i></li>");
      });
  });
  socket.on('server-send-message', function(data) {
      $('#content_chat').append("<p>" + data.un + ": " + data.nd + "</p>");
  });
  //chat don
  socket.on('server-mode-chat-don', function(data) {
      data.forEach(function(element) {
          $("#" + element).click(function() {
              socket.emit('chon-user-chat', element);
          });
      });
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
      //chat don
      $('#btn_chat_don').click(function() {
          socket.emit('mode-chat-don');
      });
  });