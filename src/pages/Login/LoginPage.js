import { ErrorMessage, Field, Form, Formik } from "formik"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { object, string } from "yup"
import button from "../../styles/Button.module.css"
import form from "../../styles/Form.module.css"
import axios from "../../utils/axios"

const validationSchema = object().shape({
    email: string().required("Email is required"),

    password: string().required("Password is required")
})

export default function LoginPage() {
    const [searchParams] = useSearchParams()

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/auth/login", values)

            localStorage.setItem("authToken", data.authToken)

            window.location.href = searchParams.get("return") ? searchParams.get("return") : "/"

        } catch ({ response }) {

            response?.status === 422 && toast.error("Invalid email or password")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                email: "",
                password: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="card max-w-500 mx-auto">
                    <div className="card-header card-title">Login</div>

                    <div className="card-body">
                        <div className="mb-5">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Field
                                type="email"
                                id="email"
                                className="form-control"
                                name="email"
                            />
                            <ErrorMessage name="email" component="p" className="form-error" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Field
                                type="password"
                                id="password"
                                className="form-control"
                                name="password"
                            />
                            <ErrorMessage name="password" component="p" className="form-error" />
                        </div>

                        <div className="mb-5">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading..." : "Login"}
                            </button>
                        </div>

                        <p className="text-center">Do not have an account ? <Link className="text-underline" to="/register">Register</Link></p>
                    </div>
                </Form>
            )}
        </Formik>
    )
}