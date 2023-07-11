const express = require('express');
const next = require('next');
const path = require('path');
const url = require('url');

const { MongoClient } = require("mongodb");

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const nextApp = next({ dir: '.', dev });
const nextHandler = nextApp.getRequestHandler();

async function get_quote(symbol) {
  const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'
  + symbol
  + '?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance');

  return await response.json();
}

async function get_history(symbol, interval) {
  const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'
  + symbol
  + '?region=US&lang=en-US&includePrePost=false&interval='
  + interval
  + '&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance');

  return await response.json();
}

async function db_connect(callback) {
  const url = 'mongodb+srv://' + process.env.DB_NAME + ':' + process.env.DB_PASS + '@cluster0.ukfrryk.mongodb.net/?retryWrites=true&w=majority';

  const client = new MongoClient(url);

  await client.connect();

  const db = client.db("COP4331");
  await callback(db);
}

nextApp.prepare()
  .then(() => {
    const server = express();
    
    server.use('/static', express.static(path.join(__dirname, 'static')));
  
    // Get a quote
    server.get('/quote/:symbol', function (req, res) {
      let symbol = req.params.symbol;
      get_quote(symbol).then(result => {
        let price = '';
        price = result['chart']['result']['0']['meta']['regularMarketPrice'];
      
        res.setHeader('Content-Type', 'application/json');
        if(price.length == 0) {
          res.send(JSON.stringify({error: "Symbol not found"}));
        } else {
          res.send(JSON.stringify({symbol: symbol, latestPrice: price}));
        }
      }).catch(err => {
        res.sendStatus(501);
      });
    });

    // Get a quote
    server.get('/history/:symbol/:time', function (req, res) {
      let symbol = req.params.symbol;
      let time = req.params.time;
      
      //Valid intervals: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
      get_history(symbol, time).then(result => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({symbol: symbol,
          priceHistory: result['chart']['result']['0']['indicators']['quote']['0']['close']}));
      }).catch(err => {
        res.sendStatus(501);
      });
    });

    server.get('/search/:symbol', async function (req, res) {
      await db_connect(async (db) => {
        const results = await db.collection('CompanyName').find({"Symbol":{"$regex":"^"
        + req.params.symbol + ".*"}}).limit(10).toArray();

        res.setHeader('Content-Type', 'application/json');
        res.send(results);
      });
    });

    // Server-side routing example
    server.get('/test', (req, res) => {
      return nextApp.render(req, res, '/test', req.query)
    })

    server.get('*', (req, res) => {
      const parsed = url.parse(req.url, true);
      nextHandler(req, res, parsed);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Listening on http://localhost:${port}`);
    });
  });
