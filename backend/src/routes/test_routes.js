// tests_backend/routes/test_routes.js
import { Router } from "express";
import { testPing, testEcho } from "../controllers/test_controller.js";

const router = Router();

router.get("/ping", testPing);
router.post("/echo", testEcho);

export default router;
