import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addCart, applyCoupon, clearUserCart, getLoggedUserCart, removeItemfromCart, updateQuantity } from "./cart.contoller.js";

export const cartRouter = Router()

cartRouter
    .route('/')
    .post(protectedRoutes, allowedTo('user', 'admin'), addCart)
    .get(protectedRoutes, allowedTo('user', 'admin'), getLoggedUserCart)
    .delete(protectedRoutes, allowedTo('user', 'admin'), clearUserCart)

cartRouter
    .route('/:id')
    .put(protectedRoutes, allowedTo('user', 'admin'), updateQuantity)
    .get()
    .delete(protectedRoutes, allowedTo('user', 'admin'), removeItemfromCart)
cartRouter.route('/apply-coupon').post(protectedRoutes, allowedTo('user', 'admin'), applyCoupon)

