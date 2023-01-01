import { Link } from "react-router-dom"
import styles from "./RelatedPost.module.css"

export default function RelatedBlog({ blog }) {
    return (
        <Link to={`/blogs/${blog.id}`} className={styles.container}>
            <img src={blog.imgUrl}/>
            <p className={styles.title}>{blog.title}</p>
        </Link>
    )
}