const express = require('express');
const router = express.Router();
const client = require('../config/paymentConfig');

// Request Bitcoin payment (generate a new address)
router.post('/bitcoin', async (req, res) => {
  const { amount, currency } = req.body;  // e.g., 0.01 BTC

  try {
    // Generate a new payment address for Bitcoin
    client.wallets.generateAddress({ currency: 'BTC' }, (err, address) => {
      if (err) {
        return res.status(500).json({ error: 'Error generating address' });
      }

      const paymentUrl = `bitcoin:${address.address}?amount=${amount}&currency=${currency}`;

      res.json({
        message: 'Please send your payment',
        paymentUrl: paymentUrl,
        address: address.address,
        amount: amount,
        currency: currency,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if payment has been received at the address
router.get('/verify-payment', async (req, res) => {
  const { address } = req.query;  // Address where payment is sent

  try {
    client.wallets.getAddress(address, (err, addressDetails) => {
      if (err) {
        return res.status(500).json({ error: 'Error checking payment' });
      }

      if (addressDetails.balance.amount > 0) {
        res.json({ status: 'Payment received', amount: addressDetails.balance.amount });
      } else {
        res.status(400).json({ status: 'No payment received' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

