import { Router } from "express"
import { addReview, deleteReview, getReview, getReviews, updateReview } from "./review.contoller.js"
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js"


export const reviewRouter = Router()

reviewRouter
    .route('/')
    .post(protectedRoutes, allowedTo('user'), addReview)
    .get(getReviews)
reviewRouter
    .route('/:id')
    .put(protectedRoutes, allowedTo('user'), updateReview)
    .get( getReview)
    .delete(protectedRoutes, allowedTo('user'), deleteReview)

