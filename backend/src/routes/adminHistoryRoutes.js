import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { 
  getAllUploads, 
  getUploadByIdAdmin, 
  updateUpload,     // ✅ NEW
  deleteUpload      // ✅ NEW
} from "../controllers/adminHistoryController.js";

const router = Router();

router.get("/", authRequired, isAdmin, getAllUploads);
router.get("/:id", authRequired, isAdmin, getUploadByIdAdmin);

// ✅ UPDATE
router.put("/:id", authRequired, isAdmin, updateUpload);

// ✅ DELETE
router.delete("/:id", authRequired, isAdmin, deleteUpload);

export default router;
