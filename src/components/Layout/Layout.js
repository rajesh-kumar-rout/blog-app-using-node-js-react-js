import { Outlet } from "react-router-dom"
import NavBar from "../NavBar/NavBar"
import Footer from "../Footer/Footer"
import styles from "./Layout.module.css"

export default function Layout() {
    return (
        <div>
            <NavBar />

            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <Outlet />
                </div>
            </div>
            
            <Footer />
        </div>
    )
}