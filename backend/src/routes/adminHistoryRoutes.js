import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getAllUploads, getUploadByIdAdmin } from "../controllers/adminHistoryController.js";

const router = Router();

router.get("/", authRequired, isAdmin, getAllUploads);
router.get("/:id", authRequired, isAdmin, getUploadByIdAdmin);

export default router;
