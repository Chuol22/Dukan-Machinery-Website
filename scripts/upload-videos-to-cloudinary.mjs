// scripts/upload-videos-to-cloudinary.mjs
// Uploads all local machine videos to Cloudinary and outputs updated machinesData image paths.
// Run: node scripts/upload-videos-to-cloudinary.mjs

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// ——— Cloudinary config (reads from process.env or hardcode for one-time use) ———
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dusezlxj0",
  api_key:    process.env.CLOUDINARY_API_KEY    || "851288133525139",
  api_secret: process.env.CLOUDINARY_API_SECRET || "DAwEuGjmumJbY9UrCrgewcxOnQ0",
});

// ——— Map local filename → machinesData slug ———
const videoFileToSlug = {
  "Banana stem fiber extraction machine-Dw0D8DsP.mp4": "banana-stem-fiber-extraction-machine",
  "Block Machine-XLmMnS90.mp4": "block-making-machine",
  "Cattle Feed Pellet Machine-DcB5hbCX.mp4": "cattle-feed-pellet-machine",
  "Chicken Feed Mill Machine.mp4": "chicken-feed-mill-machine",
  "Crushing washing drying related to plastic-CNki6tDV.mp4": "plastic-crushing-washing-drying-line",
  "Cow dung drying machine-DwiQ1zNM.mp4": "cow-dung-drying-machine",
  "Dung Dewatering Machine-DgjJzCJD.mp4": "dung-dewatering-machine",
  "Goat Feed Pellet machine-Be1CHZoJ.mp4": "goat-feed-pellet-machine",
  "Straw cutting machine-BmQMn1m-.mp4": "straw-cutting-machine",
  "Sugarcane Cutting machine-DjyyKX-Z.mp4": "sugarcane-cutting-machine",
  "Maize Grinding Machine-MW6nCSsW.mp4": "maize-grinding-machine",
  "Grain Mixing Machine-BaD3Fa8n.mp4": "grain-mixing-machine",
  "leave crushing machine-COjoLUtP.mp4": "leave-crushing-machine",
  "Salt making machine-BBUXiFcp.mp4": "salt-making-machine",
  "CNC Cutting machine-DrL-5-Kv.mp4": "cnc-cutting-machine",
  "Iron Roasting machine-B5YaMbsG.mp4": "iron-roasting-machine",
  "Hammer Mill Machine-BxZa4fFi.mp4": "hammer-mill-machine",
};

const videosDir = path.join(root, "public", "videos", "machines");
const results = {};

async function uploadVideo(filename) {
  const localPath = path.join(videosDir, filename);
  const slug = videoFileToSlug[filename];
  if (!slug) {
    console.log(`⚠️  No slug mapping for: ${filename}`);
    return null;
  }

  const publicId = `dkm/machines/videos/${slug}`;
  
  // Check if already uploaded
  try {
    const existing = await cloudinary.api.resource(publicId, { resource_type: "video" });
    console.log(`✓ Already on Cloudinary: ${slug} → ${existing.secure_url}`);
    return { slug, url: existing.secure_url };
  } catch {
    // Not found — upload it
  }
  
  console.log(`⬆  Uploading: ${filename} (${(fs.statSync(localPath).size / 1024 / 1024).toFixed(1)} MB)...`);
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: "video",
      public_id: publicId,
      overwrite: false,
      chunk_size: 6000000, // 6MB chunks for large files
      eager: [{ quality: "auto", format: "mp4" }],
      eager_async: true,
    });
    console.log(`✅ Uploaded: ${slug} → ${result.secure_url}`);
    return { slug, url: result.secure_url };
  } catch (err) {
    console.error(`❌ Failed: ${filename}`, err.message);
    return null;
  }
}

async function main() {
  const files = Object.keys(videoFileToSlug);
  console.log(`\n🎬 Uploading ${files.length} machine videos to Cloudinary...\n`);

  for (const file of files) {
    const result = await uploadVideo(file);
    if (result) {
      results[result.slug] = result.url;
    }
  }

  // Output a summary
  console.log("\n\n=== CLOUDINARY VIDEO URLS ===");
  for (const [slug, url] of Object.entries(results)) {
    console.log(`"${slug}": "${url}",`);
  }

  // Write results to a JSON file for easy copy-paste
  const outputPath = path.join(root, "scripts", "cloudinary-video-urls.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Results saved to: ${outputPath}`);
}

main().catch(console.error);
