export const cloudinaryImg = (url) => {

    if (url && url.startsWith("https://res.cloudinary.com/")) {

        return [
            url.split("upload/")[0],

            "upload/",

            "w_510,h_360,c_fill/",


            url.split("upload/")[1]
        ].join("")
    }

    return url
}

export function handleImage(event, setFieldValue) {
    const reader = new FileReader()

    reader.readAsDataURL(event.target.files[0])

    reader.onload = () => {
        setFieldValue(event.target.name, reader.result)
    }
}