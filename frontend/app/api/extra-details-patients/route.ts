import { NextRequest, NextResponse } from 'next/server';
import { apiUrl } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    // Get doctor ID from query params
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');

    if (!doctorId) {
      return NextResponse.json(
        { status: 'error', message: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    console.log("Extra-details-patients route called with doctorId:", doctorId, status ? `and status: ${status}` : '');

    // Get auth token from request headers
    const token = request.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Format token properly with Bearer prefix if it doesn't have it
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const xAuthToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    // Build the API URL with optional status filter
    let apiEndpoint = `${apiUrl}/api/extra-details-patients/doctor/${doctorId}`;
    if (status) {
      apiEndpoint += `?status=${status}`;
    }

    // Make a direct request to the backend API with cache disabled
    const response = await fetch(apiEndpoint, {
      headers: {
        'Authorization': authToken,
        'x-auth-token': xAuthToken
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { status: 'error', message: errorData.message || 'Failed to fetch patient details' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Raw data from backend:", data);

    // Return the data directly
    return NextResponse.json({
      status: 'success',
      data: data
    });
  } catch (error) {
    console.error('Error in extra-details-patients API route:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Extra-details-patients POST route called");
    
    // Parse the request body
    const body = await request.json();
    console.log("Request body:", body);
    
    // Check for required fields
    if (!body.doctorId || !body.patientName || !body.patientEmail) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get auth token from request headers
    const token = request.headers.get('authorization');
    
    // Make a direct request to the backend API
    const response = await fetch(`${apiUrl}/api/extra-details-patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token })
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    console.log("Response from backend:", data);
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: data.msg || 'Failed to create patient details',
          error: data.error
        },
        { status: response.status }
      );
    }
    
    // Return success response
    return NextResponse.json({
      status: 'success',
      message: 'Patient details created successfully',
      data: data.patientDetails
    });
  } catch (error) {
    console.error('Error in extra-details-patients POST route:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
} 