const { Client } = require('coinbase');

const client = new Client({
  apiKey: 'YOUR_COINBASE_API_KEY',
  apiSecret: 'YOUR_COINBASE_API_SECRET',
});

module.exports = client;
