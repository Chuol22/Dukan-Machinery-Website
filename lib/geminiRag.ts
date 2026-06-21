// lib/geminiRag.ts – assemble RAG context for Gemini AI
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "@/lib/prisma";
import { machinesData } from "@/data/machinesData";
import faqData from "@/data/chatbot-knowledge.json";

/**
 * Load the product documentation markdown from the project root.
 */
async function loadProductDoc(): Promise<string> {
  const possiblePaths = [
    path.join(process.cwd(), "..", "PRODUCT_DOCUMENTATION.md"),
    path.join(process.cwd(), "PRODUCT_DOCUMENTATION.md"),
  ];
  for (const p of possiblePaths) {
    try {
      return await fs.readFile(p, "utf-8");
    } catch (_) {
      // continue
    }
  }
  console.warn("⚠️ Could not locate PRODUCT_DOCUMENTATION.md for Gemini RAG.");
  return "";
}

/**
 * Assemble a single string that contains all knowledge sources.
 * The format mirrors the previous OpenAI prompt: documentation, FAQ, catalog, plus DB data.
 */
export async function getRagContext(): Promise<string> {
  const doc = await loadProductDoc();
  const faq = JSON.stringify(faqData, null, 2);
  const catalog = JSON.stringify(machinesData, null, 2);

  // Fetch dynamic machine info from the database (e.g., all machines).
  let dbMachines: any[] = [];
  try {
    dbMachines = await prisma.machine.findMany({
      select: { id: true, name: true, description: true, image: true },
    });
  } catch (e) {
    console.error("❌ Prisma fetch error for Gemini RAG:", e);
  }
  const dbInfo = JSON.stringify(dbMachines, null, 2);

  // Build the combined context string.
  return `### 1. DKM COMPANY & PLATFORM DOCUMENTATION:\n${doc}\n\n### 2. FAQ KNOWLEDGE ITEMS:\n${faq}\n\n### 3. COMPLETE PRODUCT CATALOG (static):\n${catalog}\n\n### 4. DYNAMIC MACHINE DATA FROM DATABASE:\n${dbInfo}`;
}
