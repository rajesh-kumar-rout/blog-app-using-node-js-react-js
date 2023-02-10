import mongoose, {Schema} from "mongoose"
import imageSchema from "./image.js"

const schema = new Schema({
    name: String,

    email: String,

    password: String,

    profileImage: imageSchema,

    isAdmin: {type: Boolean, default: false}
})

export default mongoose.model("User", schema)