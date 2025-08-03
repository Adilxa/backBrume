import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /api/auth/otp:
 *   post:
 *     summary: Отправить OTP код на email
 *     description: Отправляет 6-значный OTP код на указанный email для авторизации
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *                 example: "user@example.com"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP код успешно отправлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "OTP код отправлен на ваш email"
 *                 userId:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Неверный запрос
 *       500:
 *         description: Ошибка сервера
 */
router.post("/otp", sendOtp);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Верификация OTP кода
 *     description: Проверяет OTP код и авторизует пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *                 example: "user@example.com"
 *               otpCode:
 *                 type: string
 *                 description: 6-значный OTP код
 *                 example: "123456"
 *             required:
 *               - email
 *               - otpCode
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Успешная авторизация"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     email:
 *                       type: string
 *                     cupCount:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *       400:
 *         description: Неверный или истекший OTP код
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.post("/verify", verifyOtp);

export default router;
