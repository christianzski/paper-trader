require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const db = require('../db');

module.exports = {
    api: async function(email, subject){

        const num = Math.floor(100000 + Math.random() * 900000);
        
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
                await db.collection('Users').updateOne(
                    {
                        "email" : email
                    },
                    {
                        $set:{
                            verificationCode:num
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