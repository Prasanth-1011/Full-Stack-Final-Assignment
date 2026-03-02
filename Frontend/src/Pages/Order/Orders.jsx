import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../Utils/Service";
import { useAuth } from "../../Context/AuthContext";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [confirmOrderNumber, setConfirmOrderNumber] = useState(null);
    const { user } = useAuth();

    const showMessage = (text, type = "Success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const fetchOrders = async () => {
        try {
            const response = await api.post("/order/user", {
                userId: user.id,
            });
            setOrders(response.data || []);
        } catch (error) {
            console.error("Error Fetching Orders:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const handleCancel = async () => {
        try {
            await api.post("/order/cancel", {
                orderNumber: confirmOrderNumber,
            });
            setConfirmOrderNumber(null);
            showMessage("Order Cancelled Successfully", "Success");
            fetchOrders();
        } catch (error) {
            setConfirmOrderNumber(null);
            showMessage(error.response?.data?.message || "Failed To Cancel Order", "Error");
        }
    };

    if (loading) return <div className="py-20 text-center">Loading Your Orders...</div>;

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
                            message.type === "Error" ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmOrderNumber && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
                        >
                            <h3 className="mb-2 text-lg font-bold text-slate-800 capitalize">
                                Cancel Order
                            </h3>
                            <p className="mb-6 text-sm text-slate-500">
                                Are You Sure You Want To Cancel Order
                                {confirmOrderNumber}? This Cannot Be Undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmOrderNumber(null)}
                                    className="btn-secondary flex-1 py-2.5 text-sm font-bold"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <h2 className="mb-10 text-center text-3xl font-bold text-slate-900 capitalize">
                Orders
            </h2>
            <div className="mx-auto max-w-4xl space-y-6">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <motion.div
                            layout
                            key={order._id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    Order {order.orderNumber}
                                </h3>
                                <div className="mt-4 space-y-2 border-t border-slate-50 pt-4">
                                    {order.products?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col justify-between gap-2 text-sm text-slate-600"
                                        >
                                            <span className="font-medium">
                                                {item.quantity !== 1 ? (
                                                    <span>
                                                        {item.name} - ${item.price} x{" "}
                                                        {item.quantity}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {item.name} - ${item.price}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 text-lg font-bold text-sky-500">
                                    Total: ${order.total.toFixed(2)}
                                </p>
                            </div>
                            <div className="mt-4 flex flex-col items-end justify-between sm:mt-0 sm:text-right">
                                <span
                                    className={`rounded-full px-4 py-2 text-xs font-bold ${order.status === "Delivered" ? "bg-green-100 text-green-700" : order.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700"}`}
                                >
                                    {order.status || "Pending"}
                                </span>

                                {(order.status === "Received" || order.status === "Dispatched") && (
                                    <button
                                        onClick={() => setConfirmOrderNumber(order.orderNumber)}
                                        className="mt-3 text-xs font-bold tracking-wider text-rose-500 capitalize transition-colors hover:text-rose-600"
                                    >
                                        Cancel Order
                                    </button>
                                )}

                                <p className="mt-3 text-xs text-slate-400">
                                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center">
                        <p className="text-slate-500">You Haven't Placed Any Orders Yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
