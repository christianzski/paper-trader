const db = require('../db');
const authenticate = require('../authenticate')

module.exports = {
    api: async function(req, res) {
        try {
            const user = await authenticate.login(req.cookies.user, req.cookies.session);

            const timer = setTimeout(function() {updateNewCode(user);}, 300000);
            
            var status = 'Failed';

            if(user && user.verificationCode != 0 && user.verificationCode == req.body.token) {
                clearTimeout(timer)
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
        } catch(e) {}
    }
}

async function updateNewCode (user) {
    await db.connect(async (db) => {
        await db.collection('Users').updateOne(user,
            {
                $set:{
                    emailVerified: false,
                    verificationCode: Math.floor(100000 + Math.random() * 900000),
                }
            }
        );

    });
}