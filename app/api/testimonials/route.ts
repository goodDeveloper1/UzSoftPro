import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all testimonials
export async function GET() {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, body: testimonialBody, img } = body;

    if (!name || !username || !testimonialBody) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const result = db
      .prepare('INSERT INTO testimonials (name, username, body, img) VALUES (?, ?, ?, ?)')
      .run(name, username, testimonialBody, img || null);

    return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create testimonial' }, { status: 500 });
  }
}

