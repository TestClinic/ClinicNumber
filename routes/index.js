var express = require('express');
var router  = express.Router();


var WS_PORT = normalizePort(process.env.PORT || '8080' || '3000');


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
module.exports = router;