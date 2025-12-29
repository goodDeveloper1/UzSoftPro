import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Video } from '@/lib/entities/Video';

// GET all videos (including inactive) for admin
export async function GET() {
  try {
    const dataSource = await getDataSource();
    const videoRepo = dataSource.getRepository(Video);
    const videos = await videoRepo.find({ order: { createdAt: 'DESC' } });
    return NextResponse.json({ success: true, data: videos });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 });
  }
}

