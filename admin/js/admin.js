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
var showed_number;

var reset_button;
var reset_config;
var config_area;
var resume;


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

                if(json.msg == 'update' && showed_number.text().trim() == '')
                    {
                        showed_number.text(json.n);
                    }
            };

        socket.onerror = function(e)
            {
                console.log('Error:');
                console.log(e);

                showed_number.text('エラーが起きました、ページを更新してください。');
                showed_number.css({'font-size':'20px','color':'red'});

                setTimeout(create_socket, 1000);
            };
    }

function broadcast_number()
    {
        var json =
            {
                msg: 'broadcast',
                n: showed_number.text().trim()
            };

        socket.send( JSON.stringify(json) );
    }

//引数の時間にリセットする
/*function set_reset_time(hour,minute){
  //現在時刻を取得
  var now_time = new Date();
  var now_time_s = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();;
  //設定時刻を秒変換
  var config_time_s = hour*3600 + minute*60;
  //差
  var diff =
}*/


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

        //config_area.hide();

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


                left_arrow.css( {
                  'border-color': 'transparent #fff transparent transparent',
                  'transition': '0.01s'});
                setTimeout(function(){
                  left_arrow.css( {
                    'border-color': 'transparent #000 transparent transparent',
                    'transition': '0.7s'});
                },30);

                showed_number.text( parseInt(showed_number.text()) - 1 );
                showed_number.css({'font-size':'80px','color':'white'});

                broadcast_number();
            });
        right_arrow.on('click', function(e)
            {
                right_arrow.css( {
                  'border-color': 'transparent transparent transparent #fff',
                  'transition': '0.01s'});
                setTimeout(function(){
                  right_arrow.css( {
                    'border-color': 'transparent transparent transparent #000',
                    'transition': '0.7s'});
                },30);

                showed_number.text( parseInt(showed_number.text()) + 1 );
                showed_number.css({'font-size':'80px','color':'white'});

                broadcast_number();
            });
        reset_button.on('click', function()
            {
                showed_number.text(0);

                broadcast_number();
            });
        reset_config.on('click', function()
            {
                config_area.toggle();
            });
        resume.on('click', function()
            {
                config_area.hide();
            });




        create_socket();
    }
