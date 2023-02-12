import { Link } from "react-router-dom"

export default function RelatedPost({ post }) {
    return (
        <Link to={`/posts/${post._id}`}>
            <img src={post.image.url}/>
            <p className="text-semibold max-line-2 mt-2">{post.title}</p>
        </Link>
    )
}