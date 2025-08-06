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
        loyaltyCards: {
          include: {
            cups: {
              orderBy: { createdAt: "asc" },
            },
          },
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

    // Находим активную карточку (неиспользованную и неполную)
    const activeCard = user.loyaltyCards.find(card => 
      !card.isUsed && card.cups.length < 6
    );

    // Считаем доступные бесплатные кофе (полные карточки, которые не использованы)
    const availableFreeCoffees = user.loyaltyCards.filter(card => 
      card.cups.length === 6 && !card.isUsed
    ).length;

    // Сортируем карточки: активная первая, затем готовые к обмену, затем использованные
    const sortedCards = user.loyaltyCards.sort((a, b) => {
      // Активная карточка (заполняется) - первая
      if (!a.isUsed && a.cups.length < 6) return -1;
      if (!b.isUsed && b.cups.length < 6) return 1;
      
      // Готовые к обмену (полные неиспользованные) - вторые
      if (!a.isUsed && a.cups.length === 6) return -1;
      if (!b.isUsed && b.cups.length === 6) return 1;
      
      // Использованные - последние, по дате создания (новые первые)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.json({
      status: 200,
      user: {
        id: user.id,
        email: user.email,
        currentProgress: activeCard ? activeCard.cups.length : 0,
        maxCups: 6,
        canAddCup: activeCard ? activeCard.cups.length < 6 : true,
        availableFreeCoffees,
        createdAt: user.createdAt,
        loyaltyCards: sortedCards.map(card => ({
          id: card.id,
          cupsCount: card.cups.length,
          isComplete: card.cups.length === 6,
          isUsed: card.isUsed,
          isActive: !card.isUsed && card.cups.length < 6, // Активная карточка
          createdAt: card.createdAt,
          usedAt: card.usedAt,
          cups: card.cups,
        })),
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
      include: {
        loyaltyCards: {
          include: {
            cups: true,
          },
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

    // Находим активную карточку (неиспользованную и неполную)
    let activeCard = user.loyaltyCards.find(card => 
      !card.isUsed && card.cups.length < 6
    );

    // Если нет активной карточки, создаем новую
    if (!activeCard) {
      activeCard = await prisma.loyaltyCard.create({
        data: {
          userId,
          isUsed: false,
        },
        include: {
          cups: true,
        },
      });
    }

    // Добавляем чашку к активной карточке
    await prisma.cup.create({
      data: {
        loyaltyCardId: activeCard.id,
      },
    });

    const newCupCount = activeCard.cups.length + 1;
    let message;
    let isCardComplete = false;

    if (newCupCount === 6) {
      message = `🎉 Карточка заполнена! У вас ${newCupCount} из 6 чашек. Теперь можете получить бесплатный кофе!`;
      isCardComplete = true;
    } else {
      message = `☕ Чашка добавлена! У вас ${newCupCount} из 6 чашек.`;
    }

    // Считаем полные неиспользованные карточки
    const loyaltyCardsWithCups = await prisma.loyaltyCard.findMany({
      where: { userId },
      include: {
        cups: true,
      },
    });

    const completeCards = loyaltyCardsWithCups.filter(card => 
      card.cups.length === 6 && !card.isUsed
    ).length;

    return res.json({
      status: 200,
      message,
      user: {
        id: userId,
        currentProgress: newCupCount,
        maxCups: 6,
        canAddMore: newCupCount < 6,
        isCardComplete,
        availableFreeCoffees: completeCards,
        cupsUntilComplete: 6 - newCupCount,
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

// Получить бесплатный кофе (пометить карточку как использованную)
export const claimFreeCoffee = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardId } = req.body; // ID конкретной карточки (опционально)

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

    let targetCard;

    if (cardId) {
      // Если указан ID карточки, используем её
      targetCard = await prisma.loyaltyCard.findFirst({
        where: {
          id: parseInt(cardId),
          userId,
          isUsed: false,
        },
        include: {
          cups: true,
        },
      });
    } else {
      // Находим первую доступную полную карточку
      const loyaltyCards = await prisma.loyaltyCard.findMany({
        where: {
          userId,
          isUsed: false,
        },
        include: {
          cups: true,
        },
        orderBy: { createdAt: "asc" },
      });

      targetCard = loyaltyCards.find(card => card.cups.length === 6);
    }

    if (!targetCard) {
      return res.status(400).json({
        status: 400,
        message: "У вас нет доступных полных карточек для получения бесплатного кофе",
      });
    }

    if (targetCard.cups.length < 6) {
      return res.status(400).json({
        status: 400,
        message: "Карточка не заполнена. Нужно 6 чашек для получения бесплатного кофе",
      });
    }

    // Помечаем карточку как использованную
    await prisma.loyaltyCard.update({
      where: { id: targetCard.id },
      data: { 
        isUsed: true,
        usedAt: new Date(),
      },
    });

    // Считаем оставшиеся доступные бесплатные кофе
    const loyaltyCardsWithCups = await prisma.loyaltyCard.findMany({
      where: { 
        userId,
        isUsed: false 
      },
      include: {
        cups: true,
      },
    });

    const remainingFreeCoffees = loyaltyCardsWithCups.filter(card => 
      card.cups.length === 6
    ).length;

    return res.json({
      status: 200,
      message: `☕ Бесплатный кофе получен! У вас осталось ${remainingFreeCoffees} доступных бесплатных кофе.`,
      user: {
        id: userId,
        availableFreeCoffees: remainingFreeCoffees,
        usedCardId: targetCard.id,
      },
    });
  } catch (error) {
    console.error("Ошибка получения бесплатного кофе:", error);
    return res.status(500).json({
      status: 500,
      message: "Ошибка сервера",
    });
  }
};