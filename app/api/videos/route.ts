import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all videos
export async function GET() {
  try {
    const videos = db.prepare('SELECT * FROM videos WHERE is_active = 1 ORDER BY created_at DESC').all();
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

    const result = db
      .prepare('INSERT INTO videos (title, description, video_url, thumbnail, category, duration) VALUES (?, ?, ?, ?, ?, ?)')
      .run(title, description || null, video_url, thumbnail || null, category || 'Ish jarayonlari', duration || null);

    return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create video' }, { status: 500 });
  }
}

