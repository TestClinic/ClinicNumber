/************
* Constants
************/
const WS_HOST = window.document.location.hostname;

const WS_ADDR = WS_HOST == '127.0.0.1'
    ? 'ws://127.0.0.1:8080'
    : 'ws://' + WS_HOST + '/ws';


/***************
* Placeholders
***************/
var current_number;
var socket;


/***************************************************
* Name        : create_socket
* Description : Initialize the client's websocket
* Takes       : Nothing
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
***************************************************/
function create_socket()
    {
        socket = new WebSocket(WS_ADDR);

        socket.onconnect = function(e)
            {
                console.log('Connected to server.');
            };

        socket.onmessage = function(e)
            {
                var json = JSON.parse(e.data);

                console.log('Message from server:');
                console.log(json.n);

                /********************************
                * Refresh number on update push
                ********************************/
                if(json.msg == 'update' || json.msg == 'init' || json.msg == 'reset')
                    {
                        current_number.text(json.n);
<<<<<<< HEAD
                        current_number.css('font-size': '80px;')
=======
                        current_number.css('font-size', '80px');
>>>>>>> design_branch


                        if(json.msg == 'update')
                            {
                                Push.create('Client', { body: 'Update from server: ' + json.n });
                            }
                    }
            };

        socket.onerror = function(e)
            {
                console.log('Error:');
                console.log(e);

<<<<<<< HEAD
                current_number.text('申し訳ございません。エラーが発生致しました。');
                current_number.css('font-size': '15px;')
=======
                current_number.html('申し訳ございません。<br>エラーが発生致しました。');
                current_number.css('font-size', '15px')
>>>>>>> design_branch

                setTimeout(create_socket, 1000);
            };
    }

/*現在時刻を表示する関数*/
<<<<<<< HEAD
/*function ShowTime{
  var nowtime = new Date();
  var hour = nowtime.getHours();
  var minute = nowtime.getMinutes();
  var message = hour:minute;
}*/
=======
function ShowTime(){
  var nowtime = (new Date()).toLocaleTimeString();
  $('#jikoku').text(nowtime.substr(0, nowtime.length-3));
}
>>>>>>> design_branch



window.onload = function()
{
    current_number = $('#current_number');

<<<<<<< HEAD
=======
    ShowTime();
    setInterval('ShowTime()',1000);

>>>>>>> design_branch
    create_socket();
}
