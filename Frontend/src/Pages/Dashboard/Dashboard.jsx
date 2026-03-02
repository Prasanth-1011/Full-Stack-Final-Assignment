import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useAuth } from "../../Context/AuthContext";

const Dashboard = () => {
    const { user, role } = useAuth();

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
            >
                <div className="mb-8 flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl font-bold text-sky-500 capitalize">
                        {user?.username?.[0] || "U"}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 capitalize">
                            Welcome, {user?.username}
                        </h2>
                        <p className="text-slate-500 capitalize">{role} Account</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {role === "Admin" ? (
                        <>
                            <Link
                                to="/admin-products"
                                className="group block cursor-pointer rounded-2xl bg-slate-50 p-6 transition-colors hover:bg-sky-50"
                            >
                                <h3 className="mb-2 font-bold text-slate-800 capitalize group-hover:text-sky-600">
                                    Product Management
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Add, Edit, Or Delete Products And Offers.
                                </p>
                            </Link>
                            <Link
                                to="/admin-orders"
                                className="group block cursor-pointer rounded-2xl bg-slate-50 p-6 transition-colors hover:bg-sky-50"
                            >
                                <h3 className="mb-2 font-bold text-slate-800 capitalize group-hover:text-sky-600">
                                    Order List
                                </h3>
                                <p className="text-sm text-slate-500">
                                    View And Manage All Customer Orders.
                                </p>
                            </Link>
                            <Link
                                to="/admin-approval"
                                className="group cursor-pointer rounded-2xl bg-slate-50 p-6 transition-colors hover:bg-sky-50"
                            >
                                <h3 className="mb-2 font-bold text-slate-800 capitalize group-hover:text-sky-600">
                                    User Management
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Approve New Admins And Manage Users.
                                </p>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/orders"
                                className="group block cursor-pointer rounded-2xl bg-slate-50 p-6 transition-colors hover:bg-sky-50"
                            >
                                <h3 className="mb-2 font-bold text-slate-800 capitalize group-hover:text-sky-600">
                                    My Orders
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Track And View Your Previous Orders.
                                </p>
                            </Link>
                            <Link
                                to="/cart"
                                className="group block cursor-pointer rounded-2xl bg-slate-50 p-6 transition-colors hover:bg-sky-50"
                            >
                                <h3 className="mb-2 font-bold text-slate-800 capitalize group-hover:text-sky-600">
                                    My Cart
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Continue With Your Items In The Cart.
                                </p>
                            </Link>
                            <Link
                                to="/update-profile"
                                className="group cursor-pointer rounded-2xl bg-slate-50 p-6 transition-colors hover:bg-sky-50"
                            >
                                <h3 className="mb-2 font-bold text-slate-800 capitalize group-hover:text-sky-600">
                                    Profile Settings
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Update Your Personal Information.
                                </p>
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
