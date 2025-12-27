import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all videos (including inactive) for admin
export async function GET() {
  try {
    const videos = db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 });
  }
}

