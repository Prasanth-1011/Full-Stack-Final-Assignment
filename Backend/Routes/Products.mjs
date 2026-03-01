import { Router } from "express";

import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    getProductsOffer,
} from "../Controllers/Products.mjs";

import upload from "../Middlewares/Multer.mjs";

const router = Router();

// Product Routes
router.get("/all", getAllProducts);
router.get("/offer", getProductsOffer);

router.post("/create", upload.single("image"), createProduct);
router.post("/single", getSingleProduct);

router.put("/update", upload.single("image"), updateProduct);

router.delete("/delete", deleteProduct);

export default router;
