import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - ترقية مستخدم إلى مدير
export async function POST(req: Request) {
  try {
    console.log('Promoting user to admin: Starting...');
    
    const session = await getServerSession(authOptions);
    console.log('Auth session:', session ? 'Found' : 'Not found');
    
    if (!session?.user) {
      console.log('Auth error: No session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, secretKey } = body;

    // التحقق من المفتاح السري
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      console.log('Invalid secret key');
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    // تحديث دور المستخدم
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });

    console.log('User promoted to admin successfully:', user.email);
    return NextResponse.json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    console.error('Error in POST /api/auth/promote-admin:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 