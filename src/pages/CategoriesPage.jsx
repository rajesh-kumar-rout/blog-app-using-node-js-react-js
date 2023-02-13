import moment from "moment"
import { useEffect, useState } from "react"
import { MdDelete, MdEdit } from "react-icons/md"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import Loader from "../components/Loader"
import axios from "../utils/axios"

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchCategories = async () => {
        const { data } = await axios.get("/categories")

        setCategories(data)

        setIsLoading(false)
    }

    const handleDeleteCategory = async (categoryId) => {
        setIsLoading(true)

        await axios.delete(`/categories/${categoryId}`)

        setCategories(categories.filter(category => category._id !== categoryId))

        toast.error("Category deleted successfully")

        setIsLoading(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    if (isLoading) {
        return <Loader />
    }

    return (
        <div>
            <div className="table-header">
                <p className="table-title">Categories</p>
                <Link to="/create-category" className="btn btn-primary">Create New</Link>
            </div>

            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th width="60%">Name</th>
                            <th width="10%">Last Modified</th>
                            <th width="10%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3}>No Category Found</td>
                            </tr>
                        )}
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>
                                    <p className="max-line-2">{category.name}</p>
                                </td>
                                <td>{moment(category.createdAt).format("DD MMM YYYY")}</td>
                                <td>
                                    <div className="btn-gap">
                                        <Link to="/edit-category" state={category} className="btn btn-warning btn-sm">
                                            <MdEdit size={24} fill="white" />
                                        </Link>
                                        <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-danger btn-sm">
                                            <MdDelete size={24} fill="white" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}