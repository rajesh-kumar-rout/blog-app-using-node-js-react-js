
export default function BlogDetails({ blog }) {

    return (
        <div className="details">
            <img src={blog.image.url} />
            <div className="details-author">
                <img className="details-author-img" src={blog.author.profileImage?.url} />
                <div>
                    <h4 className="details-author-name">{blog.author.name}</h4>
                    <p className="details-created-at">Posted {blog.createdAt}</p>
                </div>
            </div>
            <h2 className="details-title">{blog.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: blog.content }} className="details-content"></p>
        </div>
    )
}