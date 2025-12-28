import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { AdminUser } from '@/lib/entities/AdminUser';

// POST login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    const dataSource = await getDataSource();
    const adminRepo = dataSource.getRepository(AdminUser);
    const user = await adminRepo.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // In production, use JWT tokens or sessions
    return NextResponse.json({ success: true, data: { email: user.email, id: user.id } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to login' }, { status: 500 });
  }
}

