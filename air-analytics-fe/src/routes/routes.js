import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LocalStorage from "../services/LocalStorage"
import { ROUTES } from "./constant"

const UserRoutes = () => {
    const token = LocalStorage.getLocalAccessToken();
    return (
        <BrowserRouter>
            <Routes>
                {ROUTES.map((route) => {
                    const Component = route.element;
                    return (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={ (!token && route.path !== '/login' && route.path !== '/register') ? <Navigate to={'/login'} /> : <Component />}
                        />
                    ) 
                })}
            </Routes>
        </BrowserRouter>
    )
}

export default UserRoutes