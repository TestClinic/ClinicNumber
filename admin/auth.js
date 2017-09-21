var jsonfile = require('jsonfile');


function auth()
    {
        return {
            check: function(user, pass)
                {
                    var credentials = jsonfile.readFileSync('./admin/credentials.json');
                    
                    return credentials[user] == pass;
                }
        }
    }

module.exports = auth();