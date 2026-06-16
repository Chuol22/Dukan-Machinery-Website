const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const machines = await prisma.machine.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      gallery: true,
    }
  });
  console.log("DB Machines:");
  console.log(JSON.stringify(machines, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
