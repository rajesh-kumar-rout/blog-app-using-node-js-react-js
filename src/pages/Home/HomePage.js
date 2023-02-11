import { useEffect, useReducer, useState } from "react"
import Post from "../../components/Post/Post"
import { posts } from "../../utils/faker"
import axios from "../../utils/axios"

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

    return (
        <div className="home">
            {posts.map(post => (
                <Post
                    key={post.id}
                    blog={post}
                />
            ))}
        </div>
    )
}