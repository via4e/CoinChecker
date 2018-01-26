'use strict'
const config = require('config');
const express=require('express');
const app=express();

const request = require ('request');

const loki = require ('lokijs');
    let db = new loki ('ex.json');

app.set ('views', __dirname + '/views/');
app.set('view engine', 'pug');

app.use(express.static('static'));

app.listen(config.port, () => {
    console.info(`Listening to c http://localhost:${config.port}`);
});

// Prepare DB
    let tickers = db.addCollection ('tickers');

// Start fetching currencies data
    setInterval ( updateTickers, 6000)

// Index Page
app.get('/',function (req,res){
    // res.send('hi');
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

//API Tickers
app.get('/tickers',function (req,res){
  res.send(tickers.data);
});

// Board Page
app.get('/board', function (req, res) {
   console.log('board page', tickers)
});

// Updater
function updateTickers () {
	console.log('update tickers', Date.now() );
	//poloniexTickers ();
	//bittrexTickers ();
	wexTickers ();
}


//Other Errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//404
app.use(function (req, res, next) {
  res.status(404).send("Page not found")
})



// Function (..modules in future..) for
// Fetch tickers from different exchanges
// Poloniex, Bittrex, Wex, HitBTC, Binance, Yobit

function poloniexTickers () {
  request('https://poloniex.com/public?command=returnTicker', (error, response, body)=> {
    if (!error && response.statusCode === 200) {
     	let polo = JSON.parse(body);
     	console.log ('Poloniex tickers catched');
     	for (let i in polo) {
     		//console.log('polo:', i, polo[i].last);
     		switch (i) {
     		  case 'USDT_BTC':
     		      tickers.insert ({ exchange:'poloniex', ticker: 'btcusdt', last: polo[i].last })
     		      break;
     		  case 'BTC_XEM':
     		      tickers.insert ({ exchange:'poloniex', ticker: 'btcxem', last: polo[i].last })
     		      break;
     		}
     	}     	
    } else {
        console.log("Poloniex got an error: ", error, ", status code: ", response.statusCode)
    }
 }); //request
}//poloniexTickers

function bittrexTickers () {
  request('https://bittrex.com/api/v1.1/public/getmarketsummaries', (error, response, body)=> {
    if (!error && response.statusCode === 200) {
     	console.log ('Bittrex tickers catched');
     	let bitt = JSON.parse(body);
    } else {
       console.log("Bittrex got an error: ", error, ", status code: ", response.statusCode)
    }
  });//request
}//bittrexTickers

function wexTickers () {
  request('https://wex.nz/api/3/ticker/btc_usd-btc_rur', (error, response, body)=> {
    if (!error && response.statusCode === 200) {
     	console.log ('Wex tickers catched');
     	let wex = JSON.parse(body);
     	//console.log('wex:', wex);
     	for (let i in wex) {
     		console.log('wex:', i, wex[i].last);
     		switch (i) {
     		  case 'btc_usd':
     		      tickers.insert ({ exchange:'wex', ticker: 'btcusd', last: wex[i].last })
     		      break;
     		  case 'btc_rur':
     		      tickers.insert ({ exchange:'wex', ticker: 'btcrur', last: wex[i].last })
     		      break;
     		}
     	}
    } else {
       console.log("Wex got an error: ", error, ", status code: ", response.statusCode)
    }
  });//request
}//wexTickers



