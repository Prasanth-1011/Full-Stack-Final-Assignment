import { useState } from "react";
import api from "../../Utils/Service";

const AccountCredentials = ({ user, role, login, showMsg }) => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showInputs, setShowInputs] = useState(false);
    const [selectedFields, setSelectedFields] = useState({
        username: false,
        mail: false,
        password: false,
    });
    const [formData, setFormData] = useState({
        username: user?.username || "",
        mail: user?.mail || "",
        password: "",
    });

    const handleToggle = (field) => {
        setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setShowInputs(false);
        setSelectedFields({ username: false, mail: false, password: false });
        setFormData({
            username: user?.username || "",
            mail: user?.mail || "",
            password: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = role === "Admin" ? "/profile/admin/update" : "/profile/user/update";
            const payload = { id: user.id };
            if (selectedFields.username) payload.username = formData.username;
            if (selectedFields.mail) payload.mail = formData.mail;
            if (selectedFields.password) payload.password = formData.password;

            const res = await api.put(endpoint, payload);
            if (selectedFields.username || selectedFields.mail) {
                const token = sessionStorage.getItem("accessToken");
                login(res.data.user || res.data.admin, token, role);
            }
            showMsg("Account Credentials Updated Successfully");
            handleCancel();
        } catch (err) {
            showMsg(err.response?.data?.message || "Account Update Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            {!isEditing ? (
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="flex flex-col gap-4 text-center">
                        <h2 className="text-xl font-extrabold text-slate-800 capitalize">
                            Account Credentials
                        </h2>
                        <p className="text-sm text-slate-500">
                            Update Your Username, Email, Password
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-secondary cursor-pointer px-6 py-2 font-bold capitalize"
                    >
                        Change Credentials
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-extrabold text-slate-800 capitalize">
                            {!showInputs
                                ? "Select Credentials To Change"
                                : "Update Selected Credentials"}
                        </h2>
                        <button
                            onClick={handleCancel}
                            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} />
                            </svg>
                        </button>
                    </div>

                    {!showInputs ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {Object.keys(selectedFields).map((field) => (
                                    <button
                                        key={field}
                                        onClick={() => handleToggle(field)}
                                        className={`cursor-pointer rounded-2xl border-2 p-6 text-sm font-bold capitalize transition-all ${selectedFields[field] ? "border-sky-500 bg-sky-500 text-white shadow-lg" : "border-slate-50 bg-slate-50 text-slate-500"}`}
                                    >
                                        {field}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCancel}
                                    className="btn-secondary flex-1 cursor-pointer py-4 font-bold capitalize"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!Object.values(selectedFields).some((v) => v)}
                                    onClick={() => setShowInputs(true)}
                                    className="btn-primary flex-2 cursor-pointer py-4 font-bold capitalize disabled:opacity-50"
                                >
                                    Confirm Selection
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {selectedFields.username && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 capitalize">
                                            Username
                                        </label>
                                        <input
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 p-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-500"
                                            required
                                        />
                                    </div>
                                )}
                                {selectedFields.mail && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 capitalize">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="mail"
                                            value={formData.mail}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 p-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-500"
                                            required
                                        />
                                    </div>
                                )}
                                {selectedFields.password && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 capitalize">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-slate-200 p-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-500"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowInputs(false)}
                                    className="btn-secondary flex-1 cursor-pointer py-4 font-bold capitalize"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-2 cursor-pointer py-4 font-bold capitalize disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Credentials"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountCredentials;
