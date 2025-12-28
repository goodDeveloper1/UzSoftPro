import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET single video
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(params.id);
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    // Increment views
    db.prepare('UPDATE videos SET views = views + 1 WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch video' }, { status: 500 });
  }
}

// PUT update video
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, video_url, thumbnail, category, duration, is_active } = body;

    if (!title || !video_url) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const result = db
      .prepare('UPDATE videos SET title = ?, description = ?, video_url = ?, thumbnail = ?, category = ?, duration = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(title, description || null, video_url, thumbnail || null, category || 'Ish jarayonlari', duration || null, is_active !== undefined ? is_active : 1, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE video
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = db.prepare('DELETE FROM videos WHERE id = ?').run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete video' }, { status: 500 });
  }
}

