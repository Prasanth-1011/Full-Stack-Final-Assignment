import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../Utils/Service";
import { useAuth } from "../../Context/AuthContext";
import { defaultHover, defaultTap } from "../../Utils/Animations";

const ProductDetail = () => {
    const { name } = useParams();
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.post("/products/single", { name });
                setProduct(response.data.product);
            } catch (err) {
                console.error("Error Fetching Product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [name]);

    const handleAddToCart = async (redirect = false) => {
        try {
            if (!user) {
                showMessage(
                    "Please Login. Logged Users Are Allowed To Access Cart",
                    "error",
                );
                setTimeout(() => navigate("/login"), 2000);
                return;
            }
            const response = await api.post("/cart/add", {
                userId: user.id,
                productId: product._id,
            });

            if (redirect) {
                navigate("/cart");
            } else {
                showMessage(
                    response.data.message || "Added To Cart!",
                    "success",
                );
            }
        } catch (err) {
            showMessage(
                err.response?.data?.message || "Error Adding To Cart",
                "error",
            );
        } finally {
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        }
    };

    if (loading) return <div className="py-20 text-center">Loading...</div>;
    if (!product)
        return <div className="py-20 text-center">Product Not Found</div>;

    const discountedPrice = product.offer
        ? product.price - (product.price * product.offerPercentage) / 100
        : product.price;

    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            {/* Toast Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg ${
                            message.type === "error"
                                ? "bg-rose-500"
                                : "bg-emerald-500"
                        }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="aspect-square overflow-hidden rounded-3xl bg-slate-100 shadow-xl"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <span className="mb-4 inline-block rounded-full bg-sky-50 px-4 py-1 text-xs font-bold tracking-widest text-sky-600 uppercase">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-extrabold text-slate-900 capitalize">
                            {product.name}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-3xl font-extrabold text-sky-500">
                            ${discountedPrice.toFixed(2)}
                        </span>
                        {product.offer && (
                            <span className="text-xl text-slate-400 line-through decoration-rose-400">
                                ${product.price}
                            </span>
                        )}
                        {product.offer && (
                            <span className="rounded-lg bg-rose-50 px-3 py-1 text-sm font-bold text-rose-500">
                                {product.offerPercentage}% OFF
                            </span>
                        )}
                    </div>

                    <p className="text-lg leading-relaxed text-slate-500">
                        {product.description}
                    </p>

                    <div className="flex items-center space-x-6 border-y border-slate-100 py-6">
                        <div className="flex flex-col">
                            <span className="mb-1 text-xs font-bold tracking-wider text-slate-400 capitalize">
                                Availability
                            </span>
                            <span
                                className={`font-bold ${product.stock > 0 ? "text-emerald-500" : "text-rose-500"}`}
                            >
                                {product.stock > 0
                                    ? `In Stock (${product.stock})`
                                    : "Out of Stock"}
                            </span>
                        </div>
                        <div className="h-8 w-px bg-slate-100" />
                        <div className="flex flex-col">
                            <span className="mb-1 text-xs font-bold tracking-wider text-slate-400 capitalize">
                                SKU
                            </span>
                            <span className="font-bold text-slate-800 uppercase">
                                {product._id.slice(-8)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <motion.button
                            whileHover={defaultHover}
                            whileTap={defaultTap}
                            onClick={() => handleAddToCart(false)}
                            disabled={product.stock <= 0}
                            className={`btn-secondary flex-1 py-4 text-sm ${product.stock <= 0 ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                            Add To Cart
                        </motion.button>
                        <motion.button
                            whileHover={defaultHover}
                            whileTap={defaultTap}
                            onClick={() => handleAddToCart(true)}
                            disabled={product.stock <= 0}
                            className={`btn-primary flex-1 py-4 text-sm ${product.stock <= 0 ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                            Buy Now
                        </motion.button>
                    </div>

                    {/* Features/Info */}
                    <div className="mt-12 grid grid-cols-2 gap-6 border-t border-slate-100 pt-12">
                        <div className="flex flex-col">
                            <span className="mb-1 text-xs font-bold tracking-wider text-slate-400 capitalize">
                                Authentic
                            </span>
                            <span className="font-bold text-slate-800 capitalize">
                                Premium Quality
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="mb-1 text-xs font-bold tracking-wider text-slate-400 capitalize">
                                Warranty
                            </span>
                            <span className="font-bold text-slate-800 capitalize">
                                2 Years Global
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
