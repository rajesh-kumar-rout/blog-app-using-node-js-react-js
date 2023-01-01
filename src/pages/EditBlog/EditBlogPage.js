import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"
import axios from "../../utils/axios"
import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string, number } from "yup"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
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

export default function EditBlogPage() {
    const { blogId } = useParams()
    const [blog, setBlog] = useState({})
    const [isFetching, setIsFetching] = useState(true)
    const [categories, setCategories] = useState([])

    const fetchBlog = async () => {
        const blogRes = await axios.get(`/account/blogs/${blogId}`)
        const categoryRes = await axios.get("/categories")
        console.log(blogRes.data, "d", blogId);
        setBlog(blogRes.data)
        setCategories(categoryRes.data)
        setIsFetching(false)
    }

    const handleSubmit = async (values, { setSubmitting }) => {
        values.img && (values.img = await getBase64Img(values.img))
        setSubmitting(true)
        await axios.patch(`/account/blogs/${blogId}`, values)
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
                img: "",
                content: blog.content
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className={form.form}>
                    <div className={form.header}>Edit Blog</div>

                    <div className={form.body}>
                        <div className={form.group}>
                            <label htmlFor="title" className={form.textLabel}>Title</label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                className={form.textInput}
                            />
                            <ErrorMessage name="title" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="image" className={form.textLabel}>Image</label>
                            <input
                                type="file"
                                id="image"
                                className={form.textInput}
                                name="image"
                                onChange={event => setFieldValue("img", event.target.files[0])}
                                accept="image/png, image/jpeg, image/jpg"
                            />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="category" className={form.textLabel}>Category</label>
                            <Field
                                className={form.textInput}
                                name="categoryId"
                                as="select"
                                defaultValue={blog.categoryId}
                            >
                                {categories.map(category => (
                                    <option key={category.id}  value={category.id}>{category.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="categoryId" component="p" className={form.errorText} />
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
                            {isSubmitting ? "Loading..." : "Update"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}