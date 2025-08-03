import prisma from "../../db/db.config.js";

// Получить информацию о пользователе по ID
export const getMe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "ID пользователя обязателен",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        cups: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Пользователь не найден",
      });
    }

    return res.json({
      status: 200,
      user: {
        id: user.id,
        email: user.email,
        cupCount: user.cups.length,
        maxCups: 6,
        canAddCup: user.cups.length < 6,
        createdAt: user.createdAt,
        cups: user.cups,
      },
    });
  } catch (error) {
    console.error("Ошибка получения пользователя:", error);
    return res.status(500).json({
      status: 500,
      message: "Ошибка сервера",
    });
  }
};

// Добавить чашку кофе пользователю
export const addCup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "ID пользователя обязателен",
      });
    }

    const userId = parseInt(id);

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Пользователь не найден",
      });
    }

    // Проверяем текущее количество чашек
    const currentCupCount = await prisma.cup.count({
      where: { userId },
    });

    let newCupCount;
    let message;
    let isFreeCoffee = false;

    if (currentCupCount >= 6) {
      // Если у пользователя уже 6 чашек - сбрасываем все и добавляем 1 новую
      await prisma.cup.deleteMany({
        where: { userId },
      });

      await prisma.cup.create({
        data: { userId },
      });

      newCupCount = 1;
      message =
        "🎉 Поздравляем! Вы получили бесплатный кофе! Начинаем новый счетчик.";
      isFreeCoffee = true;
    } else {
      // Просто добавляем новую чашку
      await prisma.cup.create({
        data: { userId },
      });

      newCupCount = currentCupCount + 1;
      message = `☕ Чашка добавлена! У вас ${newCupCount} из 6 чашек.`;
    }

    return res.json({
      status: 200,
      message,
      user: {
        id: userId,
        cupCount: newCupCount,
        maxCups: 6,
        canAddMore: newCupCount < 6,
        isFreeCoffee,
        cupsUntilFree: 6 - newCupCount,
      },
    });
  } catch (error) {
    console.error("Ошибка добавления чашки:", error);
    return res.status(500).json({
      status: 500,
      message: "Ошибка сервера",
    });
  }
};
