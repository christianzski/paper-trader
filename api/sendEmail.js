const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const db = require('./db');

module.exports = {
    api: async function(email, num, subject){
        
        const msg = {
            to:email,
            from:'papertrader42@gmail.com',
            subject:subject,
            text: num + ' is your verification code.'
        }

        sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })

        await db.connect (async (db) => {
            try{
                db.collection('Users').updateOne(
                    {
                        "email" : email
                    },
                    {
                        $set:{
                            verifcationCode:num
                        }
                    }
                )
                }
                catch(e) {
                    console.error(e);
                }

        });
    }
}