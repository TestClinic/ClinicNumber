$(function(){


  $("#nav li").hover(function(){
          $(this).css({
            'transition': '0.5s',
            'box-shadow':'0 0 10px gray'
          });
  },function(){
    $(this).css({
      'transition': '0.3s',
      'box-shadow':'0 0 0px gray'
      });
  });

  /*$('#home_nav').click(function(){
    window.location.href = "./index.html";
  });
  $('#client_nav').click(function(){
    window.location.href = "./client.html";
  });
  $('#admin_nav').click(function(){
    window.location.href = "./admin.html";
  });
  $('#admin_nav').click(function(){
    window.location.href = "./admin.html";
  });*/

});
