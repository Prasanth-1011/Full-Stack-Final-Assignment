import { Router } from "express";
import {
    updateAdmin,
    updateUser,
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    updateProfileImage,
} from "../Controllers/Profile.mjs";
import upload from "../Middlewares/Multer.mjs";

const router = Router();

// Profile Routes
router.post("/create", upload.single("image"), createProfile);
router.post("/get", getProfile);
router.put("/update", upload.single("image"), updateProfile);
router.put("/update-image", upload.single("image"), updateProfileImage);
router.delete("/delete", deleteProfile);

// Account Routes
router.put("/user/update", updateUser);
router.put("/admin/update", updateAdmin);

export default router;
