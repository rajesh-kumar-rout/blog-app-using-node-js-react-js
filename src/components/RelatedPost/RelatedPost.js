import { Link } from "react-router-dom"
import styles from "./RelatedPost.module.css"

export default function RelatedPost({ post }) {
    return (
        <Link to="/posts/2" className={styles.container}>
            <img src={post.imgUrl}/>
            <p className={styles.title}>{post.title}</p>
        </Link>
    )
}