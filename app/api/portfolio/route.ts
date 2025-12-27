import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all portfolio projects
export async function GET() {
  try {
    const projects = db.prepare('SELECT * FROM portfolio ORDER BY created_at DESC').all();
    // Parse technologies JSON string
    const projectsWithParsedTech = projects.map((project: any) => ({
      ...project,
      technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
    }));
    return NextResponse.json({ success: true, data: projectsWithParsedTech });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio projects' }, { status: 500 });
  }
}

// POST create new portfolio project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, category, technologies, client, duration, teamSize, status, liveUrl, githubUrl } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const technologiesJson = Array.isArray(technologies) ? JSON.stringify(technologies) : technologies;

    const result = db
      .prepare('INSERT INTO portfolio (title, description, image, category, technologies, client, duration, teamSize, status, liveUrl, githubUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
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
        githubUrl || null
      );

    return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create portfolio project' }, { status: 500 });
  }
}

