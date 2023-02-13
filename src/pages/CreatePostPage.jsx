import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import Loader from "../components/Loader"
import axios from "../utils/axios"
import { handleImage } from "../utils/functions"
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
        return <Loader />
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
            {({ isSubmitting, setFieldValue, values, setFieldTouched }) => (
                <Form className="card" style={{ maxWidth: 600, margin: "auto" }}>
                    <p className="card-header card-title">Create New Post</p>

                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">Title</label>
                            <Field
                                type="text"
                                id="title"
                                className="form-control"
                                name="title"
                            />
                            <ErrorMessage name="title" component="p" className="form-error" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                className="form-control"
                                onChange={event => handleImage(event, setFieldValue)}
                                accept=".png, .jpeg, .jpg"
                                required
                                ref={imgRef}
                            />
                        </div>

                        <div className="form-group">
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
                            {isSubmitting ? "Loading..." : "Save"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}