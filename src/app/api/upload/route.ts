import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    const email = session.user.email;

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const socialHandle = formData.get('socialHandle') as string;
    const files = formData.getAll('images') as File[];

    if (!name || !socialHandle || files.length === 0) {
      return NextResponse.json(
        { error: 'Name, social handle, and at least one image are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Use different upload directory based on environment
    const uploadDir =
      process.env.VERCEL === 'true' ? '/tmp/uploads' : join(process.cwd(), 'public', 'uploads');

    try {
      // Create the directory if it doesn't exist
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.log('Error creating directory:', err);
    }

    const imagePaths: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeFilename = basename(file.name).replace(/[^a-z0-9\.-]/gi, '_');
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${safeFilename}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imagePaths.push(`/uploads/${filename}`); // This may need further adjustment based on your front-end
    }

    const existingUser = await User.findOne({ email, name });

    if (existingUser) {
      existingUser.images.push(...imagePaths);
      await existingUser.save();

      return NextResponse.json({
        success: true,
        message: 'Images appended to existing user.',
        user: existingUser,
      });
    } else {
      const newUser = await User.create({
        name,
        email,
        socialHandle,
        images: imagePaths,
      });

      return NextResponse.json({
        success: true,
        message: 'New user created.',
        user: newUser,
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload. Please try again.' },
      { status: 500 }
    );
  }
}
