import { v2 as cloudinary } from "cloudinary"
import { config } from "dotenv"

config()

cloudinary.config({ secure: true })

export default cloudinary

export async function upload(img) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(img)
    return { imgUrl: secure_url, imgId: public_id }
}

export const destroy = cloudinary.uploader.destroy

