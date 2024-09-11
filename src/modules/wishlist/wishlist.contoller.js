import slugify from "slugify";
import { Brand } from "../../../database/models/brand.model.js";
import { catchError } from "../../middleware/catchError.js";
import { messages } from "../../utlities/messages.js";
import { AppError } from "../../utlities/appError.js";
import { deleteOne } from "../handlers/handlers.js";
import { User } from "../../../database/models/user.model.js";


const addToWishList = catchError(async (req, res, next) => {

    let wishList = await User.findByIdAndUpdate(req.user.id, { $addToSet: { wishlist: req.body.product } }, { new: true })
    wishList || next(new AppError(messages.user.notFound, 404))
    !wishList || res.status(200).json({ message: 'Added to wishlist Successfully', data: wishList })
})

const removeFromWishList = catchError(async (req, res, next) => {

    let wishList = await User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: req.params.id } }, { new: true })
    wishList || next(new AppError(messages.user.notFound, 404))
    !wishList || res.status(200).json({ message: 'Removed from wishlist Successfully', data: wishList })
})

const getLoggedUserWishList = catchError(async (req, res, next) => {

    let wishList = await User.findById(req.user.id, { new: true }).populate('wishlist')
    wishList || next(new AppError(messages.user.notFound, 404))
    !wishList || res.status(200).json({ message: 'User WishList', wishList: wishList.wishlist })
})

export {
    addToWishList,
    removeFromWishList,
    getLoggedUserWishList
}