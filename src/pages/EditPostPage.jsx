import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Loader from "../components/Loader"
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
        return <Loader/>
    }

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
            {({ isSubmitting, setFieldValue, setFieldTouched, values }) => (
                <Form className="card" style={{ maxWidth: 600, margin: "auto" }}>
                    <p className="card-header card-title">Edit Post</p>

                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">Title</label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                            />
                            <ErrorMessage name="title" component="p" className="form-error" />
                        </div>

                        <div className="form-group">
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

                        <div className="form-group">
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

                        <div className="form-group">
                            <label htmlFor="content" className="form-label">Content</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={values.content}
                                onChange={(_, editor) => setFieldValue("content", editor.getData())}
                                onBlur={() => setFieldTouched("content", true)}
                            />
                            <ErrorMessage name="content" component="p" className="form-error" />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
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