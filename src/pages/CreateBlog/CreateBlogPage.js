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

    categoryId: number().required("Category is required"),

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
        values.img && (values.img = await getBase64Img(values.img))
        setSubmitting(true)

        try {
            await axios.post("/users/posts", values)
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

    if(isFetching) {
        return <div>Loading...</div>
    }

    return (
        <Formik
            initialValues={{
                title: "",
                categoryId: "",
                img: "",
                content: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className={form.form}>
                    <div className={form.header}>Create New Blog</div>

                    <div className={form.body}>
                        <div className={form.group}>
                            <label htmlFor="title" className={form.textLabel}>Title</label>
                            <Field
                                type="text"
                                id="title"
                                className={form.textInput}
                                name="title"
                            />
                            <ErrorMessage name="title" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="image" className={form.textLabel}>Image</label>
                            <Field
                                type="file"
                                id="image"
                                className={form.textInput}
                                name="image"
                                onChange={event => setFieldValue("img", event.target.files[0])}
                                accept="image/png, image/jpeg, image/jpg"
                                required
                                ref={imgRef}
                            />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="category" className={form.textLabel}>Category</label>
                            <Field 
                                className={form.textInput}
                                name="categoryId"
                                as="select"
                            >
                                <option></option>
                                {categories.map(category => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="content" className={form.textLabel}>Content</label>
                            <Field
                                id="content"
                                className={form.textInput}
                                name="content"
                                as="textarea"
                            />
                            <ErrorMessage name="content" component="p" className={form.errorText} />
                        </div>

                        <button
                            type="submit"
                            className={button.btn}
                            data-primary
                            data-full
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