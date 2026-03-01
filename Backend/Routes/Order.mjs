import express from "express";
import {
    getAllOrders,
    getOrders,
    createOrder,
    updateOrder,
    cancelOrder,
} from "../Controllers/Order.mjs";

const router = express.Router();

router.post("/all", getAllOrders);
router.post("/user", getOrders);

router.post("/create", createOrder);

router.post("/cancel", cancelOrder);

router.put("/update", updateOrder);

export default router;
