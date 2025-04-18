import { NextRequest, NextResponse } from 'next/server';
import { apiUrl } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    // Get parameters from query
    const endpoint = request.nextUrl.searchParams.get('endpoint');
    
    // Get auth token
    const token = request.headers.get('x-auth-token') || 
                   request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!endpoint) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing endpoint parameter',
        token: token ? 'present' : 'missing'
      });
    }
    
    // Set up request headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['x-auth-token'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make request to backend
    const backendUrl = `${apiUrl}${endpoint}`;
    console.log(`Debug API: Calling ${backendUrl}`);
    console.log(`Debug API: Token present: ${!!token}`);
    
    const response = await fetch(backendUrl, {
      headers,
      cache: 'no-store'
    });
    
    console.log(`Debug API: Response status: ${response.status}`);
    
    let responseData;
    try {
      responseData = await response.json();
      console.log(`Debug API: Response parsed as JSON`);
    } catch (err) {
      console.log(`Debug API: Response is not JSON, using text`);
      responseData = await response.text();
    }
    
    console.log(`Debug API: Response data type: ${typeof responseData}`);
    
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries())
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'An error occurred',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 