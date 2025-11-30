import { Router } from "express";
import multer from "multer";
import { authRequired } from "../middlewares/auth.js";
import { analyzeDocument } from "../controllers/uploadController.js";

const router = Router();

// Configurar multer (subida de archivos)
const upload = multer({ dest: "uploads/" });

router.post("/", authRequired, upload.single("file"), analyzeDocument);

export default router;
