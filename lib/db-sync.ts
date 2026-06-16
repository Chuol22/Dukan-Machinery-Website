import { prisma } from "./prisma";
import { machinesData } from "@/data/machinesData";

// Map of slug → correct Cloudinary video URL
const CLOUDINARY_VIDEO_URLS: Record<string, string> = {
  "banana-stem-fiber-extraction-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640342/dkm/machines/videos/banana-stem-fiber-extraction-machine.mp4",
  "block-making-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640349/dkm/machines/videos/block-making-machine.mp4",
  "cattle-feed-pellet-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640365/dkm/machines/videos/cattle-feed-pellet-machine.mp4",
  "chicken-feed-mill-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640406/dkm/machines/videos/chicken-feed-mill-machine.mp4",
  "plastic-crushing-washing-drying-line": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640449/dkm/machines/videos/plastic-crushing-washing-drying-line.mp4",
  "cow-dung-drying-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640456/dkm/machines/videos/cow-dung-drying-machine.mp4",
  "dung-dewatering-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640464/dkm/machines/videos/dung-dewatering-machine.mp4",
  "goat-feed-pellet-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640471/dkm/machines/videos/goat-feed-pellet-machine.mp4",
  "straw-cutting-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640496/dkm/machines/videos/straw-cutting-machine.mp4",
  "sugarcane-cutting-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640506/dkm/machines/videos/sugarcane-cutting-machine.mp4",
  "maize-grinding-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640511/dkm/machines/videos/maize-grinding-machine.mp4",
  "grain-mixing-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640518/dkm/machines/videos/grain-mixing-machine.mp4",
  "leave-crushing-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640538/dkm/machines/videos/leave-crushing-machine.mp4",
  "salt-making-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640553/dkm/machines/videos/salt-making-machine.mp4",
  "cnc-cutting-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640568/dkm/machines/videos/cnc-cutting-machine.mp4",
  "iron-roasting-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640587/dkm/machines/videos/iron-roasting-machine.mp4",
  "hammer-mill-machine": "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640593/dkm/machines/videos/hammer-mill-machine.mp4",
};

export async function syncStaticMachinesToDatabase() {
  try {
    // 1. Get all machines from DB
    const dbMachines = await prisma.machine.findMany({
      select: { id: true, slug: true, image: true }
    });
    
    const dbMachineMap = new Map(dbMachines.map(m => [m.slug, m]));
    
    // 2. Find machines missing from DB
    const missingMachines = machinesData.filter(m => !dbMachineMap.has(m.slug));
    
    // 3. Find existing DB machines with wrong/local image paths that need patching
    const machinesNeedingImagePatch = dbMachines.filter(dbM => {
      const correctUrl = CLOUDINARY_VIDEO_URLS[dbM.slug];
      if (!correctUrl) return false;
      // Patch if image is null, empty, a local /videos/ path, or not the correct Cloudinary URL
      return !dbM.image || 
             dbM.image.startsWith("/videos/") || 
             dbM.image.startsWith("/images/") ||
             (dbM.image !== correctUrl && !dbM.image.startsWith("https://res.cloudinary.com/dusezlxj0/video/upload/"));
    });

    // 4. Patch existing machines with wrong image URLs
    for (const dbM of machinesNeedingImagePatch) {
      const correctUrl = CLOUDINARY_VIDEO_URLS[dbM.slug];
      if (!correctUrl) continue;
      try {
        const staticM = machinesData.find(sm => sm.slug === dbM.slug);
        await prisma.machine.update({
          where: { id: dbM.id },
          data: {
            image: correctUrl,
            gallery: staticM?.gallery || [],
          }
        });
        console.log(`[db-sync] Patched image for: ${dbM.slug}`);
      } catch (err) {
        console.error(`[db-sync] Failed to patch image for "${dbM.slug}":`, err);
      }
    }

    // 5. Seed missing machines
    if (missingMachines.length > 0) {
      console.log(`[db-sync] Found ${missingMachines.length} missing machines. Seeding...`);
      
      for (const sm of missingMachines) {
        try {
          const rawCatName = sm.category || "General Purpose";
          const catName = rawCatName === "all" ? "General Purpose" : rawCatName;
          const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          
          let dbCategory = await prisma.category.findUnique({ where: { slug: catSlug } });
          if (!dbCategory) {
            dbCategory = await prisma.category.create({
              data: { slug: catSlug, name: catName, description: `${catName} Machinery` }
            });
          }
          
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
          
          const baseSku = `SKU-${sm.id}-${sm.slug.substring(0, 10).toUpperCase()}`;
          let sku = baseSku;
          let counter = 1;
          while (await prisma.machine.findUnique({ where: { sku } })) {
            sku = `${baseSku}-${counter++}`;
          }
          
          // Always use the Cloudinary URL (falls back to static data image which is now Cloudinary)
          const imageUrl = CLOUDINARY_VIDEO_URLS[sm.slug] || sm.image;
          
          await prisma.machine.create({
            data: {
              slug: sm.slug,
              sku,
              name: sm.name,
              image: imageUrl,
              gallery: sm.gallery || [],
              category_id: dbCategory.id,
              type: sm.type || "standard",
              description: sm.description || "",
              features: sm.features || [],
              applications: sm.applications || [],
              price: 0,
              is_available: true,
              specifications: specificationsJson,
              input: sm.input || "",
              output: sm.output || "",
              process: sm.process || "",
            }
          });
          console.log(`[db-sync] Seeded: ${sm.name}`);
        } catch (machineErr) {
          console.error(`[db-sync] Failed to seed "${sm.slug}":`, machineErr);
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("[db-sync] Error:", error);
    return { success: false, error };
  }
}
