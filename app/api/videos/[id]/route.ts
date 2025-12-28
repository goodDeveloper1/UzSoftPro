import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Video } from '@/lib/entities/Video';
import { deleteFromR2, extractR2Key } from '@/lib/r2';

// GET single video
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const dataSource = await getDataSource();
    const videoRepo = dataSource.getRepository(Video);
    const video = await videoRepo.findOne({ where: { id: parseInt(id) } });
    
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    
    // Increment views
    video.views += 1;
    await videoRepo.save(video);
    
    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch video' }, { status: 500 });
  }
}

// PUT update video
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { title, description, video_url, thumbnail, category, duration, is_active } = body;

    if (!title || !video_url) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const videoRepo = dataSource.getRepository(Video);
    
    const video = await videoRepo.findOne({ where: { id: parseInt(id) } });
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    video.title = title;
    video.description = description || undefined;
    video.videoUrl = video_url;
    video.thumbnail = thumbnail || undefined;
    video.category = category || 'Ish jarayonlari';
    video.duration = duration || undefined;
    video.isActive = is_active !== undefined ? is_active : 1;
    
    await videoRepo.save(video);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE video
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const dataSource = await getDataSource();
    const videoRepo = dataSource.getRepository(Video);
    
    // Get video data to extract file URL
    const video = await videoRepo.findOne({ where: { id: parseInt(id) } });
    
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    // Delete from database
    await videoRepo.remove(video);

    // Delete files from R2 (async, don't wait for it)
    if (video.videoUrl) {
      deleteFromR2(extractR2Key(video.videoUrl)).catch(err => 
        console.error('Failed to delete video from R2:', err)
      );
    }
    if (video.thumbnail) {
      deleteFromR2(extractR2Key(video.thumbnail)).catch(err => 
        console.error('Failed to delete thumbnail from R2:', err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete video' }, { status: 500 });
  }
}

