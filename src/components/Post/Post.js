import { Link } from "react-router-dom"
import styles from "./Post.module.css"

export default function Post({ blog }) {
    console.log(blog);
    return (
        <Link to={`/posts/${blog._id}`} className={styles.container}>
            <div className={styles.leftBox}>
                <h2 className={styles.title}>{blog.title}</h2>
                <p className={styles.content}>{blog.content}</p>
                <p className={styles.content}>Posted on 10 Jan 2022</p>
            </div>

            <div className={styles.rightBox}>
                <img className={styles.postImg} src={blog.image.url} />
            </div>
        </Link>
    )
}