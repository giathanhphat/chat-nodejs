  //truy cap den server
  var socket = io('http://localhost:4000');
  var roomid;
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
          $('.users_list_don').append("<li class='userID' data-id='" + element.id + "'><i class='fa fa-circle' aria-hidden='true'>  " + element.name + "</i></li>");
      });
  });
  socket.on('server-send-message', function(data) {
      $('#content_chat').append("<p>" + data.un + ": " + data.nd + "</p>");
  });
  //user-connect to-chat 11
  socket.on('server-send-chat11-success', function(data) {
      $('#current_User1').html('');
      $('#content_chat1').html('');
      $('#txt_chat1').html('');
      $('#current_User1').append(data);
      $('#content_form1').show();

  });
  //nhận message chat11 from server
  socket.on('server-send-message-chat11-success', function(data) {
      if (data.nhan == 1)
          $('#content_chat1').append("<p>" + data.un + ": " + data.nd + "</p>");
      else {
          $('#current_User1').html("");
          $('#current_User1').append(data.un);
          $('#content_chat1').append("<p>" + data.un + ": " + data.nd + "</p>");
          $('#content_form1').show();
      }
  });

  //nhận danh sách room từ server
  socket.on('server-send-room', function(data) {
      $('#group_list').html("");
      data.forEach(function(element) {
          $('#group_list').append("<li class='groupID' data-id='" + element.name + "'><i class='fa fa-circle' aria-hidden='true'>  " + element.name + "</i></li>");
      });
  });
  //'server-send-create-room-error'
  socket.on('server-send-create-room-error', function() {
      alert('Phòng này đã tồn tại');
  });

  //'server-send-create-room-success'
  socket.on('server-send-create-room-success', function(data) {
      $('#current_User-nhom').append(data);
      roomid = data;
  });

  //user nhận message from room
  socket.on('server-send-message-in-room', function(data) {
      $('#content_chat-nhom').append("<p>" + data.un + ": " + data.nd + "</p>")
  });
  $(document).ready(function() {
      $('#btnregister').click(function() {
          socket.emit('client-send-name', $('#txtusername').val());
      });
      //chọn chế độ chat đơn
      $('#btn_chat_don').click(function() {
          $('.users_list_don').attr('id', 'active');
          $('.users_list_nhom').attr('id', '');
          $('#content_form').show(2000);
          $('#content_form-nhom').hide(1000);
      });
      //chọn chế độ chat nhóm
      $('#btn_chat_nhom').click(function() {
          $('.users_list_don').attr('id', '');
          $('.users_list_nhom').attr('id', 'active');
          $('#content_form').hide(1000);
          $('#content_form-nhom').show(2000);
          //user yêu cầu lấy danh sách room
          socket.emit('user-require-get-rooms');
      });
      //logout tài khoản
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
          socket.emit('user-connect-chat11-success', $id);

      });
      //gửi message chat 11 form user
      $('#btn_send1').on('click', function() {
          var username = $('#current_User1').html();
          socket.emit('user-send-message-chat11', { toun: username, content: $('#txt_chat1').val() });
      });

      //Create Room
      $('.btn_room').on('click', function() {
          socket.emit('user-send-create-room', $('#txt_room_name').val());
      });

      //Chat nhom
      $('#btn_send-nhom').click(function() {
          alert(roomid);
          socket.emit('user-send-message-nhom', { toroom: roomid, content: $('#txt_chat-nhom').val() });
      });
  });