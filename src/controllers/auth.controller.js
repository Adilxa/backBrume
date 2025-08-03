import prisma from "../../db/db.config.js";
import OtpService from "../services/otp.service.js";

// Отправка OTP кода на email
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "Email обязателен",
      });
    }

    // Проверяем валидность email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: "Неверный формат email",
      });
    }

    // Ищем или создаем пользователя
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    // Деактивируем все предыдущие OTP коды для этого пользователя
    await prisma.otpCode.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: { used: true },
    });

    // Генерируем новый OTP код
    const otpCode = OtpService.generateOtpCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Код действителен 10 минут

    // Сохраняем OTP в базу
    await prisma.otpCode.create({
      data: {
        userId: user.id,
        code: otpCode,
        expiresAt,
      },
    });

    // Отправляем OTP на email
    await OtpService.sendOtpEmail(email, otpCode);

    return res.json({
      status: 200,
      message: "OTP код отправлен на ваш email",
      userId: user.id,
    });
  } catch (error) {
    console.error("Ошибка отправки OTP:", error);
    return res.status(500).json({
      status: 500,
      message: "Ошибка сервера при отправке OTP",
    });
  }
};

// Верификация OTP кода и авторизация
export const verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        status: 400,
        message: "Email и OTP код обязательны",
      });
    }

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Пользователь не найден",
      });
    }

    // Ищем действующий OTP код
    const validOtp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: otpCode,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!validOtp) {
      return res.status(400).json({
        status: 400,
        message: "Неверный или истекший OTP код",
      });
    }

    // Помечаем OTP как использованный
    await prisma.otpCode.update({
      where: { id: validOtp.id },
      data: { used: true },
    });

    // Получаем количество кружек пользователя
    const cupCount = await prisma.cup.count({
      where: { userId: user.id },
    });

    return res.json({
      status: 200,
      message: "Успешная авторизация",
      user: {
        id: user.id,
        email: user.email,
        cupCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Ошибка верификации OTP:", error);
    return res.status(500).json({
      status: 500,
      message: "Ошибка сервера при верификации OTP",
    });
  }
};
