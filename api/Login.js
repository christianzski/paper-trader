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
        await db.collection('Users').find({loginId:login,password:hash}).toArray();
        
        var id = -1;
        var fn = '';
        var ln = '';
        var username = '';
        if( results.length > 0 )
        {
            id = results[0].id;
            fn = results[0].FirstName;
            ln = results[0].LastName;
            username = results[0].loginId;

            status = 'Success';
            var getToken = uuidv4();
            await db.collection('Users').updateOne(
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

        const expiry = 1000 * 3600 * 5; // By default, expire in 5 hours
        res.cookie('user', id, { maxAge: expiry, httpOnly: true });
        res.cookie('session', getToken, { maxAge: expiry, httpOnly: true });
        res.cookie('username', username, { maxAge: expiry, httpOnly: true });

        var ret = { token:getToken, error:error, message:status, userid:id };
        res.status(200).json(ret);
    });

    }
}
