/************
* Constants
************/
const WS_HOST = 'ws-clinicnumber.193b.starter-ca-central-1.openshiftapps.com';
const WS_PORT = '8080';

const WS_ADDR = 'ws://' + WS_HOST + ':' + WS_PORT + '/ws';

/***************
* Placeholders
***************/
var number_text;
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
                console.log(json);
                
                number_text.html('現在の番号は:<br>' + json.n);
            };
        
        socket.onerror = function(e)
            {
                console.log('Error:', e);
                
                number_text.text('エラーが起きました、ページを更新してください。');
                
                setTimeout(create_socket, 1000);
            };
    }


window.onload = function()
{
    number_text = $('#number_text');
    
    create_socket();
}