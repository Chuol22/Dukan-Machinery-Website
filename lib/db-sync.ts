import { prisma } from "./prisma";
import { machinesData } from "@/data/machinesData";

export async function syncStaticMachinesToDatabase() {
  try {
    // 1. Get all machines from DB to see what is already there
    const dbMachines = await prisma.machine.findMany({
      select: { slug: true }
    });
    
    const dbSlugs = new Set(dbMachines.map(m => m.slug));
    
    // Find static machines that are NOT in the database
    const missingMachines = machinesData.filter(m => !dbSlugs.has(m.slug));
    
    if (missingMachines.length === 0) {
      return { success: true, message: "All machines are already synced" };
    }
    
    console.log(`[db-sync] Found ${missingMachines.length} missing machines. Seeding to database...`);
    
    for (const sm of missingMachines) {
      try {
        // Resolve category name (default to "General Purpose" if empty or "all")
        const rawCatName = sm.category || "General Purpose";
        const catName = rawCatName === "all" ? "General Purpose" : rawCatName;
        const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        
        // Find or create category in DB
        let dbCategory = await prisma.category.findUnique({
          where: { slug: catSlug }
        });
        
        if (!dbCategory) {
          dbCategory = await prisma.category.create({
            data: {
              slug: catSlug,
              name: catName,
              description: `${catName} Machinery`
            }
          });
          console.log(`[db-sync] Created category "${catName}" with slug "${catSlug}"`);
        }
        
        // Build specifications JSON
        const specificationsJson = {
          capacity: sm.capacity || "",
          power: sm.power || "",
          weight: sm.weight || "",
          dimensions: sm.dimensions || "",
          voltage: sm.voltage || "",
          warranty: sm.warranty || "",
          rpm: sm.rpm || "",
          material: sm.material || "",
          operation: sm.operation || "",
          noiseLevel: sm.noiseLevel || "",
          operators: sm.operators || "",
          extractionRate: sm.extractionRate || "",
          waterConsumption: sm.waterConsumption || "",
          fiberThickness: sm.fiberThickness || "",
        };
        
        // Generate a unique SKU
        const baseSku = `SKU-${sm.id}-${sm.slug.substring(0, 10).toUpperCase()}`;
        let sku = baseSku;
        let counter = 1;
        while (await prisma.machine.findUnique({ where: { sku } })) {
          sku = `${baseSku}-${counter++}`;
        }
        
        // Create machine in DB
        await prisma.machine.create({
          data: {
            slug: sm.slug,
            sku: sku,
            name: sm.name,
            image: sm.image,
            gallery: sm.gallery || [],
            category_id: dbCategory.id,
            type: sm.type || "standard",
            description: sm.description || "",
            features: sm.features || [],
            applications: sm.applications || [],
            price: 0, // default to request price
            is_available: true,
            specifications: specificationsJson,
            input: sm.input || "",
            output: sm.output || "",
            process: sm.process || "",
          }
        });
        console.log(`[db-sync] Successfully seeded machine: ${sm.name} (${sm.slug})`);
      } catch (machineErr) {
        console.error(`[db-sync] Failed to seed machine "${sm.slug}":`, machineErr);
      }
    }
    
    return { success: true, message: `Successfully synced missing machines` };
  } catch (error) {
    console.error("[db-sync] Error in syncStaticMachinesToDatabase:", error);
    return { success: false, error };
  }
}
