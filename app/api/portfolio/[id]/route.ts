import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET single portfolio project
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(params.id);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Portfolio project not found' }, { status: 404 });
    }
    const projectWithParsedTech = {
      ...project,
      technologies: typeof (project as any).technologies === 'string' ? JSON.parse((project as any).technologies) : (project as any).technologies,
    };
    return NextResponse.json({ success: true, data: projectWithParsedTech });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio project' }, { status: 500 });
  }
}

// PUT update portfolio project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description, image, category, technologies, client, duration, teamSize, status, liveUrl, githubUrl } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const technologiesJson = Array.isArray(technologies) ? JSON.stringify(technologies) : technologies;

    const result = db
      .prepare('UPDATE portfolio SET title = ?, description = ?, image = ?, category = ?, technologies = ?, client = ?, duration = ?, teamSize = ?, status = ?, liveUrl = ?, githubUrl = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(
        title,
        description,
        image || null,
        category,
        technologiesJson,
        client || null,
        duration || null,
        teamSize || null,
        status || 'Yakunlangan',
        liveUrl || null,
        githubUrl || null,
        params.id
      );

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Portfolio project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update portfolio project' }, { status: 500 });
  }
}

// DELETE portfolio project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = db.prepare('DELETE FROM portfolio WHERE id = ?').run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Portfolio project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete portfolio project' }, { status: 500 });
  }
}

