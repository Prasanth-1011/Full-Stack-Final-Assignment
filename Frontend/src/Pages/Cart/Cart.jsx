import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../Utils/Service";
import { useAuth } from "../../Context/AuthContext";
import { defaultHover, defaultTap } from "../../Utils/Animations";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const showMessage = (text, type = "Success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const fetchCart = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await api.post("/cart/get", { userId: user.id });
            setCartItems(response.data.cart?.products || []);
        } catch (err) {
            console.error("Error Fetching Cart:", err);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const handleUpdateQuantity = async (productId, currentQty, targetQty) => {
        try {
            if (targetQty > currentQty) {
                await api.post("/cart/add", {
                    userId: user.id,
                    productId,
                });
            } else {
                await api.post("/cart/remove", {
                    userId: user.id,
                    productId,
                });
            }
            fetchCart();
        } catch (error) {
            console.error("Update Quantity Error:", error.message);
            showMessage(error.response?.data?.message || "Failed To Update Quantity", "Error");
        }
    };

    const handleClearCart = async () => {
        try {
            await api.delete("/cart/clear", { data: { userId: user.id } });
            setCartItems([]);
            setShowClearConfirm(false);
            showMessage("Cart Cleared!", "Success");
        } catch (err) {
            setShowClearConfirm(false);
            showMessage("Failed Clearing Cart Items", "Error");
        }
    };

    const handleCheckout = async () => {
        try {
            try {
                const profileRes = await api.post("/profile/get", {
                    userId: user.id,
                });
                if (
                    !profileRes.data.phone ||
                    !profileRes.data.address ||
                    !profileRes.data.location
                ) {
                    throw new Error("Incomplete Profile");
                }
            } catch (error) {
                showMessage("Please Complete Your Profile Details Before Ordering", "Error");
                setTimeout(() => navigate("/profile"), 2000);
                return;
            }

            const items = cartItems.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
            }));
            const totalAmount = calculateTotal();

            const profileRes = await api.post("/profile/get", {
                userId: user.id,
            });
            const { name, phone, address } = profileRes.data;

            await api.post("/order/create", {
                userId: user.id,
                name: user.username,
                phone,
                address,
                items,
                totalAmount,
            });

            await api.delete("/cart/clear", { data: { userId: user.id } });
            showMessage("Order Placed Successfully!", "Success");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            console.error("Checkout Error:", err);
            showMessage(
                err.response?.data?.message || "Failed Checkout. Items Might Be Without Stock.",
                "Error",
            );
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => {
            if (!item.productId) return acc;
            const price = item.productId.offer
                ? item.productId.price -
                  (item.productId.price * item.productId.offerPercentage) / 100
                : item.productId.price;
            return acc + price * item.quantity;
        }, 0);
    };

    if (loading)
        return (
            <div className="animate-pulse py-20 text-center text-slate-500">
                Loading Your Cart...
            </div>
        );

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Toast Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg ${
                            message.type === "error" ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Clear Cart Confirm Modal */}
            <AnimatePresence>
                {showClearConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
                        >
                            <h3 className="mb-2 text-lg font-bold text-slate-800 capitalize">
                                Clear Your Cart
                            </h3>
                            <p className="mb-6 text-sm text-slate-500">
                                Are You Sure You Want To Clear All Items From Your Cart?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="btn-secondary flex-1 py-2.5 text-sm font-bold"
                                >
                                    Keep Items
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600"
                                >
                                    Yes, Clear
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mb-10 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900 capitalize">Your Cart</h2>
                {cartItems.length > 0 && (
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="text-sm font-bold text-rose-500 transition-colors hover:text-rose-600"
                    >
                        Clear All Items
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <AnimatePresence mode="popLayout">
                        {cartItems.filter((item) => item.productId).length > 0 ? (
                            cartItems
                                .filter((item) => item.productId)
                                .map((item) => (
                                    <motion.div
                                        key={item.productId._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col items-center space-y-4 space-x-0 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:space-y-0 sm:space-x-6"
                                    >
                                        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-50">
                                            <img
                                                src={item.productId.image}
                                                alt={item.productId.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="w-full grow">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-800 capitalize">
                                                        {item.productId.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm font-semibold tracking-widest text-slate-400 capitalize">
                                                        {item.productId.category || "Watches"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center space-x-3">
                                                    <motion.button
                                                        whileHover={defaultHover}
                                                        whileTap={defaultTap}
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.productId._id,
                                                                item.quantity,
                                                                item.quantity - 1,
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M20 12H4"
                                                            />
                                                        </svg>
                                                    </motion.button>
                                                    <span className="w-8 text-center font-bold text-slate-700">
                                                        {item.quantity}
                                                    </span>
                                                    <motion.button
                                                        whileHover={defaultHover}
                                                        whileTap={defaultTap}
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.productId._id,
                                                                item.quantity,
                                                                item.quantity + 1,
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-500"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 4v16m8-8H4"
                                                            />
                                                        </svg>
                                                    </motion.button>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-black text-sky-500">
                                                        $
                                                        {(item.productId.offer
                                                            ? item.productId.price -
                                                              (item.productId.price *
                                                                  item.productId.offerPercentage) /
                                                                  100
                                                            : item.productId.price
                                                        ).toFixed(2)}
                                                    </div>
                                                    {item.productId.offer && (
                                                        <div className="text-xs text-slate-400 line-through decoration-rose-400">
                                                            ${item.productId.price.toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center"
                            >
                                <div className="mb-4 flex justify-center text-slate-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-20 w-20"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-xl font-bold text-slate-400">
                                    Your Cart Feeling Light.
                                </p>
                                <button
                                    onClick={() => navigate("/product")}
                                    className="mt-6 font-bold text-sky-500 underline hover:text-sky-600"
                                >
                                    Browse Products
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100">
                        <h3 className="mb-8 border-b pb-4 text-2xl font-black text-slate-900 capitalize">
                            Sum Summary
                        </h3>
                        <div className="mb-10 space-y-5">
                            <div className="flex justify-between font-bold text-slate-500">
                                <span>Subtotal</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-500">
                                <span>Shipping Fees</span>
                                <span className="text-emerald-500">Free</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                <span className="text-lg font-bold text-slate-900">
                                    Total Amount
                                </span>
                                <span className="text-3xl font-black text-sky-500">
                                    ${calculateTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            className={`btn-primary w-full py-5 text-lg font-black shadow-2xl transition-all hover:scale-[1.02] ${cartItems.length === 0 ? "cursor-not-allowed opacity-50 grayscale" : "shadow-sky-100"}`}
                        >
                            Complete Checkout
                        </button>
                        <p className="mt-6 px-4 text-center text-xs font-bold text-slate-400">
                            Secure Payments. All Taxes Calculated At Checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
