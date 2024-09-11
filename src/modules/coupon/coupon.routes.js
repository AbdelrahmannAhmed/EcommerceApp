import { Router } from "express"
import { addCoupon, deleteCoupon, getCoupon, getCoupons, updateCoupon } from "./coupon.contoller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

export const couponRouter = Router()
couponRouter.use(protectedRoutes, allowedTo('admin'))
couponRouter.route('/').post(addCoupon).get(getCoupons)
couponRouter.route('/:id').put(updateCoupon).get(getCoupon).delete(deleteCoupon)

