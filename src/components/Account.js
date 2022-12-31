import { createContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Loader from "./Loader/Loader"
import axios from "../utils/axios"

export const AccountContext = createContext()

export default function Account({ children }) {
    const [isFetching, setIsFetching] = useState(true)
    const [account, setAccount] = useState()

    const fetchAccount = async () => {
        const { data } = await axios.get("/auth/account")
        setAccount(data)
        setIsFetching(false)
    }

    useEffect(() => {
        if(localStorage.getItem("jwtToken")){
            fetchAccount()
        } else {
            setIsFetching(false)
        }
    }, [])

    if (isFetching) {
        return <Loader/>
    }

    return (
        <AccountContext.Provider
            value={{
                account,
                setAccount
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}