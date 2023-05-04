const axios = require('axios');
const twilio = require('twilio');
require('dotenv').config();
const client = twilio('AC8dce978bd2076636dac8da6c24a4115d', '68926c189e98064d5c0fa7032285506f');

const P2P_AD_URL = process.env.P2P_AD_URL;
const LIVE_PRICE_URL = process.env.LIVE_PRICE_URL;

const api = axios.create();

const fiat = 'INR';
const assets = ['ETH', 'BTC', 'USDT'];

async function fetchP2PAdPrice(asset, tradeType) {
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
  const { data: { data: [p2pAd] } } = await api.post(P2P_AD_URL, data);
//   await api.post(P2P_AD_URL, data).then(res => console.log(res.data.data[0]))
  return p2pAd?.adv?.dynamicMaxSingleTransAmount < 20000 ? p2pAd : null;
}

async function fetchLivePrice(coin) {
  const { data } = await api.get(`${LIVE_PRICE_URL}ids=${coin}&vs_currencies=inr`);
  return data[coin]?.inr;
}

let lastAlertMessage = '';
let lastmsg = 0;
function sendAlert(alertMessage) {
  if (alertMessage === lastAlertMessage) {
    console.log('Same alert message as last time. Skipping client message.');
    return;
  }
  if (Date.now()-lastmsg < 30000) {
    console.log('A msg has been sent recently. Skipping client message.' + Date.now());
    return;
  }

  console.log('Alert: ' + alertMessage);

  client.messages.create({
    body: alertMessage,
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+919505753170'
  }).then(() => {
    console.log('Client message sent.');
  });

  lastAlertMessage = alertMessage;
  lastmsg = Date.now();
}

async function compareAndNotify(p2pAd, livePrice) {
  if (!p2pAd) return;

  const p2pAdPrice = p2pAd.adv.price;
  if (livePrice && p2pAdPrice < livePrice) {
    const alertMessage = `Alert 32 - P2P ad price for ${p2pAd.advertiser.nickName} is less than live price: ${p2pAdPrice} < ${livePrice}`;
    sendAlert(alertMessage);
  }
}

async function compareAndNotifyBuyandSell(p2pBuyAd, p2pSellAd) {
  if (!p2pBuyAd || !p2pSellAd) return;

  const p2pBuyAdPrice = p2pBuyAd.adv.price;
  const p2pSellAdPrice = p2pSellAd.adv.price;
  if (p2pBuyAdPrice < p2pSellAdPrice) {
    const alertMessage = `Alert 3 - P2P ad price for ${p2pBuyAd.advertiser.nickName} is less than sell price: ${p2pBuyAdPrice} < ${p2pSellAdPrice}`;
    sendAlert(alertMessage);
  }
}




  async function run() {
    try {
      const [p2pAdPrice, livePrice] = await Promise.all([fetchP2PAdPrice('ETH','sell'), fetchLivePrice('ethereum')]);
      compareAndNotify(p2pAdPrice, livePrice);
  
      const [p2pBuyAdPrice, p2pSellAdPrice] = await Promise.all([fetchP2PAdPrice('ETH','buy'), fetchP2PAdPrice('ETH','sell')]);
      compareAndNotifyBuyandSell(p2pBuyAdPrice, p2pSellAdPrice);

      const [btcp2pAdPrice, btclivePrice] = await Promise.all([fetchP2PAdPrice('BTC','buy'), fetchLivePrice('bitcoin')]);
      compareAndNotify(btcp2pAdPrice, btclivePrice);

      const [btcp2pBuyAdPrice, btcp2pSellAdPrice] = await Promise.all([fetchP2PAdPrice('BTC','buy'), fetchP2PAdPrice('BTC','sell')]);
      compareAndNotifyBuyandSell(btcp2pBuyAdPrice, btcp2pSellAdPrice);

      const [usdtp2pAdPrice, usdtlivePrice] = await Promise.all([fetchP2PAdPrice('USDT','buy'), fetchLivePrice('tether')]);
      compareAndNotify(usdtp2pAdPrice, usdtlivePrice);

      const [usdtp2pBuyAdPrice, usdtp2pSellAdPrice] = await Promise.all([fetchP2PAdPrice('USDT','buy'), fetchP2PAdPrice('USDT','sell')]);
      compareAndNotifyBuyandSell(usdtp2pBuyAdPrice, usdtp2pSellAdPrice);


      
    } catch (error) {
      console.log(error);
    }
    
  }
  
  setInterval(run, 5000);
  