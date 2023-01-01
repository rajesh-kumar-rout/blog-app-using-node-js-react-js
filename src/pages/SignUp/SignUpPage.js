import { Link, useNavigate } from "react-router-dom"
import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string, ref } from "yup"
import { toast } from "react-toastify"
import axios from "../../utils/axios"
import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"

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
            const { data } = await axios.post("/auth/sign-up", values)
            localStorage.setItem("jwtToken", data.jwtToken)
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
                <Form className={form.form}>
                    <div className={form.header}>SIGN UP</div>

                    <div className={form.body}>
                        <div className={form.group}>
                            <label htmlFor="name" className={form.textLabel}>Name</label>
                            <Field
                                type="text"
                                id="name"
                                className={form.textInput}
                                name="name"
                            />
                            <ErrorMessage name="name" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="email" className={form.textLabel}>Email</label>
                            <Field
                                type="email"
                                id="email"
                                className={form.textInput}
                                name="email"
                            />
                            <ErrorMessage name="email" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="password" className={form.textLabel}>Password</label>
                            <Field
                                type="password"
                                id="password"
                                className={form.textInput}
                                name="password"
                            />
                            <ErrorMessage name="password" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="confirmPassword" className={form.textLabel}>Confirm Password</label>
                            <Field
                                type="password"
                                id="confirmPassword"
                                className={form.textInput}
                                name="confirmPassword"
                            />
                            <ErrorMessage name="confirmPassword" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <button
                                type="submit"
                                className={button.btn}
                                data-full
                                data-primary
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading" : "Sign Up"}
                            </button>
                        </div>

                        <p className={form.formLink}>Already have an account ? <Link to="/account/login">Login</Link></p>
                    </div>
                </Form>
            )}
        </Formik>
    )
}