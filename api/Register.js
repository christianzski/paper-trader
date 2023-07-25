const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');
const sendEmail = require('./sendEmail');
const db = require('../db');
const verification = require('./verification')

module.exports = {
    api: async function(req, res) {

        //incoming: firstname, lastname, loginId, password, email, phone, question 1-3, answer 1-3, 
        //outgoing: session token, error, and status

    
        var error = '';
        var status = "failed";
        var getToken = uuidv4();



        const { firstName, lastName, login, password, email, phone, question1, answer1, question2, answer2, question3, answer3, photo } = req.body;

        var hashPass = createHash('sha256').update(password).digest('hex');
        var hashAns1 = createHash('sha256').update(answer1).digest('hex');
        var hashAns2 = createHash('sha256').update(answer2).digest('hex');
        var hashAns3 = createHash('sha256').update(answer3).digest('hex');

        let creationTime = Date.now();

        const newUser = {
            firstName: firstName, lastName: lastName, loginId: login, password: hashPass, email: email, phone: phone,
            wallet: 10000.00, question1: question1, answer1: hashAns1, question2: question2, answer2: hashAns2, question3: question3,
            answer3: hashAns3, friendsId: [], emailVerified: false, verificationCode: 0, sessionToken: getToken, creationTime: creationTime, photo: 0
        };

        try {
            await db.connect(async (db) => {

                if(await db.collection('Users').find({"email":email}).toArray().length != 0) {
                    status = "Email is already in use."
                }

                else if(await db.collection('Users').find({"loginId":login}).toArray().length != 0) {
                    status = 'Username has already been taken.'
                }

                else{

                    const result = await db.collection('Users').insertOne(newUser);
                    const cursor = await db.collection('Users').find({"email":email}).toArray();
                    const id = cursor[0].id;
                    
                    await db.collection('Portfolio').insertOne({userId:id, portHistoryValueDay:[], portHistoryValueMonth:[]});
                    await db.collection('Friends').insertOne({inComingReq:[], outGoingReq:[], friendList:[], userId: id});
                    status = "success";
                }

            });
        }
        catch (e) {
            error = e.toString();
        }

        if(status === 'success') {
            sendEmail.api(email, "Your Verification Code");
            //if wanting to verify again do we want to update sendEmail with cookies or keep it the same?
        }

        const expiry = 1000 * 3600 * 5; // By default, expire in 5 hours
        res.cookie('user', id, { maxAge: expiry, httpOnly: true });
        res.cookie('session', getToken, { maxAge: expiry, httpOnly: true });
        res.cookie('username', username, { maxAge: expiry, httpOnly: true });

        var ret = { token: getToken, error: error, status: status };
        res.status(201).json(ret);

    }
}