const { Client } = require('coinbase-commerce-node');
const { Charge } = require('coinbase-commerce-node').resources;

const client = new Client({ apiKey: 'YOUR_COINBASE_API_KEY' });

const createPaymentSession = async (req, res) => {
  try {
    const chargeData = {
      name: 'Premium Membership',
      description: 'Access premium features for Down for Love',
      local_price: {
        amount: '60.00',
        currency: 'USD',
      },
      pricing_type: 'fixed_price',
      metadata: {
        userId: req.body.userId,
      },
    };

    const charge = await Charge.create(chargeData);

    res.status(200).json({ chargeUrl: charge.hosted_url });
  } catch (error) {
    res.status(500).json({ message: 'Payment creation failed' });
  }
};

module.exports = { createPaymentSession };
