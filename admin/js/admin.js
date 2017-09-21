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
var left_arrow;
var right_arrow;
var socket;


/**************************
* Create listening socket
**************************/
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
                
                console.log('Admin: Message from server:');
                console.log(json);
                
                if(json.msg == 'update' && current_number.text().trim() == '')
                    {
                        current_number.text(json.n);
                    }
            };
        
        socket.onerror = function(e)
            {
                console.log('Error:');
                console.log(e);
                
                current_number.text('エラーが起きました、ページを更新してください。');
                
                setTimeout(create_socket, 1000);
            };
    }

function broadcast_number()
    {
        var json =
            {
                msg: 'broadcast',
                n: current_number.text().trim()
            };
        
        socket.send( JSON.stringify(json) );
    }


window.onload = function()
    {
        current_number = $('#current_number');
        left_arrow     = $('#number_left_arrow');
        right_arrow    = $('#number_right_arrow');
        
        
        current_number.on('keydown', function(e)
            {
                if(e.which == 13) //enter
                    {
                        e.preventDefault();
                        
                        broadcast_number();
                    }
            });
        
        left_arrow.on('click', function(e)
            {
                current_number.text( parseInt(current_number.text()) - 1 );
                
                broadcast_number();
            });
        right_arrow.on('click', function(e)
            {
                current_number.text( parseInt(current_number.text()) + 1 );
                
                broadcast_number();
            });
        
        
        create_socket();
    }