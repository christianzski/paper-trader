const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');

module.exports = {
    api: async function(req, res) {

    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    var error = '';
    var status = 'Failed';
    
    
    const { login, password } = req.body;

    var hash = createHash('sha256').update(password).digest('hex');

    await db.connect(async (db) => {
    
        const results = await 
        db.collection('Users').find({loginId:login,password:hash}).toArray();
        
        var id = -1;
        var fn = '';
        var ln = '';
        if( results.length > 0 )
        {
            id = results[0].id;
            fn = results[0].FirstName;
            ln = results[0].LastName;
            status = 'Success';
            var getToken = uuidv4();
            db.collection('Users').updateOne(
                {
                    "loginId" : login,
                    "password" : hash
                },
                {
                    $set:{
                        sessionToken:getToken
                    }
                }
            );
        }
        var ret = { token:getToken, error:error, message:status, userid:id };
        res.status(200).json(ret);
    });

    }
}
