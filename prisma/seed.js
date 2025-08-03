import prisma from "../db/db.config.js"

async function main() {
  // await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@examplee.com",
    },
  });

  await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@examplee.com",
    },
  });
  await prisma.user.create({
    data: {
      name: "Bob Johnson",
      email: "bob@examplee.com",
    },
  });

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
