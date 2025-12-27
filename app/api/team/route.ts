import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all team members
export async function GET() {
  try {
    const team = db.prepare('SELECT * FROM team ORDER BY created_at DESC').all();
    // Parse skills JSON string
    const teamWithParsedSkills = team.map((member: any) => ({
      ...member,
      skills: typeof member.skills === 'string' ? JSON.parse(member.skills) : member.skills,
    }));
    return NextResponse.json({ success: true, data: teamWithParsedSkills });
  } catch (error) {
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

    const result = db
      .prepare('INSERT INTO team (name, position, bio, image, skills, linkedin, github, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(name, position, bio, image || null, skillsJson, linkedin || null, github || null, email || null);

    return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create team member' }, { status: 500 });
  }
}

