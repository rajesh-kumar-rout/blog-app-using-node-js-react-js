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

        userId: Schema.Types.ObjectId,

        categoryId: Schema.Types.ObjectId,

        isTrending: Boolean,

        isApproved: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("News", schema)