import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },

        orderId: {
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
            enum: ["Pending", "Completed", "Cancelled"],
            default: "Pending",
        },
    },

    { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
