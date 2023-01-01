
import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string, ref } from "yup"
import { toast } from "react-toastify"
import axios from "../../utils/axios"
import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"

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
                <Form className={form.form}>
                    <h2 className={form.header}>Change Password</h2>

                    <div className={form.body}>
                        <div className={form.group}>
                            <label htmlFor="oldPassword" className={form.textLabel}>Old Password</label>
                            <Field
                                type="password"
                                id="oldPassword"
                                className={form.textInput}
                                name="oldPassword"
                            />
                            <ErrorMessage name="oldPassword" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="newPassword" className={form.textLabel}>New Password</label>
                            <Field
                                type="password"
                                id="newPassword"
                                className={form.textInput}
                                name="newPassword"
                            />
                            <ErrorMessage name="newPassword" component="p" className={form.errorText} />
                        </div>

                        <div className={form.group}>
                            <label htmlFor="confirmNewPassword" className={form.textLabel}>Confirm New Password</label>
                            <Field
                                type="password"
                                id="confirmNewPassword"
                                className={form.textInput}
                                name="confirmNewPassword"
                            />
                            <ErrorMessage name="confirmNewPassword" component="p" className={form.errorText} />
                        </div>

                        <button
                            className={button.btn}
                            data-primary
                            data-full
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