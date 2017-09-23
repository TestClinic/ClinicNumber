var fs   = require('fs');
var exec = require('child_process').exec;


console.log('Getting pods...');

var oc = exec('oc get pods', function(err, stdout, stderr)
    {
        var pods = stdout.split('\n')
            .map( (line) => line.split(/\s+/) )
        
        for(let i = 0; i < pods.length; i++)
            {
                if(pods[i][2] == 'Running')
                    {
                        exec('oc logs '+pods[i][0], function(err, stdout, stderr)
                            {
                                console.log('  Getting ' + pods[i][0] + ' logs...');
                                
                                fs.writeFileSync(pods[i][0]+'.txt', stdout);
                            })
                    }
            }
    });