import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import api from "../Utils/Service";
import { useAuth } from "../Context/AuthContext";
import { defaultHover, defaultTap } from "../Utils/Animations";

const ProductCard = ({ product, role, fetchProducts }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [message, setMessage] = useState({ text: "", type: "" });
    const [confirmAction, setConfirmAction] = useState(null);
    const [offerModal, setOfferModal] = useState(false);
    const [offerInput, setOfferInput] = useState("");

    const showMessage = (text, type = "Success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const handleAddToCart = async (redirect = false) => {
        try {
            if (!user) {
                showMessage("Please Login", "Error");
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
                    "Success",
                );
            }
        } catch (error) {
            showMessage(
                error.response?.data?.message || "Failed To Add To Cart",
                "Error",
            );
        }
    };

    const handleAddOffer = async () => {
        const percentage = Number(offerInput);
        if (!offerInput || isNaN(percentage)) {
            showMessage("Please Enter A Valid Percentage", "Error");
            return;
        }
        try {
            await api.put("/products/update", {
                _id: product._id,
                offer: true,
                offerPercentage: percentage,
            });
            showMessage("Offer Updated Successfully", "Success");
            setOfferModal(false);
            setOfferInput("");
            if (fetchProducts) fetchProducts();
        } catch (err) {
            showMessage(
                err.response?.data?.message || "Failed Updating Offer",
                "Error",
            );
        }
    };

    const handleDeleteOffer = () => {
        setConfirmAction({
            label: "Are You Sure? Remove This Offer?",
            onConfirm: async () => {
                try {
                    await api.put("/products/update", {
                        _id: product._id,
                        offer: false,
                        offerPercentage: 0,
                    });
                    showMessage("Offer Removed Successfully", "Success");
                    if (fetchProducts) fetchProducts();
                } catch (err) {
                    showMessage(
                        err.response?.data?.message || "Failed To Remove Offer",
                        "Error",
                    );
                }
            },
        });
    };

    const handleDeleteProduct = () => {
        setConfirmAction({
            label: "Are You Sure You Want To Permanently Delete This Product?",
            onConfirm: async () => {
                try {
                    await api.delete("/products/delete", {
                        data: { _id: product._id },
                    });
                    showMessage("Product Deleted Successfully", "Success");
                    if (fetchProducts) fetchProducts();
                } catch (err) {
                    showMessage(
                        err.response?.data?.message || "Error Deleting Product",
                        "Error",
                    );
                }
            },
        });
    };

    const { name, price, offer, offerPercentage, description, image, stock } =
        product;
    const discountedPrice = offer
        ? price - (price * offerPercentage) / 100
        : price;

    return (
        <div>
            {/* Toast Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: -8 }}
                        exit={{ opacity: 0, y: -16 }}
                        className={`mb-3 rounded-lg px-4 py-2 text-center text-sm font-bold ${
                            message.type === "Error"
                                ? "text-rose-500"
                                : "text-emerald-500"
                        }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Modal */}
            <AnimatePresence>
                {confirmAction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
                        >
                            <p className="mb-6 text-sm font-medium text-slate-600">
                                {confirmAction.label}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className="btn-secondary flex-1 py-2.5 text-sm font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        await confirmAction.onConfirm();
                                        setConfirmAction(null);
                                    }}
                                    className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Offer Input Modal */}
            <AnimatePresence>
                {offerModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
                        >
                            <h3 className="mb-4 text-lg font-bold text-slate-800 capitalize">
                                {offer ? "Edit Offer" : "Add Offer"}
                            </h3>
                            <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-500 capitalize">
                                Offer Percentage (%)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={offerInput}
                                onChange={(e) => setOfferInput(e.target.value)}
                                placeholder=""
                                className="mb-6 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setOfferModal(false);
                                        setOfferInput("");
                                    }}
                                    className="btn-secondary flex-1 cursor-pointer py-2.5 text-sm font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddOffer}
                                    className="btn-primary flex-1 cursor-pointer py-2.5 text-sm font-bold"
                                >
                                    Apply Offer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Card */}
            <motion.div
                whileHover={defaultHover}
                whileTap={defaultTap}
                className="card group rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
                <Link
                    to={`/product/${name}`}
                    className="group relative block overflow-hidden"
                >
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={image}
                        alt={name}
                        className="h-64 w-full object-cover transition-transform duration-500"
                    />
                    {offer && (
                        <div className="absolute top-4 left-4 rounded-lg bg-sky-500 px-3 py-1 text-xs font-bold text-white capitalize shadow-lg">
                            {offerPercentage}% Off
                        </div>
                    )}
                    {stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                            <span className="rounded-xl bg-white px-4 py-2 text-sm font-bold tracking-wider text-slate-900 capitalize shadow-xl">
                                Out Of Stock
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>

                <div className="space-y-4 p-5">
                    <Link to={`/product/${name}`} className="group/title block">
                        <h3 className="line-clamp-1 text-lg font-bold text-slate-800 capitalize transition-colors group-hover/title:text-sky-500">
                            {name}
                        </h3>
                        <p className="mt-1 text-xs font-bold tracking-widest text-slate-400 capitalize">
                            {product.category || "Watches"}
                        </p>
                    </Link>
                    <p className="mt-1 mb-4 line-clamp-2 h-10 text-sm text-slate-500">
                        {description}
                    </p>

                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <span className="text-xl font-bold text-sky-500">
                                ${discountedPrice.toFixed(2)}
                            </span>
                            {offer && (
                                <span className="ml-2 text-sm text-slate-400 line-through">
                                    ${price.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <span
                            className={`rounded px-2 py-1 text-xs font-medium ${stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                        >
                            {stock > 0 ? `${stock} In Stock` : "Out of Stock"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {role === "Admin" ? (
                        <div className="flex w-full gap-2">
                            <button
                                onClick={() => setOfferModal(true)}
                                className="btn-primary grow cursor-pointer bg-emerald-500 py-2 text-xs shadow-emerald-100 hover:bg-emerald-600"
                            >
                                {offer ? "Edit Offer" : "Add Offer"}
                            </button>
                            {offer && (
                                <button
                                    onClick={handleDeleteOffer}
                                    className="cursor-pointer rounded-lg border border-slate-100 bg-rose-50 px-3 py-2 text-rose-500 transition-colors hover:bg-rose-100"
                                    title="Remove Offer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 cursor-pointer"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={handleDeleteProduct}
                                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-500"
                                title="Delete Product"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => handleAddToCart(false)}
                                disabled={stock <= 0}
                                className={`btn-secondary flex-1 py-2 text-xs ${stock <= 0 ? "cursor-not-allowed opacity-50" : ""}`}
                            >
                                Add To Cart
                            </button>
                            <button
                                onClick={() => handleAddToCart(true)}
                                disabled={stock <= 0}
                                className={`btn-primary flex-1 py-2 text-xs ${stock <= 0 ? "cursor-not-allowed opacity-50" : ""}`}
                            >
                                Buy Now
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProductCard;
