import { useContext, useState } from "react"
import { MdArrowDropDown } from "react-icons/md"
import { Link } from "react-router-dom"
import { AuthContext } from "../Auth"
import styles from "./NavBar.module.css"

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
        <div className={styles.container}>
            <Link to="/" className={styles.title}>BLOG.IO</Link>

            {currentUser ? (
                <div className={styles.dropDownBox}>
                    <div className={styles.dropDownBtn} onClick={handleDropDown}>
                        <p>{currentUser.name}</p>
                        <img src={currentUser.profileImage?.url} />
                        <MdArrowDropDown size={24} />
                    </div>

                    {isDropDownOpened && (
                        <div className={styles.dropDown}>
                            {currentUser.isAdmin && <Link to="/unapproved-posts">Unapproved Posts</Link>}
                            <Link to="/posts">My Blogs</Link>
                            <Link to="/create-post">Post New Blog</Link>
                            <Link to="/edit-profile">Edit Account</Link>
                            <Link to="/change-password">Change Password</Link>
                            <Link onClick={handleLogout}>Logout</Link>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/login">Login/Sign Up</Link>
            )}
        </div>
    )
}