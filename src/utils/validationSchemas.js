import { object, string, ref } from "yup"

export const postSchema = object().shape({
    title: string()
        .trim()
        .max(255, "Title must be within 255 characters")
        .required("Title is required"),

    categoryId: string().required("Category is required"),

    content: string()
        .trim()
        .max(5000, "Content must be within 5000 characters")
        .required("Content is required")
})

export const changePasswordSchema = object().shape({
    oldPassword: string().required("Old password is required"),

    newPassword: string()
        .min(6, "New password must be at least 6 characters")
        .max(20, "New password must be within 20 characters")
        .required("New password is required"),

    confirmNewPassword: string()
        .oneOf([ref("newPassword")], "New password mismatch")
        .required("Please confirm your password"),
})

export const editProfileSchema = object().shape({
    name: string()
        .trim()
        .max(30, "Name must be within 30 characters")
        .required("Name is required"),

    email: string()
        .trim()
        .email()
        .max(30, "Email must be within 30 characters")
        .required("Email is required")
})

export const registerSchema = object().shape({
    name: string()
        .trim()
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

export const loginSchema = object().shape({
    email: string().required("Email is required"),

    password: string().required("Password is required")
})