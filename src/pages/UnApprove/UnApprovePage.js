import { MdEdit, MdDelete, MdDoneOutline, MdClose } from "react-icons/md"
import { Link } from "react-router-dom"
import { posts } from "../../utils/faker"
import table from "../../styles/Table.module.css"
import button from "../../styles/Button.module.css"
import styles from "./blogsPage.module.css"
import { useEffect, useState } from "react"
import axios from "../../utils/axios"

export default function UnApprovePage() {
    const [blogs, setBlogs] = useState([])
    const [isFetching, setIsFetching] = useState(true)

    const fetchBlogs = async () => {
        const { data } = await axios.get("/posts/unapproved")
        console.log(data);
        setBlogs(data)
        setIsFetching(false)
        console.log(data);
    }

    const handleApprove = async (blogId) => {
        setIsFetching(true)
        const {data} = await axios.patch(`/posts/${blogId}/approve`)
        console.log(data);
        setBlogs(blogs.filter(blog => blog._id !== blogId))
        setIsFetching(false)
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>My Blogs</h2>
            <div className={table.table}>
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Title</th>
                            <th width="10%">Image</th>
                            <th width="15%">Posted At</th>
                            <th width="15%">Author</th>
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
                                    <img src={blog.image.url}/>
                                </td>
                                <td>{blog.createdAt}</td>
                                <td>
                                    <div>
                                        {blog.author.profileImage && <img src={blog.author.profileImage.url}/>}
                                        <p>{blog.author.name}</p>
                                    </div>
                                </td>
                                <td>
                                    <Link to={`/edit-post/${blog._id}`} className={button.btn} data-btn-sm data-warning style={{marginRight: 4}}>
                                        <MdEdit size={24} fill="white"/>
                                    </Link>
                                    <button onClick={()=>handleApprove(blog._id)} className={button.btn} data-btn-sm data-danger>
                                        <MdDelete size={24} fill="white"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}