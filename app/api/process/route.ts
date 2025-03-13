import { NextRequest, NextResponse } from 'next/server';

async function handler(request: NextRequest, res: NextResponse) {
  if (request.method === 'POST') {
    try {
      const { inputString, type } = await request.json();

      console.log(inputString, type);

      if (inputString) {
        return new NextResponse(
          JSON.stringify({ message: `${type} processed successfully!` }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        return new NextResponse(
          JSON.stringify({ message: 'Please provide a valid input string' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return new NextResponse(
        JSON.stringify({ message: 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else {
    return new NextResponse(JSON.stringify({ message: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export { handler as GET, handler as POST };
