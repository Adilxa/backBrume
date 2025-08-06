import { Router } from "express";
import { getMe, addCup, claimFreeCoffee } from "../controllers/user.controller.js";

const router = Router();

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Получить информацию о пользователе по ID
 *     description: Возвращает информацию о пользователе и его кружках по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     email:
 *                       type: string
 *                     cupCount:
 *                       type: number
 *                     maxCups:
 *                       type: number
 *                       example: 6
 *                     canAddCup:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     cups:
 *                       type: array
 *       400:
 *         description: ID не предоставлен
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get("/:id", getMe);

/**
 * @swagger
 * /api/user/{id}/add-cup:
 *   post:
 *     summary: Добавить чашку кофе пользователю
 *     description: Добавляет чашку кофе пользователю. При достижении 6 чашек - сбрасывает счетчик и дает бесплатный кофе
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Чашка успешно добавлена
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
 *                   example: "☕ Чашка добавлена! У вас 3 из 6 чашек."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     cupCount:
 *                       type: number
 *                     maxCups:
 *                       type: number
 *                       example: 6
 *                     canAddMore:
 *                       type: boolean
 *                     isFreeCoffee:
 *                       type: boolean
 *                       description: true если получен бесплатный кофе
 *                     cupsUntilFree:
 *                       type: number
 *                       description: Сколько чашек осталось до бесплатного кофе
 *       400:
 *         description: ID не предоставлен
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.post("/:id/add-cup", addCup);
router.post("/:id/claim-coffee", claimFreeCoffee);

export default router;
