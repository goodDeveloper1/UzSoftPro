import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Team } from '@/lib/entities/Team';
import { deleteFromR2, extractR2Key } from '@/lib/r2';

// GET single team member
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const dataSource = await getDataSource();
    const teamRepo = dataSource.getRepository(Team);
    const member = await teamRepo.findOne({ where: { id: parseInt(id) } });
    
    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    
    const memberWithParsedSkills = {
      ...member,
      skills: typeof member.skills === 'string' ? JSON.parse(member.skills) : member.skills,
    };
    return NextResponse.json({ success: true, data: memberWithParsedSkills });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch team member' }, { status: 500 });
  }
}

// PUT update team member
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { name, position, bio, image, skills, linkedin, github, email } = body;

    if (!name || !position || !bio) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;

    const dataSource = await getDataSource();
    const teamRepo = dataSource.getRepository(Team);
    
    const member = await teamRepo.findOne({ where: { id: parseInt(id) } });
    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    member.name = name;
    member.position = position;
    member.bio = bio;
    member.image = image || undefined;
    member.skills = skillsJson;
    member.linkedin = linkedin || undefined;
    member.github = github || undefined;
    member.email = email || undefined;
    
    await teamRepo.save(member);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update team member' }, { status: 500 });
  }
}

// DELETE team member
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const dataSource = await getDataSource();
    const teamRepo = dataSource.getRepository(Team);
    
    // Get team member data to extract image URL
    const member = await teamRepo.findOne({ where: { id: parseInt(id) } });
    
    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    // Delete from database
    await teamRepo.remove(member);

    // Delete image from R2 (async, don't wait for it)
    if (member.image) {
      deleteFromR2(extractR2Key(member.image)).catch(err => 
        console.error('Failed to delete team member image from R2:', err)
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
  }
}

