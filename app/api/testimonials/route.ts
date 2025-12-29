import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Testimonial } from '@/lib/entities/Testimonial';

// GET all testimonials
export async function GET() {
  try {
    const dataSource = await getDataSource();
    const testimonialRepo = dataSource.getRepository(Testimonial);
    const testimonials = await testimonialRepo.find({ order: { createdAt: 'DESC' } });
    return NextResponse.json({ success: true, data: testimonials });
  } catch {
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

    const dataSource = await getDataSource();
    const testimonialRepo = dataSource.getRepository(Testimonial);
    
    const testimonial = testimonialRepo.create({
      name,
      username,
      body: testimonialBody,
      img: img || undefined,
    });
    
    const result = await testimonialRepo.save(testimonial);
    return NextResponse.json({ success: true, data: { id: result.id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create testimonial' }, { status: 500 });
  }
}

