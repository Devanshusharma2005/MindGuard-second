import { NextResponse } from 'next/server';
import { Reward } from '@/models/Reward';

export async function POST(request: Request) {
  try {
    const { challengeId, points, description } = await request.json();
    const userId = 'default-user'; // Replace with actual user ID when auth is implemented

    let userRewards = await Reward.findOne({ userId });
    if (!userRewards) {
      userRewards = new Reward({ 
        userId,
        totalPoints: 0,
        earnedPoints: [],
        badges: [],
        redeemedRewards: []
      });
    }

    // Add new points
    userRewards.earnedPoints.push({
      amount: points,
      source: 'wellness-challenge',
      description,
      earnedAt: new Date()
    });

    // Update total points
    userRewards.totalPoints += points;

    await userRewards.save();
    return NextResponse.json({ success: true, data: userRewards });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add points' },
      { status: 500 }
    );
  }
} 