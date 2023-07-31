'use client';
import  {useState, useEffect} from 'react';


export default function renderNews( {symbol, startDate, endDate} ) {

    const [result, setResult] = useState([]);

    // category = string
    // datetime = unix time number
    // headline = string
    // id = number
    // image = string (https link)
    // related = string
    // source = string
    // summary = string
    // url = string (https link)

    let printSummary = "Hi"; 
    
    console.log("hello");
    
    console.log(symbol);
    console.log(startDate);
    console.log(endDate);

    // let arrNews = [];

    // async function getNews() {
    //     await fetch("/api/getNews",  {
    //         method: 'GET',
    //         mode: 'cors',
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             symbol: symbol,
    //             startDate: startDate,
    //             endDate: endDate
    //         })
    //     }).then(async response => {
    //             const {result, error} = await response.json();
    //             arrNews = result;
    //             console.log(result);
    //         }).catch(error => {
    //             console.log("Error: " + error);
    //         })
    // }

    // getNews();
    // console.log(arrNews);

    

    async function get_News() {
        let response = await fetch("https://finnhub.io/api/v1/company-news?symbol="
            + symbol + "&from=" + endDate + "&to=" + startDate + "&token=" + process.env.FINNHUB_API_KEY);
        
        if (response.ok) { // if HTTP-status is 200-299
            // get the response body
            let json = await response.json();
            let filteredArr;
            if (json.length > 10) {
                filteredArr = json.slice(0, 10);
            } else {
                filteredArr = json.slice(0, json.length);
            }
            return filteredArr;
        } else {
            console.log("HTTP-Error: " + response.status);
        }
    }
    
    
    useEffect (() => {
        get_News().then(res => {
            setResult(res);
            console.log(res);    
        }).catch(err => {
            console.log(err);
        });
    }, []);


    // console.log(result);



    


    
    
    // Filter the data to only 10 news article
    // console.log(result);


    return(
    <div className = "interBold">
        { result }
    </div>
    );


}