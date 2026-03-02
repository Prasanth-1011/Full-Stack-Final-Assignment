import { Outlet } from "react-router-dom";

import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import ScrollToTop from "../../Components/ScrollToTop";

const Auth = () => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <ScrollToTop />
            <Header />
            <main className="grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Auth;
