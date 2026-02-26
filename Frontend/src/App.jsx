import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import Auth from "./Pages/Auth/Auth";
import Home from "./Pages/Auth/Home";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import Things from "./Pages/Product/Things";
import Product from "./Pages/Product/Product";

import Unit from "./Components/Unit";
import Category from "./Components/Category";

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
        ],
    },
    {
        path: "/product",
        element: <Product />,
        children: [
            {
                index: true,
                element: <Things />,
            },
            {
                path: ":unit",
                element: <Unit />,
            },
            {
                path: "category/:category",
                element: <Category />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
