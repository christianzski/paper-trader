async function get_quote(symbol) {
    const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'
    + symbol
    + '?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance');
  
    return await response.json();
}

module.exports = {
    api: function(req, res) {
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
    }
};