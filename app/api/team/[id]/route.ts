import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET single team member
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const member = db.prepare('SELECT * FROM team WHERE id = ?').get(params.id);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }
    const memberWithParsedSkills = {
      ...member,
      skills: typeof (member as any).skills === 'string' ? JSON.parse((member as any).skills) : (member as any).skills,
    };
    return NextResponse.json({ success: true, data: memberWithParsedSkills });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch team member' }, { status: 500 });
  }
}

// PUT update team member
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, position, bio, image, skills, linkedin, github, email } = body;

    if (!name || !position || !bio) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;

    const result = db
      .prepare('UPDATE team SET name = ?, position = ?, bio = ?, image = ?, skills = ?, linkedin = ?, github = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(name, position, bio, image || null, skillsJson, linkedin || null, github || null, email || null, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update team member' }, { status: 500 });
  }
}

// DELETE team member
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = db.prepare('DELETE FROM team WHERE id = ?').run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
  }
}

