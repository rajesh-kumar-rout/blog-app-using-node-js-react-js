import { ErrorMessage, Field, Form, Formik } from "formik"
import { useContext } from "react"
import { toast } from "react-toastify"
import { object, string } from "yup"
import { AuthContext } from "../../components/Auth"
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
        .required("Email is required")
})

export default function EditAccountPage() {
    const { currentUser, setCurrentUser } = useContext(AuthContext)

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.patch("/auth/edit-profile", values)
            console.log(data);
            setCurrentUser({
                ...currentUser,
                name: values.name,
                email: values.email,
                profileImage: data.profileImage
            })
            toast.success("Account edited successfully")
        } catch ({ response }) {
            response?.status === 409 && toast.error("Email already taken")
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={{
                name:currentUser.name,
                email: currentUser.email,
                profileImage: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form className={form.form}>
                    <div className={form.header}>Edit Account</div>

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
                            <label htmlFor="profileImg" className={form.textLabel}>Profile Image</label>
                            <input
                                type="file"
                                id="profileImg"
                                className={form.textInput}
                                name="profileImg"
                                onChange={event => {
                                    const reader = new FileReader()

                                    reader.readAsDataURL(event.target.files[0])
                                    reader.onload = () => {
                                        setFieldValue("profileImage", reader.result)
                                    }
                                }}
                                accept="image/jpeg, image/png, image/jpg"
                            />
                        </div>

                        <button
                            className={button.btn}
                            data-full
                            data-primary
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