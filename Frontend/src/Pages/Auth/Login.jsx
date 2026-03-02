import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import api from "../../Utils/Service";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [role, setRole] = useState("User");
    const [message, setMessage] = useState({ text: "", type: "" });

    const [pending, setPending] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });
        setPending(false);

        try {
            const endpoint = role === "Admin" ? "/admin/login" : "/user/login";
            const response = await api.post(endpoint, {
                mail: email,
                password,
            });

            const userData =
                role === "Admin" ? response.data.admin : response.data.user;
            login(userData, response.data.accessToken, role);
            setMessage({
                text: "Login Successful! Redirecting...",
                type: "Success",
            });
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            if (err.response?.status === 403 && role === "Admin") {
                setPending(true);
            } else if (!err.response) {
                setMessage({
                    text: "Network Error: Could Not Reach The Server",
                    type: "Error",
                });
            } else {
                setMessage({
                    text: err.response?.data?.message,
                    type: "Error",
                });
            }
        } finally {
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        }
    };

    if (pending) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-slate-800 capitalize">
                        Approval Pending
                    </h2>
                    <p className="mb-6 text-slate-600">
                        Your Admin Access Is Currently Pending Approval. Please
                        Contact The Administrator For Access.
                    </p>
                    <button
                        onClick={() => setPending(false)}
                        className="btn-primary w-full"
                    >
                        Back To Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[88vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 rounded-2xl border border-slate-100 bg-white p-10 shadow-sm"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 capitalize">
                        Login Timepiece
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Select Your Role and Enter Your Credentials
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
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-t-lg border border-slate-200 px-3 py-3 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-sky-500 focus:ring-sky-500 focus:outline-none sm:text-sm"
                                placeholder="Email Address"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-b-lg border border-slate-200 px-3 py-3 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-sky-500 focus:ring-sky-500 focus:outline-none sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {message.type === "Success" && (
                        <div className="rounded-lg bg-green-50 py-2 text-center text-sm text-green-500">
                            {message.text}
                        </div>
                    )}

                    {message.type === "Error" && (
                        <div className="rounded-lg bg-red-50 py-2 text-center text-sm text-red-500">
                            {message.text}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="btn-primary w-full shadow-lg shadow-sky-100"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/register"
                            className="text-sm font-medium text-sky-500 hover:text-sky-600"
                        >
                            Don't Have An Account? Register Here
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
