import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Reward } from '@/models/Reward';

export async function GET() {
  try {
    const userId = 'default-user'; // Replace with actual user ID when auth is implemented
    const userRewards = await Reward.findOne({ userId });
    return NextResponse.json({ success: true, data: userRewards });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();
    const userId = 'default-user'; // Replace with actual user ID when auth is implemented

    let userRewards = await Reward.findOne({ userId });

    if (type === 'INITIALIZE' && !userRewards) {
      userRewards = new Reward({
        userId,
        points: 0,
        badges: [],
        redeemedRewards: []
      });
      await userRewards.save();
      return NextResponse.json({ success: true, data: userRewards });
    }

    if (!userRewards) {
      userRewards = new Reward({ userId, points: 0, badges: [], redeemedRewards: [] });
    }

    switch (type) {
      case 'ADD_POINTS':
        userRewards.points += data.points;
        break;
      case 'ADD_BADGE':
        userRewards.badges.push({
          ...data,
          dateEarned: new Date()
        });
        break;
      case 'REDEEM_REWARD':
        if (userRewards.points >= data.pointsCost) {
          userRewards.points -= data.pointsCost;
          userRewards.redeemedRewards.push({
            ...data,
            dateRedeemed: new Date()
          });
        } else {
          throw new Error('Insufficient points');
        }
        break;
    }

    await userRewards.save();
    return NextResponse.json({ success: true, data: userRewards });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update rewards' },
      { status: 500 }
    );
  }
} 