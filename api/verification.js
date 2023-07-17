const db = require('../db');
const authenticate = require('../authenticate')

module.exports = {
    api: async function(req, res) {
        const user = await authenticate.login(req.cookies.user, req.cookies.session);
        
        var status = 'Failed';

        if(user && user.verificationCode != 0 && user.verificationCode == req.body.token) {
            await db.connect(async (db) => {
                await db.collection('Users').updateOne(user,
                    {
                        $set:{
                            emailVerified: true,
                            verificationCode: Math.floor(100000 + Math.random() * 900000),
                        }
                    }
                );

                status = 'Success';
            });
        }

        res.status(200).json({ status: status });
    }
}