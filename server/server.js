const WSS = require('ws').Server;


var wss = new WSS({ port: 8080 });
var counter = 1;

wss.on('connection', function(socket)
    {
        console.log('クライアントに接続しました');
        
        /****************************
        * Send number on connection
        ****************************/
        var json = JSON.stringify({ n: 1234 });
        socket.send(json);
        
        socket.on('message', function(msg)
            {
                console.log('メッセージ: ', msg);
            });
        
        socket.on('close', function()
            {
                console.log('クライアントと切断しました');
            });
    });


function broadcast()
    {
        var json = JSON.stringify({ n: counter++ });
        
        for(var i = 0; i < wss.clients.length; i++)
            {
                var client = wss.clients[i];
                
                client.send(json);
                console.log('Sent: ', json);
            }
        
        console.log(1);
    }

setInterval(broadcast, 5000);