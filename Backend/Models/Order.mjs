import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        orderNumber: {
            type: Number,
            required: true,
            unique: true,
        },

        products: {
            type: Array,
            required: true,
        },

        total: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            required: true,
            enum: ["Received", "Dispatched", "Delivered", "Cancelled"],
            default: "Received",
        },

        receivedAt: {
            type: Date,
            default: Date.now,
        },

        dispatchedAt: {
            type: Date,
        },

        deliveredAt: {
            type: Date,
        },

        cancelledAt: {
            type: Date,
        },
    },

    { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
