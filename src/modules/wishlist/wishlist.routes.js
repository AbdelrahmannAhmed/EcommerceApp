import { Router } from "express"
import { validate } from "../../middleware/validate.js";
import { addToWishList, getLoggedUserWishList, removeFromWishList } from "./wishlist.contoller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";


export const wishListRouter = Router()

wishListRouter.route('/').patch(protectedRoutes, allowedTo('user'), addToWishList)
wishListRouter.route('/').get(protectedRoutes, allowedTo('user'), getLoggedUserWishList)
wishListRouter.route('/:id').delete(protectedRoutes, allowedTo('user'), removeFromWishList)

