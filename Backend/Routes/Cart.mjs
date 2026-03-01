import { Router } from "express";

import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
} from "../Controllers/Cart.mjs";

const router = Router();

router.get("/get", getCart);

router.post("/add", addToCart);
router.post("/remove", removeFromCart);

router.delete("/clear", clearCart);

export default router;
