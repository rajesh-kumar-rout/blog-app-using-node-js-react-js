import styles from "./PostDetails.module.css"

export default function PostDetails({ post }) {
    return (
        <div className={styles.container}>
            <img className={styles.postImg} src={post.imgUrl} />
            <div className={styles.author}>
                <img className={styles.authorImg} src={post.authorImgUrl} />
                <div>
                    <h4 className={styles.authorName}>{post.authorName}</h4>
                    <p className={styles.postedAt}>Posted {post.postedAt}</p>
                </div>
            </div>
            <h2 className={styles.title}>{post.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: post.content }} className={styles.content}></p>
        </div>
    )
}