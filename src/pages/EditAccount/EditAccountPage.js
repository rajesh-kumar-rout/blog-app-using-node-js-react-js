import { Formik, Field, ErrorMessage, Form } from "formik"
import { object, string } from "yup"
import { getBase64Img } from "../../utils/functions"
import { toast } from "react-toastify"
import axios from "../../utils/axios"
import form from "../../styles/Form.module.css"
import button from "../../styles/Button.module.css"
import { useContext } from "react"
import { AccountContext } from "../../components/Account"

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
    const { account, setAccount } = useContext(AccountContext)

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        values.profileImg && (values.profileImg = await getBase64Img(values.profileImg))
        setSubmitting(true)

        try {
            const { data } = await axios.patch("/auth/edit-account", values)
            setAccount({
                ...account,
                name: values.name,
                email: values.email,
                profileImgUrl: data.profileImgUrl
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
                name:account.name,
                email: account.email,
                profileImg: ""
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
                                onChange={event => setFieldValue("profileImg", event.target.files[0])}
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