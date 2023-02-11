import React from "react"
import App from "./App"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"
import "./styles/variables.css"
import "./styles/reset.css"
import "./styles/utilities.css"
import "./styles/index.css"
import { ToastContainer } from "react-toastify"

const root = createRoot(document.getElementById("root"))

root.render(
    <>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </>
)
