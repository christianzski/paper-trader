const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');
const user = require('./user');


module.exports = {
    api: async function(req, res) {

    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    var error = '';
    var status = 'Failed';
    
    const { login } = req.body;

    await db.connect(async (db) => {
    
        const results = await 
        await db.collection('Users').find({loginId:login}).toArray();
        
        if( results.length > 0 )
        {

            status = 'Success';
            var getToken = uuidv4();
            await db.collection('Users').updateOne(
                {
                    "loginId" : login
                },
                {
                    $set:{
                        sessionToken: -1
                    }
                }
            );
        }
        // console.log("HEllo");
        res.cookie('user', -1, { maxAge: 0, httpOnly: true });
        res.cookie('session', -1, { maxAge: 0, httpOnly: true });
        res.cookie('username', -1, { maxAge: 0, httpOnly: true });
        var ret = { token:getToken, error:error, message:status};
        res.status(200).json(ret);
    });

    }
}