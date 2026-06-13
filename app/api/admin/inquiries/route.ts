// admin/inquiries/route.ts — admin GET all inquiries
import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inquiries = await prisma.machineInquiry.findMany({
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        customer_name: true,
        email: true,
        phone: true,
        machine_name: true,
        message: true,
        status: true,
        created_at: true,
      },
    });

    return NextResponse.json({ inquiries: inquiries || [] });
  } catch (error) {
    console.error('Admin inquiries API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : undefined,
        },
      },
      { status: 500 }
    );
  }
}
