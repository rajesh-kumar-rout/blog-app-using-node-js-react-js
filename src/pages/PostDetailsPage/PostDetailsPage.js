import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostDetails from "../../components/PostDetails/PostDetails";
import RelatedPost from "../../components/RelatedPost/RelatedPost";
import { posts, post } from "../../utils/faker";
import styles from "./PostDetailsPage.module.css"
import axios from "../../utils/axios"

export default function PostDetailsPage() {
    const { postId } = useParams()

    const [blog, setBlog] = useState({})
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchBlogDetails = async () => {
        const { data } = await axios.get(`/posts/${postId}`)
        setBlog(data.post)
        setRelatedBlogs(data.relatedPosts)
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
            <PostDetails post={blog} />
            <div>
                <h4 className={styles.title}>Related Post</h4>
                <div className={styles.posts}>
                    {relatedBlogs.map(post => (
                        <RelatedPost
                            key={post.id}
                            post={post}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}