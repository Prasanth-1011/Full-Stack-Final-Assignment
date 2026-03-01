import { Router } from "express";

import {
    loginAdmin,
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin,
} from "../Controllers/Admin.mjs";

const router = Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/pending", getPendingAdmins);
router.put("/approve", approveAdmin);
router.put("/reject", rejectAdmin);

export default router;
