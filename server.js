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
const resetPassword = require('./api/resetPassword');
const logout = require('./api/logout');

const user = require('./api/user');

const favorite = require('./api/favorite');

const getShares = require('./api/getShares');
const getOrders = require('./api/getOrders');
const buy = require('./api/buy')
const sell = require('./api/sell')

const sendFriend = require('./api/sendFriendRQ');
const respondFriend = require('./api/respondFriendRQ');
const friendList = require('./api/friendList');
const removeFriend = require('./api/removeFriend');

const cookieParser = require('cookie-parser');

const portValue = require('./api/portValue');

nextApp.prepare()
  .then(() => {
    const server = express();

    server.use(cookieParser());
    
    server.use(express.json());

    /* User Authentication */
    server.post('/api/Register', register.api);

    server.post('/api/Login', login.api);

    server.post('/api/logout', logout.api);

    server.post('/api/forgot-password', forgotPassword.api);

    server.post('/api/reset-password', forgotPassword.api);

    server.post('/api/verification', verification.api);

    server.get('/api/user', user.api);

    /* User Friends */
    server.post('/api/sendFriendRQ', sendFriend.api);

    server.post('/api/respondFriendRQ', respondFriend.api);

    server.post('/api/removeFriend', removeFriend.api);

    server.get('/friendList', friendList.api);

    /* User Favorites */
    server.post('/api/favorite', favorite.toggle);

    server.get('/api/favorites', favorite.get);

    /* User Investments */
    server.post('/api/buy', buy.api);

    server.post('/api/sell', sell.api);

    server.get('/api/portfolio', portValue.api);
    
    server.get('/api/get-shares', getShares.api);

    server.get('/api/get-orders', getOrders.api);

    /* Stock information */
    // Get a quote
    server.get('/quote/:symbol', quote.api);

    // Get a symbol's history
    server.get('/history/:symbol/:time', history.api);

    // Search for symbols
    server.get('/search', search.api);

    server.get('*', async (req, res) => {
      const parsed = url.parse(req.url, true);
      await nextHandler(req, res, parsed);
    });

    server.listen(port, (err) => {
      if (err) throw err;

      if(process.env.NODE_ENV !== 'production') {
        console.log(`Listening on http://localhost:${port}`);
      }

      if(process.env.NODE_ENV === 'production') {
        setInterval(function() {
          let time = parseInt(Date.now() / 1000);
          const is5Min = (time % 300) == 0;

          if(is5Min) {
            // Calculate the portfolio for all users
            portValue.portValue(time);
          }
        }, 1000);
      }
    });
  });