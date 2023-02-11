import { useEffect, useState } from "react"
import { MdVisibility } from "react-icons/md"
import Loader from "../../components/Loader/Loader"
import axios from "../../utils/axios"
import styles from "./blogsPage.module.css"

export default function UnApprovePage() {
    const [blogs, setBlogs] = useState([])
    const [selectedPost, setSelectedPost] = useState()
    const [isFetching, setIsFetching] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const fetchPosts = async () => {
        const { data } = await axios.get("/posts/unapproved")
        console.log(data);
        setBlogs(data)
        setIsFetching(false)
        console.log(data);
    }

    const handleApprovePost = async () => {
        setIsLoading(true)

        await axios.patch(`/posts/${selectedPost._id}/approve`)

        setBlogs(blogs.filter(blog => blog._id !== selectedPost._id))

        setIsLoading(false)

        setSelectedPost()
    }

    const handleDeletePost = async () => {
        setIsLoading(true)

        await axios.delete(`/posts/${selectedPost._id}`)

        setBlogs(blogs.filter(blog => blog._id !== selectedPost._id))

        setIsLoading(false)

        setSelectedPost()
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    if (isFetching) {
        return <Loader />
    }

    return (
        <div className>
            <h2 className="text-lg mb-10">Unapproved Posts</h2>

            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Title</th>
                            <th width="10%">Image</th>
                            <th width="10%">Posted At</th>
                            <th width="10%">Author</th>
                            <th width="10%">Action</th>
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
                                    <div>
                                        {blog.author.profileImage && <img src={blog.author.profileImage.url} />}
                                        <p className="mt-2">{blog.author.name}</p>
                                    </div>
                                </td>
                                <td>
                                    <button onClick={() => setSelectedPost(blog)} className="btn btn-warning btn-sm">
                                        <MdVisibility size={24} fill="white" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedPost && (
                <div className="page-overlay">
                    <div className="modal">
                        <div className="modal-header">{selectedPost.title}</div>

                        <p dangerouslySetInnerHTML={{ __html: selectedPost.content }} className="modal-body"></p>

                        <div className="modal-footer text-right">
                            <button disabled={isLoading} className="btn btn-warning" onClick={handleApprovePost}>Approve</button>

                            <button disabled={isLoading} className="btn btn-danger mx-1" onClick={handleDeletePost}>Delete</button>

                            <button disabled={isLoading} className="btn btn-primary" onClick={() => setSelectedPost()}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}