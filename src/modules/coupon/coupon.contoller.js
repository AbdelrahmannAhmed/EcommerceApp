import { catchError } from "../../middleware/catchError.js";
import { messages } from "../../utlities/messages.js";
import { AppError } from "../../utlities/appError.js";
import { deleteOne } from "../handlers/handlers.js";
import { Coupon } from "../../../database/models/coupon.model.js";

const addCoupon = catchError(async (req, res, next) => {
    let isExist = await Coupon.findOne({ code: req.body.code })
    if (isExist) return next(new AppError('Coupon already exists', 409))
    console.log(req.body.image);
    let coupon = new Coupon(req.body)
    await coupon.save()
    res.status(201).json({ message: messages.coupon.addedSuccessfully, data: coupon })
})

const getCoupons = catchError(async (req, res, next) => {
    let coupons = await Coupon.find()
    res.json({ message: messages.coupon.successGet, coupons })
})


const getCoupon = catchError(async (req, res, next) => {

    let coupon = await Coupon.findById(req.params.id)
    coupon || next(new AppError(messages.category.notFound, 404))
    !coupon || res.status(200).json({ message: messages.coupon.successGet, data: coupon })
})
const updateCoupon = catchError(async (req, res, next) => {

    let coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    coupon || next(new AppError(messages.category.notFound, 404))
    !coupon || res.status(200).json({ message: messages.coupon.updatedSuccessfully, data: coupon })
})

const deleteCoupon = deleteOne(Coupon)

export {
    addCoupon,
    getCoupons,
    updateCoupon,
    getCoupon,
    deleteCoupon
}