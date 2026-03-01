import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },

        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
            },
        ],
    },
    { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
