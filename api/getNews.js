async function get_News(symbol, startDate, endDate) {
    const response = await fetch('https://finnhub.io/api/v1/company-news?symbol='
    + symbol
    + '&from='
    + endDate
    + '&to='
    + startDate
    + '&token='
    + process.env.FINNHUB_API_KEY);
  
    return await response.json();
  }
  
  module.exports = {
      api: async function(req, res) {

          let symbol = req.body.symbol;
          let startDate = req.body.startDate;
          let endDate = req.body.endDate;
          
          var error;
          var status = "failed";
          
          get_News(symbol, startDate, endDate).then(result => {
            let arrNews = result;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(arrNews);
          }).catch(err => {
            res.sendStatus(501);
          });


      }
  }