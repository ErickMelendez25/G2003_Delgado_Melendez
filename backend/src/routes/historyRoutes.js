import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { getUserHistory, getAnalysisById } from "../controllers/historyController.js";

const router = Router();

router.get("/", authRequired, getUserHistory);
router.get("/:id", authRequired, getAnalysisById);

export default router;
