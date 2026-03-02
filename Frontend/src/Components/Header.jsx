import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../Context/AuthContext";

const Header = () => {
    const [menu, setMenu] = useState(false);
    const { user, role, logout } = useAuth();
    const [logoutMsg, setLogoutMsg] = useState(false);
    const navigate = useNavigate();

    const links = [
        { name: "Products", path: "/product", show: true },
        { name: "Profile", path: "/profile", show: !!user },
        { name: "Login", path: "/login", show: !user },
        { name: "Register", path: "/register", show: !user },
        { name: "Dashboard", path: "/dashboard", show: !!user },
        { name: "Cart", path: "/cart", show: role === "User" },
        {
            name: "Logout",
            action: () => {
                logout();
                setMenu(false);
                setLogoutMsg(true);
                setTimeout(() => {
                    setLogoutMsg(false);
                    navigate("/");
                }, 1500);
            },
            show: !!user,
        },
    ];

    const mobileMenuVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white py-4 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link to="/" className="flex items-center">
                            <span className="text-3xl font-extrabold tracking-wide text-sky-500 capitalize">
                                Timepiece
                            </span>
                        </Link>

                        {/* Mobile Menu */}
                        <div className="flex items-center md:hidden">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/search")}
                                className="mr-4 rounded-full bg-slate-100 p-2 text-slate-600 transition-all duration-300 hover:bg-sky-50 hover:text-sky-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
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
                            </motion.button>
                            <button
                                onClick={() => setMenu(!menu)}
                                className="text-sky-500 focus:outline-none"
                            >
                                {menu ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.5}
                                        stroke="currentColor"
                                        className="size-8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18 18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.5}
                                        stroke="currentColor"
                                        className="size-8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center space-x-10 md:flex">
                            {links
                                .filter((link) => link.show)
                                .map((link) =>
                                    link.path ? (
                                        <NavLink
                                            key={link.name}
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `group relative text-sm font-semibold capitalize transition-colors duration-200 ${
                                                    isActive
                                                        ? "text-sky-500"
                                                        : "text-slate-600 hover:text-sky-500"
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {link.name}
                                                    <span
                                                        className={`absolute -bottom-1 left-0 h-0.5 origin-left bg-sky-500 transition-transform duration-300 ${
                                                            isActive
                                                                ? "w-full scale-x-100"
                                                                : "w-full scale-x-0 group-hover:scale-x-100"
                                                        }`}
                                                    ></span>
                                                </>
                                            )}
                                        </NavLink>
                                    ) : (
                                        <button
                                            key={link.name}
                                            onClick={link.action}
                                            className="cursor-pointer text-sm font-semibold text-slate-600 capitalize transition-colors duration-200 hover:text-sky-500"
                                        >
                                            {link.name}
                                        </button>
                                    ),
                                )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/search")}
                                className="rounded-full bg-slate-100 p-2 text-slate-600 transition-all duration-300 hover:bg-sky-50 hover:text-sky-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
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
                            </motion.button>
                        </nav>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {menu && (
                        <motion.div
                            className="absolute top-24 left-0 h-[calc(100vh-6rem)] w-full bg-white py-8 shadow-md md:hidden"
                            variants={mobileMenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <nav className="flex flex-col items-center space-y-4 px-4">
                                {links
                                    .filter((link) => link.show)
                                    .map((link) =>
                                        link.path ? (
                                            <NavLink
                                                key={link.name}
                                                to={link.path}
                                                onClick={() => setMenu(false)}
                                                className={({ isActive }) =>
                                                    `w-full py-2 text-center text-base font-semibold capitalize transition-colors duration-200 ${
                                                        isActive
                                                            ? "text-sky-500"
                                                            : "text-slate-600 hover:text-sky-500"
                                                    }`
                                                }
                                            >
                                                {link.name}
                                            </NavLink>
                                        ) : (
                                            <button
                                                key={link.name}
                                                onClick={() => {
                                                    link.action();
                                                    setMenu(false);
                                                }}
                                                className="w-full py-2 text-center text-base font-semibold text-slate-600 capitalize transition-colors duration-200 hover:text-sky-500"
                                            >
                                                {link.name}
                                            </button>
                                        ),
                                    )}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Logout Toast */}
                <AnimatePresence>
                    {logoutMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25 }}
                            className="fixed top-20 right-0 left-0 z-9999 mx-auto flex w-fit items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-xl"
                        >
                            User Logged Out
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;
