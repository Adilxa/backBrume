import { Router } from "express";
import { SendEmail, getUserEmails } from "../controllers/email.controller.js";

const router = Router();

/**
 * @swagger
 * /api/email:
 *   post:
 *     summary: Отправить email
 *     description: Отправка email определенному пользователю.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Адрес email получателя.
 *                 example: "user@example.com"
 *               message:
 *                 type: string
 *                 description: Текст сообщения.
 *                 example: "Привет, это тестовое сообщение!"
 *     responses:
 *       200:
 *         description: Email успешно отправлен
 *       500:
 *         description: Ошибка сервера
 */
router.post("/", SendEmail);

/**
 * @swagger
 * /api/email/{user_id}:
 *   get:
 *     summary: Получить email по ID пользователя
 *     description: Возвращает список email сообщений для указанного пользователя.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя.
 *     responses:
 *       200:
 *         description: Список email сообщений пользователя
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get("/:user_id", getUserEmails);

export default router;
