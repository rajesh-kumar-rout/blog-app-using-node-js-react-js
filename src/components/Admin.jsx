import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "./Auth"

export default function Admin() {
    const { currentUser } = useContext(AuthContext)

    return currentUser.isAdmin ? <Outlet/> : <Navigate to="/" replace />
}
