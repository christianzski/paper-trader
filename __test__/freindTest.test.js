const sendFriendRQ = require('../api/sendFriendRQ');
const respondFriendRQ = require('../api/respondFriendRQ');
const removeFriend = require('../api/removeFriend');
const db = require('../db');
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

/*
testing Order run thru = send,respond,remove
send:
    userId:2 sendFriendRQ to userId:21
        id = 2, loginId = poonp
        id = 21, loginId = PoonPTest

        needed in req
        header -> adder's userId, adder's sessionKey
        body -> responder's loginId
respond:
    userId:21 respondFriendRQ to userId:2
        id = 2, loginId = poonp
        id = 21, loginId = PoonPTest

        needed in req
        header -> responder's userId, responder's sessionKey
        body -> adder's loginId, status (accept,reject)
remove:
    userId:21 removeFriend to userId:2
        id = 2, loginId = poonp
        id = 21, loginId = PoonPTest

        needed in req
        header -> user's userId, user's sessionKey
        body -> target of removing's loginId
*/

describe("test three endpoints from friends", ()=>{
    describe("test sending, then respond, then remove in order",()=> {

        const server = express();

        server.use(cookieParser());
        server.use(express.json());

        //sendFriendRQ tests
        {
            server.post('/api/sendFriendRQ', sendFriendRQ.api);

            let senderBefore = '';
            let responderBefore = '';
            let oldOutGoingReq = 0;
            let oldIncomingReq = 0;

            let senderAfter = '';
            let responderAfter = '';
            let newOutGoingReq = 0;
            let newIncomingReq = 0;



            it("will success with success status", async()=>{
                await db.connect(async (db) => {
                    senderBefore = await db.collection('Friends').findOne({"userId": 2});
                    oldOutGoingReq = senderBefore.outGoingReq.length;
                    responderBefore = await db.collection('Friends').findOne({"userId": 21});
                    oldIncomingReq = responderBefore.inComingReq.length;

                    var agent = request.agent(server);
                    var result = await agent.post("/api/sendFriendRQ")
                    .send({
                        "userAdding":"PoonPTest"
                    })
                    .set('Accept', 'application/json')
                    .set(
                        'Cookie','user=2; session="983acbd6-a32a-4a9f-b256-963c5dfded80"'
                    );
                    var parsedResult = JSON.parse(result.text);

                    senderAfter = await db.collection('Friends').findOne({"userId": 2});
                    newOutGoingReq = senderAfter.outGoingReq.length;
                    responderAfter = await db.collection('Friends').findOne({"userId": 21});
                    newIncomingReq = responderAfter.inComingReq.length;

                    expect(parsedResult.status).toBe("A friend request has been sent to the user");
                })
            })

            it("will success with larger outGoingReq for sender", async()=>{
                var flag = false;
                if(oldOutGoingReq < newOutGoingReq) flag = true;
                expect(flag).toBe(true);
            })

            it("will success with larger inComingReq for responder", async()=>{
                var flag = false;
                if(oldIncomingReq < newIncomingReq) flag = true;
                expect(flag).toBe(true);
            })
        }

        //respondFriendRQ tests
        {
            server.post('/api/respondFriendRQ', respondFriendRQ.api);

            let senderBefore = '';
            let responderBefore = '';
            let oldOutGoingReq = 0;
            let oldIncomingReq = 0;
    
            let senderAfter = '';
            let responderAfter = '';
            let newOutGoingReq = 0;
            let newIncomingReq = 0;
    
            let status = 'Accept';
    
            it("will success with success status", async()=>{
                await db.connect(async (db) => {
                    senderBefore = await db.collection('Friends').findOne({"userId": 2});
                    oldOutGoingReq = senderBefore.outGoingReq.length;
                    responderBefore = await db.collection('Friends').findOne({"userId": 21});
                    oldIncomingReq = responderBefore.inComingReq.length;
    
                    var agent = request.agent(server);
                    var result = await agent.post("/api/respondFriendRQ")
                    .send({
                        "userName":"poonp", "status":status
                    })
                    .set('Accept', 'application/json')
                    .set(
                        'Cookie','user=21; session="769daff0-a998-4147-8d7b-5818212b7b6c"'
                    );
                    var parsedResult = JSON.parse(result.text);
    
                    senderAfter = await db.collection('Friends').findOne({"userId": 2});
                    newOutGoingReq = senderAfter.outGoingReq.length;
                    responderAfter = await db.collection('Friends').findOne({"userId": 21});
                    newIncomingReq = responderAfter.inComingReq.length;
    
                    expect(parsedResult).toBe("successfully responded");
                })
            })
    
            it("will success with smaller outGoingReq for sender", async()=>{
                var flag = false;
                if(oldOutGoingReq > newOutGoingReq) flag = true;
                expect(flag).toBe(true);
            })
    
            it("will success with smaller inComingReq for responder", async()=>{
                var flag = false;
                if(oldIncomingReq > newIncomingReq) flag = true;
                expect(flag).toBe(true);
            })
    
            it("will have the sender in the friendList after accept", ()=> {
                var flag = false;
                for(var i = 0; i<responderAfter.friendList.length; i++){
                    if(responderAfter.friendList[i] == "poonp") flag = true;
                }
                expect(flag).toBe(true);
            })
        }

        //removeFriend tests
        {
            server.post('/api/removeFriend', removeFriend.api);

            var senderBefore = '';
            var oldNumFriend = 0;
            var senderAfter = '';
            var newNumFriend = 0;

            it("will success with success status", async()=>{
                await db.connect(async (db) => {
                    senderBefore = await db.collection('Friends').findOne({"userId": 21});
                    oldNumFriend = senderBefore.friendList.length;

                    var agent = request.agent(server);
                    var result = await agent.post("/api/removeFriend")
                    .send({
                        "userDelete" : "poonp"
                    })
                    .set('Accept', 'application/json')
                    .set(
                        'Cookie','user=21; session="769daff0-a998-4147-8d7b-5818212b7b6c"'
                    );
                    var parsedResult = JSON.parse(result.text);

                    senderAfter = await db.collection('Friends').findOne({"userId": 21});
                    newNumFriend = senderAfter.friendList.length;

                    expect(parsedResult.status).toBe("Friend has been successfully removed.");
                })
            })

            it("will success with smaller user's friendList", async()=>{
                var flag = false;
                if(oldNumFriend > newNumFriend) flag = true;
                expect(flag).toBe(true);
            })

            it("will not have the taget's loginId in user's friendList", ()=> {
                var flag = false;
                for(var i = 0; i<senderAfter.friendList.length; i++){
                    if(senderAfter.friendList[i] == "poonp") flag = true;
                }
                expect(flag).toBe(false);
            })
        }
    })
})