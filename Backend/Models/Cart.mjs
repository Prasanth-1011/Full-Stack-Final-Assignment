import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },

        products: {
            type: Array,
            default: [],
        },

        buyLater: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
