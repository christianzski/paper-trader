module.exports = {
    get_quote: async function(symbol) {
        const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'
        + symbol
        + '?region=US&lang=en-US&includePrePost=false&interval=2m&useYfid=true&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance');
      
        const result = await response.json();

        let price = '';
        price = result['chart']['result']['0']['meta']['regularMarketPrice'];


        // let initialPriceDayPrice = result['chart']['result']['indicators']['quote']['open']['0'];
        
        // Perform calculation to get daily percent change

        if(price.length == 0) {
            return {error: "Symbol not found"};
        } else return {symbol: symbol, latestPrice: price};
    },

    api: function(req, res) {
        let symbol = req.params.symbol;
        module.exports.get_quote(symbol).then(result => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        }).catch(err => {
            res.sendStatus(501);
        });
    }
};