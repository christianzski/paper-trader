const express = require('express');
const next = require('next');
const path = require('path');
const url = require('url');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const nextApp = next({ dir: '.', dev });
const nextHandler = nextApp.getRequestHandler();

const quote = require('./api/quote')
const history = require('./api/history')
const search = require('./api/search')

const verification = require('./api/verification')
const register = require('./api/Register');
const login = require('./api/Login');
const forgotPassword = require('./api/forgotPassword');

const getShares = require('./api/getShares');
const getOrders = require('./api/getOrders');
const buy = require('./api/buy')
const sell = require('./api/sell')

const cookieParser = require('cookie-parser');

nextApp.prepare()
  .then(() => {
    const server = express();

    server.use(cookieParser());
    
    server.use(express.json());

    server.post('/api/get-shares', register.api);

    server.post('/api/Register', register.api);

    server.post('/api/Login', login.api);

    server.post('/api/Register', forgotPassword.api);

    server.post('/api/verification', verification.api);

    server.post('/api/buy', buy.api);

    server.post('/api/sell', sell.api);
    
    server.get('/api/get-shares', getShares.api);

    server.get('/api/get-orders', getOrders.api);

    // Get a quote
    server.get('/quote/:symbol', quote.api);

    // Get a symbol's history
    server.get('/history/:symbol/:time', history.api);

    // Search for symbols
    server.get('/search/:symbol', search.api);

    server.get('*', async (req, res) => {
      const parsed = url.parse(req.url, true);
      await nextHandler(req, res, parsed);
    });

    server.listen(port, (err) => {
      if (err) throw err;

      if(process.env.NODE_ENV !== 'production') {
        console.log(`Listening on http://localhost:${port}`);
      }

      setInterval(function() { }, 5 * (1000 * 60));
    });
  });
