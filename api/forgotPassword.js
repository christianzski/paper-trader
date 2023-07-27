const sendEmail = require('./sendEmail');
const db = require('../db');


module.exports = {
    api: async function(req, res) {
        //incoming: email
        //output: email to the user with a verification code

        const { email, password } = req.body;

        var error = '';
        var status = "Could not find user with email";

        await db.connect(async (db) => {

            const results = await db.collection('Users').find({email:email}).toArray();

            if(results.length > 0) {
                sendEmail.api(email, 'Password reset')

                try{
                await db.collection('Users').updateOne(
                    {
                        "email" : email
                    },
                    {
                        $set:{
                            password:password
                        }
                    }
                );
                status = "success";
                }
                catch(e) {
                    error = e.toString()
                }
            }

        });
        var ret = { status:status, error:error };
        res.status(200).json(ret);
    }
}