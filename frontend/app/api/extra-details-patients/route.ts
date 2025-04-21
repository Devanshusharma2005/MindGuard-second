import { NextRequest, NextResponse } from 'next/server';

// Environment variables or constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    console.log('[API Route] Authorization header:', authHeader?.substring(0, 20) + '...');
    
    if (!authHeader) {
      console.log('[API Route] No authorization header provided');
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Log request details for debugging
    console.log('[API Route] Forwarding request to backend:', `${API_URL}/api/extra-details-patients`);

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/extra-details-patients`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    console.log('[API Route] Backend responded with status:', response.status);

    // Get the response data
    const data = await response.json();
    console.log('[API Route] Response data sample:', Array.isArray(data) ? `${data.length} items` : 'Not an array');

    // Return the data with the appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API Route] Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header and body from the incoming request
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/extra-details-patients`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await response.json();

    // Return the data with the appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
} 