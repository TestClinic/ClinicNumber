var WSS = require('ws').Server;


function ws_server()
    {
        return {
            n   : 0,
            wss : '',
            
            broadcast: function()
                {
                    var that = this;
                    
                    console.log('Broadcast to clients:', that.n);
                    
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
                                    
                                    console.log('Sent to client:', json);
                                }
                        });
                },
            
            init: function(server)
                {
                    var that = this;
                    
                    this.wss = new WSS
                        ({
                            server: server,
                            //port: WS_PORT
                        });
                    
                    
                    this.wss.on('connection', function(socket)
                        {
                            console.log('Connected to client.');
                            
                            
                            /***********************************
                            * Send initial value on connection
                            ***********************************/
                            var json =
                                {
                                    msg: 'update',
                                    n: that.n
                                };
                            
                            socket.send( JSON.stringify(json) );
                            
                            socket.on('message', function(json)
                                {
                                    console.log('Message from admin:');
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
                                    console.log('Client disconnected.');
                                });
                        });
                }
        };
    }


module.exports = ws_server();