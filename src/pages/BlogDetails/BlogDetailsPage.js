import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogDetails from "../../components/PostDetails/PostDetails";
import RelatedBlog from "../../components/RelatedPost/RelatedPost";
import styles from "./blogDetailsPage.module.css"
import axios from "../../utils/axios"

export default function BlogDetailsPage() {
    const { postId } = useParams()

    const [blog, setBlog] = useState({})
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchBlogDetails = async () => {
        const { data } = await axios.get(`/blogs/${postId}`)
        setBlog(data.blog)
        setRelatedBlogs(data.relatedBlogs)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchBlogDetails()
    }, [])

    if(isFetching){
        return <div>Loading...</div>
    }

    return (
        <div className={styles.container}>
            <BlogDetails blog={blog} />
            <div>
                <h4 className={styles.title}>Related Post</h4>
                <div className={styles.posts}>
                    {relatedBlogs.map(blog => (
                        <RelatedBlog
                            key={blog.id}
                            blog={blog}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}