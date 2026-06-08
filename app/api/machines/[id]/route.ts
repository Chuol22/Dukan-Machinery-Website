// machines/[id]/route.ts — admin PUT update and DELETE machine by ID
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

const normalizeStringArray = (v: unknown) => {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string')
    return v
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  return [];
};

const parsePrice = (raw: unknown): number => {
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();

    // Don't allow slug changes to keep URLs stable.
    const {
      slug: _slug,
      id: _id,
      ...rest
    } = payload ?? {};

    const updateData: Record<string, unknown> = {
      name: rest.name,
      image: rest.image,
      gallery: normalizeStringArray(rest.gallery),
      features: normalizeStringArray(rest.features),
      applications: normalizeStringArray(rest.applications),
      is_available: rest.available ?? true,
      description: rest.description || undefined,
      type: rest.type || undefined,
      input: rest.input || undefined,
      output: rest.output || undefined,
      process: rest.process || undefined,
      specifications: {
        capacity: rest.capacity || '',
        power: rest.power || '',
        weight: rest.weight || '',
        dimensions: rest.dimensions || '',
        voltage: rest.voltage || '',
        warranty: rest.warranty || '',
      },
    };

    if (rest.price !== undefined) {
      updateData.price = parsePrice(rest.price);
    }

    // Remove undefined keys so Prisma ignores them
    for (const key of Object.keys(updateData)) {
      if (updateData[key] === undefined) delete updateData[key];
    }

    const machine = await prisma.machine.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    const result = {
      id: machine.id,
      slug: machine.slug,
      name: machine.name,
      image: machine.image || '',
      gallery: machine.gallery || [],
      category: machine.category?.name || machine.type || '',
      type: machine.type,
      capacity: (machine.specifications as Record<string, string> | null)?.capacity || '',
      power: (machine.specifications as Record<string, string> | null)?.power || '',
      weight: (machine.specifications as Record<string, string> | null)?.weight || '',
      dimensions: (machine.specifications as Record<string, string> | null)?.dimensions || '',
      voltage: (machine.specifications as Record<string, string> | null)?.voltage || '',
      warranty: (machine.specifications as Record<string, string> | null)?.warranty || '',
      description: machine.description || '',
      features: machine.features || [],
      applications: machine.applications || [],
      price: machine.price > 0 ? `ETB ${machine.price.toLocaleString()}` : 'Call for price',
      available: machine.is_available,
      input: machine.input || '',
      output: machine.output || '',
      process: machine.process || '',
    };

    return NextResponse.json({ machine: result });
  } catch (error) {
    console.error('Machines PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.machine.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Machines DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
