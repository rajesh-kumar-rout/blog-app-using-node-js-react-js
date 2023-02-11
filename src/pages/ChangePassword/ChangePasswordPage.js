
import { ErrorMessage, Field, Form, Formik } from "formik"
import { toast } from "react-toastify"
import { object, ref, string } from "yup"
import axios from "../../utils/axios"

const validationSchema = object().shape({
    oldPassword: string()
        .min(6, "Invalid password")
        .max(20, "Invalid password")
        .required("Old password is required"),

    newPassword: string()
        .min(6, "New password must be at least 6 characters")
        .max(20, "New password must be within 20 characters")
        .required("New password is required"),

    confirmNewPassword: string()
        .oneOf([ref("newPassword")], "New password mismatch")
        .required("Please confirm your password"),
})

export default function ChangePasswordPage() {

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true)

        try {
            await axios.patch("/auth/change-password", values)

            toast.success("Password changed successfully")

            resetForm()

        } catch ({ response }) {
            
            response?.status === 422 && toast.error("Old password does not match")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="card mx-auto max-w-600">
                    <h2 className="card-header card-title">Change Password</h2>

                    <div className="card-body">
                        <div className="mb-5">
                            <label htmlFor="oldPassword" className="form-label">Old Password</label>
                            <Field
                                type="password"
                                id="oldPassword"
                                className="form-control"
                                name="oldPassword"
                            />
                            <ErrorMessage name="oldPassword" component="p" className="form-error" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <Field
                                type="password"
                                id="newPassword"
                                className="form-control"
                                name="newPassword"
                            />
                            <ErrorMessage name="newPassword" component="p" className="form-error" />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                name="confirmNewPassword"
                            />
                            <ErrorMessage name="confirmNewPassword" component="p" className="form-error" />
                        </div>

                        <button
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Loading..." : "Change Password"}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}