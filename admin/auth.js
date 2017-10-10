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
        const ADMIN_USER = process.env.ADMIN_USER || 'user';
        const ADMIN_PASS = process.env.ADMIN_PASS || 'pass';
        
        return {
            check: function(user_hash, pass_hash)
                {
                    return user_hash = ADMIN_USER && pass_hash == ADMIN_PASS;
                }
        };
    }

module.exports = auth();