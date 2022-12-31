import { Link } from "react-router-dom"
import styles from "./Post.module.css"

export default function Post({ post }) {
    return (
        <Link to={`/posts/${post.id}`} className={styles.container}>
            <div className={styles.leftBox}>
                <h2 className={styles.title}>{post.title}</h2>
                <p className={styles.content}>{post.content}</p>
            </div>

            <div className={styles.rightBox}>
                <img className={styles.postImg} src={post.imgUrl} />
            </div>
        </Link>
    )
}