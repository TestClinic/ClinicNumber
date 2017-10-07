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
                
                current_number.text('エラー');
                
                setTimeout(create_socket, 1000);
            };
    }


window.onload = function()
{
    current_number = $('#current_number');
    
    create_socket();
};