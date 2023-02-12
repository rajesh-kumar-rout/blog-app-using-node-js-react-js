import { useEffect, useState } from "react"
import Loader from "../components/Loader"
import Post from "../components/Post"
import axios from "../utils/axios"

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchPosts = async () => {
        const { data } = await axios.get("/posts")
        setPosts(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    if (isFetching) {
        return <Loader />
    }

    return (
        <div className="home">
            {posts.map(post => <Post key={post.id} post={post} />)}
        </div>
    )
}