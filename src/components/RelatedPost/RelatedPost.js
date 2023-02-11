import { Link } from "react-router-dom"

export default function RelatedBlog({ blog }) {
    return (
        <Link to={`/posts/${blog._id}`}>
            <img src={blog.image.url}/>
            <p className="text-semibold max-line-2 mt-2">{blog.title}</p>
        </Link>
    )
}