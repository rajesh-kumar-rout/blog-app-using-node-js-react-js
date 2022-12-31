import { useEffect, useReducer, useState } from "react"
import Post from "../../components/Post/Post"
import { posts } from "../../utils/faker"
import axios from "../../utils/axios"

export default function HomePage() {
    const [blogs, setBlogs] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchBlogs = async () => {
        const { data } = await axios.get("/posts")
        setBlogs(data)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    return (
        <div>
            {blogs.map(post => (
                <Post
                    key={post.id}
                    post={post}
                />
            ))}
        </div>
    )
}