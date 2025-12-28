import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Video } from '@/lib/entities/Video';

// GET all videos
export async function GET() {
  try {
    const dataSource = await getDataSource();
    const videoRepo = dataSource.getRepository(Video);
    const videos = await videoRepo.find({ 
      where: { isActive: 1 },
      order: { createdAt: 'DESC' } 
    });
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 });
  }
}

// POST create new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, video_url, thumbnail, category, duration } = body;

    if (!title || !video_url) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const videoRepo = dataSource.getRepository(Video);
    
    const video = videoRepo.create({
      title,
      description: description || undefined,
      videoUrl: video_url,
      thumbnail: thumbnail || undefined,
      category: category || 'Ish jarayonlari',
      duration: duration || undefined,
    });
    
    const result = await videoRepo.save(video);
    return NextResponse.json({ success: true, data: { id: result.id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create video' }, { status: 500 });
  }
}

