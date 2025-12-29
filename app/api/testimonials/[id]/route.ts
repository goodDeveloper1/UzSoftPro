import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Testimonial } from '@/lib/entities/Testimonial';
import { deleteFromR2, extractR2Key } from '@/lib/r2';

// GET single testimonial
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const dataSource = await getDataSource();
    const testimonialRepo = dataSource.getRepository(Testimonial);
    const testimonial = await testimonialRepo.findOne({ where: { id: parseInt(id) } });
    
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: testimonial });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// PUT update testimonial
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { name, username, body: testimonialBody, img } = body;

    if (!name || !username || !testimonialBody) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const testimonialRepo = dataSource.getRepository(Testimonial);
    
    const testimonial = await testimonialRepo.findOne({ where: { id: parseInt(id) } });
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    testimonial.name = name;
    testimonial.username = username;
    testimonial.body = testimonialBody;
    testimonial.img = img || undefined;
    
    await testimonialRepo.save(testimonial);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE testimonial
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const dataSource = await getDataSource();
    const testimonialRepo = dataSource.getRepository(Testimonial);
    
    // Get testimonial data to extract image URL
    const testimonial = await testimonialRepo.findOne({ where: { id: parseInt(id) } });
    
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    // Delete from database
    await testimonialRepo.remove(testimonial);

    // Delete image from R2 (async, don't wait for it)
    if (testimonial.img) {
      deleteFromR2(extractR2Key(testimonial.img)).catch(err => 
        console.error('Failed to delete testimonial image from R2:', err)
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 });
  }
}

