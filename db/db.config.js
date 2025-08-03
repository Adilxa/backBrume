import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ["query"],
});

async function connectDB() {
  try {
    await prisma.$connect()
    console.log('База данных успешно подключена')
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error)
    process.exit(1)
  }
}

await connectDB()

export default prisma;