import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// POST cleanup videos older than 24 hours
export async function POST() {
  try {
    // Delete videos created more than 24 hours ago
    const result = db.prepare(`
      DELETE FROM videos 
      WHERE datetime(created_at) < datetime('now', '-24 hours')
    `).run();

    // Also delete associated comments
    db.prepare(`
      DELETE FROM video_comments 
      WHERE video_id NOT IN (SELECT id FROM videos)
    `).run();

    return NextResponse.json({ 
      success: true, 
      deleted: result.changes 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to cleanup videos' }, { status: 500 });
  }
}

