import { Routes, Route } from "react-router-dom"
import { Authenticated, NotAuthenticated } from "./components/Auth"
import Layout from "./components/Layout/Layout"
import ChangePasswordPage from "./pages/ChangePassword/ChangePasswordPage"
import EditAccountPage from "./pages/EditAccount/EditAccountPage"
import LoginPage from "./pages/Login/LoginPage"
import SignUpPage from "./pages/SignUp/SignUpPage"
import HomePage from "./pages/Home/HomePage"
import BlogDetailsPage from "./pages/BlogDetails/BlogDetailsPage"
import BlogsPage from "./pages/Blogs/BlogsPage"
import CreateBlogPage from "./pages/CreateBlog/CreateBlogPage"
import EditBlogPage from "./pages/EditBlog/EditBlogPage"
import Account from "./components/Account"

export default function App() {
    return (
        <Account>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/blogs/:postId" element={<BlogDetailsPage />} />

                    <Route element={<Authenticated />}>
                        <Route path="/account/change-password" element={<ChangePasswordPage />} />
                        <Route path="/account/edit-account" element={<EditAccountPage />} />

                        <Route path="/account/blogs/create" element={<CreateBlogPage />} />
                        <Route path="/account/blogs/:blogId/edit" element={<EditBlogPage />} />
                        <Route path="/account/blogs" element={<BlogsPage />} />
                    </Route>

                    <Route element={<NotAuthenticated />}>
                        <Route path="/account/login" element={<LoginPage />} />
                        <Route path="/account/sign-up" element={<SignUpPage />} />
                    </Route>
                </Route>
            </Routes>
        </Account>
    )
}