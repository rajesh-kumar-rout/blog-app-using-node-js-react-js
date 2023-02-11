import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"
import axios from "../../utils/axios"
import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string, number } from "yup"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { getBase64Img, handleImage } from "../../utils/functions"

const validationSchema = object().shape({
    title: string()
        .trim()
        .min(6, "Title must be at least 6 characters")
        .max(255, "Title must be within 255 characters")
        .required("Title is required"),

    categoryId: string().required("Category is required"),

    content: string()
        .trim()
        .min(6, "Content must be at least 6 characters")
        .max(5000, "Content must be within 5000 characters")
        .required("Content is required")
})

export default function EditBlogPage() {
    const { postId } = useParams()
    const [blog, setBlog] = useState({})
    const [isFetching, setIsFetching] = useState(true)
    const [categories, setCategories] = useState([])

    const fetchBlog = async () => {
        const blogRes = await axios.get(`/users/me/posts/${postId}`)

        const categoryRes = await axios.get("/categories")

        setBlog(blogRes.data)

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

    console.log(blog,'n');

    return (
        <Formik
            initialValues={{
                title: blog.title,
                categoryId: blog.categoryId,
                image: "",
                content: blog.content
            }}
            validationSchema={validationSchema}
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
                                defaultValue={blog.categoryId}
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