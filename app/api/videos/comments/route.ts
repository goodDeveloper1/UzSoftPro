import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { VideoComment } from '@/lib/entities/VideoComment';

// GET comments for a video
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('video_id');

    if (!videoId) {
      return NextResponse.json({ success: false, error: 'Video ID required' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const commentRepo = dataSource.getRepository(VideoComment);
    
    // Get approved comments only
    const comments = await commentRepo.find({
      where: { 
        videoId: parseInt(videoId),
        isApproved: 1 
      },
      order: { createdAt: 'DESC' }
    });
    
    return NextResponse.json({ success: true, data: comments });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { video_id, comment, author_name } = body;

    if (!video_id || !comment) {
      return NextResponse.json({ success: false, error: 'Video ID and comment required' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const commentRepo = dataSource.getRepository(VideoComment);
    
    // Insert comment (not approved by default, admin will approve)
    const newComment = commentRepo.create({
      videoId: video_id,
      comment,
      authorName: author_name || 'Anonim',
    });
    
    const result = await commentRepo.save(newComment);
    return NextResponse.json({ success: true, data: { id: result.id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
  }
}

