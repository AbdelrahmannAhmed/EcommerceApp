import { model, Schema } from "mongoose";

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "Category name must be unique"],
        minlength: [3, "Category name Must be at least 3 characters"]

    },
    slug: {
        type: String,
        lowercase: true,
        required: true,
        unique: [true, "Category slug must be unique"],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref:"Category"

    },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
    versionKey: false
});


export const SubCategory = model("SubCategory", schema);
