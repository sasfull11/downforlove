// server/controllers/paymentController.js
const { Charge } = require('../config/coinbase');

const createCharge = async (req, res) => {
  const { amount, currency, userId } = req.body;

  try {
    const chargeData = {
      name: 'Premium Subscription',
      description: 'Access to premium features for 1 month',
      local_price: {
        amount,
        currency,
      },
      pricing_type: 'fixed_price',
      metadata: {
        userId,
      },
    };

    const charge = await Charge.create(chargeData);
    res.status(200).json({ chargeUrl: charge.hosted_url });
  } catch (error) {
    console.error('Error creating charge:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

module.exports = { createCharge };
// server/controllers/paymentController.js (update)
const { Charge } = require('../config/coinbase');
const User = require('../models/User');

const confirmPayment = async (req, res) => {
  const { chargeId, userId } = req.body;

  try {
    const charge = await Charge.retrieve(chargeId);

    if (charge.status === 'CONFIRMED') {
      // Update user status to premium
      const user = await User.findByIdAndUpdate(userId, { premium: true }, { new: true });
      res.status(200).json({ message: 'Payment confirmed, premium access granted!', user });
    } else {
      res.status(400).json({ message: 'Payment not confirmed' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

module.exports = { createCharge, confirmPayment };
