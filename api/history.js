async function get_history(symbol, interval) {
  const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'
  + symbol
  + '?region=US&lang=en-US&includePrePost=false&interval='
  + interval
  + '&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance');

  return await response.json();
}

module.exports = {
    api: function(req, res) {
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
    }
};