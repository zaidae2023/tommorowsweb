// routes/webhook.js
import express from 'express';
import Stripe from 'stripe';
import User from '../models/user.js'; // Adjust path
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      await User.findByIdAndUpdate(userId, { isPremium: true });
      console.log(`User ${userId} upgraded to Premium`);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  }

  res.status(200).json({ received: true });
});

export default router;
