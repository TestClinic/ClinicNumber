var user_input;
var pass_input;

var submit_button;
var remember_me;

var old_name;
var old_pass;


$(function() {

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

});

function send_login()
    {
        var [user, pass]           = [ user_input.val(), pass_input.val() ];
        var [hash_user, hash_pass] = [ sha256(user), sha256(pass) ];
        
        
        if( ($.cookie('remember') != undefined && $.cookie('remember') == 'true') || remember.checked )
            {
                $.cookie('user', user);
                $.cookie('pass', pass);
                $.cookie('timestamp', $.now());
            }
        
        
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
    }


window.onload = function()
    {
        user_input    = $('#username');
        pass_input    = $('#password');
        submit_button = $('#login-submit');
        remember_me   = $('#remember');
        
        
        if( $.cookie('remember') == 'true')
            {
                user_input.val( $.cookie('user') );
                pass_input.val( $.cookie('pass') );
            }
        
        $('#login-form').submit( function()
            {
                user_input.val( function(i, old) { old_name = old; return sha256(old); } );
                pass_input.val( function(i, old) { old_pass = old; return sha256(old); } );
                
                return true;
            });
        
        
        submit_button.on('click', (e) =>
            {
                //e.preventDefault();
                
                //user_input.val(old_name);
                //pass_input.val(old_pass);
                
                //send_login();
            });
        
        remember_me.on('change', function()
            {
                $.cookie('remember', remember.checked);
            });
    }