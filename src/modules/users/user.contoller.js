import { catchError } from "../../middleware/catchError.js";
import { messages } from "../../utlities/messages.js";
import { AppError } from "../../utlities/appError.js";
import { deleteOne } from "../handlers/handlers.js";
import { User } from "../../../database/models/user.model.js";

const addUser = catchError(async (req, res, next) => {
    let user = new User(req.body)
    await user.save()
    res.status(201).json({ message: messages.user.addedSuccessfully, data: user })
})

const getUsers = catchError(async (req, res, next) => {
    let Users = await User.find()
    res.json({ message: messages.user.successGet, Users })
})


const getUser = catchError(async (req, res, next) => {

    let user = await User.findById(req.params.id)
    user || next(new AppError(messages.category.notFound, 404))
    !user || res.status(200).json({ message: messages.user.successGet, data: user })
})
const updateUser = catchError(async (req, res, next) => {

    let user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    user || next(new AppError(messages.category.notFound, 404))
    !user || res.status(200).json({ message: messages.user.updatedSuccessfully, data: user })
})

const deleteUser = deleteOne(User)

export {
    addUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}