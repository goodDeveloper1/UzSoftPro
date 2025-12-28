import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET comments for a video
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('video_id');

    if (!videoId) {
      return NextResponse.json({ success: false, error: 'Video ID required' }, { status: 400 });
    }

    // Get approved comments only
    const comments = db.prepare('SELECT * FROM video_comments WHERE video_id = ? AND is_approved = 1 ORDER BY created_at DESC').all(videoId);
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
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

    // Insert comment (not approved by default, admin will approve)
    const result = db
      .prepare('INSERT INTO video_comments (video_id, comment, author_name) VALUES (?, ?, ?)')
      .run(video_id, comment, author_name || 'Anonim');

    return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
  }
}

