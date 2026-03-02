import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../Utils/Service";
import { useAuth } from "../../Context/AuthContext";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const { role } = useAuth();

    const showMessage = (text, type = "Success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.post("/order/all");
                setOrders(response.data || []);
            } catch (error) {
                console.error("Error Fetching Orders:", error.message);
            } finally {
                setLoading(false);
            }
        };
        if (role === "Admin" || role === "Root") fetchOrders();
    }, [role]);

    const updateStatus = async (orderNumber, status) => {
        try {
            await api.put("/order/update", { orderNumber, status });
            setOrders(
                orders.map((ord) => (ord.orderNumber === orderNumber ? { ...ord, status } : ord)),
            );
            showMessage("Status Updated Successfully", "Success");
        } catch (error) {
            showMessage(error.response?.data?.message || "Failed To Update Status", "Error");
        }
    };

    if (loading) return <div className="py-20 text-center">Loading Orders...</div>;

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

            <h2 className="mb-10 text-center text-3xl font-bold text-slate-900 capitalize">
                Manage Orders
            </h2>
            <div className="mx-auto flex max-w-5xl flex-col space-y-6">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <motion.div
                            layout
                            key={order._id}
                            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row"
                        >
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-lg font-bold text-slate-800">
                                    Order {order.orderNumber}
                                </h3>
                                <p className="text-sm text-slate-500">User ID: {order.userId}</p>
                                <div className="mt-3 space-y-1 text-sm text-slate-600">
                                    {order.products?.map((p, i) => (
                                        <div key={i} className="flex justify-between gap-8">
                                            <span className="font-medium">
                                                - {p.name || p.productId} (x
                                                {p.quantity})
                                            </span>
                                            <span className="text-slate-400">
                                                ${(p.price * p.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-lg font-bold text-sky-500">
                                    Total: ${order.total?.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex min-w-[180px] flex-col justify-center space-y-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold tracking-wider text-slate-400 capitalize">
                                        Current Status
                                    </span>
                                    <div className="flex items-center">
                                        <div
                                            className={`mr-2 h-2 w-2 rounded-full ${
                                                order.status === "Delivered"
                                                    ? "bg-green-500"
                                                    : order.status === "Cancelled"
                                                      ? "bg-red-500"
                                                      : order.status === "Dispatched"
                                                        ? "bg-blue-500"
                                                        : "bg-sky-500"
                                            }`}
                                        />
                                        <span className="text-sm font-bold text-slate-700">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    {order.status === "Received" && (
                                        <button
                                            onClick={() =>
                                                updateStatus(order.orderNumber, "Dispatched")
                                            }
                                            className="w-full rounded-xl bg-sky-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-200 transition-all hover:bg-sky-600 hover:shadow-sky-300 active:scale-95"
                                        >
                                            Dispatch Order
                                        </button>
                                    )}

                                    {order.status === "Dispatched" && (
                                        <button
                                            onClick={() =>
                                                updateStatus(order.orderNumber, "Delivered")
                                            }
                                            className="w-full rounded-xl bg-green-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-green-200 transition-all hover:bg-green-600 hover:shadow-green-300 active:scale-95"
                                        >
                                            Complete Delivery
                                        </button>
                                    )}

                                    {(order.status === "Received" ||
                                        order.status === "Dispatched") && (
                                        <button
                                            onClick={() =>
                                                updateStatus(order.orderNumber, "Cancelled")
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-400 transition-all hover:bg-slate-50 hover:text-rose-500 active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    {order.status === "Delivered" && (
                                        <div className="flex w-full items-center justify-center rounded-xl border border-green-100 bg-green-50 py-2.5 text-xs font-bold text-green-600">
                                            Successfully Delivered
                                        </div>
                                    )}

                                    {order.status === "Cancelled" && (
                                        <div className="flex w-full items-center justify-center rounded-xl border border-red-100 bg-red-50 py-2.5 text-xs font-bold text-red-600">
                                            Order Terminated
                                        </div>
                                    )}
                                </div>

                                <p className="text-right text-[10px] font-medium text-slate-400">
                                    Updated:{" "}
                                    {new Date(order.updatedAt || order.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center">
                        <p className="text-slate-500">No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
