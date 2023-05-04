const axios = require('axios');

const url = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';

const data = {
  fiat: 'INR',
  page: 1,
  rows: 1,
  tradeType: 'buy',
  asset: 'ETH',
  countries: [],
  proMerchantAds: false,
  publisherType: null,
  payTypes: []
};

axios.post(url, data)
  .then((response) => {

    console.log("Name : "+ response.data.data[0].advertiser.nickName);
    console.log("Price : "+ response.data.data[0].adv.price +" " +response.data.data[0].adv.fiatUnit);
    console.log("Symbol : "+ response.data.data[0].adv.asset);
  })
  .catch((error) => {
    console.log(error);
  });


  const url2 = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr";

  

axios.get(url2)
  .then((response) => {
    console.log(`Live Price: ${response.data.ethereum.inr}`);
  })
  .catch((error) => {
    console.log(error);
  });