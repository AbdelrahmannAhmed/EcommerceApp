import { Router } from "express"
import { validate } from "../../middleware/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addAddress, getLoggedUserAddresses, removeAddress } from "./address.contoller.js";


export const addressRouter = Router()

addressRouter.route('/').patch(protectedRoutes, allowedTo('user'), addAddress)
addressRouter.route('/').get(protectedRoutes, allowedTo('user'), getLoggedUserAddresses)
addressRouter.route('/:id').delete(protectedRoutes, allowedTo('user'), removeAddress)

