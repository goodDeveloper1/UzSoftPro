import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET single testimonial
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testimonial = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(params.id);
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// PUT update testimonial
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, username, body: testimonialBody, img } = body;

    if (!name || !username || !testimonialBody) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const result = db
      .prepare('UPDATE testimonials SET name = ?, username = ?, body = ?, img = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(name, username, testimonialBody, img || null, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE testimonial
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = db.prepare('DELETE FROM testimonials WHERE id = ?').run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 });
  }
}

