import mongoose, {Schema} from "mongoose"

const schema = new Schema({
    name: String,

    email: String,

    password: String,

    isAdmin: {type: Boolean, default: false}
})

export default mongoose.model("User", schema)