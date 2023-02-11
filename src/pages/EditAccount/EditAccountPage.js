import { ErrorMessage, Field, Form, Formik } from "formik"
import { useContext } from "react"
import { toast } from "react-toastify"
import { object, string } from "yup"
import { AuthContext } from "../../components/Auth"
import axios from "../../utils/axios"
import { handleImage } from "../../utils/functions"

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

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true)

        try {
            const { data } = await axios.patch("/auth/edit-profile", values)

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
                <Form className="card mx-auto max-w-600">
                    <div className="card-header card-title">Edit Account</div>

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
                            <label htmlFor="profileImg" className="form-label">Profile Image</label>
                            <input
                                type="file"
                                id="profileImg"
                                className="form-control"
                                name="profileImg"
                                onChange={event => handleImage(event, setFieldValue)}
                                accept=".png, .jpeg, .jpg"
                            />
                        </div>

                        <button
                            className="btn btn-primary w-full"
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