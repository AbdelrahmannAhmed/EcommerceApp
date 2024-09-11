import { Router } from "express"
import { addBrand, deleteBrand, getBrand, getBrands, updateBrand } from "./brand.contoller.js"
import { uplaodSingleFile } from "../../fileUpload/fileUpload.js"
import { validate } from "../../middleware/validate.js";
import { addBrandValidation, updateBrandValidation } from "./brand.validation.js"

export const brandRouter = Router()

brandRouter.route('/').post(uplaodSingleFile("image", "logo"), validate(addBrandValidation), addBrand).get(getBrands)
brandRouter.route('/:id').put(uplaodSingleFile("image", "logo"), validate(updateBrandValidation), updateBrand).get(getBrand).delete(deleteBrand)

