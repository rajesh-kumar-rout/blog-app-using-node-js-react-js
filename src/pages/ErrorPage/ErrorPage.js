import { useParams } from "react-router-dom"
import styles from "./ErrorPage.module.css"

export default function ErrorPage() {
    const { message } = useParams()

    return (
        <div className={styles.container}>
            <p>{message}</p>
        </div>
    )
}