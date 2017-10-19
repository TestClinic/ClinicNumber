var sha256 = require('js-sha256').sha256;

/**************************************************
* Name        : auth
* Description : Check credentials with user input
* Takes       : Nothing
* Returns     : Nothing
* Notes       : Nothing
* TODO        : Nothing
**************************************************/
function auth()
    {
        var ADMIN_USER, ADMIN_PASS;
        
        return {
            check: function(user_hash, pass_hash)
                {
                    ADMIN_USER = sha256(process.env.ADMIN_USER || 'user');
                    ADMIN_PASS = sha256(process.env.ADMIN_PASS || 'pass');
                    
                    return user_hash = ADMIN_USER && pass_hash == ADMIN_PASS;
                }
        };
    }

module.exports = auth();