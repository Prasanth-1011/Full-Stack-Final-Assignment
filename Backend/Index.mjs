import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";

import connect from "./Database.mjs";
import userRoutes from "./Routes/User.mjs";
import adminRoutes from "./Routes/Admin.mjs";
import orderRoutes from "./Routes/Order.mjs";
import productsRoutes from "./Routes/Products.mjs";
import profileRoutes from "./Routes/Profile.mjs";
import cartRoutes from "./Routes/Cart.mjs";
import initRootAdmin from "./Utils/initRootAdmin.mjs";

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);

// Database Connection
const startServer = async () => {
    try {
        await connect();
        await initRootAdmin();
        app.listen(port || 3000, () => {
            console.log(`Server running on http://localhost:${port || 3000}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
};

startServer();
