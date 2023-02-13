import { ErrorMessage, Field, Form, Formik } from "formik"
import { useContext } from "react"
import { toast } from "react-toastify"
import { AuthContext } from "../components/Auth"
import axios from "../utils/axios"
import { handleImage } from "../utils/functions"
import { changePasswordSchema, editProfileSchema } from "../utils/validationSchemas"

export default function EditProfilePage() {
    const { currentUser, setCurrentUser } = useContext(AuthContext)

    const handleEditProfile = async (values, { setSubmitting }) => {
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

    const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
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
        <>
            <Formik
                initialValues={{
                    name: currentUser.name,
                    email: currentUser.email,
                    profileImage: ""
                }}
                validationSchema={editProfileSchema}
                onSubmit={handleEditProfile}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form className="card" style={{ maxWidth: 600, margin: "auto" }}>
                        <p className="card-header" style={{ fontWeight: "bold" }}>Edit Profile</p>

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
                                <label htmlFor="profileImage" className="form-label">Profile Image</label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    className="form-control"
                                    name="profileImage"
                                    onChange={event => handleImage(event, setFieldValue)}
                                    accept=".png, .jpeg, .jpg"
                                />
                            </div>

                            <button
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading..." : "Save"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

            <Formik
                initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: ""
                }}
                validationSchema={changePasswordSchema}
                onSubmit={handleChangePassword}
            >
                {({ isSubmitting }) => (

                    <Form className="card" style={{ maxWidth: 600, margin: "auto", marginTop: 20 }}>
                        <p className="card-header" style={{ fontWeight: "bold" }}>Change Password</p>

                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="oldPassword" className="form-label">Old Password</label>
                                <Field
                                    type="password"
                                    id="oldPassword"
                                    className="form-control"
                                    name="oldPassword"
                                />
                                <ErrorMessage name="oldPassword" component="p" className="form-error" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                <Field
                                    type="password"
                                    id="newPassword"
                                    className="form-control"
                                    name="newPassword"
                                />
                                <ErrorMessage name="newPassword" component="p" className="form-error" />
                            </div>

                            <div className="form-group">
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
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading..." : "Change Password"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}