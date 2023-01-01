import { Link } from "react-router-dom"
import styles from "./Post.module.css"

export default function Post({ blog }) {
    return (
        <Link to={`/blogs/${blog.id}`} className={styles.container}>
            <div className={styles.leftBox}>
                <h2 className={styles.title}>{blog.title}</h2>
                <p className={styles.content}>{blog.content}</p>
            </div>

            <div className={styles.rightBox}>
                <img className={styles.postImg} src={blog.imgUrl} />
            </div>
        </Link>
    )
}