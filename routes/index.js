var express = require('express');
var router = express.Router();

router.get('/pagecount', function(req, res, next)
    {
        res.send(true);
    });

/* GET home page. */
router.get('/', function(req, res, next)
    {
        res.render('index', { title: 'Express' });
    });

module.exports = router;