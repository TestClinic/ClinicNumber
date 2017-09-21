/************
* Constants
************/
const WS_HOST = window.document.location.hostname;
const WS_PORT = '8000';

const WS_ADDR = WS_HOST == '127.0.0.1'
    ? 'ws://127.0.0.1:8080'
    : 'ws://' + WS_HOST + '/ws';


/***************
* Placeholders
***************/
var current_number;
var socket;


/****************
* Create socket
****************/
function create_socket()
    {
        socket = new WebSocket(WS_ADDR);
        
        socket.onconnect = function(e)
            {
                console.log('サーバーに接続しました');
            };

        socket.onmessage = function(e)
            {
                var json = JSON.parse(e.data);
                
                console.log('Message from server:');
                console.log(json);
                
                if(json.msg == 'update')
                    {
                        current_number.text(json.n);
                    }
            };
        
        socket.onerror = function(e)
            {
                console.log('Error:');
                console.log(e);
                
                current_number.text('エラーが発生、ページを更新してください。');
                
                setTimeout(create_socket, 1000);
            };
    }


window.onload = function()
{
    current_number = $('#current_number');
    
    create_socket();
}