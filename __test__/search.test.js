const search = require('../api/search');
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

describe("/get search",()=>{
    describe("test search function against companyName database", ()=>{

        const server = express();

        server.use(cookieParser());
        server.use(express.json());
        server.get('/search', search.api);

        it("will return the full object, dectect symbol", async ()=>{

                var query = {query:"Apple Inc.",symbol:""}
                var req = {query};

                var agent = request.agent(server);
                var result = await agent.get("/search?symbol=AAPL");
                //console.log(result);
                var parsedResult = JSON.parse(result.text)
                //console.log(parsedResult);
                expect(parsedResult[0].Symbol).toEqual("AAPL");
        })

        it("will return unidentified when not found", async ()=>{

                var query = {query:"Randomdly Wrong Name Company.",symbol:""}
                var req = {query};

                var agent = request.agent(server);
                var result = await agent.get("/search?symbol=AAPL")
                expect(result.data).toBe(undefined);
        })
    })
})