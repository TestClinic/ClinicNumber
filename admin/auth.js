var jsonfile = require('jsonfile');

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
        return {
            check: function(user_hash, pass_hash)
                {
                    var credentials = jsonfile.readFileSync('./admin/credentials.json');
                    
                    return (credentials[user_hash] !== undefined && credentials[user_hash] == pass_hash);
                }
        };
    }

module.exports = auth();