import moment from "moment"
import { Link } from "react-router-dom"

export default function Post({ post }) {

    return (
        <Link to={`/posts/${post._id}`} className="post">
            <img src={post.image.url} />
            <div className="post-footer">
                <p className="post-title max-line-2">{post.title}</p>
                <p className="post-created-at">Posted on {moment(post.createdAt).format("DD MMM YYYY")}</p>
            </div>
        </Link>
    )
}
