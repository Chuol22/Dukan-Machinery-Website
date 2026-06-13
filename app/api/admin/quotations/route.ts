import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function verifyAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('dkm_admin_session');
  
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  
  try {
    const decodedData = Buffer.from(sessionCookie.value, 'base64').toString('utf8');
    const session = JSON.parse(decodedData);
    return session;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quotations = await prisma.quotation.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return NextResponse.json({ quotations });
  } catch (error) {
    console.error('Quotations GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      order_id,
      customer_name,
      customer_email,
      customer_phone,
      machine_id,
      machine_name,
      quantity,
      requirements,
      machine_cost,
      shipping_cost,
      installation_cost,
    } = body;

    const total_cost = machine_cost + (shipping_cost || 0) + (installation_cost || 0);
    const quotation_number = `QT-${Date.now().toString().slice(-6)}`;

    const quotation = await prisma.quotation.create({
      data: {
        quotation_number,
        order_id,
        customer_name,
        customer_email,
        customer_phone,
        machine_id,
        machine_name,
        quantity,
        requirements,
        machine_cost,
        shipping_cost: shipping_cost || 0,
        installation_cost: installation_cost || 0,
        total_cost,
        status: 'draft',
      },
    });

    return NextResponse.json({ quotation }, { status: 201 });
  } catch (error) {
    console.error('Quotations POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
