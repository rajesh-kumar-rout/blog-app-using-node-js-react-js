import { MY_IMG } from "../../utils/constants"
import styles from "./Footer.module.css"

export default function Footer() {
    return (
        <footer className={styles.container}>
            <img src={MY_IMG} />
            <p>Designed and devloped by Rajesh Rout</p>
        </footer>
    )
}