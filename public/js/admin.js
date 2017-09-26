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
var left_arrow;
var right_arrow;
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
                console.log('Admin - Connected to client.');
            };

        socket.onmessage = function(e)
            {
                var json = JSON.parse(e.data);
                
                console.log('Admin - Message from server:');
                console.log(json);
                
                /***********************
                * Refresh only on load
                ***********************/
                if(json.msg == 'init')
                    {
                        current_number.text(json.n);
                        
                        // json.reset_on
                        // json.reset_time
                    }
                else if(json.msg == 'reset')
                    {
                        current_number.text(json.n);
                    }
                else
                    {
                        console.log(json.msg);
                    }
            };
        
        socket.onerror = function(e)
            {
                console.log('Admin - Error:');
                console.log(e);
                
                current_number.text('エラーが起きました、ページを更新してください。');
                
                setTimeout(create_socket, 1000);
            };
    }

/******************************************************
* Name        : broadcast_number
* Description : Send the current number to the server
* Takes       : Nothing
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
******************************************************/
function broadcast_number()
    {
        var json =
            {
                msg: 'broadcast',
                n: current_number.text().trim()
            };
        
        socket.send( JSON.stringify(json) );
    }

function to_UTC(h, m)
    {
        h -= 9;
        h = h < 0 ? 24+h : h;
        
        return [h, m];
    }

function set_reset(com)
    {
        var json =
            {
                msg: 'set_reset',
                com: com
            };
        
        socket.send( JSON.stringify(json) );
    }

function set_reset_time(h, m)
    {
        [h, m] = to_UTC(h, m);
        
        var json =
            {
                msg: 'set_reset_time',
                h: h,
                m: m
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
                /********
                * Enter
                ********/
                if(e.which == 13)
                    {
                        e.preventDefault();
                        
                        broadcast_number();
                        current_number.blur();
                    }
            });
        
        left_arrow.on('click', function(e)
            {
                current_number.text( (i, old) => parseInt(old) - 1 );
                
                broadcast_number();
            });
        right_arrow.on('click', function(e)
            {
                current_number.text( (i, old) => parseInt(old) + 1 );
                
                broadcast_number();
            });
        
        
        create_socket();
    }