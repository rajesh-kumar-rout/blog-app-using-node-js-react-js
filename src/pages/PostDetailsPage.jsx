import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../components/Loader"
import PostDetails from "../components/PostDetails"
import RelatedPost from "../components/RelatedPost"
import axios from "../utils/axios"

export default function PostDetailsPage() {
    const { postId } = useParams()

    const [post, setPost] = useState({})
    const [relatedPosts, setRelatedPosts] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchBlogDetails = async () => {
        setIsFetching(true)

        const { data } = await axios.get(`/posts/${postId}`)

        setPost(data.post)

        setRelatedPosts(data.relatedPosts)

        setIsFetching(false)
    }

    useEffect(() => {
        fetchBlogDetails()
    }, [postId])

    if (isFetching) {
        return <Loader />
    }

    return (
        <div className="post-details">
            <PostDetails post={post} />

            <div>
                <h4 className="post-details-title">Related Post</h4>
                <div >
                    {relatedPosts.map(post => <RelatedPost key={post.id} post={post} />)}
                </div>
            </div>
        </div>
    )
}