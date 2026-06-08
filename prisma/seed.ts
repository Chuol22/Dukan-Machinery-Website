// seed.ts — populates initial machine categories in the database
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  const categories = await prisma.category.createMany({
    data: [
      { slug: 'tractors', name: 'Tractors', description: 'Farm tractors' },
      { slug: 'harvesters', name: 'Harvesters', description: 'Harvesting equipment' },
      { slug: 'sprayers', name: 'Sprayers', description: 'Agricultural sprayers' },
      { slug: 'parts', name: 'Parts', description: 'Replacement parts' },
    ],
    skipDuplicates: true,
  })
  
  console.log(`Seeded ${categories.count} categories`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())