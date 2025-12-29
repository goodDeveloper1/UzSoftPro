import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Team } from '@/lib/entities/Team';

// GET all team members
export async function GET() {
  try {
    const dataSource = await getDataSource();
    const teamRepo = dataSource.getRepository(Team);
    const team = await teamRepo.find({ order: { createdAt: 'DESC' } });
    
    // Parse skills JSON string
    const teamWithParsedSkills = team.map((member) => ({
      ...member,
      skills: typeof member.skills === 'string' ? JSON.parse(member.skills) : member.skills,
    }));
    return NextResponse.json({ success: true, data: teamWithParsedSkills });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch team members' }, { status: 500 });
  }
}

// POST create new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, bio, image, skills, linkedin, github, email } = body;

    if (!name || !position || !bio) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;

    const dataSource = await getDataSource();
    const teamRepo = dataSource.getRepository(Team);
    
    const member = teamRepo.create({
      name,
      position,
      bio,
      image: image || undefined,
      skills: skillsJson,
      linkedin: linkedin || undefined,
      github: github || undefined,
      email: email || undefined,
    });
    
    const result = await teamRepo.save(member);
    return NextResponse.json({ success: true, data: { id: result.id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create team member' }, { status: 500 });
  }
}

