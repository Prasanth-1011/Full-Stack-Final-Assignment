import { Link } from "react-router-dom";

const Footer = () => {
    const categories = [
        { name: "Watches", path: "/product" },
        { name: "Requirements", path: "/product" },
        { name: "Accessories", path: "/product" },
        { name: "Offers", path: "/", state: { scrollTo: "offers" } },
    ];

    const company = [
        { name: "About Us", path: "/", state: { scrollTo: "info" } },
        { name: "Contact Admin", path: "/", state: { scrollTo: "info" } },
    ];

    return (
        <footer className="border-t border-slate-100 bg-white py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2">
                        <span className="text-xl font-bold text-sky-500 capitalize">
                            Timepiece
                        </span>
                        <p className="mt-4 max-w-xs text-slate-500">
                            Your one-stop destination for premium watches and
                            all your requirements. Quality and trust, delivered.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 font-bold text-slate-900 capitalize">
                            Categories
                        </h4>
                        <ul className="space-y-2">
                            {categories.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        state={item.state}
                                        className="text-slate-500 capitalize transition-colors hover:text-sky-500"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-bold text-slate-900 capitalize">
                            Company
                        </h4>
                        <ul className="space-y-2">
                            {company.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        state={item.state}
                                        className="text-slate-500 capitalize transition-colors hover:text-sky-500"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-50 pt-8 text-center">
                    <p className="text-slate-400 capitalize">
                        © 2026 Timepiece. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
