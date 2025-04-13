import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get token from headers or cookies
    const authHeader = request.headers.get('x-auth-token');
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!authHeader && !userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Call backend API to get user profile
    const backendUrl = `http://127.0.0.1:5000/api/user/profile${userId ? `?userId=${userId}` : ''}`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': authHeader || ''
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Backend error:', await response.text());
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: response.status }
      );
    }
    
    const userData = await response.json();
    return NextResponse.json(userData);
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 