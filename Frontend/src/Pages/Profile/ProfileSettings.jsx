import { useState } from "react";
import { motion } from "framer-motion";

import api from "../../Utils/Service";
import ProfileDetailsForm from "./ProfileDetailsForm";

const ProfileSettings = ({ profile, user, fetchProfile, showMsg }) => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showEditInputs, setShowEditInputs] = useState(false);
    const [selectedFields, setSelectedFields] = useState({
        phone: false,
        location: false,
        address: false,
    });
    const [formData, setFormData] = useState({
        phone: profile?.phone || "",
        location: profile?.location || "",
        address: profile?.address || "",
    });

    const handleFieldToggle = (field) => {
        setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const profileData = new FormData();
            profileData.append("userId", user.id);
            profileData.append("phone", formData.phone);
            profileData.append("location", formData.location);
            profileData.append("address", formData.address);

            if (profile) {
                await api.put("/profile/update", profileData);
                showMsg("Profile Updated Successfully");
            } else {
                await api.post("/profile/create", profileData);
                showMsg("Profile Created Successfully");
            }

            setIsEditing(false);
            setShowEditInputs(false);
            fetchProfile();
        } catch (error) {
            showMsg(
                error.response?.data?.message || "Operation Failed",
                "error",
            );
        } finally {
            setLoading(false);
        }
    };

    if (!profile) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
            >
                <h2 className="mb-8 text-2xl font-extrabold text-slate-800">
                    Finish Your Profile
                </h2>
                <ProfileDetailsForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    isAddMode={true}
                />
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            {!isEditing ? (
                <div className="flex justify-center md:justify-start">
                    <button
                        onClick={() => {
                            setIsEditing(true);
                            setShowEditInputs(false);
                            setSelectedFields({
                                phone: false,
                                location: false,
                                address: false,
                            });
                        }}
                        className="btn-primary cursor-pointer px-8 py-3 text-sm font-bold capitalize shadow-lg shadow-sky-100"
                    >
                        Update Details
                    </button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
                >
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-extrabold text-slate-800 capitalize">
                            {!showEditInputs
                                ? "Select Details To Change"
                                : "Update Selected Details"}
                        </h2>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setShowEditInputs(false);
                            }}
                            className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    d="M6 18L18 6M6 6l12 12"
                                    strokeWidth={2}
                                />
                            </svg>
                        </button>
                    </div>

                    {!showEditInputs ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {Object.keys(selectedFields).map((field) => (
                                    <button
                                        key={field}
                                        onClick={() => handleFieldToggle(field)}
                                        className={`cursor-pointer rounded-2xl border-2 p-6 text-sm font-bold capitalize transition-all duration-300 ${selectedFields[field] ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-100" : "border-slate-50 bg-slate-50 text-slate-500 hover:border-sky-200 hover:bg-white"}`}
                                    >
                                        {field}
                                        {selectedFields[field] && (
                                            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-white"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={
                                    !Object.values(selectedFields).some(
                                        (v) => v,
                                    )
                                }
                                onClick={() => setShowEditInputs(true)}
                                className="btn-primary w-full cursor-pointer py-5 text-lg font-extrabold capitalize shadow-xl shadow-sky-100 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Confirm Selection
                            </button>
                        </div>
                    ) : (
                        <ProfileDetailsForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            loading={loading}
                            selectedFields={selectedFields}
                            showEditInputs={showEditInputs}
                            setShowEditInputs={setShowEditInputs}
                        />
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default ProfileSettings;
