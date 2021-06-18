// CoinChecker v1.4
console.warn('Coin Checker start');

'use strict'
const config = require('config');
const express=require('express');
const app=express();

const request = require ('request');

let tickers={};
      tickers.polo={};
      tickers.bitt={};
      tickers.marcap={};
      tickers.exmo={};

app.set ('views', __dirname + '/views/');
app.set('view engine', 'pug');

app.use(express.static('static'));

app.listen(config.port, () => {
    console.info(`Listening to c http://localhost:${config.port}`);
});

// Start fetching currencies data
    updateTickers();
    setInterval ( updateTickers, 20000)

// Index Page
app.get('/',function (req,res){
    // res.send('hi');
  res.render('index', { title: 'Tickers List', message: 'Tickers' })
});

//API Tickers
app.get('/tickers',function (req,res){
  res.send(tickers);
});

// Updater
function updateTickers () {
	console.log('update tickers', Date.now() );
    //exmoTickers();
	poloniexTickers ();
	bittrexTickers ();
    coinmarketcap();
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

function coinmarketcap(){
  request('https://api.coinmarketcap.com/v2/global', (error, response, body)=> {
    if (!error && response.statusCode === 200) {
     	let marcap = JSON.parse(body);
     	marcap = marcap.data;

        tickers.marcap.btcdom = { exchange:'marcap', name: 'BTC dominance:', ticker: 'btcdom', last :  marcap.bitcoin_percentage_of_market_cap }
        tickers.marcap.totalcap = { exchange:'marcap', name: 'Market Cap:', ticker: 'totalcap', last :  marcap.quotes.USD.total_market_cap }

    } else {
        console.log("CoinMarketCap got an error: ", error, ", status code: ", response.statusCode)
    }
 }); //request  
}

function poloniexTickers () {
  request('https://poloniex.com/public?command=returnTicker', (error, response, body)=> {
    if (!error && response.statusCode === 200) {
     	let polo = JSON.parse(body);
     	console.log ('Poloniex tickers catched');
     	for (let i in polo) {
     		//console.log('polo:', i, polo[i].last);
       	switch (i) {
     		  case 'USDT_BTC':
              tickers.polo.btc_usdt={ exchange:'poloniex', name: 'BTC/USDT', ticker: 'btc_usdt', last: polo[i].last }
     		      break;
     		  case 'BTC_XEM':
     		      tickers.polo.btc_xem=({ exchange:'poloniex', name: 'BTC/XEM', ticker: 'btc_xem', last: polo[i].last })
              break;              
          case 'BTC_ETH':
              tickers.polo.btc_eth=({ exchange:'poloniex', name: 'BTC/ETH', ticker: 'btc_eth', last: polo[i].last })
              break;              
          case 'BTC_ETC':
              tickers.polo.btc_etc=({ exchange:'poloniex', name: 'BTC/ETC', ticker: 'btc_etc', last: polo[i].last })
              break;              
          case 'BTC_ZEC':
              tickers.polo.btc_zec=({ exchange:'poloniex', name: 'BTC/ZEC', ticker: 'btc_zec', last: polo[i].last })
              break;              
          case 'BTC_XMR':
              tickers.polo.btc_xmr=({ exchange:'poloniex', name: 'BTC/XMR', ticker: 'btc_xmr', last: polo[i].last })
              break;              
          case 'BTC_DOGE':
              tickers.polo.btc_doge=({ exchange:'poloniex', name: 'BTC/DOGE', ticker: 'btc_doge', last: polo[i].last })
              break;              
          case 'BTC_NXT':
              tickers.polo.btc_nxt=({ exchange:'poloniex', name: 'BTC/NXT', ticker: 'btc_nxt', last: polo[i].last })      
              break;              
          case 'BTC_SC':
              tickers.polo.btc_sc=({ exchange:'poloniex', name: 'BTC/SC', ticker: 'btc_sc', last: polo[i].last }) 
              break;              
          case 'BTC_STR':
              tickers.polo.btc_str=({ exchange:'poloniex', name: 'BTC/STR', ticker: 'btc_str', last: polo[i].last })                               
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
     	let bitt = JSON.parse(body);
      bitt = bitt.result;
      console.log ('Bittrex tickers catched');      
          for (let i in bitt) {
            let name = bitt[i].MarketName
            switch (name) {
              case 'BTC-XEM':
                  tickers.bitt.btc_xem = { exchange:'bittrex', name: 'BTC/XEM', ticker: 'btc_xem', last: bitt[i].Last } 
                  break;               
              case 'USDT-BTC':
                  tickers.bitt.usdt_btc = { exchange:'bittrex', name: 'USDT/BTC', ticker: 'usdt_btc', last: bitt[i].Last } 
                  break;
              case 'USDT-BCC':
                  tickers.bitt.usdt_bcc = { exchange:'bittrex', name: 'USDT/BCC', ticker: 'usdt_bcc', last: bitt[i].Last } 
                  break;
              case 'USDT-DASH':
                  tickers.bitt.usdt_dash = { exchange:'bittrex', name: 'USDT/DASH', ticker: 'usdt_dash', last: bitt[i].Last } 
                  break;
              case 'USDT-ETH':
                  tickers.bitt.usdt_eth = { exchange:'bittrex', name: 'USDT/ETH', ticker: 'usdt_eth', last: bitt[i].Last } 
                  break;
              case 'USDT-ETC':
                  tickers.bitt.usdt_etc = { exchange:'bittrex', name: 'USDT/ETC', ticker: 'usdt_etc', last: bitt[i].Last } 
                  break; 
              case 'USDT-LTC':
                  tickers.bitt.usdt_ltc = { exchange:'bittrex', name: 'USDT/LTC', ticker: 'usdt_ltc', last: bitt[i].Last } 
                  break;
              case 'USDT-NEO':
                  tickers.bitt.usdt_neo = { exchange:'bittrex', name: 'USDT/NEO', ticker: 'usdt_neo', last: bitt[i].Last } 
                  break;
              case 'USDT-XMR':
                  tickers.bitt.usdt_xmr = { exchange:'bittrex', name: 'USDT/XMR', ticker: 'usdt_xmr', last: bitt[i].Last } 
                  break; 
              case 'USDT-NXT':
                  tickers.bitt.usdt_nxt = { exchange:'bittrex', name: 'USDT/NXT', ticker: 'usdt_nxt', last: bitt[i].Last } 
                  break;
              case 'USDT-ZEC':
                  tickers.bitt.usdt_zec = { exchange:'bittrex', name: 'USDT/ZEC', ticker: 'usdt_zec', last: bitt[i].Last } 
                  break;                                                                                                                                                                 
              case 'BTC-LTC':
                  tickers.bitt.btc_ltc = { exchange:'bittrex', name: 'BTC/LTC', ticker: 'btc_ltc', last: bitt[i].Last } 
                  break;
              case 'BTC-ARDR':
                  tickers.bitt.btc_ardr = { exchange:'bittrex', name: 'BTC/ARDR', ticker: 'btc_ardr', last: bitt[i].Last } 
                  break;  
              case 'BTC-BCC':
                  tickers.bitt.btc_bcc = { exchange:'bittrex', name: 'BTC/BCC', ticker: 'btc_bcc', last: bitt[i].Last } 
                  break;
              case 'BTC-DASH':
                  tickers.bitt.btc_dash = { exchange:'bittrex', name: 'BTC/DASH', ticker: 'btc_dash', last: bitt[i].Last } 
                  break;
              case 'BTC-DGB':
                  tickers.bitt.btc_dgb = { exchange:'bittrex', name: 'BTC/DGB', ticker: 'btc_dgb', last: bitt[i].Last } 
                  break; 
              case 'BTC-DOGE':
                  tickers.bitt.btc_doge = { exchange:'bittrex', name: 'BTC/DOGE', ticker: 'btc_doge', last: bitt[i].Last } 
                  break;
              case 'BTC-ETH':
                  tickers.bitt.btc_eth = { exchange:'bittrex', name: 'BTC/ETH', ticker: 'btc_eth', last: bitt[i].Last } 
                  break;
              case 'BTC-ETC':
                  tickers.bitt.btc_etc = { exchange:'bittrex', name: 'BTC/ETC', ticker: 'btc_etc', last: bitt[i].Last } 
                  break;  
              case 'BTC-NEO':
                  tickers.bitt.btc_neo = { exchange:'bittrex', name: 'BTC/NEO', ticker: 'btc_neo', last: bitt[i].Last } 
                  break;
              case 'BTC-NXT':
                  tickers.bitt.btc_nxt = { exchange:'bittrex', name: 'BTC/NXT', ticker: 'btc_nxt', last: bitt[i].Last } 
                  break;  
              case 'BTC-SC':
                  tickers.bitt.btc_sc = { exchange:'bittrex', name: 'BTC/SC', ticker: 'btc_sc', last: bitt[i].Last } 
                  break; 
              case 'BTC-STORJ':
                  tickers.bitt.btc_storj = { exchange:'bittrex', name: 'BTC/STORJ', ticker: 'btc_storj', last: bitt[i].Last } 
                  break;  
              case 'BTC-XMR':
                  tickers.bitt.btc_xmr = { exchange:'bittrex', name: 'BTC/XMR', ticker: 'btc_xmr', last: bitt[i].Last } 
                  break; 
              case 'BTC-ZEC':
                  tickers.bitt.btc_zec = { exchange:'bittrex', name: 'BTC/ZEC', ticker: 'btc_zec', last: bitt[i].Last } 
                  break;                                   
              default:
                  break;
            }
          }      
    } else {
       console.log("Bittrex got an error: ", error, ", status code: ", response.statusCode)
    }
  });//request
}//bittrexTickers


function exmoTickers () {
    request('https://api.exmo.com/v1/ticker/', (error, response, body)=> {
        if (!error && response.statusCode === 200) {
            let exmo = JSON.parse(body);
            tickers.exmo.btc_xem = { exchange:'exmo', name: 'BTC/XEM', ticker: 'btc_xem', last: 111 }
            console.log ('EXMO tickers catched',exmo);
            for (let i in exmo) {
                 switch (i) {
                     case 'BTC_USD':
                         tickers.exmo.btc_xem = { exchange:'exmo', name: 'BTC_USD', ticker: 'btc_xem', last: exmo[i].avg }
                         break;
                     case 'XEM_BTC':
                         tickers.exmo.usdt_btc = { exchange:'exmo', name: 'XEM_BTC', ticker: 'usdt_btc', last: exmo[i].avg }
                         break;
                     case 'ZEC_USD':
                         tickers.exmo.usdt_bcc = { exchange:'exmo', name: 'ZEC_USD', ticker: 'usdt_bcc', last: exmo[i].avg }
                         break;
                     default:
                         break;
                 }
            }
        } else {
            console.log("EXMO got an error: ", error, ", status code: ", response.statusCode)
        }
    });//request
}//bittrexTickers