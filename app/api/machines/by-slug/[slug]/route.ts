// machines/by-slug/[slug]/route.ts — fetch a single machine by slug from the database
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { machinesData } from "@/data/machinesData";

const toSpecifications = (specs: unknown): Record<string, string> | null => {
  if (!specs || typeof specs !== "object") return null;
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(specs as Record<string, unknown>)) {
    result[key] = String(value);
  }
  return result;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const dbMachine = await prisma.machine.findFirst({
      where: { slug },
      include: { category: true },
    });

    // Fallback map from static file
    const staticMachine = machinesData.find((m) => m.slug === slug);

    if (!dbMachine) {
      // Not in DB — return static data if it exists, otherwise 404
      if (staticMachine) {
        return NextResponse.json({ machine: staticMachine });
      }
      return NextResponse.json({ error: "Machine not found" }, { status: 404 });
    }

    const specifications = toSpecifications(dbMachine.specifications);

    const machine = {
      id: dbMachine.id,
      slug: dbMachine.slug,
      name: dbMachine.name,
      image:
        dbMachine.image ||
        staticMachine?.image ||
        "/images/machines/Custom Industrial Machines.jpg",
      gallery: dbMachine.gallery?.length
        ? dbMachine.gallery
        : staticMachine?.gallery || [],
      category: dbMachine.category?.name || dbMachine.type || "",
      type: dbMachine.type,
      capacity: specifications?.capacity || staticMachine?.capacity || "",
      power: specifications?.power || staticMachine?.power || "",
      weight: specifications?.weight || staticMachine?.weight || "",
      dimensions: specifications?.dimensions || staticMachine?.dimensions || "",
      voltage: specifications?.voltage || staticMachine?.voltage || "",
      rpm: specifications?.rpm || staticMachine?.rpm || "",
      material: specifications?.material || staticMachine?.material || "",
      warranty: specifications?.warranty || staticMachine?.warranty || "",
      extractionRate:
        specifications?.extractionRate ||
        staticMachine?.extractionRate ||
        "",
      waterConsumption:
        specifications?.waterConsumption ||
        staticMachine?.waterConsumption ||
        "",
      fiberThickness:
        specifications?.fiberThickness || staticMachine?.fiberThickness || "",
      operation:
        specifications?.operation || staticMachine?.operation || "",
      noiseLevel:
        specifications?.noiseLevel || staticMachine?.noiseLevel || "",
      operators:
        specifications?.operators || staticMachine?.operators || "",
      description: dbMachine.description || staticMachine?.description || "",
      features:
        dbMachine.features?.length
          ? dbMachine.features
          : staticMachine?.features || [],
      applications:
        dbMachine.applications?.length
          ? dbMachine.applications
          : staticMachine?.applications || [],
      price:
        dbMachine.price > 0
          ? `ETB ${dbMachine.price.toLocaleString()}`
          : staticMachine?.price || "Call for price",
      available: dbMachine.is_available,
      availability_status:
        dbMachine.inventory_status ||
        (dbMachine.is_available ? "available" : "out_of_stock"),
      motor_type: specifications?.motor_type || "",
      input: dbMachine.input || staticMachine?.input || "",
      output: dbMachine.output || staticMachine?.output || "",
      process: dbMachine.process || staticMachine?.process || "",
    };

    return NextResponse.json({ machine });
  } catch (error) {
    console.error("Machine by-slug GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
