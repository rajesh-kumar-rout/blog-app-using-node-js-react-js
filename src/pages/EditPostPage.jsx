import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { handleImage } from "../utils/functions"
import { postSchema } from "../utils/validationSchemas"

export default function EditPostPage() {
    const { postId } = useParams()
    const [post, setPost] = useState({})
    const [isFetching, setIsFetching] = useState(true)
    const [categories, setCategories] = useState([])

    const fetchBlog = async () => {
        const blogRes = await axios.get(`/users/me/posts/${postId}`)

        const categoryRes = await axios.get("/categories")

        setPost(blogRes.data)

        setCategories(categoryRes.data)

        setIsFetching(false)
    }

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        await axios.patch(`/users/me/posts/${postId}`, values)

        toast.success("Blog edited successfully")

        setSubmitting(false)
    }

    useEffect(() => {
        fetchBlog()
    }, [])

    if(isFetching) {
        return <div>Loading...</div>
    }

    console.log(post,'n');

    return (
        <Formik
            initialValues={{
                title: post.title,
                categoryId: post.categoryId,
                image: "",
                content: post.content
            }}
            validationSchema={postSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className="card max-w-600 mx-auto">
                    <div className="card-header card-title">Edit Post</div>

                    <div className="card-body">
                        <div className="mb-5">
                            <label htmlFor="title" className="form-label">Title</label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                            />
                            <ErrorMessage name="title" component="p" className="form-error" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input
                                type="file"
                                id="image"
                                className="form-control"
                                name="image"
                                onChange={event => handleImage(event, setFieldValue)}
                                accept=".png, .jpeg, .jpg"
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="category" className="form-label">Category</label>
                            <Field
                                className="form-control"
                                name="categoryId"
                                as="select"
                                defaultValue={post.categoryId}
                            >
                                {categories.map(category => (
                                    <option key={category._id}  value={category._id}>{category.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="categoryId" component="p" className="form-error" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="content" className="form-label">Content</label>
                            <Field
                                id="content"
                                className="form-control"
                                name="content"
                                as="textarea"
                            />
                            <ErrorMessage name="content" component="p" className="form-error" />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Loading..." : "Update"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}