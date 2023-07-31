const sendEmail = require('./sendEmail');
const db = require('../db');


module.exports = {
    api: async function(req, res) {
        try {
            const { email } = req.body;

            await db.connect(async (db) => {
                const results = await db.collection('Users').find({email:email}).toArray();

                if(results.length > 0) {
                    await sendEmail.api(email, 'Password reset');
                }
            });
            
            res.status(200).json({status: "sent"});
        } catch(e) {}
    }
}