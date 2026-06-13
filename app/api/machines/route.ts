// machines/route.ts — public GET all machines; admin POST to create
import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.machine.findMany({
      include: { category: true },
      orderBy: { created_at: 'asc' },
    });

    // Map to the shape the frontend MachinesClient expects
    const machines = data.map((m) => ({
      id: m.id,
      slug: m.slug,
      name: m.name,
      image: m.image || '',
      gallery: m.gallery || [],
      category: m.category?.name || m.type || '',
      type: m.type,
      capacity: (m.specifications as Record<string, string> | null)?.capacity || '',
      power: (m.specifications as Record<string, string> | null)?.power || '',
      weight: (m.specifications as Record<string, string> | null)?.weight || '',
      dimensions: (m.specifications as Record<string, string> | null)?.dimensions || '',
      voltage: (m.specifications as Record<string, string> | null)?.voltage || '',
      warranty: (m.specifications as Record<string, string> | null)?.warranty || '',
      description: m.description || '',
      features: m.features || [],
      applications: m.applications || [],
      price: m.price > 0 ? `ETB ${m.price.toLocaleString()}` : 'Call for price',
      available: m.is_available,
      availability_status: m.availability_status || (m.is_available ? 'available' : 'out_of_stock'),
      inventory_status: m.inventory_status || 'available',
      motor_type: (m.specifications as Record<string, string> | null)?.motor_type || '',
      input: m.input || '',
      output: m.output || '',
      process: m.process || '',
    }));

    return NextResponse.json({ machines });
  } catch (error) {
    console.error('Machines GET error:', error);
    return NextResponse.json({ error: 'Internal server error', machines: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();

    const normalizeStringArray = (v: unknown) => {
      if (Array.isArray(v)) return v.map(String);
      if (typeof v === 'string')
        return v
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
      return [];
    };

    const {
      name,
      slug,
      image,
      gallery,
      category,
      type,
      capacity,
      power,
      weight,
      dimensions,
      voltage,
      warranty,
      description,
      features,
      applications,
      price,
      available,
      availability_status,
      motor_type,
      input,
      output,
      process: processField,
    } = payload;

    // Parse price – strip currency prefix / commas, fallback to 0
    const parsePrice = (raw: unknown): number => {
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string') {
        const cleaned = raw.replace(/[^0-9.]/g, '');
        const n = parseFloat(cleaned);
        return Number.isNaN(n) ? 0 : n;
      }
      return 0;
    };

    // Find or create category
    const categorySlug = (category || type || 'general')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    let categoryRecord = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          slug: categorySlug,
          name: category || type || 'General',
        },
      });
    }

    const machineSlug =
      slug ||
      (name || '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const sku = `SKU-${Date.now()}`;

    const machine = await prisma.machine.create({
      data: {
        slug: machineSlug,
        sku,
        name: name || 'Unnamed Machine',
        image: image || '/images/machines/Custom Industrial Machines.jpg',
        gallery: normalizeStringArray(gallery),
        category_id: categoryRecord.id,
        type: type || 'standard',
        specifications: {
          capacity: capacity || '',
          power: power || '',
          weight: weight || '',
          dimensions: dimensions || '',
          voltage: voltage || '',
          warranty: warranty || '',
          motor_type: motor_type || '',
        },
        description: description || '',
        features: normalizeStringArray(features),
        applications: normalizeStringArray(applications),
        price: parsePrice(price),
        is_available: available ?? true,
        availability_status: availability_status || (available === false ? 'out_of_stock' : 'available'),
        input: input || '',
        output: output || '',
        process: processField || '',
        status: 'published',
      },
    });

    // Return in the same shape GET uses
    const result = {
      id: machine.id,
      slug: machine.slug,
      name: machine.name,
      image: machine.image || '',
      gallery: machine.gallery || [],
      category: categoryRecord.name,
      type: machine.type,
      capacity: capacity || '',
      power: power || '',
      weight: weight || '',
      dimensions: dimensions || '',
      voltage: voltage || '',
      warranty: warranty || '',
      description: machine.description || '',
      features: machine.features || [],
      applications: machine.applications || [],
      price: machine.price > 0 ? `ETB ${machine.price.toLocaleString()}` : 'Call for price',
      available: machine.is_available,
      availability_status: machine.availability_status || (machine.is_available ? 'available' : 'out_of_stock'),
      motor_type: (machine.specifications as Record<string, string> | null)?.motor_type || '',
      input: machine.input || '',
      output: machine.output || '',
      process: machine.process || '',
    };

    return NextResponse.json({ machine: result }, { status: 201 });
  } catch (error) {
    console.error('Machines POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
