import slugify from "slugify";
import { Brand } from "../../../database/models/brand.model.js";
import { catchError } from "../../middleware/catchError.js";
import { messages } from "../../utlities/messages.js";
import { AppError } from "../../utlities/appError.js";
import { deleteOne } from "../handlers/handlers.js";
import { User } from "../../../database/models/user.model.js";


const addAddress = catchError(async (req, res, next) => {

    let address = await User.findByIdAndUpdate(req.user.id, { $push: { addresses: req.body } }, { new: true })
    address || next(new AppError(messages.user.notFound, 404))
    !address || res.status(200).json({ message: 'Added to address Successfully', address: address.addresses })
})

const removeAddress = catchError(async (req, res, next) => {
    console.log(req.user);

    let address = await User.findByIdAndUpdate(req.user._id, { $pull: { addresses: { _id: req.params.id } } }, { new: true })
    address || next(new AppError(messages.user.notFound, 404))
    !address || res.status(200).json({ message: 'Removed from address Successfully', address: address.addresses })
})

const getLoggedUserAddresses = catchError(async (req, res, next) => {
    let address = await User.findById(req.user._id)
    address || next(new AppError(messages.user.notFound, 404))
    !address || res.status(200).json({ message: 'User address', user: req.user.name, email: req.user.email, address: address.addresses })
})

export {
    addAddress,
    removeAddress,
    getLoggedUserAddresses
}

