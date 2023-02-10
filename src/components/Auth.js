import { createContext, useEffect, useState } from "react"
import axios from "../utils/axios"
import Loader from "./Loader/Loader"

export const AuthContext = createContext()

export default function Auth({ children }) {
    const [isFetching, setIsFetching] = useState(true)
    const [currentUser, setCurrentUser] = useState()

    const fetchCurrentUser = async () => {
        const { data } = await axios.get("/auth")
        setCurrentUser(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchCurrentUser()
    }, [])

    if (isFetching) {
        return <Loader/>
    }

    return (
        <AuthContext.Provider
            value={{
                setCurrentUser,
                currentUser,
                setIsFetching,
                isFetching
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}