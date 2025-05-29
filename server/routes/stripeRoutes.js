// routes/stripeRoutes.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js'; // ✅ Import CommonJS module
const { verifyToken } = authMiddleware; // ✅ Extract the named export

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'TuneUp Premium Subscription',
            },
            unit_amount: 499, // in cents ($4.99)
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/upgrade`,
      metadata: {
        userId: req.user.id, // Pass user ID for webhook to use
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment session creation failed' });
  }
});

export default router;
