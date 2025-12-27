import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'video', 'team', 'testimonial'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    
    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid video format. Only MP4, WebM, and QuickTime are allowed.' }, { status: 400 });
    }
    
    if ((type === 'team' || type === 'testimonial') && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed.' }, { status: 400 });
    }

    // Determine upload directory
    let uploadDir = '';
    if (type === 'video') {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
    } else if (type === 'team') {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'images', 'team');
    } else if (type === 'testimonial') {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'images', 'testimonials');
    } else {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the public URL
    let publicUrl = '';
    if (type === 'video') {
      publicUrl = `/uploads/videos/${filename}`;
    } else if (type === 'team') {
      publicUrl = `/uploads/images/team/${filename}`;
    } else if (type === 'testimonial') {
      publicUrl = `/uploads/images/testimonials/${filename}`;
    }

    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
  }
}

