import { Link } from "react-router-dom"
import styles from "./RelatedPost.module.css"

export default function RelatedBlog({ blog }) {
    return (
        <Link to={`/posts/${blog._id}`} className={styles.container}>
            <img src={blog.image.url}/>
            <p className={styles.title}>{blog.title}</p>
        </Link>
    )
}