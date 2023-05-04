const axios = require('axios');

const P2P_AD_URL = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';
const LIVE_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr';
const accountSid = 'AC8dce978bd2076636dac8da6c24a4115d';
const authToken = 'b5f5e6e11a1c9ec303858307c860dbe9';
const client = require('twilio')(accountSid, authToken);

const api = axios.create();

const fiat = 'INR';
const asset = 'ETH';
const tradeType = 'buy';

// Fetch P2P ad price
function fetchP2PAdPrice(tradeType) {
  const data = {
    fiat,
    page: 1,
    rows: 1,
    tradeType,
    asset,
    countries: [],
    proMerchantAds: false,
    publisherType: null,
    payTypes: []
  };
//   console.log("Name : "+ response.data.data[0].advertiser.nickName);
//     console.log("Price : "+ response.data.data[0].adv.price +" " +response.data.data[0].adv.fiatUnit);
//     console.log("Symbol : "+ response.data.data[0].adv.asset);
  return api.post(P2P_AD_URL, data)
    .then(response => response.data.data[0].adv.price);
}


// Fetch live price of the asset
function fetchLivePrice() {
  const url = LIVE_PRICE_URL;
  return api.get(url)
    .then(response => response.data.ethereum.inr);
}

// Compare prices and send notification if P2P ad price is less than live price
function compareAndNotify(p2pAdPrice, livePrice) {
  if (p2pAdPrice < livePrice) {
    console.log(`P2P ad price is less than live price: ${p2pAdPrice} < ${livePrice}`);
    // send notification here (e.g. using a messaging service or email)
    client.messages
    .create({
        body: `Alert 32 - P2P ad price is less than live price: ${p2pAdPrice} < ${livePrice}`,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+919505753170'
    })
    .then(message => console.log(message.sid))
    .done();
    setTimeout(20000);
  } else {
    console.log(`P2P ad price is greater than or equal to live price: ${p2pAdPrice} >= ${livePrice}`);
    
  }
}
function compareAndNotifyBuyandSell(p2pBuyAdPrice, p2pSellAdPrice) {
    if (p2pBuyAdPrice < p2pSellAdPrice) {
      console.log(`P2P ad buy price is less than sell price: ${p2pBuyAdPrice} < ${p2pSellAdPrice}`);
      // send notification here (e.g. using a messaging service or email)
      client.messages
      .create({
          body: `Alert 3 - P2P ad price is less than live price: ${p2pBuyAdPrice} < ${p2pSellAdPrice}`,
          from: 'whatsapp:+14155238886',
          to: 'whatsapp:+919505753170'
      })
      .then(message => console.log(message.sid))
      .done();
      setTimeout(20000);
    } else {
      console.log(`P2P ad buy price is greater than or equal to sell price: ${p2pBuyAdPrice} >= ${p2pSellAdPrice}`);
      
    }
  }
// Run the code every 5 seconds
setInterval(() => {
    // client.messages
    // .create({
    //     body: `I'm ready!`,
    //     from: 'whatsapp:+14155238886',
    //     to: 'whatsapp:+919505753170'
    // });
  Promise.all([fetchP2PAdPrice('buy'), fetchLivePrice()])
    .then(prices => compareAndNotify(prices[0], prices[1]))
    .catch(error => console.log(error));
  Promise.all([fetchP2PAdPrice('buy'), fetchP2PAdPrice('sell')])
    .then(prices => compareAndNotifyBuyandSell(prices[0], prices[1]))
    .catch(error => console.log(error));
}, 5000);  // 5 seconds interval
