import { NextRequest, NextResponse } from 'next/server';
export async function middleware(request: NextRequest) {
  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      const inputString = formData.get('inputString')?.toString();
      const type = formData.get('type')?.toString();
      const firstName = formData.get('firstName')?.toString();

      if (!inputString || !type || !firstName) {
        return new NextResponse(
          JSON.stringify({
            message: 'Missing required fields: inputString, type, or firstName',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error('Error processing form data:', error);
      return new NextResponse(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  return NextResponse.next();
}
