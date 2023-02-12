import { Route, Routes } from "react-router-dom"
import Admin from "./components/Admin"
import Auth from "./components/Auth"
import Authenticated from "./components/Authenticated"
import Layout from "./components/Layout"
import UnAuthenticated from "./components/UnAuthenticated"
import PostDetailsPage from "./pages/PostDetailsPage"
import MyPostsPage from "./pages/MyPostsPage"
import CreatePostPage from "./pages/CreatePostPage"
import EditProfilePage from "./pages/EditProfilePage"
import EditPostPage from "./pages/EditPostPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import UnApprovedPostsPage from "./pages/UnApprovedPostsPage"

export default function App() {
    return (
        <Auth>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/posts/:postId" element={<PostDetailsPage />} />

                    <Route element={<Authenticated />}>
                        <Route path="/edit-profile" element={<EditProfilePage />} />
                        <Route path="/create-post" element={<CreatePostPage />} />
                        <Route path="/edit-post/:postId" element={<EditPostPage />} />
                        <Route path="/posts" element={<MyPostsPage />} />
                        <Route element={<Admin />}>
                            <Route path="/unapproved-posts" element={<UnApprovedPostsPage />} />
                        </Route>
                    </Route>

                    <Route element={<UnAuthenticated />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>
                </Route>
            </Routes>
        </Auth>
    )
}