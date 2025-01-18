import connectDB from '../../../lib/mongodb';
import Admin from '../../../models/Admin';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { email, secretKey } = body;

    if (!email || !secretKey) {
      return NextResponse.json({ error: 'Email and secret key are required' }, { status: 400 });
    }

    const validSecretKey = process.env.ADMIN_SECRET_KEY; 
    if (secretKey !== validSecretKey) {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      
      return NextResponse.json({ message: 'Admin exists' });
    }

    const newAdmin = await Admin.create({ email });

    return NextResponse.json({ message: 'Admin registration successful', admin: newAdmin });
  } catch (error) {
    console.log('Error registering admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
