

// Not Done


async function get_News(symbol, startDate, interval) {
    const response = await fetch('https://finnhub.io/api/v1/company-news?symbol='
    + symbol
    + '&from='
    + startDate
    + '&to='
    + endDate
    + '&token='
    + process.env.FINNHUB_API_KEY);
  
    return await response.json();
  }
  
  module.exports = {
      api: function(req, res) {
          let symbol = req.params.symbol;
          let time = req.params.time;
          
          //Valid intervals: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
          get_history(symbol, time).then(result => {
              let history = result['chart']['result']['0']['indicators']['quote']['0']['close'] || [];
              history = history.filter(item => item != null);
  
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({symbol: symbol, priceHistory: history}));
          }).catch(err => {
              res.sendStatus(501);
          });
      }
  };