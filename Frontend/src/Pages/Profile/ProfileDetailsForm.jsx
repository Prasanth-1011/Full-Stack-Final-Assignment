const ProfileDetailsForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    loading,
    selectedFields,
    setShowEditInputs,
    isAddMode = false,
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {(isAddMode || selectedFields.phone) && (
                    <div className="space-y-2">
                        <label className="px-2 text-sm font-bold text-slate-400 capitalize">
                            Phone Number
                        </label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter Your Phone Number"
                            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>
                )}
                {(isAddMode || selectedFields.location) && (
                    <div className="space-y-2">
                        <label className="px-2 text-sm font-bold text-slate-400 capitalize">
                            Location
                        </label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>
                )}
                {(isAddMode || selectedFields.address) && (
                    <div className="space-y-2 md:col-span-2">
                        <label className="px-2 text-sm font-bold text-slate-400 capitalize">
                            Shipping Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Full Shipping Address"
                            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>
                )}
            </div>
            <div className="flex gap-4 pt-4">
                {!isAddMode && (
                    <button
                        type="button"
                        onClick={() => setShowEditInputs(false)}
                        className="btn-secondary flex-1 cursor-pointer py-4 font-bold capitalize"
                    >
                        Back
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary cursor-pointer py-4 text-lg font-bold capitalize shadow-xl shadow-sky-100 disabled:opacity-50 ${isAddMode ? "w-full" : "flex-2"}`}
                >
                    {loading
                        ? "Saving..."
                        : isAddMode
                          ? "Add Profile Details"
                          : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

export default ProfileDetailsForm;
