import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await prisma.task.createMany({
  data: [
    { title: 'Susun prioritas minggu ini', priority: 'high' },
    { title: 'Balas email yang tertunda', priority: 'medium' },
  ],
  skipDuplicates: true,
});
console.log('Seed selesai.');
await prisma.$disconnect();
