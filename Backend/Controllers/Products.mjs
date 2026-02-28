import Products from "../Models/Products.mjs";

// Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json({ products, message: "Sent All Product Details" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Product
export const createProduct = async (req, res) => {};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { _id, ...data } = req.body;

        if (!data) {
            return res.status(400).json({ message: "No Data Found" });
        }

        if (!_id) {
            return res.status(400).json({ message: "No Product Found" });
        }

        const product = await Products.findOneAndUpdate(
            { _id },
            { $set: data },
            {
                new: true,
                runValidators: true,
            },
        );
        res.status(200).json({ product, message: "Updated Product Details" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {};

// Get Single Product
export const getSingleProduct = async (req, res) => {
    try {
        const { name } = req.body;
        const product = await Products.findOne({ name });
        res.status(200).json({ product, message: "Sent Product Details" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Products With Offer
export const getProductsOffer = async (req, res) => {
    try {
        const products = await Products.find({ offer: true });
        res.status(200).json({
            products,
            message: "Sent All Product Details That Has Offer",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
