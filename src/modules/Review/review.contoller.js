import { catchError } from "../../middleware/catchError.js";
import { messages } from "../../utlities/messages.js";
import { AppError } from "../../utlities/appError.js";
import { deleteOne } from "../handlers/handlers.js";
import { Review } from "../../../database/models/review.model.js";

const addReview = catchError(async (req, res, next) => {
    let userId = req.user._id
    let addedBefore = await Review.findOne({ user: userId, product: req.body.product })
    if (!addedBefore) {
        req.body.user = req.user._id
        console.log(req.body.image);
        let review = new Review(req.body)
        await review.save()
        res.status(201).json({ message: messages.review.addedSuccessfully, data: review })
    } return next(new AppError('User Cannot add more reviews', 405))

})

const getReviews = catchError(async (req, res, next) => {
    let reviews = await Review.find()
    res.json({ message: messages.review.successGet, reviews })
})


const getReview = catchError(async (req, res, next) => {

    let review = await Review.findById(req.params.id)
    review || next(new AppError(messages.category.notFound, 404))
    !review || res.status(200).json({ message: messages.review.successGet, data: review })
})
const updateReview = catchError(async (req, res, next) => {
    let review = await Review.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true })
    review || next(new AppError("Review not found or User no authorized", 404))
    !review || res.status(200).json({ message: messages.review.updatedSuccessfully, data: Review })
    return next(new AppError('This user not authorized to edit this review', 409))

})

const deleteReview = deleteOne(Review)

export {
    addReview,
    getReviews,
    updateReview,
    getReview,
    deleteReview
}