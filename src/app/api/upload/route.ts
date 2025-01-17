// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const socialHandle = formData.get('socialHandle') as string;
    const files = formData.getAll('images') as File[];

    await connectDB();

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory might already exist, ignore error
    }

    const imagePaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename to avoid conflicts
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const filename = `${uniqueSuffix}-${file.name}`;
      const filepath = join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      imagePaths.push(`/uploads/${filename}`);
    }

    const user = await User.create({
      name,
      socialHandle,
      images: imagePaths,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload' },
      { status: 500 }
    );
  }
}