import { Router } from "express";

import { loginAdmin, registerAdmin } from "../Controllers/Admin.mjs";

const router = Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);

export default router;
