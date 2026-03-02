import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import api from "../../Utils/Service";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("User");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords Do Not Match");
            return;
        }

        try {
            const endpoint =
                role === "Admin" ? "/admin/register" : "/user/register";
            await api.post(endpoint, { username, mail: email, password });

            setSuccess("Registration Successful! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            if (!err.response) {
                setError("Network Error: Could Not Reach The Server");
            } else {
                setError(err.response?.data?.message);
            }
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 rounded-2xl border border-slate-100 bg-white p-10 shadow-sm"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 capitalize">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Join Timepiece
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="mb-6 flex justify-center space-x-4">
                        {["User", "Admin"].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                                    role === r
                                        ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-t-lg border border-slate-200 px-3 py-3 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-sky-500 focus:ring-sky-500 focus:outline-none sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full appearance-none rounded-none border border-slate-200 px-3 py-3 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-sky-500 focus:ring-sky-500 focus:outline-none sm:text-sm"
                                placeholder="Email Address"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full appearance-none rounded-none border border-slate-200 px-3 py-3 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-sky-500 focus:ring-sky-500 focus:outline-none sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="relative block w-full appearance-none rounded-none rounded-b-lg border border-slate-200 px-3 py-3 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-sky-500 focus:ring-sky-500 focus:outline-none sm:text-sm"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 py-2 text-center text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg bg-green-50 py-2 text-center text-sm text-green-500">
                            {success}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="btn-primary w-full shadow-lg shadow-sky-100"
                        >
                            Register
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-sky-500 hover:text-sky-600"
                        >
                            Already Have An Account? Login Here
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
