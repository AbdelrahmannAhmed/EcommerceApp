import { Router } from "express";
import { addSubCategory, deleteSubCategory, getSubCategories, getSubCategory, updateSubcategory } from "./subcategory.controller.js";
import { validate } from "../../middleware/validate.js";
import { addSubCategoryValidation, updateSubCategoryValidation } from "./subcategory.validation.js";


export const subCategoryRouter = Router({ mergeParams: true })

subCategoryRouter.route('/')
    .post(validate(addSubCategoryValidation), addSubCategory)
    .get(getSubCategories)
subCategoryRouter.route('/:id')
    .put(validate(updateSubCategoryValidation), updateSubcategory)
    .delete(deleteSubCategory)
    .get(getSubCategory)
