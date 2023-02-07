import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({ secure: true })

export default cloudinary

export async function upload(image) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(image)

    return { url: secure_url, id: public_id }
}

export const destroy = cloudinary.uploader.destroy

