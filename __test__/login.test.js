const login = require('../api/Login');
const db = require('../db');
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

describe("/post login",()=>{
    describe("logging in success", ()=> {
        
        const server = express();

        server.use(cookieParser());
        server.use(express.json());
        server.post('/api/Login', login.api);

        //body has {login, password} = {"poonp", "testing"}, userId = 2

        it("will give object with seccess and user's id", async ()=>{
            var agent = request.agent(server);
            var result = await agent.post("/api/Login")
                .send({"login":"poonp","password":"testing"})
                .set('Accept', 'application/json');
            
            var parsedResult = JSON.parse(result.text);
            expect(parsedResult.message).toBe("Success");
            expect(parsedResult.userid).toBe(2);
        })

        it("will give status failed, otherwise",async ()=>{
            var agent = request.agent(server);
            var result = await agent.post("/api/Login")
                .send({"login":"poonp","password":"testing_wrong"})
                .set('Accept', 'application/json');
            
            var parsedResult = JSON.parse(result.text);
            expect(parsedResult.message).toBe("Failed");
        })
    })
})