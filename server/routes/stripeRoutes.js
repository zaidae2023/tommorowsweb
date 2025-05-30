import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Route to create a Subscription Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required for Stripe Checkout' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // ✅ Required for recurring payments
      payment_method_types: ['card'],
      customer_email: email, // ✅ Used by webhook to find the user
      line_items: [
        {
          price: 'price_1RUCGCQxGI7D6wc7KnYghEGr', // ✅ Your recurring price ID
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    // ✅ Return the session URL for redirection
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe Error:', err.message);
    res.status(500).json({ error: 'Stripe Checkout failed' });
  }
});

export default router;
