var user_input;
var pass_input;

var submit_button;
var remember_me;

var old_user;
var old_pass;


/*$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});*/


/*********************************************
* Name        : form_init
* Description : Initialize login.html forms
* Takes       : Nothing
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
********************************************/
function form_init()
    {
        if( $.cookie('remember') == 'true' && $.cookie('user') != undefined && $.cookie('pass') != undefined )
            {
                user_input.val( $.cookie('user') );
                pass_input.val( $.cookie('pass') );

                remember.checked = true;
            }
        else
            {
                user_input.val('');
                pass_input.val('');
            }
    }


/*******************************************************
* Name        : submit_login
* Description : Edit login form data before submitting
* Takes       : Nothing
* Returns     : Nothing
* Notes       : It is triggered with an onsubmit event
* TODO        : Nothing
*******************************************************/
function submit_login()
    {
        var [user, pass]           = [ user_input.val(), pass_input.val() ];
        var [hash_user, hash_pass] = [ sha256(user), sha256(pass) ];
        

        /**************************
        * Set cookies on remember
        **************************/
        if( ($.cookie('remember') != undefined && $.cookie('remember') == 'true') || remember.checked )
            {
                console.log('user', user, hash_user);
                console.log('pass', pass, hash_pass);
                console.log('timestamp', $.now());

                $.cookie('user', user);
                $.cookie('pass', pass);
                $.cookie('timestamp', $.now());
            }
        else
            {
                $.removeCookie('user', { path: '/' });
                $.removeCookie('pass', { path: '/' });
                $.removeCookie('timestamp', { path: '/' });
            }


        /***********************
        * Replace input values
        ***********************/
        user_input.val(hash_user);
        pass_input.val(hash_pass);

        old_user = user;
        old_pass = pass;


        /**
        var url = '/auth.cgi?user=' + hash_user + '&pass=' + hash_pass;

        $.ajax
            ({
                method: 'GET',
                url: url,

                success: function(a, b, c)
                    {
                        console.log('success', a);
                    },

                error: function(err)
                    {
                        console.log('Couldn\'t connect to server:');
                        console.log(err);
                    }
            });
        **/

        return true;
    }


window.onload = function()
    {
        user_input    = $('#username');
        pass_input    = $('#password');
        submit_button = $('#login-submit');
        remember_me   = $('#remember');


        $('#login-form').submit( submit_login );

        remember_me.on('change', function()
            {
                $.cookie('remember', remember.checked);

                if(remember.checked == false)
                    {
                        $.removeCookie('user',      { path: '/' });
                        $.removeCookie('pass',      { path: '/' });
                        $.removeCookie('timestamp', { path: '/' });
                    }
            });

        /**
        submit_button.on('click', (e) =>
            {
                e.preventDefault();

                user_input.val(old_user);
                pass_input.val(old_pass);

                send_login();
            });
        **/


        form_init();
    }
