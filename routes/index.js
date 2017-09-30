var express = require('express');
var router  = express.Router();

var path = require('path');
var auth = require('../admin/auth.js');


/***********************************
* Name        : time
* Description : Get formatted time
* Takes       : Nothing
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
***********************************/
function time()
    {
        var date = new Date();
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }


/********************************************
* Name        : log_time_ip
* Description : Log time and ip on request
* Takes       : Nothing
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
*******************************************/
function log_time_ip(req, res, next)
    {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        console.log('\n['+time()+'] ' + ip);
        
        next();
    };

router.use(log_time_ip);


router.get('/pagecount', function(req, res, next)
    {
        res.send(true);
    });

/**
router.get('/', function(req, res, next)
    {
        res.render('index', { title: 'Express' });
    });
**/

router.get(/^\/auth\.cgi/, function(req, res, next)
    {
        console.log('Routes - CGI request');
        
        var pairs = {};
        
        
        /****************
        * Get arguments
        ****************/
        var args  = req.url.match(/auth.cgi\?(.+)/);
        
        if(!args || args.length == 0) { return; }
        args = args[1];
        
        
        /******************
        * Parse arguments
        ******************/
        args = args.split('&')
            .filter( (arg)  => arg != '' )
            .map   ( (pair) => pair.split('=') );
        
        for(var i = 0; i < args.length; i++)
            {
                pairs[ args[i][0] ] = args[i][1];
            }
        
        
        /********************************
        * Send admin page if authorized
        ********************************/
        auth.check( pairs.user, pairs.pass )
            ? res.sendFile( path.resolve('./admin/admin.html') )
            : res.send('Not authorized.');
    });

router.get(/^\/admin/, function(req, res, next)
    {
        console.log('admin request', req.url);
        
        res.sendFile( path.resolve('.' + req.url) );
    });

module.exports = router;