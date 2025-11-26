import { Router } from "express";
import { register, login, logout, profile } from "../controllers/authController.js";
import { authRequired } from "../middlewares/auth.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);   // 👈 AQUI ES IMPORTANTE
router.get("/profile", authRequired, profile);

export default router;
