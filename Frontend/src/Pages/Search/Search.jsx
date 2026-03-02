import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import api from "../../Utils/Service";
import { useAuth } from "../../Context/AuthContext";
import ProductCard from "../../Components/ProductCard";
import { floatUpVariants } from "../../Utils/Animations";

const Search = () => {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();

    const fetchAllProducts = async () => {
        try {
            const response = await api.get("/products/all");
            setProducts(response.data.products || []);
            setFilteredProducts(response.data.products || []);
        } catch (err) {
            console.error("Error Fetching Products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (!value) {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter(
            (p) =>
                p.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
                p.description.toLowerCase().indexOf(value.toLowerCase()) !==
                    -1 ||
                p.category.toLowerCase().indexOf(value.toLowerCase()) !== -1,
        );
        setFilteredProducts(filtered);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 capitalize">
                    Search Products
                </h2>
                <div className="relative mx-auto max-w-2xl">
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="Search For Watches, Requirements..."
                        className="w-full rounded-2xl border-none bg-white py-4 pr-4 pl-12 text-slate-700 shadow-sm shadow-sky-100 transition-all focus:ring-2 focus:ring-sky-500"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product._id}
                            variants={floatUpVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{
                                opacity: 0,
                                scale: 0.8,
                                transition: { duration: 0.3 },
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: (index % 8) * 0.1,
                            }}
                            layout
                        >
                            {query && (
                                <ProductCard
                                    product={product}
                                    role={role}
                                    fetchProducts={fetchAllProducts}
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && !loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center"
                >
                    <div className="mb-4 text-6xl"></div>
                    <h3 className="text-xl font-semibold text-slate-800 capitalize">
                        No Products Found
                    </h3>
                    <p className="mt-2 text-slate-500">
                        Try Searching For Something Else
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default Search;
