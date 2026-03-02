import { useState } from "react";

import api from "../../Utils/Service";
import defaultAvatar from "../../Assets/Image-Avatar.jpg";

const ProfileHeader = ({ user, role, profile, fetchProfile, showMsg }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(profile?.image || defaultAvatar);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageUpdate = async () => {
        if (!imageFile) return;
        setLoading(true);
        const data = new FormData();
        data.append("userId", user.id);
        data.append("image", imageFile);

        try {
            await api.put("/profile/update-image", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            showMsg("Profile Image Updated Successfully");
            setImageFile(null);
            fetchProfile();
        } catch (err) {
            showMsg(err.response?.data?.message || "Image Update Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
                {/* Profile Image */}
                <div className="group relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-4 border-slate-50 shadow-inner">
                    <img src={imagePreview} alt="Avatar" className="h-full w-full object-cover" />

                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        {imageFile ? "Update Image?" : "Change Photo"}
                    </label>

                    {imageFile && (
                        <button
                            onClick={handleImageUpdate}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-sky-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg"
                        >
                            {loading ? "..." : "Save"}
                        </button>
                    )}
                </div>

                <div className="grow space-y-4 text-center md:text-left">
                    <div className="flex flex-col gap-2">
                        <h1
                            title={user?.mail}
                            className="mx-auto w-fit px-4 text-3xl font-extrabold text-slate-900 capitalize md:mx-0"
                        >
                            {user?.username}
                        </h1>
                        <span className="mx-auto inline-block w-fit rounded-full bg-sky-50 p-2 px-4 text-sm font-bold tracking-wide text-sky-600 capitalize md:mx-0">
                            {role} Account
                        </span>
                    </div>

                    {profile ? (
                        <div className="grid grid-cols-1 gap-4 pt-4">
                            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 capitalize">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-sky-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        strokeWidth={2}
                                    />
                                </svg>
                                {profile.phone}
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 capitalize">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-sky-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        strokeWidth={2}
                                    />
                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2} />
                                </svg>
                                {profile.location}
                            </div>
                            <div className="col-span-full flex items-center gap-3 text-sm font-semibold text-slate-600 capitalize">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-sky-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        strokeWidth={2}
                                    />
                                </svg>
                                {profile.address}
                            </div>
                        </div>
                    ) : (
                        <p className="inline-block rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-500 capitalize">
                            No Profile Details Added Yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
