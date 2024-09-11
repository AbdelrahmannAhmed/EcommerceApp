import { model, Schema } from "mongoose";

const schema = new Schema({
    code: String,
    expires: Date,
    discount: Number
}, {
    timestamps: true,
    versionKey: false
});


export const Coupon = model("Coupon", schema);
