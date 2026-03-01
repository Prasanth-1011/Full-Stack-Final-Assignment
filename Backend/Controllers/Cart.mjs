import Cart from "../Models/Cart.mjs";
import Product from "../Models/Products.mjs";

// Get All The Products Added
export const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart)
            return res.status(404).json({ cart: [], message: "Cart Empty!" });

        res.status(200).json({ cart, message: "Cart Items Fetched" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Add Product - Update Quantity
export const updateCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const product = await Product.findById(productId);
        const productIndex = cart.products.findIndex(
            (p) => p.productId === productId,
        );

        if (productIndex > -1) {
            if (cart.products[productIndex].quantity + 1 > product.stock) {
                return res.status(400).json({
                    message: `Cannot Add More. Only ${product.stock} Available!`,
                });
            }
            cart.products[productIndex].quantity += 1;
        } else {
            if (product.stock < 1) {
                return res.status(400).json({
                    message:
                        "Product Currently Unavailable. Await For Restock!",
                });
            }
            cart.products.push({ productId, quantity: 1 });
        }

        cart.markModified("products");
        await cart.save();

        res.status(200).json({ cart, message: "Cart Updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Remove Product - Update Quantity
export const deleteCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.json({ message: "Products Not Added Yet!" });

        const productIndex = cart.products.findIndex(
            (p) => p.productId === productId,
        );

        if (cart.products[productIndex].quantity > 1) {
            cart.products[productIndex].quantity -= 1;
        } else {
            cart.products.splice(productIndex, 1);
        }

        cart.markModified("products");
        await cart.save();

        res.status(200).json({ cart, message: "Product Quantity Updated" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Clear Cart
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.products = [];
            await cart.save();
        }

        res.status(200).json({ cart, message: "Cart Cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
