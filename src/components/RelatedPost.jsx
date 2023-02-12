import { Link } from "react-router-dom"

export default function RelatedPost({ post }) {
    return (
        <Link to={`/posts/${post._id}`}>
            <img src={post.image.url}/>
            <p className="related-post-title max-line-2">{post.title}</p>
        </Link>
    )
}