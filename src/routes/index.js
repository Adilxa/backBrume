import { Router } from "express";
import EmailRouter from "./email.routes.js";
import UserRouter from "./user.routes.js";
import AuthRouter from "./auth.routes.js";
const router = Router();

router.use("/email", EmailRouter);
router.use("/user", UserRouter);
router.use("/auth", AuthRouter);

export default router;
