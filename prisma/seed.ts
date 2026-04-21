import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.supplier.deleteMany();
  await prisma.rateCard.deleteMany();
  await prisma.inventoryCounter.deleteMany();

  await prisma.supplier.createMany({
    data: [
      { phone: '+254700000001', name: 'Achieng Household' },
      { phone: '+254700000002', name: 'Mwangi Household', trusted: true },
      { phone: '+254700000003', name: 'Ochieng Household' },
    ],
  });

  await prisma.rateCard.createMany({
    data: [
      { category: 'GREEN', pricePerKg: 15, active: true },
      { category: 'BROWN', pricePerKg: 10, active: true },
      { category: 'REJECT', pricePerKg: 0, active: true },
    ],
  });

  await prisma.inventoryCounter.createMany({
    data: [
      { stage: 'POULTRY', demandKg: 50, onHandKg: 0 },
      { stage: 'MUSHROOM', demandKg: 40, onHandKg: 0 },
      { stage: 'VEGETABLE', demandKg: 20, onHandKg: 0 },
    ],
  });

  console.log('Seeded 3 suppliers, rate card, inventory counters.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
