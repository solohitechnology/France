const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();
const express = require('express');

const router = express.Router();

router.post('/payment', async (req, res) => {
  const { amount, email } = req.body;

  // Calculate the amount in kobo
  const amountInKobo = amount * 100;

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email,
        amount: amountInKobo,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseData = {
      message: 'solohitech',
      input1: amount,
      email: email,
      amount: amount,
      paystackResponse: response.data.data.authorization_url,
    };

    console.log(responseData.paystackResponse);
    res.json(responseData);
    console.log('solohitechnology');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while processing the payment.' });
  }
});

router.post('/webhook', (req, res) => {
  const payload = req.body;
  const signature = req.headers['x-paystack-signature'];
  const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;

  const verifyWebhook = (payload, signature) => {
    const hash = crypto.createHmac('sha512', webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');
    return hash === signature;
  };

  // Verify the authenticity of the webhook notification
  if (!verifyWebhook(payload, signature)) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const { event, data } = payload;

  // Process the payment event
  if (event === 'charge.success') {
    // Payment was successful, perform further actions
    console.log('Payment was successful');
    // Send a message to the user
    // Add your logic here
  }

  // Handle other webhook events if needed

  res.sendStatus(200);
});

module.exports = router;
