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
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
