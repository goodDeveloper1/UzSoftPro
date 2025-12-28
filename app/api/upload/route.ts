import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';

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

    // Determine R2 folder path
    let folderPath = '';
    if (type === 'video') {
      folderPath = 'videos';
    } else if (type === 'team') {
      folderPath = 'images/team';
    } else if (type === 'testimonial') {
      folderPath = 'images/testimonials';
    } else {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const r2Key = `${folderPath}/${filename}`;

    // Convert file to buffer and upload to R2
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const publicUrl = await uploadToR2(r2Key, buffer, file.type);

    return NextResponse.json({ success: true, url: publicUrl, filename, key: r2Key });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
  }
}

