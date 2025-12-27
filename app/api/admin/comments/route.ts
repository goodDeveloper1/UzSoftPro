import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all comments (for admin)
export async function GET() {
  try {
    const comments = db.prepare(`
      SELECT 
        vc.*,
        v.title as video_title,
        v.thumbnail as video_thumbnail
      FROM video_comments vc
      LEFT JOIN videos v ON vc.video_id = v.id
      ORDER BY vc.created_at DESC
    `).all();
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// PUT approve/delete comment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body; // action: 'approve' or 'delete'

    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'ID and action required' }, { status: 400 });
    }

    if (action === 'approve') {
      const result = db.prepare('UPDATE video_comments SET is_approved = 1 WHERE id = ?').run(id);
      if (result.changes === 0) {
        return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
      }
    } else if (action === 'delete') {
      const result = db.prepare('DELETE FROM video_comments WHERE id = ?').run(id);
      if (result.changes === 0) {
        return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update comment' }, { status: 500 });
  }
}

