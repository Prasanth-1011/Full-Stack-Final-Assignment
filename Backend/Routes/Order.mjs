import express from "express";
import {
    getAllOrders,
    getOrders,
    createOrder,
    updateOrder,
} from "../Controllers/Order.mjs";

const router = express.Router();

router.get("/all", getAllOrders);
router.get("/user", getOrders);

router.post("/create", createOrder);

router.put("/update", updateOrder);

export default router;
