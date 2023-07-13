const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');
const sendEmail = require('./sendEmail');
const db = require('./db');

module.exports = {
    api: async function(req, res) {

        //incoming: firstname, lastname, loginId, password, email, phone, question 1-3, answer 1-3, 
        //outgoing: session token, error, and status

    
        var error = '';
        var status = "failed";
        var getToken = uuidv4();



        const { firstName, lastName, login, password, email, phone, question1, answer1, question2, answer2, question3, answer3 } = req.body;

        var hashPass = createHash('sha256').update(password).digest('hex');
        var hashAns1 = createHash('sha256').update(answer1).digest('hex');
        var hashAns2 = createHash('sha256').update(answer2).digest('hex');
        var hashAns3 = createHash('sha256').update(answer3).digest('hex');

        var verifCode = Math.floor(100000 + Math.random() * 900000);

        const newUser = {
            firstName: firstName, lastName: lastName, loginId: login, password: hashPass, email: email, phone: phone,
            wallet: 10000.00, question1: question1, answer1: hashAns1, question2: question2, answer2: hashAns2, question3: question3,
            answer3: hashAns3, friendsId: [], emailVerified: false, verificationCode: verifCode, sessionToken: getToken
        };

        try {
            await db.connect(async (db) => {

                const result = db.collection('Users').insertOne(newUser);
                const cursor = await db.collection('Users').find({"email":email}).toArray();
                const id = cursor[0].id;
                
                db.collection('Portfolio').insertOne({id:id});
                status = "success";
                
            });
        }
        catch (e) {
            error = e.toString();
        }

        var ret = { token: getToken, error: error, status: status };

        res.status(201).json(ret);
    }
}