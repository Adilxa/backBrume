import { Router } from "express";
import EmailRouter from "./email.routes.js";
import UserRouter from "./user.routes.js";
import AuthRouter from "./auth.routes.js";
const router = Router();

router.use("/api/email", EmailRouter);
router.use("/api/user", UserRouter);
router.use("/api/auth", AuthRouter);

export default router;
