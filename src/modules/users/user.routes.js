import { Router } from "express"
import { addUser, deleteUser, getUser, getUsers, updateUser } from "./user.contoller.js"
import { checkEmail } from "../../middleware/checkEmail.js"
import { orderRouter } from "../order/order.routes.js"

export const userRouter = Router()

userRouter.route('/').post(checkEmail, addUser).get(getUsers)
userRouter.route('/:id').put(updateUser).get(getUser).delete(deleteUser)
userRouter.use('/:userid/orders', orderRouter)
