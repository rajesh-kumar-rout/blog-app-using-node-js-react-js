
export default function PostDetails({ post }) {

    return (
        <div className="details">
            <img src={post.image.url} />

            <div className="details-author">
                <img className="details-author-img" src={post.author.profileImage?.url} />
                <div>
                    <h4 className="details-author-name">{post.author.name}</h4>
                    <p className="details-created-at">Posted {post.createdAt}</p>
                </div>
            </div>
            
            <h2 className="details-title">{post.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: post.content }} className="details-content"></p>
        </div>
    )
}