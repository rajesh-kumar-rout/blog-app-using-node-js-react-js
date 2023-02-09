import mongoose, { Schema } from "mongoose"

const imageSchema = new Schema({
    url: String,

    id: String
})

const schema = new Schema(
    {
        title: String,

        content: String,

        image: imageSchema,

        authorId: Schema.Types.ObjectId,

        categoryId: Schema.Types.ObjectId,

        isApproved: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Post", schema)