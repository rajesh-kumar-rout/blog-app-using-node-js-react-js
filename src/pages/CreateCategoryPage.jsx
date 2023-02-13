import { ErrorMessage, Field, Form, Formik } from "formik"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { categorySchema } from "../utils/validationSchemas"

export default function CreateCategoryPage() {

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        setSubmitting(true)

        try {
            await axios.post("/categories", values)

            toast.success("Category created successfully")

            resetForm()

        } catch ({ response }) {

            response?.status === 409 && toast.error("Category already exists")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{ name: "" }}
            onSubmit={handleSubmit}
            validationSchema={categorySchema}
        >
            {({ isSubmitting }) => (
                <Form className="card" style={{ maxWidth: 600, margin: "auto" }}>
                    <div className="card-header card-title">Create New Category</div>

                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Name</label>
                            <Field
                                type="text"
                                id="name"
                                className="form-control"
                                name="name"
                            />
                            <ErrorMessage name="name" component="p" className="form-error" />
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