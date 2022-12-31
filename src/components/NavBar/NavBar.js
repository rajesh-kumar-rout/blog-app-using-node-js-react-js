import { useContext, useState } from "react"
import { MdArrowDropDown } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { AccountContext } from "../Account"
import styles from "./NavBar.module.css"

export default function NavBar() {
    const navigate = useNavigate()
    const { account } = useContext(AccountContext)
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
        localStorage.clear()
        window.location.href = "/"
    }

    return (
        <div className={styles.container}>
            <Link to="/" className={styles.title}>BLOG.IO</Link>

            {account ? (
                <div className={styles.dropDownBox}>
                    <div className={styles.dropDownBtn} onClick={handleDropDown}>
                        <p>{account.name}</p>
                        <img src={account.profileImgUrl} />
                        <MdArrowDropDown size={24} />
                    </div>

                    {isDropDownOpened && (
                        <div className={styles.dropDown}>
                            <Link to="/account/blogs">My Blogs</Link>
                            <Link to="/account/blogs/create">Post New Blog</Link>
                            <Link to="/account/edit-account">Edit Account</Link>
                            <Link to="/account/change-password">Change Password</Link>
                            <Link onClick={handleLogout}>Logout</Link>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/account/login">Login/Sign Up</Link>
            )}
        </div>
    )
}