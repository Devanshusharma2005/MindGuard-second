import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  plan: { type: String, enum: ['FREE', 'PRO'], default: 'FREE' },
  credits: { type: Number, default: 5 },
  subscriptionStatus: { type: String, default: 'inactive' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.text();
    const headersList = headers();
    const razorpaySignature = headersList.get('x-razorpay-signature');

    if (!razorpaySignature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return new Response('Invalid webhook signature', { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === 'payment.captured') {
      const { notes } = event.payload.payment.entity;
      const userId = notes.userId;

      if (!userId) {
        return new Response('User ID not found in payment notes', { status: 400 });
      }

      // Update user subscription status
      await User.findByIdAndUpdate(userId, {
        plan: 'PRO',
        subscriptionStatus: 'active',
        credits: 999999 // Effectively unlimited for PRO users
      });
    }

    return new Response('OK');
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return new Response('Webhook error', { status: 500 });
  }
} 