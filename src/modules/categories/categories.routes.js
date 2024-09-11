import { Router } from "express";
import { uplaodSingleFile } from "../../fileUpload/fileUpload.js";
import { validate } from "../../middleware/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { subCategoryRouter } from "../subcategories/subcategory.route.js";
import { addCategory, deleteCategory, getCategories, getCategory, updateCategory } from "./categories.controller.js";
import { addCategoryValidation, updateCategoryValidation } from "./category.validation.js";

export const categoriesRouter = Router()

categoriesRouter.route('/').post(protectedRoutes, allowedTo('admin'), uplaodSingleFile("image", "categories"), validate(addCategoryValidation), addCategory).get(getCategories)
categoriesRouter
    .route("/:id")
    .get(protectedRoutes, getCategory)
    .put(protectedRoutes, allowedTo('user', 'admin', 'mgr'), uplaodSingleFile("image", "categories"), validate(updateCategoryValidation), updateCategory)
    .delete(allowedTo('admin'), deleteCategory)
categoriesRouter.use('/:categoryid/subcategories', subCategoryRouter)


