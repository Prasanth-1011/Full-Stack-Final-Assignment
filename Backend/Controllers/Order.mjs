import Order from "../Models/Order.mjs";

export const getAllOrders = async (req, res) => {
    try {
        const { orderNumber } = req.body;
        if (!orderNumber) {
            return res.status(400).json({ message: "Order Number Required" });
        }
        const orders = await Order.findById(orderNumber);
        if (!orders) {
            return res.status(404).json({ message: "Order Not Found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        if (!orders) {
            return res.status(404).json({ message: "No Orders Done Yet" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        if (!userId || !items || !totalAmount) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }

        // Generate Unique Order Number
        const now = Date.now();
        const orderNumber = now.getTime();

        const order = new Order({
            userId,
            orderNumber,
            products: items,
            total: totalAmount,
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { orderNumber, status } = req.body;
        if (!orderNumber || !status) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }
        const order = await Order.findByIdAndUpdate(
            orderNumber,
            { status },
            { new: true },
        );
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
