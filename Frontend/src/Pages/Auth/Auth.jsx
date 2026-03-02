import { Outlet } from "react-router-dom";

import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

const Auth = () => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />
            <main className="grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Auth;
