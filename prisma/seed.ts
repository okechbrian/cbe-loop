import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.payout.deleteMany();
  await prisma.wasteBatch.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.rateCard.deleteMany();
  await prisma.inventoryCounter.deleteMany();

  await prisma.supplier.createMany({
    data: [
      { phone: '+256772000001', name: 'Namubiru Household' },
      { phone: '+256782000002', name: 'Ssemwogerere Household', trusted: true },
      { phone: '+256702000003', name: 'Nakato Household' },
      { phone: '+256752000004', name: 'Mukasa Household' },
      { phone: '+256776000005', name: 'Kiggundu Household' },
    ],
  });

  // Prices in UGX (rough working benchmarks for Kampala peri-urban procurement).
  await prisma.rateCard.createMany({
    data: [
      { category: 'GREEN', pricePerKg: 500, currency: 'UGX', active: true },
      { category: 'BROWN', pricePerKg: 300, currency: 'UGX', active: true },
      { category: 'REJECT', pricePerKg: 0, currency: 'UGX', active: true },
    ],
  });

  await prisma.inventoryCounter.createMany({
    data: [
      { stage: 'POULTRY', demandKg: 50, onHandKg: 0 },
      { stage: 'MUSHROOM', demandKg: 40, onHandKg: 0 },
      { stage: 'VEGETABLE', demandKg: 20, onHandKg: 0 },
    ],
  });

  console.log('Seeded 5 Kampala-area suppliers, UGX rate card, inventory counters.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
