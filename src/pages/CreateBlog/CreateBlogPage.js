import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"
import axios from "../../utils/axios"
import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string, number } from "yup"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import { getBase64Img } from "../../utils/functions"

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

export default function CreateBlogPage() {
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
            console.log(response.data);
            response?.status === 409 && toast.error("Title already exists")
        }

        setSubmitting(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    if (isFetching) {
        return <div>Loading...</div>
    }

    return (
        <Formik
            initialValues={{
                title: "",
                categoryId: "",
                image: "",
                content: ""
            }}
            validationSchema={validationSchema}
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