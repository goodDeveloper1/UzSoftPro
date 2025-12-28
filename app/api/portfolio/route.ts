import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Portfolio } from '@/lib/entities/Portfolio';

// GET all portfolio projects
export async function GET() {
  try {
    const dataSource = await getDataSource();
    const portfolioRepo = dataSource.getRepository(Portfolio);
    const projects = await portfolioRepo.find({ order: { createdAt: 'DESC' } });
    
    // Parse technologies JSON string
    const projectsWithParsedTech = projects.map((project) => ({
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

    const dataSource = await getDataSource();
    const portfolioRepo = dataSource.getRepository(Portfolio);
    
    const project = portfolioRepo.create({
      title,
      description,
      image: image || undefined,
      category,
      technologies: technologiesJson,
      client: client || undefined,
      duration: duration || undefined,
      teamSize: teamSize || undefined,
      status: status || 'Yakunlangan',
      liveUrl: liveUrl || undefined,
      githubUrl: githubUrl || undefined,
    });
    
    const result = await portfolioRepo.save(project);
    return NextResponse.json({ success: true, data: { id: result.id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create portfolio project' }, { status: 500 });
  }
}

