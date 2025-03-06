import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Memory } from '@/models/Memory';

// Connect to MongoDB
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/memories");
    }
  } catch (error) {
    throw error;
  }
}

export async function GET() {
  try {
    await connectDB();
    const memories = await Memory.find().sort({ date: -1 });
    return NextResponse.json({ success: true, data: memories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch memories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    if (!body.date || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Date and content are required' },
        { status: 400 }
      );
    }

    const memory = new Memory({
      date: body.date,
      content: body.content,
      userId: 'default-user' // Temporary until auth is set up
    });

    const savedMemory = await memory.save();
    return NextResponse.json({ success: true, data: savedMemory });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save memory' },
      { status: 500 }
    );
  }
} 