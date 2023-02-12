import { ErrorMessage, Field, Form, Formik } from "formik"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "../utils/axios"
import { loginSchema } from "../utils/validationSchemas"

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
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form
                    className="card"
                    style={{ maxWidth: 500, margin: "auto" }}
                >
                    <div className="card-header card-title">Login</div>

                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Field
                                type="email"
                                id="email"
                                className="form-control"
                                name="email"
                            />
                            <ErrorMessage name="email" component="p" className="form-error" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Field
                                type="password"
                                id="password"
                                className="form-control"
                                name="password"
                            />
                            <ErrorMessage name="password" component="p" className="form-error" />
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading..." : "Login"}
                            </button>
                        </div>

                        <center>
                            Do not have an account ? <Link style={{ textDecoration: "underline" }} to="/register">Register</Link>
                        </center>
                    </div>
                </Form>
            )}
        </Formik>
    )
}