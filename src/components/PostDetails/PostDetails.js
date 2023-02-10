import styles from "./PostDetails.module.css"

export default function BlogDetails({ blog }) {
    console.log(blog);
    // return <div></div>
    return (
        <div className={styles.container}>
            <img className={styles.postImg} src={blog.image.url} />
            <div className={styles.author}>
                <img className={styles.authorImg} src={blog.author.profileImage?.url} />
                <div>
                    <h4 className={styles.authorName}>{blog.author.name}</h4>
                    <p className={styles.postedAt}>Posted {blog.createdAt}</p>
                </div>
            </div>
            <h2 className={styles.title}>{blog.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: blog.content }} className={styles.content}></p>
        </div>
    )
}