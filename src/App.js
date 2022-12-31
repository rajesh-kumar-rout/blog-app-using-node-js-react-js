import { Routes, Route } from "react-router-dom"
import { Authenticated, NotAuthenticated } from "./components/Auth"
import Layout from "./components/Layout/Layout"
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage"
import EditAccountPage from "./pages/EditAccountPage/EditAccountPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import SignUpPage from "./pages/SignUpPage/SignUpPage"
import HomePage from "./pages/HomePae/HomePage"
import PostDetailsPage from "./pages/PostDetailsPage/PostDetailsPage"
import BlogsPage from "./pages/BlogsPage/BlogsPage"
import CreateBlogPage from "./pages/CreateBlog/CreateBlogPage"
import EditBlogPage from "./pages/EditBlog/EditBlogPage"
import Account from "./components/Account"

export default function App() {
    return (
        <Account>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/posts/:postId" element={<PostDetailsPage />} />

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