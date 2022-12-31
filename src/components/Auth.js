import { Navigate, Outlet, useLocation } from "react-router-dom"

export function Authenticated() {
    const { pathname, search } = useLocation()
    const destination = pathname + search

    return localStorage.getItem("jwtToken") ? <Outlet/> : <Navigate to={`/account/login?return=${destination}`} replace />
}

export function NotAuthenticated() {
    return localStorage.getItem("jwtToken") ? <Navigate to="/" replace /> : <Outlet/>
}