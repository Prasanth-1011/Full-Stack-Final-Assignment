import { Router } from "express";

import {
    getCart,
    updateCart,
    deleteCart,
    clearCart,
} from "../Controllers/Cart.mjs";

const router = Router();

router.post("/get", getCart);

router.post("/add", updateCart);
router.post("/remove", deleteCart);

router.delete("/clear", clearCart);

export default router;
