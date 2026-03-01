import Products from "../Models/Products.mjs";
import upload from "../Middlewares/Multer.mjs";
import cloudinary from "../Configs/Cloudinary.mjs";

// Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json({ products, message: "Sent All Product Details" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

// Get Products With Offer
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

// Create Product
export const createProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No Image Found" });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                },
            );
            stream.end(req.file.buffer);
        });

        const imageData = {
            image: result.secure_url,
            imageId: result.public_id,
        };

        const { name, price, description, category, stock } = req.body;

        if (
            !name ||
            !price ||
            !description ||
            !category ||
            !stock ||
            !imageData.image ||
            !imageData.imageId
        ) {
            return res.status(400).json({ message: "Missing Required Fields" });
        }

        const product = new Products({
            name,
            price,
            description,
            category,
            stock,
            image: imageData.image,
            imageId: imageData.imageId,
        });

        await product.save();
        res.status(201).json({
            product,
            message: "Product Created Successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { _id, ...data } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "No Product Found" });
        }

        let imageData = {};
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    },
                );
                stream.end(req.file.buffer);
            });

            imageData = {
                image: result.secure_url,
                imageId: result.public_id,
            };
        }

        const updatedData = { ...data, ...imageData };

        const product = await Products.findOneAndUpdate(
            { _id },
            { $set: updatedData },
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
export const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.body;
        const product = await Products.findOneAndDelete({ _id });
        res.status(200).json({ product, message: "Deleted Product Details" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
