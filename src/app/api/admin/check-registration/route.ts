// import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb'; // Adjust path as needed
import Admin from '../../../models/Admin'; // Ensure Admin model exists and is imported
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    if (!email) {
      console.log("email is required");
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Error checking admin registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
