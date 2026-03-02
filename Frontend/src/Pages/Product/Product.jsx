import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../Utils/Service";
import ProductCard from "../../Components/ProductCard";
import { floatUpVariants } from "../../Utils/Animations";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const { role } = useAuth();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/products/all");
            const allProducts = response.data.products || [];
            setProducts(allProducts);
            setFilteredProducts(allProducts);
        } catch (error) {
            console.error("Error Fetching Products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(
                products.filter((p) => p.category === activeCategory),
            );
        }
    }, [activeCategory, products]);

    const categories = ["All", "Men", "Women", "Smart Watch", "Accessories"];

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-32">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
                <p className="animate-pulse font-bold text-slate-500">
                    Loading Collection...
                </p>
            </div>
        );

    return (
        <div className="mx-auto min-h-[84vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 text-center"
            >
                <h1 className="mb-4 text-5xl font-black tracking-tight text-slate-900">
                    Our Premium Collection
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-500">
                    Meticulously Crafted Essentials Designed For The Modern
                    Professional. Elevate Your Everyday Carry With Our Curated
                    Selection.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
                                activeCategory === cat
                                    ? "scale-105 bg-sky-500 text-white shadow-lg shadow-sky-200"
                                    : "border border-slate-100 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-500"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
                <motion.div
                    layout
                    className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product._id}
                            variants={floatUpVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            layout
                        >
                            <ProductCard
                                product={product}
                                role={role}
                                fetchProducts={fetchProducts}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {filteredProducts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center"
                >
                    <p className="text-2xl font-bold text-slate-400">
                        No Products Found {`${activeCategory}`} Category
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default Product;
