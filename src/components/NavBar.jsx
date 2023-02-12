import { useContext, useState } from "react"
import { MdArrowDropDown } from "react-icons/md"
import { Link } from "react-router-dom"
import { AuthContext } from "./Auth"

export default function NavBar() {
    const { currentUser } = useContext(AuthContext)
    const [isDropDownOpened, setIsDropDownOpened] = useState(false)

    window.onclick = () => {
        isDropDownOpened && setIsDropDownOpened(false)
    }

    const handleDropDown = (event) => {
        event.stopPropagation()
        setIsDropDownOpened(true)
    }

    const handleLogout = (event) => {
        event.preventDefault()
        localStorage.removeItem("authToken")
        window.location.href = "/"
    }

    return (
        <div className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-title">BLOG.IO</Link>

                {currentUser ? (
                    <div className="navbar-dropdown-wrapper">
                        <div className="navbar-dropdown-btn" onClick={handleDropDown}>
                            <p>{currentUser.name}</p>

                            <img className="navbar-dropdown-img" src={currentUser.profileImage?.url} />
                            
                            <MdArrowDropDown size={24} />
                        </div>

                        {isDropDownOpened && (
                            <div className="navbar-dropdown">
                                {currentUser.isAdmin && <Link className="navbar-dropdown-link" to="/unapproved-posts">Unapproved Posts</Link>}
                                <Link className="navbar-dropdown-link" to="/posts">My Blogs</Link>
                                <Link className="navbar-dropdown-link" to="/create-post">Post New Blog</Link>
                                <Link className="navbar-dropdown-link" to="/edit-profile">Edit Profile</Link>
                                <Link className="navbar-dropdown-link" onClick={handleLogout}>Logout</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">Login/Sign Up</Link>
                )}
            </div>
        </div>
    )
}