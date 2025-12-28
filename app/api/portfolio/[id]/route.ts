import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Portfolio } from '@/lib/entities/Portfolio';

// GET single portfolio project
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const dataSource = await getDataSource();
    const portfolioRepo = dataSource.getRepository(Portfolio);
    const project = await portfolioRepo.findOne({ where: { id: parseInt(id) } });
    
    if (!project) {
      return NextResponse.json({ success: false, error: 'Portfolio project not found' }, { status: 404 });
    }
    
    const projectWithParsedTech = {
      ...project,
      technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
    };
    return NextResponse.json({ success: true, data: projectWithParsedTech });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio project' }, { status: 500 });
  }
}

// PUT update portfolio project
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { title, description, image, category, technologies, client, duration, teamSize, status, liveUrl, githubUrl } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const technologiesJson = Array.isArray(technologies) ? JSON.stringify(technologies) : technologies;

    const dataSource = await getDataSource();
    const portfolioRepo = dataSource.getRepository(Portfolio);
    
    const project = await portfolioRepo.findOne({ where: { id: parseInt(id) } });
    if (!project) {
      return NextResponse.json({ success: false, error: 'Portfolio project not found' }, { status: 404 });
    }

    project.title = title;
    project.description = description;
    project.image = image || undefined;
    project.category = category;
    project.technologies = technologiesJson;
    project.client = client || undefined;
    project.duration = duration || undefined;
    project.teamSize = teamSize || undefined;
    project.status = status || 'Yakunlangan';
    project.liveUrl = liveUrl || undefined;
    project.githubUrl = githubUrl || undefined;
    
    await portfolioRepo.save(project);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update portfolio project' }, { status: 500 });
  }
}

// DELETE portfolio project
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const dataSource = await getDataSource();
    const portfolioRepo = dataSource.getRepository(Portfolio);
    
    const project = await portfolioRepo.findOne({ where: { id: parseInt(id) } });
    if (!project) {
      return NextResponse.json({ success: false, error: 'Portfolio project not found' }, { status: 404 });
    }

    await portfolioRepo.remove(project);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete portfolio project' }, { status: 500 });
  }
}

