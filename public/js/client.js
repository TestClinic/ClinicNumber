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
                        current_number.css('font-size', '80px');


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

                current_number.html('申し訳ございません。<br>エラーが発生致しました。');
                current_number.css('font-size', '15px')

                setTimeout(create_socket, 1000);
            };
    }

/*現在時刻を表示する関数*/
function ShowTime(){
  var nowtime = (new Date()).toLocaleTimeString();
  $('#jikoku').text(nowtime.substr(0, nowtime.length-3));
}



window.onload = function()
{
    current_number = $('#current_number');

    ShowTime();
    setInterval('ShowTime()',1000);

    create_socket();
};
