import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route to create a Subscription Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required for Stripe Checkout' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: 'price_1RUCGCQxGI7D6wc7KnYghEGr',
          quantity: 1,
        },
      ],
      success_url: 'https://meek-macaron-f162ab.netlify.app/success',
      cancel_url: 'https://meek-macaron-f162ab.netlify.app/cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe Error:', err.message);
    res.status(500).json({ error: 'Stripe Checkout failed' });
  }
});

export default router;
