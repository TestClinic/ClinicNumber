var express = require('express');
var router  = express.Router();

var path = require('path');
var auth = require('../admin/auth.js');


router.get('/pagecount', function(req, res, next)
    {
        res.send(true);
    });

/* GET home page. */
/**
router.get('/', function(req, res, next)
    {
        res.render('index', { title: 'Express' });
    });
**/

router.get(/^\/auth\.cgi/, function(req, res, next)
    {
        var pairs = {};
        console.log('cgi request');
        
        var args = req.url.match(/auth.cgi\?(.+)/);
        
        if(!args || args.length == 0) { return; }
        args = args[1];
        
        
        args = args.split('&')
            .filter( (arg) => arg != '' )
            .map( (pair) => pair.split('=') );
        
        for(var i = 0; i < args.length; i++)
            {
                pairs[ args[i][0] ] = args[i][1];
            }
        
        console.log(pairs);
        if( auth.check( pairs.user, pairs.pass ) )
            {
                res.sendFile( path.resolve('./admin/admin.html') );
            }
        else
            {
                res.send('Not authorized.');
            }
    });

module.exports = router;