import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },

        price: {
            type: Number,
            required: true,
        },

        offer: {
            type: Boolean,
            default: false,
        },

        offerPrice: {
            type: Number,
            required: true,
        },

        description: {
            type: String,
            required: true,
            min: 3,
            max: 100,
        },

        image: {
            type: String,
            required: true,
            unique: true,
        },

        stock: {
            type: Number,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },
    },

    { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
