import { Link } from "react-router-dom"

export default function Post({ blog }) {

    return (
        <Link to={`/posts/${blog._id}`} className="post">
            <img src={blog.image.url} />
            <div className="p-10">
                <h2 className="text-semibold max-line-2">{blog.title}</h2>
                <p className="text-gray-600 text-sm mt-2">Posted on 10 Jan 2022</p>
            </div>
        </Link>
    )
}
