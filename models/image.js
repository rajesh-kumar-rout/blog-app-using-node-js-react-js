import { Schema } from "mongoose"

const imageSchema = new Schema({
    url: String,

    id: String
})

export default imageSchema