import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Auth from "./Pages/Auth/Auth";
import Home from "./Pages/Auth/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import Search from "./Pages/Search/Search";

import Dashboard from "./Pages/Dashboard/Dashboard";
import AdminOrders from "./Pages/Dashboard/AdminOrders";
import AdminApproval from "./Pages/Dashboard/AdminApproval";
import AdminProducts from "./Pages/Dashboard/AdminProducts";

import Product from "./Pages/Product/Product";
import ProductDetail from "./Pages/Product/ProductDetail";

import UpdateProfile from "./Pages/Profile/UpdateProfile";

import Cart from "./Pages/Cart/Cart";

import Orders from "./Pages/Order/Orders";

import { AuthProvider } from "./Context/AuthContext";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Auth />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "search",
                element: <Search />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "profile",
                element: <UpdateProfile />,
            },
            {
                path: "product",
                element: <Product />,
            },
            {
                path: "admin-approval",
                element: <AdminApproval />,
            },
            {
                path: "admin-orders",
                element: <AdminOrders />,
            },
            {
                path: "admin-products",
                element: <AdminProducts />,
            },
            {
                path: "product/:name",
                element: <ProductDetail />,
            },
            {
                path: "cart",
                element: <Cart />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
        ],
    },
]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
