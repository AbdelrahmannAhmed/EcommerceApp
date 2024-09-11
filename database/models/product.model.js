import { model, Schema, Types } from "mongoose";

const schema = new Schema({
    title: {
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
    Desc: {
        type: String,
        required: true,
        minlength: [10, "minlength name Must be at least 10 characters"],
        maxlength: [2000, "maxlength name Must be at least 2000 characters"]
    },
    image: String,
    images: [String],
    price: {
        type: Number,
        Required: true,
        min: [0, "Product price cannot be negative"]
    },
    priceAfterDiscount: {
        type: Number,
        min: [0, "Product price cannot be negative"]
    },
    soldItems: Number,
    stock: {
        type: Number,
        min: [0, "Product price cannot be negative"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Catgory'
    },
    SubCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    Brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    rateavg: {
        type: Number,
        minlength: [0, "Rating cannot be negative"],
        maxlength: [5, "Rating cannot be more than 5."]
    },
    rateCount: Number,
    createdby: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

schema.virtual('myReviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
});

schema.pre('findOne', function () {
    this.populate('myReviews')
})


schema.post("init", (doc) => {
    if (doc.image) doc.image ? (doc.image = process.env.BASE_URL + `products/` + doc.image) : "";
    if (doc.images) doc.images ? (doc.images = doc.images.map((image) => { return process.env.BASE_URL + `products/` + image })) : "";
});

export const Product = model("Product", schema);
