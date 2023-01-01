export const postImgUrl = (url) => {
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

export const getBase64Img = (image) => {
    image  = new File([image], image.name, { type: image.type });
    const reader = new FileReader()
    reader.readAsDataURL(image)
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result)
        }
    })
}