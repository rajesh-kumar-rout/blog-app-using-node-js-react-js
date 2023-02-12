import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import Loader from "../components/Loader"
import axios from "../utils/axios"
import { postSchema } from "../utils/validationSchemas"

export default function CreatePostPage() {
    const [categories, setCategories] = useState([])
    const [isFetching, setIsFetching] = useState(true)
    const imgRef = useRef()

    const fetchCategories = async () => {
        const { data } = await axios.get("/categories")
        setCategories(data)
        setIsFetching(false)
    }

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true)

        try {
            await axios.post("/users/me/posts", values)

            toast.success("Blog created successfully")

            resetForm()

            imgRef.current.value = ""

        } catch ({ response }) {

            response?.status === 409 && toast.error("Title already exists")
        }

        setSubmitting(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    if (isFetching) {
        return <Loader/>
    }

    return (
        <Formik
            initialValues={{
                title: "",
                categoryId: "",
                image: "",
                content: ""
            }}
            validationSchema={postSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className="card max-w-600 mx-auto">
                    <div className="card-header card-title">Create New Blog</div>

                    <div className="card-body">
                        <div className="mb-5">
                            <label htmlFor="title" className="form-label">Title</label>
                            <Field
                                type="text"
                                id="title"
                                className="form-control"
                                name="title"
                            />
                            <ErrorMessage name="title" component="p" className="form-error" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="img" className="form-label">Image</label>
                            <input
                                type="file"
                                id="img"
                                className="form-control"
                                onChange={event => {
                                    const reader = new FileReader()

                                    reader.readAsDataURL(event.target.files[0])
                                    reader.onload = () => {
                                        setFieldValue("image", reader.result)
                                    }
                                }}
                                accept=".png, .jpeg, .jpg"
                                required
                                ref={imgRef}
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="categoryId" className="form-label">Category</label>
                            <Field
                                className="form-control"
                                name="categoryId"
                                as="select"
                            >
                                <option></option>
                                {categories.map(category => (
                                    <option value={category._id}>{category.name}</option>
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
                            {isSubmitting ? "Loading..." : "Save"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}