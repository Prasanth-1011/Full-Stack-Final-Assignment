import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../Context/AuthContext";

import api from "../../Utils/Service";
import { floatUpVariants } from "../../Utils/Animations";

import ProfileHeader from "./ProfileHeader";
import ProfileSettings from "./ProfileSettings";
import AccountCredentials from "./AccountCredentials";

const UpdateProfile = () => {
    const { user, role, login } = useAuth();
    const [profile, setProfile] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });

    const showMsg = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };

    const fetchProfile = async () => {
        try {
            setFetching(true);
            const response = await api.post("/profile/get", {
                userId: user.id,
            });
            setProfile(response.data);
        } catch (err) {
            console.error("Profile Fetch Error:", err);
            setProfile(null);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchProfile();
    }, [user]);

    if (fetching) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-24 left-1/2 z-50 -translate-x-1/2 rounded-xl px-8 py-3 font-bold text-white shadow-xl ${message.type === "error" ? "bg-rose-500" : "bg-emerald-500"}`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                variants={floatUpVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                <ProfileHeader
                    user={user}
                    role={role}
                    profile={profile}
                    fetchProfile={fetchProfile}
                    showMsg={showMsg}
                />
                <AccountCredentials
                    user={user}
                    role={role}
                    login={login}
                    showMsg={showMsg}
                />
                <ProfileSettings
                    profile={profile}
                    user={user}
                    fetchProfile={fetchProfile}
                    showMsg={showMsg}
                />
            </motion.div>
        </div>
    );
};

export default UpdateProfile;
