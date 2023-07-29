const buy = require('../api/buy');
const db = require('../db');
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

describe("post /buy",()=> {

    describe("testing their wallet is decrease", ()=> {

        const server = express();

        server.use(cookieParser());
        server.use(express.json());
        server.post('/api/buy', buy.api);

        let userBefore = '';
        let oldWallet = 0.0;
        let stockBefore = '';
        let oldNumShare = -1;

        let userAfter = '';
        let newWallet = 0.0;
        let stockAfter = '';
        let newNumShare = -1;

        //test success after buying
        
        it("will success when buy", async ()=>{
            await db.connect(async (db) => {

                userBefore = await db.collection('Users').findOne({"id": 2});
                oldWallet = userBefore.wallet;
                stockBefore = await db.collection('Stock').findOne({"portId":2, "companyName":"AAPL"});
                oldNumShare = stockBefore.amountShareOwned;


                var agent = request.agent(server);
                var result = await agent.post("/api/buy")
                .send({
                    "symbol":"AAPL","shares":2.0
                })
                .set('Accept', 'application/json')
                .set(
                    'Cookie','user=2; session="983acbd6-a32a-4a9f-b256-963c5dfded80"'
                );
                var parsedResult = JSON.parse(result.text);

                userAfter = await db.collection('Users').findOne({"id": 2});
                newWallet = userAfter.wallet;
                stockAfter = await db.collection('Stock').findOne({"portId":2, "companyName":"AAPL"});
                newNumShare = stockAfter.amountShareOwned;

                expect(parsedResult.success).toBe(true);
            })
        })

        it("will check the wallet decreases", async ()=>{
            var flag = false;
            if(newWallet < oldWallet) flag = true;
            expect(flag).toBe(true);
        })

        it("will check the numStock increase", async ()=> {
            var flag = false;
            if(newNumShare > oldNumShare) flag = true;
            expect(flag).toBe(true);
        })

    })
})