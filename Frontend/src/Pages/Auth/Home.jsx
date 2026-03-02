import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { useAuth } from "../../Context/AuthContext";
import ProductCard from "../../Components/ProductCard";

import api from "../../Utils/Service";
import { floatUpVariants } from "../../Utils/Animations";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [offerProducts, setOfferProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { role } = useAuth();

    const offersRef = useRef(null);
    const infoRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo === "offers" && offersRef.current) {
            offersRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (location.state?.scrollTo === "info" && infoRef.current) {
            infoRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [location.state]);

    const fetchProducts = async () => {
        try {
            const [allRes, offerRes] = await Promise.all([
                api.get("/products/all"),
                api.get("/products/offer"),
            ]);
            setProducts(allRes.data.products?.slice(0, 4) || []);
            setOfferProducts(offerRes.data.products || []);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <section className="relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden bg-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-8 sm:px-6 md:flex-row lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-6 text-center md:text-left"
                    >
                        <h1 className="text-4xl leading-tight font-extrabold text-slate-900 capitalize md:text-6xl">
                            Exquisite Timepieces for{" "}
                            <span className="text-sky-500">
                                Modern Elegance
                            </span>
                        </h1>
                        <p className="mx-auto max-w-lg text-lg text-slate-500 md:mx-0">
                            Experience The Horological Craftsmanship. Our
                            Curated Premium Watch Selection Blends Timeless
                            Design With Modern Precision.
                        </p>
                        <div className="flex justify-center space-x-4 md:justify-start">
                            <Link to="/product" className="btn-primary">
                                Shop Now
                            </Link>
                            <Link to="/search" className="btn-secondary">
                                Find Yours
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 flex-1 md:mt-0"
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 animate-pulse rounded-full bg-sky-100 opacity-30 blur-3xl"></div>
                            <picture>
                                {/* Landscape for Desktop */}
                                <source
                                    media="(min-width: 992px)"
                                    srcSet="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1200"
                                />
                                {/* Portrait for Mobile/Tab */}
                                <img
                                    src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800"
                                    alt="Luxury Watch"
                                    className="relative max-h-[60vh] w-auto rounded-3xl object-contain shadow-2xl transition-transform duration-700 hover:scale-105"
                                />
                            </picture>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Offers Section */}
            {offerProducts.length > 0 && (
                <section
                    ref={offersRef}
                    className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8"
                >
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 capitalize">
                                Exclusive Offers
                            </h2>
                            <p className="mt-2 text-slate-500">
                                Limited Time Deals On Premium Items
                            </p>
                        </div>
                        <Link
                            to="/product"
                            className="font-medium text-sky-500 capitalize hover:underline"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {offerProducts.map((product, index) => (
                            <motion.div
                                key={product._id}
                                variants={floatUpVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard
                                    product={product}
                                    role={role}
                                    fetchProducts={fetchProducts}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            <section ref={infoRef} className="scroll-mt-20 bg-slate-50 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-12 text-3xl font-bold text-slate-900 capitalize">
                        Why Choose Timepiece?
                    </h2>
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        {[
                            {
                                title: "Quality Assurance",
                                desc: "Every timepiece is verified for excellence and authenticity.",
                                icon: "",
                            },
                            {
                                title: "Global Delivery",
                                desc: "Swift and secure shipping to enthusiasts worldwide.",
                                icon: "",
                            },
                            {
                                title: "Secure Transactions",
                                desc: "Encrypted payment processing for total peace of mind.",
                                icon: "",
                            },
                        ].map((item, i) => (
                            <div key={i} className="space-y-4">
                                <div className="mb-4 text-4xl">{item.icon}</div>
                                <h3 className="text-xl font-bold text-slate-800 capitalize">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
