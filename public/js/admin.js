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
var showed_number;

var reset_button;
var reset_config;
var config_area;
var resume;


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
                        showed_number.text(json.n);

                        showed_number.css({'font-size':'80px','color':'white'});

                        // json.reset_on
                        // json.reset_time
                    }
                else if(json.msg == 'reset')
                    {
                        showed_number.text(json.n);
                        showed_number.css({'font-size':'80px','color':'white'});
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

                showed_number.text('エラーが起きました、ページを更新してください。');
                showed_number.css({'font-size':'20px','color':'red'});

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
                n: showed_number.text().trim()
            };

        socket.send( JSON.stringify(json) );
    }

/************************************************
* Name        : to_UTC
* Description : Convert Japan/Tokyo time to UTC
* Takes       : Nothing
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
************************************************/
function to_UTC(h, m)
    {
        h -= 9;
        h = h < 0 ? 24+h : h;

        return [h, m];
    }

/**********************************************************
* Name        : set_reset
* Description : Change reset timer status
* Takes       : com (str): Either 'on', 'off' or 'toggle'
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
**********************************************************/
function set_reset(com)
    {
        var json =
            {
                msg: 'set_reset',
                com: com
            };

        socket.send( JSON.stringify(json) );
    }

/*************************************************
* Name        : set_reset_time
* Description : Change reset time
* Takes       : Nothing
* Returns     : Nothing
* Notes       : If timer is off, it's turned on
* TODO        : Nothing
*************************************************/
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
        showed_number  = $('#showed_number');

        reset_button  = $('#reset_button');
        reset_config  = $('#reset_config');
        config_area  = $('.config_area');
        resume = $('#resume');


        showed_number.on('keydown', function(e)
            {
                /********
                * Enter
                ********/
                if(e.which == 13)
                    {
                        e.preventDefault();

                        broadcast_number();
                        showed_number.blur();
                    }
            });

        left_arrow.on('click', function(e)
            {
              //エフェクトコード
              left_arrow.css( {
                'border-color': 'transparent #fff transparent transparent',
                'transition': '0.01s'});
              setTimeout(function(){
                left_arrow.css( {
                  'border-color': 'transparent #000 transparent transparent',
                  'transition': '0.7s'});
              },30);
              //エフェクトコード終わり

                showed_number.text( (i, old) => parseInt(old) - 1 );
                showed_number.css({'font-size':'80px','color':'white'});

                broadcast_number();
            });
        right_arrow.on('click', function(e)
            {
              //エフェクトコード
              right_arrow.css( {
                'border-color': 'transparent transparent transparent #fff',
                'transition': '0.01s'});
              setTimeout(function(){
                right_arrow.css( {
                  'border-color': 'transparent transparent transparent #000',
                  'transition': '0.7s'});
              },30);
              //エフェクトコード終わり

                showed_number.text( (i, old) => parseInt(old) + 1 );
                showed_number.css({'font-size':'80px','color':'white'});

                broadcast_number();
            });

        reset_button.on('click', function()
            {
                showed_number.text(0);
                showed_number.css({'font-size':'80px','color':'white'});

                broadcast_number();
            });
        reset_config.on('click', function()
            {
                config_area.toggle();
            });
        resume.on('click', function()
            {   var on_off = $('#toggle:checked').val()
                var hour = $('#hour').val();
                var minute = $('#minute').val();

                if(on_off){
                    set_reset(true);
                }else{
                    set_reset(false);
                }

                set_reset_time(hour, minute);

                console.log(on_off, hour, minute);
                config_area.hide();
            });


        create_socket();
    }
