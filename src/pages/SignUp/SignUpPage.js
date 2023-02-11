import { ErrorMessage, Field, Form, Formik } from "formik"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { object, ref, string } from "yup"
import button from "../../styles/Button.module.css"
import form from "../../styles/Form.module.css"
import axios from "../../utils/axios"

const validationSchema = object().shape({
    name: string()
        .trim()
        .min(2, "Invalid name")
        .max(30, "Name must be within 30 characters")
        .required("Name is required"),

    email: string()
        .trim()
        .email()
        .max(30, "Email must be within 30 characters")
        .required("Email is required"),

    password: string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be within 20 characters")
        .required("Password is required"),

    confirmPassword: string()
        .oneOf([ref("password")], "Password mismatch")
        .required("Please confirm your password"),
})

export default function SignUpPage() {
    
    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.post("/auth/register", values)

            localStorage.setItem("authToken", data.authToken)

            window.location.href = "/"

        } catch ({ response }) {

            response?.status === 409 && toast.error("Email already taken")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="card max-w-500 mx-auto">
                    <div className="card-header card-title">Register</div>

                    <div className="card-body">
                        <div className="mb-5">
                            <label htmlFor="name" className="form-label">Name</label>
                            <Field
                                type="text"
                                id="name"
                                className="form-control"
                                name="name"
                            />
                            <ErrorMessage name="name" component="p" className="form-error" />
                        </div>

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
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                name="confirmPassword"
                            />
                            <ErrorMessage name="confirmPassword" component="p" className="form-error" />
                        </div>

                        <div className="mb-5">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading" : "Register"}
                            </button>
                        </div>

                        <p className="text-center">Already have an account ? <Link className="text-underline" to="/login">Login</Link></p>
                    </div>
                </Form>
            )}
        </Formik>
    )
}