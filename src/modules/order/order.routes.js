import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createCashOrder, createCheckoutSession, getAllOrders, getUserOrder } from "./order.contoller.js";

export const orderRouter = Router({ mergeParams: true })

orderRouter
    .route('/:id')
    .post(protectedRoutes, allowedTo('user'), createCashOrder)

orderRouter.route('/').get(protectedRoutes, allowedTo('user'), getUserOrder)
orderRouter.route('/all').get(protectedRoutes, allowedTo('admin'), getAllOrders)
orderRouter.route('/checkout/:id').post(protectedRoutes, allowedTo('user'), createCheckoutSession)
