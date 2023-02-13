import moment from "moment"
import { useEffect, useState } from "react"
import { MdVisibility } from "react-icons/md"
import Loader from "../components/Loader"
import axios from "../utils/axios"

export default function UnApprovedPostsPage() {
    const [posts, setPosts] = useState([])
    const [selectedPost, setSelectedPost] = useState()
    const [isFetching, setIsFetching] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const fetchPosts = async () => {
        const { data } = await axios.get("/posts/unapproved")

        setPosts(data)

        setIsFetching(false)
    }

    const handleApprovePost = async () => {
        setIsLoading(true)

        await axios.patch(`/posts/${selectedPost._id}/approve`)

        setPosts(posts.filter(blog => blog._id !== selectedPost._id))

        setIsLoading(false)

        setSelectedPost()
    }

    const handleDeletePost = async () => {
        setIsLoading(true)

        await axios.delete(`/posts/${selectedPost._id}`)

        setPosts(posts.filter(blog => blog._id !== selectedPost._id))

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
        <div>
            <p className="table-title" style={{marginBottom: 16}}>Unapproved Posts</p>
            
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
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5}>No Posts Found</td>
                            </tr>
                        )}
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td>
                                    <p className="max-line-2">{post.title}</p>
                                </td>
                                <td>
                                    <img src={post.image.url} />
                                </td>
                                <td>{moment(post.createdAt).format("DD MMM YYYY")}</td>
                                <td>
                                    <div>
                                        {post.author.profileImage && <img src={post.author.profileImage.url} />}
                                        <p className="mt-2">{post.author.name}</p>
                                    </div>
                                </td>
                                <td>
                                    <button onClick={() => setSelectedPost(post)} className="btn btn-warning btn-sm">
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