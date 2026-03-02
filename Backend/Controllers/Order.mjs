import Order from "../Models/Order.mjs";
import Product from "../Models/Products.mjs";

export const getAllOrders = async (req, res) => {
    try {
        const { orderNumber } = req.body || {};
        if (orderNumber) {
            const orders = await Order.findOne({ orderNumber });
            if (!orders) {
                return res.status(404).json({ message: "Order Not Found" });
            }
            return res.status(200).json([orders]);
        } else {
            const orders = await Order.find().sort({ createdAt: -1 });
            return res.status(200).json(orders);
        }
    } catch (error) {
        console.error("GetAllOrders Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { userId } = req.body || {};
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No Orders Done Yet" });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error("GetOrders Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { userId, name, phone, items, totalAmount, address } = req.body;
        if (!userId || !name || !phone || !items || !totalAmount || !address) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }

        const enrichedItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res
                    .status(404)
                    .json({ message: `Product ${item.productId} Not Found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient Stock For ${product.name}`,
                });
            }
            product.stock -= item.quantity;
            await product.save();

            enrichedItems.push({
                productId: item.productId,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        // Generate Unique Order Number
        const orderNumber = new Date().getTime();

        const order = new Order({
            userId,
            name,
            phone,
            address,
            orderNumber,
            products: enrichedItems,
            total: totalAmount,
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { orderNumber, status } = req.body;
        if (!orderNumber || !status) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }

        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        // Logical Status Transitions
        const currentStatus = order.status;

        if (currentStatus === "Cancelled") {
            return res
                .status(400)
                .json({ message: "Cannot update a cancelled order" });
        }
        if (currentStatus === "Delivered") {
            return res
                .status(400)
                .json({ message: "Cannot update a delivered order" });
        }

        if (status === "Delivered" && currentStatus !== "Dispatched") {
            return res.status(400).json({
                message: "Cannot deliver an order before it is dispatched",
            });
        }

        order.status = status;
        if (status === "Dispatched") order.dispatchedAt = new Date();
        if (status === "Delivered") order.deliveredAt = new Date();
        if (status === "Cancelled") order.cancelledAt = new Date();

        await order.save();
        res.status(200).json(order);
    } catch (error) {
        console.error("UpdateOrder Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderNumber } = req.body;
        if (!orderNumber) {
            return res
                .status(400)
                .json({ message: "Order Number is required" });
        }

        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        if (order.status === "Delivered") {
            return res
                .status(400)
                .json({ message: "Cannot cancel a delivered order" });
        }

        order.status = "Cancelled";
        order.cancelledAt = new Date();

        await order.save();
        res.status(200).json(order);
    } catch (error) {
        console.error("CancelOrder Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
