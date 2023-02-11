import { useEffect, useState } from "react"
import { MdClose, MdDelete, MdDone, MdEdit } from "react-icons/md"
import { Link } from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import axios from "../../utils/axios"
import styles from "./blogsPage.module.css"

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchPosts = async () => {
        const { data } = await axios.get("/users/me/posts")

        setBlogs(data)

        setIsFetching(false)
    }

    const handleDeletePost = async (blogId) => {
        setIsFetching(true)

        await axios.delete(`/users/me/posts/${blogId}`)

        setBlogs(blogs.filter(blog => blog._id !== blogId))

        setIsFetching(false)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    if(isFetching) {
        return <Loader/>
    }

    return (
        <div>
            <h2 className="text-lg mb-10">My Blogs</h2>

            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Title</th>
                            <th width="10%">Image</th>
                            <th width="10%">Posted At</th>
                            <th width="5%">Approved</th>
                            <th width="15%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.length === 0 && (
                            <tr>
                                <td colSpan={5}>No Posts Found</td>
                            </tr>
                        )}
                        {blogs.map(blog => (
                            <tr key={blog.id}>
                                <td>
                                    <p className={styles.title}>{blog.title}</p>
                                </td>
                                <td>
                                    <img src={blog.image.url} />
                                </td>
                                <td>{blog.createdAt}</td>
                                <td>
                                    {blog.isApproved ? <MdDone fill="green" size={24} /> : <MdClose fill="red" size={24} />}
                                </td>
                                <td>
                                    <div className="btn-gap">
                                        <Link to={`/edit-post/${blog._id}`} className="btn btn-warning btn-sm">
                                            <MdEdit size={24} fill="white" />
                                        </Link>

                                        <button onClick={() => handleDeletePost(blog._id)} className="btn btn-danger btn-sm">
                                            <MdDelete size={24} fill="white" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}