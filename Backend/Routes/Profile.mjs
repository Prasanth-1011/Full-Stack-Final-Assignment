import { Router } from "express";
import { updateAdmin, updateUser } from "../Controllers/Profile.mjs";

const router = Router();

router.put("/user/update", updateUser);
router.put("/admin/update", updateAdmin);

export default router;
