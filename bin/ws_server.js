var WSS   = require('ws').Server;
var later = require('later');

later.date.UTC();


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
            reset_on   : false,
            reset_time : { h: 15, m: 0 },
            reset_timer: '',


            /**********************************************
            * Name        : send_client
            * Description : Send message to client
            * Takes       : json (json) - Message to send
            * Returns     : Nothing
            * Notes       : Nothing
            * TODO        : Nothing
            **********************************************/
            send_client: function(json) 
                {
                    this.wss.clients.forEach( function each(client)
                        {
                            if(client.readyState == 1)
                                {
                                    client.send( JSON.stringify(json) );

                                    console.log('Server - Sent to client:', json);
                                }
                        });
                },


            /**************************************
            * Name        : reset_n
            * Description : Reset current number
            * Takes       : Nothing
            * Returns     : Nothing
            * Notes       : Nothing
            * TODO        : Nothing
            **************************************/
            reset_n: function()
                {
                    console.log('n resetted.');

                    this.n = 0;
                    this.broadcast('reset');

                    this.send_client({ msg: 'n resetted' });
                },


            /*******************************************
            * Name        : set_reset_time
            * Description : Change reset time
            * Takes       : h (number) - Hour
            *               m (number) - Minutes
            * Returns     : Nothing
            * Notes       : Restarts on timer setting
            * TODO        : Nothing
            *******************************************/
            set_reset_time: function(h, m)
                {
                    var that = this;

                    if(this.reset_timer !== '') { this.reset_timer.clear(); }

                    this.reset_time.h = h;
                    this.reset_time.m = m;

                    var sched = { schedules: [{ h: [h], m: [m], s: [0] }]};

                    this.reset_timer = later.setInterval( () => that.reset_n(), sched);


                    var d = new Date();

                    this.send_client
                        ({
                            msg: 'reset timer changed to: ' + h + ':' + m +
                                ' (now: ' + d.getUTCHours() + ':' + d.getUTCMinutes() + ')'
                        });
                },


            /*******************************************************
            * Name        : broadcast
            * Description : Send the current number to all clients
            * Takes       : msg (json) - Message to broadcast
            * Returns     : Nothing
            * Notes       : Nothing
            * TODO        : Nothing
            *******************************************************/
            broadcast: function(msg)
                {
                    var that = this;

                    console.log('Server - Broadcasting to ' + that.n + ' clients.');

                    this.send_client({ msg: msg, n: that.n });
                },


            /**************************************************
            * Name        : init
            * Description : Initialize the server's websocket
            * Takes       : server (obj) - HTTP server
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
                                    n  : that.n,
                                    reset_on  : that.reset_on,
                                    reset_time: that.reset_time
                                };

                            that.send_client(json);

                            socket.on('message', function(json)
                                {
                                    console.log('Server - Message from admin:');
                                    console.log(json);

                                    json = JSON.parse(json);

                                    if(json.msg == 'broadcast')
                                        {
                                            that.n = json.n;

                                            that.broadcast('update');
                                        }
                                    else if(json.msg == 'set_reset')
                                        {
                                            var was_off = !that.reset_on;

                                            if     (json.com == 'on'    ) { that.reset_on = true;           }
                                            else if(json.com == 'off'   ) { that.reset_on = false;          }
                                            else if(json.com == 'toggle') { that.reset_on = !that.reset_on; }

                                            if(that.reset_on && was_off)
                                                {
                                                    var sched =
                                                        {
                                                            schedules:
                                                                [{
                                                                    h: [that.reset_time.h],
                                                                    m: [that.reset_time.m],
                                                                    s: [0]
                                                                }]
                                                        };

                                                    that.reset_timer = later.setInterval(() => that.reset_n(), sched);

                                                }
                                            else if(!that.reset_on)
                                                {
                                                    if(that.reset_timer !== '') { that.reset_timer.clear(); }
                                                }

                                            that.send_client('reset timer ' + (that.reset_on ? 'on' : 'off') + '.');
                                        }
                                    else if(json.msg == 'set_reset_time')
                                        {
                                            that.reset_on = true;

                                            that.set_reset_time(json.h, json.m);
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
