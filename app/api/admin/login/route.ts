import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// POST login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email) as any;

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // In production, use JWT tokens or sessions
    return NextResponse.json({ success: true, data: { email: user.email, id: user.id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to login' }, { status: 500 });
  }
}

