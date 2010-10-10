var client,
    config;

$(document).ready(function() {

    // Fetch our config file and instantiate the client;
    // then finish setup.
    $.ajax({
        url: 'js/gibberer_config.json',
        success: function(data) {
            config = data;
            client = new Faye.Client('http://mole.local:8000');
            finishSetup();
        },
        error: function(request, errorType) {
            config = {};
            // Default location
            client = new Faye.Client('http://localhost:8000/');
            finishSetup();
        },
    });
    viewportFit();
    chatHandlers();
    // JQUERY UI AWAYYYYYYYYY
    $(".chatContainer").draggable({
        stack: ".chatContainer"
    });

});

viewportFit = function() {
    $('#container').height($(window).height() - 30);
    $('#container').width($(window).width() - 30);

    $(window).resize(function() {
        $('#container').height($(window).height() - 30);
        $('#container').width($(window).width() - 30);
    });
}

chatHandlers = function() {
    $('.chatContainer').mousedown(function() {
        $('.chatContainer').each(function(index) {
            $(this).removeClass('focusedChat');
        });

        $(this).addClass('focusedChat');
        $(this).find('.pubmsg').focus();
    });
}

finishSetup = function() {
  // receive chat messages
  client.subscribe('/messages',
  function(message) {
      var p = $("<div class='chatLine' style='display:block;'><div class='chatLineContent'><span class='chatLineUsername'>" + message.user + ": </span>" + message.text + "</div></div>");
      $('#' + message.id).find('.chats').append(p);
      $('#' + message.id).find('.chats').scrollTop($('.chats').attr("scrollHeight"));
  });
  $(".pubmsg").keyup(function(event) {
      if ((event.keyCode == '13' || event.keyCode == undefined) && $(this).val()) {
          client.publish('/messages', {
              text: $(this).val(),
              user: $(this).closest('.chatContainer').find('.username').val() || "Unknown",
              id: $(this).closest('.chatContainer').attr('id')
          });

          console.log($(this).closest('.chatContainer').attr('id'));

          $(this).val("").focus();
      }
  });
  $('.pubsend').click(function() {
      $(this).closest('.chatContainer').find('.pubmsg').keyup();
  });
}
