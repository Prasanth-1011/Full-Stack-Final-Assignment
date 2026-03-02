import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../Utils/Service";
import { useAuth } from "../../Context/AuthContext";
import { floatUpVariants } from "../../Utils/Animations";

const AdminProducts = () => {
    const { role } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [confirmAction, setConfirmAction] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    };
    const [selectedFields, setSelectedFields] = useState({
        name: false,
        price: false,
        category: false,
        description: false,
        stock: false,
        image: false,
    });
    const [showEditInputs, setShowEditInputs] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        stock: "",
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/products/all");
            setProducts(response.data.products || []);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === "Admin" || role === "Root") {
            fetchProducts();
        }
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (role !== "Admin" && role !== "Root") {
            showMessage("Unauthorized", "error");
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("stock", formData.stock);
        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            await api.post("/products/create", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            showMessage("Product Created Successfully!", "success");
            setFormData({
                name: "",
                price: "",
                category: "",
                description: "",
                stock: "",
            });
            setImageFile(null);
            fetchProducts();
        } catch (err) {
            showMessage(err.response?.data?.message || "Error Creating Product", "error");
        }
    };

    const handleDelete = (productId) => {
        setConfirmAction({
            label: "Are You Sure You Want To Delete This Product?",
            onConfirm: async () => {
                try {
                    await api.delete("/products/delete", {
                        data: { _id: productId },
                    });
                    showMessage("Product Deleted Successfully", "success");
                    fetchProducts();
                } catch (err) {
                    showMessage(err.response?.data?.message || "Error Deleting Product", "error");
                }
            },
        });
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setSelectedFields({
            name: false,
            price: false,
            category: false,
            description: false,
            stock: false,
            image: false,
        });
        setShowEditInputs(false);
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("_id", editingProduct._id);
        data.append("name", editingProduct.name);
        data.append("price", editingProduct.price);
        data.append("category", editingProduct.category);
        data.append("description", editingProduct.description);
        data.append("stock", editingProduct.stock);
        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            await api.put("/products/update", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            showMessage("Product Updated Successfully", "success");
            setIsEditing(false);
            setEditingProduct(null);
            setImageFile(null);
            fetchProducts();
        } catch (err) {
            showMessage(err.response?.data?.message || "Error Updating Product", "error");
        }
    };

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

            {/* Confirm Modal */}
            <AnimatePresence>
                {confirmAction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
                        >
                            <p className="mb-6 text-sm font-medium text-slate-600">
                                {confirmAction.label}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className="btn-secondary flex-1 py-2.5 text-sm font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        await confirmAction.onConfirm();
                                        setConfirmAction(null);
                                    }}
                                    className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Product Creation Form */}
                <div className="lg:col-span-1">
                    <motion.div
                        variants={floatUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
                    >
                        <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 capitalize">
                            Add New Product
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                    Product Name
                                </label>
                                <input
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 transition-all outline-none focus:ring-2 focus:ring-sky-500"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter Product Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                    Category
                                </label>
                                <input
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 transition-all outline-none focus:ring-2 focus:ring-sky-500"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value,
                                        })
                                    }
                                    placeholder="Mention Category"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 transition-all outline-none focus:ring-2 focus:ring-sky-500"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 transition-all outline-none focus:ring-2 focus:ring-sky-500"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stock: e.target.value,
                                            })
                                        }
                                        placeholder="Quantity"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                    Description
                                </label>
                                <textarea
                                    className="h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 transition-all outline-none focus:ring-2 focus:ring-sky-500"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Product description..."
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                    Product Image
                                </label>
                                <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 pt-5 pb-6">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-slate-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-slate-600">
                                            <label className="relative cursor-pointer rounded-md bg-white px-2 font-medium text-sky-600 hover:text-sky-500">
                                                <span>Upload a file</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(e) =>
                                                        setImageFile(e.target.files[0])
                                                    }
                                                    required
                                                />
                                            </label>
                                        </div>
                                        {imageFile && (
                                            <p className="mt-2 text-xs font-bold text-green-500">
                                                {imageFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-sky-100"
                            >
                                Create Product
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Product Listing */}
                <div className="lg:col-span-2">
                    <h2 className="mb-8 text-2xl font-bold text-slate-900 capitalize">
                        Existing Products
                    </h2>
                    {loading ? (
                        <div className="py-20 text-center">Loading products...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        layout
                                        className="flex items-start space-x-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="h-24 w-24 shrink-0">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full rounded-2xl object-cover shadow-sm"
                                            />
                                        </div>
                                        <div className="grow">
                                            <h3 className="line-clamp-1 font-bold text-slate-800 capitalize">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs font-bold tracking-wider text-slate-400 capitalize">
                                                {product.category}
                                            </p>
                                            <div className="mt-2 text-lg font-bold text-sky-500">
                                                ${product.price}
                                            </div>
                                            <div className="mt-4 flex space-x-3">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-xs font-bold text-slate-500 capitalize transition-colors hover:text-sky-500"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-xs font-bold text-rose-400 capitalize transition-colors hover:text-rose-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                                    <p className="text-slate-500">No products found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsEditing(false)}
                                className="absolute top-6 right-6 text-slate-400 transition-colors hover:text-slate-600"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <h2 className="mb-6 text-2xl font-bold text-slate-900 capitalize">
                                Update Product
                            </h2>

                            {!showEditInputs ? (
                                <div className="space-y-6">
                                    <p className="text-sm text-slate-500">
                                        Select the details you want to change:
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.keys(selectedFields).map((field) => (
                                            <label
                                                key={field}
                                                className="flex cursor-pointer items-center space-x-3 rounded-xl border border-slate-100 p-3 capitalize transition-colors hover:bg-slate-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 rounded text-sky-500 focus:ring-sky-500"
                                                    checked={selectedFields[field]}
                                                    onChange={() =>
                                                        setSelectedFields({
                                                            ...selectedFields,
                                                            [field]: !selectedFields[field],
                                                        })
                                                    }
                                                />
                                                <span className="font-medium text-slate-700">
                                                    {field}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <button
                                        disabled={!Object.values(selectedFields).some((v) => v)}
                                        onClick={() => setShowEditInputs(true)}
                                        className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Confirm Selection
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    {selectedFields.name && (
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                                Product Name
                                            </label>
                                            <input
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                                                value={editingProduct.name}
                                                onChange={(e) =>
                                                    setEditingProduct({
                                                        ...editingProduct,
                                                        name: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    )}
                                    {selectedFields.category && (
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                                Category
                                            </label>
                                            <input
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                                                value={editingProduct.category}
                                                onChange={(e) =>
                                                    setEditingProduct({
                                                        ...editingProduct,
                                                        category: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedFields.price && (
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                                    Price ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                                                    value={editingProduct.price}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            price: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        )}
                                        {selectedFields.stock && (
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                                    Stock
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                                                    value={editingProduct.stock}
                                                    onChange={(e) =>
                                                        setEditingProduct({
                                                            ...editingProduct,
                                                            stock: e.target.value,
                                                        })
                                                    }
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {selectedFields.description && (
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                                Description
                                            </label>
                                            <textarea
                                                className="h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:ring-2 focus:ring-sky-500"
                                                value={editingProduct.description}
                                                onChange={(e) =>
                                                    setEditingProduct({
                                                        ...editingProduct,
                                                        description: e.target.value,
                                                    })
                                                }
                                                required
                                            ></textarea>
                                        </div>
                                    )}
                                    {selectedFields.image && (
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold tracking-wider text-slate-700 capitalize">
                                                Product Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-sky-700 hover:file:bg-sky-100"
                                                onChange={(e) => setImageFile(e.target.files[0])}
                                                required
                                            />
                                        </div>
                                    )}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditInputs(false)}
                                            className="btn-secondary flex-1 border-2 py-4 font-bold"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary flex-2 py-4 text-lg font-bold shadow-xl shadow-sky-100"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
