var WSS = require('ws').Server;


/***************************************
* Name        : ws_server
* Description : Websocket server class
* Takes       : Nothing
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
***************************************/
function ws_server()
    {
        return {
            n   : 0,
            wss : '',
            
            /*******************************************************
            * Name        : broadcast
            * Description : Send the current number to all clients
            * Takes       : Nothing
            * Returns     : Nothing
            * Notes       : Nothing
            * TODO        : Nothing
            *******************************************************/
            broadcast: function()
                {
                    var that = this;
                    
                    console.log('Server - Broadcasting to ' + that.n + ' clients.');
                    
                    var json =
                        {
                            msg: 'update',
                            n: that.n
                        };
                    
                    this.wss.clients.forEach( function each(client)
                        {
                            if(client.readyState == 1)
                                {
                                    client.send( JSON.stringify(json) );
                                    
                                    console.log('Server - Sent to client:', json);
                                }
                        });
                },
            
            
            /**************************************************
            * Name        : init
            * Description : Initialize the server's websocket
            * Takes       : Nothing
            * Returns     : Nothing
            * Notes       : Nothing
            * TODO        : Nothing
            **************************************************/
            init: function(server)
                {
                    var that = this;
                    
                    this.wss = new WSS({ server: server });
                    
                    this.wss.on('connection', function(socket)
                        {
                            console.log('Server - Connected to client.');
                            
                            
                            /***********************************
                            * Send initial value on connection
                            ***********************************/
                            var json =
                                {
                                    msg: 'init',
                                    n: that.n
                                };
                            
                            socket.send( JSON.stringify(json) );
                            
                            socket.on('message', function(json)
                                {
                                    console.log('Server - Message from admin:');
                                    console.log(json);
                                    
                                    json = JSON.parse(json);
                                    
                                    if(json.msg == 'broadcast')
                                        {
                                            that.n = json.n;
                                            
                                            that.broadcast();
                                        }
                                });
                            
                            socket.on('close', function()
                                {
                                    console.log('Server - Client disconnected.');
                                });
                        });
                }
        };
    }


module.exports = ws_server();