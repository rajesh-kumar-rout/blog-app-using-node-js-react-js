import styles from "./PostDetails.module.css"

export default function BlogDetails({ blog }) {
    return (
        <div className={styles.container}>
            <img className={styles.postImg} src={blog.imgUrl} />
            <div className={styles.author}>
                <img className={styles.authorImg} src={blog.authorImgUrl} />
                <div>
                    <h4 className={styles.authorName}>{blog.authorName}</h4>
                    <p className={styles.postedAt}>Posted {blog.postedAt}</p>
                </div>
            </div>
            <h2 className={styles.title}>{blog.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: blog.content }} className={styles.content}></p>
        </div>
    )
}