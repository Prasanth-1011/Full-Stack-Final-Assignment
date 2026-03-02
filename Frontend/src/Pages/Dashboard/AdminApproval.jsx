import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import api from "../../Utils/Service";
import { useAuth } from "../../Context/AuthContext";

const AdminApproval = () => {
    const { user, role } = useAuth();
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchPendingAdmins = async () => {
        try {
            const response = await api.post("/admin/pending", {
                rootId: user.id,
            });
            setPendingAdmins(response.data.pendingAdmins);
        } catch (err) {
            setError(err.response?.data?.message || "Failed To Fetch Pending Admins");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === "Admin" && user?.status === "Root") {
            fetchPendingAdmins();
        } else {
            setError("Access Denied. Root Admin only.");
            setLoading(false);
        }
    }, [role, user]);

    const handleApprove = async (adminId) => {
        setError("");
        setSuccess("");
        try {
            const response = await api.put("/admin/approve", {
                rootId: user.id,
                adminIdToApprove: adminId,
            });
            setSuccess(`${response.data.admin.username} Has Been Approved.`);
            fetchPendingAdmins();
        } catch (err) {
            setError(err.response?.data?.message || "Failed To Approve Admin");
        }
    };

    const handleReject = async (adminId) => {
        setError("");
        setSuccess("");
        try {
            const response = await api.put("/admin/reject", {
                rootId: user.id,
                adminIdToReject: adminId,
            });
            setSuccess(`${response.data.admin.username} Has Been Rejected.`);
            fetchPendingAdmins();
        } catch (err) {
            setError(err.response?.data?.message || "Failed To Reject Admin");
        }
    };

    if (loading) {
        return <div className="py-12 text-center">Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
            >
                <h2 className="mb-6 text-2xl font-bold text-slate-800 capitalize">
                    Pending Admin Approvals
                </h2>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-500">
                        {success}
                    </div>
                )}

                {pendingAdmins.length === 0 ? (
                    <p className="py-8 text-center text-slate-500">No Pending Admins Found.</p>
                ) : (
                    <div className="space-y-4">
                        {pendingAdmins.map((admin) => (
                            <div
                                key={admin._id}
                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
                            >
                                <div>
                                    <h3 className="font-semibold text-slate-800 capitalize">
                                        {admin.username}
                                    </h3>
                                    <p className="text-sm text-slate-500">{admin.mail}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleApprove(admin._id)}
                                        className="btn-primary px-4 py-2 shadow-sky-100"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(admin._id)}
                                        className="rounded-full bg-red-500 px-4 py-2 font-medium text-white shadow-md shadow-red-100 transition-all hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminApproval;
