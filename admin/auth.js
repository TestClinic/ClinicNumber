var jsonfile = require('jsonfile');


function auth()
    {
        return {
            check: function(user_hash, pass_hash)
                {
                    var credentials = jsonfile.readFileSync('./admin/credentials.json');
                    
                    return (credentials[user_hash] != undefined && credentials[user_hash] == pass_hash);
                }
        }
    }

module.exports = auth();