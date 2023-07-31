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
        try {
            let symbol = req.params.symbol;
            let time = req.params.time;
            
            //Valid intervals: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
            get_history(symbol, time).then(result => {
                let history = result['chart']['result']['0']['indicators']['quote']['0']['close'] || [];
                let timestamp = [];

                for(let i = 0; i < history.length; ++i) {
                    if(history[i] != null) {
                        timestamp.push(result['chart']['result']['0']['timestamp'][i] || 0);
                    }
                }

                history = history.filter(item => item != null);

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({symbol: symbol, priceHistory: history, timestamps: timestamp}));
            }).catch(err => {
                res.sendStatus(501);
            });
        } catch(e) {}
    }
};