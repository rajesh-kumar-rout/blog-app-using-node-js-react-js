import { Route, Routes } from "react-router-dom"
import Admin from "./components/Admin"
import Auth from "./components/Auth"
import Authenticated from "./components/Authenticated"
import Layout from "./components/Layout/Layout"
import UnAuthenticated from "./components/UnAuthenticated"
import BlogDetailsPage from "./pages/BlogDetails/BlogDetailsPage"
import BlogsPage from "./pages/Blogs/BlogsPage"
import ChangePasswordPage from "./pages/ChangePassword/ChangePasswordPage"
import CreateBlogPage from "./pages/CreateBlog/CreateBlogPage"
import EditAccountPage from "./pages/EditAccount/EditAccountPage"
import EditBlogPage from "./pages/EditBlog/EditBlogPage"
import HomePage from "./pages/Home/HomePage"
import LoginPage from "./pages/Login/LoginPage"
import SignUpPage from "./pages/SignUp/SignUpPage"
import UnApprovePage from "./pages/UnApprove/UnApprovePage"

export default function App() {
    return (
        <Auth>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/posts/:postId" element={<BlogDetailsPage />} />

                    <Route element={<Authenticated />}>
                        <Route path="/change-password" element={<ChangePasswordPage />} />
                        <Route path="/edit-profile" element={<EditAccountPage />} />
                        <Route path="/create-post" element={<CreateBlogPage />} />
                        <Route path="/edit-post/:postId" element={<EditBlogPage />} />
                        <Route path="/posts" element={<BlogsPage />} />
                        <Route element={<Admin/>}>
                        <Route path="/unapproved-posts" element={<UnApprovePage />} />
                        </Route>
                    </Route>

                    <Route element={<UnAuthenticated />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<SignUpPage />} />
                    </Route>
                </Route>
            </Routes>
        </Auth>
    )
}