import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ This route must be mounted using express.raw() in app.js
router.post('/', async (req, res) => {
  console.log('🔥 Stripe webhook HIT');

  // Debug logs to inspect raw request data & headers
  console.log('Headers:', req.headers);
  console.log('Stripe Signature Header:', req.headers['stripe-signature']);
  if (req.body && Buffer.isBuffer(req.body)) {
    console.log('Raw body length:', req.body.length);
    console.log('Raw body preview:', req.body.toString('utf8').slice(0, 200));
  } else {
    console.warn('⚠️ Warning: req.body is not a buffer!');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body.toString('utf8'),  // <-- Pass raw body as UTF-8 string here
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('Webhook verified:', event.type);
  } catch (err) {
    console.error('❌ Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log full event for debugging
  console.log('📦 Full event:', JSON.stringify(event, null, 2));

  // Handle subscription-related events
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'invoice.payment_succeeded'
  ) {
    const session = event.data.object;
    const email = session.customer_email;

    console.log('📧 Checkout email:', email);

    try {
      const user = await User.findOne({ email });

      if (user) {
        user.plan = 'premium'; //Set to 'premium'
        await user.save();
        console.log(`🎉 User ${email} upgraded to Premium`);
      } else {
        console.warn(`⚠️ No user found with email: ${email}`);
      }
    } catch (err) {
      console.error('❌ Error upgrading user:', err.message);
    }
  } else {
    console.log(`ℹ️ No action taken for event type: ${event.type}`);
  }

  res.status(200).send({ received: true });
});

export default router;
