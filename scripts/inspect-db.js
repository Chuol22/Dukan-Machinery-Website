const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const machines = await prisma.machine.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        image: true,
      }
    });
    console.log("=== Database Machines ===");
    console.log(JSON.stringify(machines, null, 2));
  } catch (error) {
    console.error("Error inspecting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
