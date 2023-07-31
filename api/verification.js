const db = require('../db');
const authenticate = require('../authenticate')

const { createHash } = require('crypto');

module.exports = {
    api: async function(req, res) {
        try {
            if(req.body.reset) {
                await db.connect(async (db) => {
                    const user = await db.collection('Users').findOne({email: req.body.email});
                    if(user && user.verificationCode != 0 && user.verificationCode == req.body.token) {
                        if(req.body.password) {

                            let hashed = createHash('sha256').update(req.body.password).digest('hex');

                            await db.collection('Users').updateOne({email: req.body.email},
                                {
                                    $set:{
                                        verificationCode: 0,
                                        password: hashed
                                    }
                                }
                            );

                            res.status(200).json({ status: "reset" });

                        } else {
                            res.status(200).json({ status: "valid" });
                        }
                    } else {
                        res.status(200).json({ status: "invalid" });
                    }
                });
            } else {
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
            }
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