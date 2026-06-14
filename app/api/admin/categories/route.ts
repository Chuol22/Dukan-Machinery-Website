import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  { name: "Feed Machines", slug: "feed-machines" },
  { name: "Pellet Machines", slug: "pellet-machines" },
  { name: "Hammer Mills", slug: "hammer-mills" },
  { name: "Mixers", slug: "mixers" },
  { name: "Fertilizer Equipment", slug: "fertilizer-equipment" },
  { name: "Spare Parts", slug: "spare-parts" },
];

async function ensureDefaultCategories() {
  const existing = await prisma.category.count();
  if (existing > 0) return;

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((category) => ({
      slug: category.slug,
      name: category.name,
      is_active: true,
    })),
  });
}

export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureDefaultCategories();

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        image: true,
        parent_id: true,
        display_order: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: [{ display_order: "asc" }, { created_at: "asc" }],
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Admin categories GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body?.name || "").trim();
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    const slug = String(body?.slug || name)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: body?.description ? String(body.description) : null,
        is_active: body?.is_active !== false,
        display_order: Number(body?.display_order ?? 0),
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Admin categories POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
