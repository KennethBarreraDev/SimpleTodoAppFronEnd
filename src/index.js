import React, { useEffect, useState, useContext, memo } from "react";
import ReactDom from "react-dom/client";
import { LoginForm } from "./pages/login";
import { TodoList } from "./pages/todos";
import 'bootstrap/dist/css/bootstrap.css';
import { UserProvider } from "./hooks/auth_context/UserProvider";
import { NavBar } from "./pages/navbar";
import { Navigate, useNavigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Urls } from "./utils/urls";
import { UserContext } from "./hooks/auth_context/UserContex";
import {jwtDecode} from "jwt-decode"; 
import { LoaderBody } from "./pages/loader";

const App = () => {
    const url = memo(Urls.baseUrl);
    const { setUser } = useContext(UserContext); 
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const validateToken = async () => {
        console.log("Validando token");
        var token = localStorage.getItem("token");
        if (!token) {
            localStorage.clear();
            console.log("Retornando 1");
            setLoading(false);
            return false;
        } else {
            token = "Bearer " + token;
            const response = await fetch(`${url.type}auth/validate-token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
            });

            if (response.status !== 200) {
                localStorage.clear();
                console.log("Retornando 2");
                setLoading(false);
                return false;
            } else {
                const decoded = jwtDecode(token.split(' ')[1]);
                setUser({
                    name: decoded.firstName + " " + decoded.lastName,
                    email: decoded.email,
                    token: token.split(' ')[1]
                });
                setAuth(true);
                setLoading(false);
                return true;
            }
        }
    };

    useEffect(() => {
        validateToken();
    }, [auth]);

    const PrivateRoutes = () => {
        return [
            {
                path: "/todos",
                element: (
                    <>
                        <NavBar />
                        <TodoList />
                    </>
                ),
            },
            { path: "*", element: <Navigate to="/todos" replace /> },
        ];
    };

    const Routes = () => {
        return [
            {
                path: "/",
                element: <LoginForm setAuth={setAuth}/>
            },
            { path: "*", element: <Navigate to="/" replace /> },
        ];
    };
    

    if (loading) {
        return <LoaderBody/>;
    }

    const router = createBrowserRouter(
        auth ? [...PrivateRoutes()] : Routes()
    );

    console.log("Router es ");
    console.log(router);

    return (
        <RouterProvider router={router} />
    );
};

ReactDom.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);
